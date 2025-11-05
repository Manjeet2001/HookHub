package com.example.webhook_delivery.service;

import com.example.webhook_delivery.dto.SubscriptionRequestDto;
import com.example.webhook_delivery.dto.SubscriptionResponseDto;
import com.example.webhook_delivery.entity.Subscription;
import com.example.webhook_delivery.repository.SubscriptionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    @Cacheable(value = "subscriptionsByEvent", key = "#eventType", condition = "#eventType != null")
    public List<Subscription> findByEventType(String eventType) {
        if (eventType == null) {
            return subscriptionRepository.findAll();
        }
        return subscriptionRepository.findByEventType(eventType);
    }

    public List<SubscriptionResponseDto> list() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        return subscriptions.stream().map(subscription -> {
            SubscriptionResponseDto dto = new SubscriptionResponseDto();
            BeanUtils.copyProperties(subscription, dto);
            return dto;
        }).toList();
    }

    public SubscriptionResponseDto getById(UUID id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found with id: " + id));
        SubscriptionResponseDto dto = new SubscriptionResponseDto();
        BeanUtils.copyProperties(subscription, dto);
        return dto;
    }

    @Transactional
    public SubscriptionResponseDto createSubscription(SubscriptionRequestDto subscription) {
        Subscription newSubscription = new Subscription();
        BeanUtils.copyProperties(subscription, newSubscription);
        Subscription savedSubscription = subscriptionRepository.save(newSubscription);
        SubscriptionResponseDto dto = new SubscriptionResponseDto();
        BeanUtils.copyProperties(savedSubscription, dto);
        return dto;
    }

    @Transactional
    public SubscriptionResponseDto updateSubscription(UUID id, SubscriptionRequestDto updatedSubscription) {
        Subscription existingSubscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found with id: " + id));
        BeanUtils.copyProperties(updatedSubscription, existingSubscription, "id");
        Subscription savedSubscription = subscriptionRepository.save(existingSubscription);
        SubscriptionResponseDto dto = new SubscriptionResponseDto();
        BeanUtils.copyProperties(savedSubscription, dto);
        return dto;
    }
}
