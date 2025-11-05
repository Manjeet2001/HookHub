package com.example.webhook_delivery.controller;

import com.example.webhook_delivery.dto.SubscriptionRequestDto;
import com.example.webhook_delivery.dto.SubscriptionResponseDto;
import com.example.webhook_delivery.entity.Subscription;
import com.example.webhook_delivery.repository.SubscriptionRepository;
import com.example.webhook_delivery.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    public SubscriptionResponseDto createSubscription(@Valid @RequestBody SubscriptionRequestDto requestDto) {
        return subscriptionService.createSubscription(requestDto);
    }

    @GetMapping
    public List<SubscriptionResponseDto> getAllSubscriptions() {
        return subscriptionService.list();
    }

    @GetMapping("/{id}")
    public SubscriptionResponseDto getSubscriptionById(@PathVariable UUID id) {
        return subscriptionService.getById(id);
    }

    @PutMapping("/{id}")
    public SubscriptionResponseDto updateSubscription(@PathVariable UUID id, @Valid @RequestBody SubscriptionRequestDto requestDto) {
        return subscriptionService.updateSubscription(id, requestDto);
    }
}
