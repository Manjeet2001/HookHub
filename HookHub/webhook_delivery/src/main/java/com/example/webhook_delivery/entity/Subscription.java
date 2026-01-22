package com.example.webhook_delivery.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.util.UUID;

@Entity
@Data
public class Subscription implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String targetUrl;

    @Column(nullable = false)
    private String eventType; // For event filtering bonus point

    private String secretKey; // For signature verification bonus point
}
