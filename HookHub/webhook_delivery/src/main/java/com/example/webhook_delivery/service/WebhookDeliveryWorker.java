package com.example.webhook_delivery.service;

import com.example.webhook_delivery.config.RabbitMQConfig;
import com.example.webhook_delivery.entity.Subscription;
import com.example.webhook_delivery.entity.WebhookDeliveryLog;
import com.example.webhook_delivery.rabbitmq.WebhookMessage;
import com.example.webhook_delivery.repository.WebhookDeliveryLogRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WebhookDeliveryWorker {

    private static final Logger logger = LoggerFactory.getLogger(WebhookDeliveryWorker.class);

    private final SubscriptionService subscriptionService;
    private final WebhookDeliveryLogRepository logRepository;
    private final RabbitTemplate rabbitTemplate;
    private final RestTemplate restTemplate;

    @Value("${app.webhook.max-retries}")
    private int maxRetries;

    @RabbitListener(queues = "${app.rabbitmq.queue}")
    public void handleDelivery(WebhookMessage message) {
        if (message == null || message.getDeliveryTaskId() == null || message.getPayload() == null) {
            logger.warn("⚠️ Received invalid or empty message — skipping processing.");
            return;
        }

        logger.info("Processing delivery task: {}", message.getDeliveryTaskId());
        
        // Get the specific subscription for this webhook
        Subscription sub = subscriptionService.findById(message.getSubscriptionId());
        if (sub == null) {
            logger.error("Subscription {} not found for task {}", message.getSubscriptionId(), message.getDeliveryTaskId());
            return;
        }

        WebhookDeliveryLog log = new WebhookDeliveryLog(message.getDeliveryTaskId(), sub.getId(), sub.getTargetUrl(), message.getAttempt());
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(message.getPayload(), headers);

            ResponseEntity<String> response = restTemplate.postForEntity(sub.getTargetUrl(), entity, String.class);

            log.setHttpStatusCode(response.getStatusCode().value());
            log.setOutcome("SUCCESS");
            logger.info("Successfully delivered webhook {} to {}", message.getDeliveryTaskId(), sub.getTargetUrl());

        } catch (HttpStatusCodeException e) {
            log.setHttpStatusCode(e.getStatusCode().value());
            log.setErrorDetails(e.getResponseBodyAsString());
            handleFailure(message, log);
        } catch (ResourceAccessException e) { // Network errors, timeouts
            log.setErrorDetails("Network Error: " + e.getMessage());
            handleFailure(message, log);
        } catch (Exception e) {
            log.setErrorDetails("An unexpected error occurred: " + e.getMessage());
            handleFailure(message, log);
        } finally {
            logRepository.save(log);
        }
    }

    private void handleFailure(WebhookMessage message, WebhookDeliveryLog log) {
        if (message.getAttempt() < maxRetries) {
            log.setOutcome("FAILED_ATTEMPT");
            requeueWithBackoff(message);
        } else {
            log.setOutcome("FAILURE");
            logger.error("Final delivery failure for task {}: max retries reached.", message.getDeliveryTaskId());
        }
    }

    private void requeueWithBackoff(WebhookMessage message) {
        message.setAttempt(message.getAttempt() + 1);
        String nextRetryQueue = getNextRetryQueue(message.getAttempt());
        if(nextRetryQueue != null){
            logger.info("Requeuing task {} for attempt {} to queue {}", message.getDeliveryTaskId(), message.getAttempt(), nextRetryQueue);
            rabbitTemplate.convertAndSend(RabbitMQConfig.DLX_EXCHANGE, nextRetryQueue, message);
        } else {
            // Fallback if attempt number is out of defined queues
            logger.error("Cannot requeue task {}, max defined retry queues exceeded.", message.getDeliveryTaskId());
        }
    }

    private String getNextRetryQueue(int attempt) {
        switch (attempt) {
            case 2:
                return RabbitMQConfig.QUEUE_RETRY_10S;
            case 3:
                return RabbitMQConfig.QUEUE_RETRY_30S;
            case 4:
                return RabbitMQConfig.QUEUE_RETRY_1M;
            case 5:
                return RabbitMQConfig.QUEUE_RETRY_5M;
            case 6:
                return RabbitMQConfig.QUEUE_RETRY_15M;
            default:
                return null;
        }
    }
}
