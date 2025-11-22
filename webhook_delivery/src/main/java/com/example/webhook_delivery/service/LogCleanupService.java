package com.example.webhook_delivery.service;

import com.example.webhook_delivery.repository.WebhookDeliveryLogRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class LogCleanupService {

    private static final Logger logger = LoggerFactory.getLogger(LogCleanupService.class);

    @Autowired
    private WebhookDeliveryLogRepository logRepository;

    @Value("${app.log-retention-hours}")
    private int logRetentionHours;

    @Scheduled(cron = "0 0 0 * * ?") // Runs every day at midnight
    @Transactional
    public void cleanupOldLogs() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(logRetentionHours);
        logger.info("Deleting logs older than {}", cutoff);
        logRepository.deleteByTimestampBefore(cutoff);
    }
}
