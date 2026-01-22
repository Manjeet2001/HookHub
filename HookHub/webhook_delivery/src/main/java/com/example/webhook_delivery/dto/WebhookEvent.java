package com.example.webhook_delivery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebhookEvent implements Serializable {
    private UUID deliveryId;
    private UUID subscriptionId;
    private String payload;
}
