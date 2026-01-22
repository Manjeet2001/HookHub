package com.example.webhook_delivery.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class WebhookDeliveryLog {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private UUID deliveryTaskId;
    private UUID subscriptionId;
    private String targetUrl;
    private LocalDateTime timestamp;
    private int attemptNumber;
    private String outcome; // SUCCESS, FAILED_ATTEMPT, FAILURE
    private Integer httpStatusCode;
    @Column(columnDefinition = "TEXT")
    private String errorDetails;

    public WebhookDeliveryLog(UUID deliveryTaskId, UUID subscriptionId, String targetUrl, int attemptNumber) {
        this.deliveryTaskId = deliveryTaskId;
        this.subscriptionId = subscriptionId;
        this.targetUrl = targetUrl;
        this.attemptNumber = attemptNumber;
        this.timestamp = LocalDateTime.now();
    }
}
