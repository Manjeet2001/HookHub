package com.example.webhook_delivery.controller;

import com.example.webhook_delivery.service.SignatureService;
import com.example.webhook_delivery.service.SubscriptionService;
import com.example.webhook_delivery.service.WebhookIngestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/ingest")
@RequiredArgsConstructor
public class WebhookIngestionController {

    private final WebhookIngestionService webhookIngestionService;

    @PostMapping("/{subscriptionId}")
    public ResponseEntity<String> ingestWebhook(
            @PathVariable UUID subscriptionId,
            @RequestBody String payload) {
            return webhookIngestionService.ingest(subscriptionId, payload);
    }
}
