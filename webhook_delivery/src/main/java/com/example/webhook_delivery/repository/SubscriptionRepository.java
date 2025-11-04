package com.example.webhook_delivery.repository;

import com.example.webhook_delivery.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    List<Subscription> findByEventType(String eventType);
}