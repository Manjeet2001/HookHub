package com.example.webhook_delivery.repository;

import com.example.webhook_delivery.entity.WebhookDeliveryLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface WebhookDeliveryLogRepository extends JpaRepository<WebhookDeliveryLog, Long> {
    List<WebhookDeliveryLog> findByDeliveryTaskIdOrderByTimestampAsc(UUID deliveryTaskId);
    List<WebhookDeliveryLog> findBySubscriptionIdOrderByTimestampDesc(UUID subscriptionId, Pageable pageable);
    void deleteByTimestampBefore(LocalDateTime timestamp);
}
