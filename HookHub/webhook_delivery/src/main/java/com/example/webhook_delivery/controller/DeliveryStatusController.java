package com.example.webhook_delivery.controller;

import com.example.webhook_delivery.entity.WebhookDeliveryLog;
import com.example.webhook_delivery.repository.WebhookDeliveryLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/status")
@RequiredArgsConstructor
public class DeliveryStatusController {

    private final WebhookDeliveryLogRepository deliveryLogRepository;

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<WebhookDeliveryLog>> getStatusByTaskId(@PathVariable UUID taskId) {
        List<WebhookDeliveryLog> logs = deliveryLogRepository.findByDeliveryTaskIdOrderByTimestampAsc(taskId);
        return logs.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(logs);
    }

    @GetMapping("/subscription/{subscriptionId}")
    public List<WebhookDeliveryLog> getRecentForSubscription(@PathVariable UUID subscriptionId) {
        return deliveryLogRepository.findBySubscriptionIdOrderByTimestampDesc(subscriptionId, PageRequest.of(0, 20));
    }

    @GetMapping("/recent")
    public List<WebhookDeliveryLog> getRecentLogs(@RequestParam(required = false) Integer hours) {
        if (hours != null && hours > 0) {
            LocalDateTime since = LocalDateTime.now().minusHours(hours);
            return deliveryLogRepository.findByTimestampAfterOrderByTimestampDesc(since, PageRequest.of(0, 50));
        }
        return deliveryLogRepository.findAll(PageRequest.of(0, 50)).getContent();
    }
}
