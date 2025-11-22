package com.example.webhook_delivery.service;

import com.example.webhook_delivery.rabbitmq.WebhookMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.webhook_delivery.dto.WebhookEvent;
import com.example.webhook_delivery.entity.Subscription;
import com.example.webhook_delivery.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class WebhookIngestionService {

    private static final Logger logger = LoggerFactory.getLogger(WebhookIngestionService.class);
    private final SubscriptionRepository subscriptionRepo;
    private final RabbitTemplate rabbitTemplate;

    @Value("${app.rabbitmq.exchange}")
    private String exchangeName;

    @Value("${app.rabbitmq.routingkey}")
    private String routingKey;

    public ResponseEntity<String> ingest(UUID subscriptionId, String payload) {
        Optional<Subscription> subscriptionOptional = subscriptionRepo.findById(subscriptionId);
        if (subscriptionOptional.isEmpty()) {
            logger.warn("Received webhook for non-existent subscription ID: {}", subscriptionId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Subscription ID not found.");
        }

        WebhookEvent event = new WebhookEvent(UUID.randomUUID(), subscriptionId, payload);

        WebhookMessage message = new WebhookMessage();
        message.setDeliveryTaskId(event.getDeliveryId());
        message.setEventType(subscriptionOptional.get().getEventType());
        message.setPayload(event.getPayload());
        message.setAttempt(1);

        rabbitTemplate.convertAndSend(exchangeName, routingKey, message);
        try {
            rabbitTemplate.convertAndSend(exchangeName, routingKey, event);
            logger.info("Queued webhook for subscription {}. Delivery ID: {}", event.getSubscriptionId(), event.getDeliveryId());
        } catch (Exception e) {
            logger.error("Failed to queue webhook for subscription {}: {}", subscriptionId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to queue webhook.");
        }

        return new ResponseEntity<>("Webhook Accepted", HttpStatus.ACCEPTED);
    }
}
