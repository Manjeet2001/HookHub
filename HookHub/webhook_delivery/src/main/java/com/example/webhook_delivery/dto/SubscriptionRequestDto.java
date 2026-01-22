package com.example.webhook_delivery.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class SubscriptionRequestDto {
    @NotBlank
    @URL
    private String targetUrl;

    @NotBlank
    private String eventType;

    private String secretKey;
}
