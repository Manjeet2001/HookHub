package com.example.webhook_delivery.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class SubscriptionResponseDto {
    private UUID id;
    private String targetUrl;
    private String eventType;
}
