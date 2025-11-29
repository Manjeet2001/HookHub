# ⚡ HookHub – Reliable Webhook Delivery System

HookHub is a **production-grade webhook subscription and delivery system** built using **Spring Boot**, **RabbitMQ**, **PostgreSQL**, and **Redis**.  
It ensures reliable webhook delivery with automatic retries, exponential backoff, persistent logging, and caching.

---

## 🚀 Features

✅ **Webhook ingestion** API for producers to queue webhook events  
✅ **Subscription management** for clients (event type + target URL)  
✅ **Asynchronous delivery** powered by RabbitMQ  
✅ **Automatic retry mechanism** with delayed queues (10s → 30s → 1m → 5m → 15m)  
✅ **Failure logging and persistence** via PostgreSQL  
✅ **Redis caching** for subscription lookups  
✅ **Docker support** for easy local deployment

---

## 🧩 Architecture Overview

```text
           ┌──────────────────┐
           │ Webhook Producer │
           └───────┬──────────┘
                   │  (1) POST /api/subscriptions
                   ▼
        ┌────────────────────────┐
        │   HookHub Ingestion    │
        │ (Spring Boot Service)  │
        └──────────┬─────────────┘
                   │  (2) Publishes Message
                   ▼
           ┌──────────────────┐
           │   RabbitMQ       │
           │  (Main Queue +   │
           │   Retry Queues)  │
           └────────┬─────────┘
                    │ (3) Async Consumption
                    ▼
           ┌──────────────────┐
           │ Webhook Worker   │
           │ Delivers HTTP(s) │
           └────────┬─────────┘
                    │
                    ▼
           ┌──────────────────┐
           │ Target Endpoint  │
           │ (Subscriber App) │
           └──────────────────┘
```

## 🛠️ Tech Stack
| Component         | Technology             |
| ----------------- | ---------------------- |
| Backend Framework | Spring Boot 3          |
| Messaging         | RabbitMQ               |
| Database          | PostgreSQL             |
| Caching           | Redis                  |
| Build Tool        | Maven                  |
| Containerization  | Docker, Docker Compose |


## ⚙️ Project Structure
```text
webhook_delivery/
├── .idea/
├── target/
├── webhook_delivery/
│   ├── .mvn/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com.example.webhook_delivery/
│   │   │   │       ├── config/     # RabbitMQ & RestTemplate configuration
│   │   │   │       ├── controller/ # REST Controllers (Webhook + Subscription)
│   │   │   │       ├── dto/        # Data Transfer Objects
│   │   │   │       ├── entity/     # JPA Entities (Subscription, DeliveryLog)
│   │   │   │       ├── rabbitmq/   # WebhookMessage DTO
│   │   │   │       ├── repository/ # JPA Repositories
│   │   │   │       ├── service/    # Business Logic (WebhookDeliveryWorker, WebhookIngestionService, SubscriptionService, signatureService, LogCleanupService)
│   │   │   │       └── WebhookDeliveryApplication.java
│   │   │   └── resources/
│   │   │       ├── static/
│   │   │       ├── templates/
│   │   │       └── application.properties
│   │   └── test/
│   └── target/
└── .gitattributes
```
## 🐳 Run Locally with Docker
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Manjeet2001/HookHub.git
cd HookHub
```
### 2️⃣ Start Dependencies (RabbitMQ, PostgreSQL, Redis)
```bash
docker-compose up -d
```

### ✅ This starts:

RabbitMQ at localhost:5672 (UI at http://localhost:15672
)

PostgreSQL at localhost:5432

Redis at localhost:6379

### 3️⃣ Configure Application Properties

Edit src/main/resources/application.properties if needed:
```bash
# Spring Datasource
spring.datasource.url=jdbc:postgresql://localhost:5432/webhook_db
spring.datasource.username=user
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Spring RabbitMQ
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
spring.rabbitmq.virtual-host=/

# Application-specific queue/exchange names
app.rabbitmq.exchange=hookhub-exchange
app.rabbitmq.queue=hookhub-delivery-queue
app.rabbitmq.routingkey=hookhub-routing-key

# Spring Redis (Caching)
spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.cache.type=redis

# Application Specific Configuration
app.webhook.max-retries=5
app.log-retention-hours=72
```

## 🧠 How It Works

### 1. A client registers a subscription (eventType + targetURL).

### 2. A producer POSTs a webhook payload to /api/webhooks/{subscriptionId}.

### 3. HookHub queues the message in RabbitMQ.

### 4. The WebhookDeliveryWorker consumes the message asynchronously and POSTs it to the subscriber’s URL.

### 5. If delivery fails (HTTP 5xx or timeout), the message is retried after a delay with exponential backoff.

### 6. All attempts and outcomes are logged in PostgreSQL.

## 🔁 Retry Mechanism
| Attempt | Queue             | Delay        | Outcome           |
|---------| ----------------- | ------------ | ----------------- |
| 1       | Main Queue        | Immediate    | First attempt     |
| 2       | Retry Queue (10s) | 10 sec later | 1st retry         |
| 3       | Retry Queue (30s) | 30 sec later | 2nd retry         |
| 4       | Retry Queue (1m)  | 1 min later  | 3rd retry         |
| 5       | Retry Queue (5m)  | 5 min later  | 4th retry         |
| 6       | Retry Queue (15m) | 15 min later | 5th retry         |
| 7       | —                 | —            | Marked as FAILURE |

### Logs are saved for each attempt in webhook_delivery_log.

## 🧪 API Endpoints
### 1️⃣ Create a Subscription

### POST /api/subscriptions

Body:
```json
{
  "targetUrl": "https://webhook.site/your-unique-id",
  "eventType": "user.created",
  "secret": "your-secret-key(Optional)"
}
```
Response:
```json
{
  "Id": "generated-subscription-id",
  "targetUrl": "https://webhook.site/your-unique-id",
  "eventType": "user.created"
}
```

## 2️⃣ Send a Webhook Event

### POST /api/webhooks/{subscriptionId}
Body:
```json
{
  "eventType": "user.created",
    "payload": {
        "userId": "12345",
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```
Response:
```body
    202 Accepted
    Webhook Accepted
```

## 3️⃣ Check Delivery Logs

### GET /api/status/subscription/{subscriptionId}

Response Example:
```json
[
  {
    "id": 107,
    "deliveryTaskId": "5d4baae3-d782-4bcb-a89c-545e7eca9d25",
    "subscriptionId": "487e5c15-9626-40a8-862f-8179400c3f22",
    "targetUrl": "https://webhook.site/cbe094fa-3c92-4ae8-a789-c0a4a441af72",
    "timestamp": "2025-11-05T10:29:51.512615",
    "attemptNumber": 4,
    "outcome": "SUCCESS",
    "httpStatusCode": 200,
    "errorDetails": null
  },
  {
    "id": 106,
    "deliveryTaskId": "5d4baae3-d782-4bcb-a89c-545e7eca9d25",
    "subscriptionId": "487e5c15-9626-40a8-862f-8179400c3f22",
    "targetUrl": "https://webhook.site/cbe094fa-3c92-4ae8-a789-c0a4a441af72",
    "timestamp": "2025-11-05T10:28:48.927651",
    "attemptNumber": 3,
    "outcome": "FAILED_ATTEMPT",
    "httpStatusCode": 500,
    "errorDetails": "This URL has no default content configured. <a href=\"https://webhook.site/#!/edit/cbe094fa-3c92-4ae8-a789-c0a4a441af72\">Change response in Webhook.site</a>."
  }
]
```
### GET /api/status/task/{taskId}
Response Example:
```json
[
  {
    "id": 102,
    "deliveryTaskId": "96197c15-713a-4100-bf70-2aeb4b062eb8",
    "subscriptionId": "487e5c15-9626-40a8-862f-8179400c3f22",
    "targetUrl": "https://webhook.site/cbe094fa-3c92-4ae8-a789-c0a4a441af72",
    "timestamp": "2025-11-05T10:07:06.313746",
    "attemptNumber": 1,
    "outcome": "SUCCESS",
    "httpStatusCode": 200,
    "errorDetails": null
  }
]
```

## 📊 Database Tables
### subscription
| Column     | Type    | Description                      |
| ---------- | ------- | -------------------------------- |
| id         | UUID    | Primary key                      |
| event_type | VARCHAR | Event name (e.g. `user.created`) |
| target_url | VARCHAR | Target webhook endpoint          |

### webhook_delivery_log
| Column           | Type      | Description                        |
| ---------------- | --------- | ---------------------------------- |
| id               | BIGINT    | Auto ID                            |
| delivery_task_id | UUID      | Tracks unique webhook delivery     |
| subscription_id  | UUID      | FK → subscription                  |
| target_url      | VARCHAR   | Target webhook endpoint            |
| timestamp        | TIMESTAMP | Logged at                          |
| attempt_number   | INT       | Attempt count                      |
| outcome          | VARCHAR   | SUCCESS / FAILED_ATTEMPT / FAILURE |
| http_status_code | INT       | Response status                    |
| error_details    | TEXT      | Error message if any               |