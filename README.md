# ⚡ HookHub - Complete Webhook Delivery System

A **production-grade, full-stack webhook subscription and delivery platform** that combines a robust Spring Boot backend with a modern React frontend. HookHub ensures reliable webhook delivery with automatic retries, exponential backoff, persistent logging, and real-time monitoring.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Development](#development)
- [CI/CD](#cicd)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

HookHub is a complete webhook management solution consisting of:

- **Backend (HookHub)**: Spring Boot application handling webhook ingestion, subscription management, and reliable delivery via RabbitMQ
- **Frontend**: Modern React dashboard for managing subscriptions, sending webhooks, and monitoring delivery status

Perfect for applications that need to:
- Send webhooks to multiple subscribers
- Ensure reliable delivery with retry mechanisms
- Monitor webhook delivery status in real-time
- Manage webhook subscriptions programmatically

---

## ✨ Features

### Backend Features
- ✅ **Webhook Ingestion API** - Queue webhook events for delivery
- ✅ **Subscription Management** - Create, read, update, delete webhook subscriptions
- ✅ **Asynchronous Delivery** - RabbitMQ-powered message queue
- ✅ **Automatic Retry System** - Exponential backoff (10s → 30s → 1m → 5m → 15m)
- ✅ **Delivery Logging** - Persistent PostgreSQL storage of all delivery attempts
- ✅ **Redis Caching** - Fast subscription lookups
- ✅ **HMAC Signature Verification** - Secure webhook payloads
- ✅ **Automatic Log Cleanup** - Scheduled cleanup of old delivery logs
- ✅ **Docker Support** - Easy deployment with Docker Compose

### Frontend Features
- 🎨 **Subscription Dashboard** - Visual management of webhook subscriptions
- 📤 **Webhook Sender** - Test webhook delivery with JSON editor
- 📊 **Delivery Logs Monitor** - Real-time webhook delivery status
- 🎯 **Modern UI** - Glassmorphism design with gradients
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔔 **Toast Notifications** - Instant feedback for all actions

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
│                    http://localhost:5173                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Subscription │  │   Webhook    │  │   Delivery Logs      │  │
│  │  Manager     │  │   Sender     │  │   Viewer             │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │ REST API
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Backend (Spring Boot)                          │
│                    http://localhost:8080                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  REST Controllers                                         │  │
│  │  • /api/webhooks      • /api/subscriptions                │  │
│  │  • /api/delivery-logs                                     │  │
│  └───────────────────┬──────────────────────────────────────┘  │
│                      │                                           │
│  ┌──────────────────┴────────────┬────────────────────────┐    │
│  │   Ingestion Service           │  Subscription Service  │    │
│  │   (Publish to RabbitMQ)       │  (CRUD + Redis Cache)  │    │
│  └───────────────────────────────┴────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Message Queue (RabbitMQ)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Main Queue  │  │ Retry Queue  │  │   Dead Letter Queue  │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Delivery Worker (Spring Boot)                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • Consume messages from RabbitMQ                         │  │
│  │  • Send HTTP POST to subscriber endpoints                │  │
│  │  • Log delivery attempts to PostgreSQL                   │  │
│  │  • Retry failed deliveries with backoff                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │   Subscriber Endpoint  │
              │   (External Service)   │
              └────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │  PostgreSQL  │  │    Redis     │                             │
│  │  (Persistent)│  │   (Cache)    │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Component         | Technology             | Purpose                        |
| ----------------- | ---------------------- | ------------------------------ |
| Framework         | Spring Boot 3          | Core application framework     |
| Language          | Java 17+               | Programming language           |
| Messaging         | RabbitMQ 3.13          | Asynchronous message queue     |
| Database          | PostgreSQL 16          | Persistent data storage        |
| Cache             | Redis 7                | Subscription lookup cache      |
| Build Tool        | Maven                  | Dependency & build management  |
| Containerization  | Docker & Docker Compose| Local development & deployment |

### Frontend
| Component         | Technology             | Purpose                        |
| ----------------- | ---------------------- | ------------------------------ |
| Framework         | React 18               | UI library                     |
| Language          | TypeScript 5.6         | Type-safe JavaScript           |
| Build Tool        | Vite 6                 | Fast dev server & bundler      |
| Styling           | Tailwind CSS 3.4       | Utility-first CSS framework    |
| HTTP Client       | Axios                  | API communication              |
| Icons             | Lucide React           | Beautiful icon library         |
| Notifications     | React Hot Toast        | Toast notifications            |

---

## 📁 Project Structure

```
webhook/
├── HookHub/                         # Backend (Spring Boot)
│   ├── docker-compose.yml          # Docker services (PostgreSQL, RabbitMQ, Redis)
│   ├── start.bat / start.sh        # Quick start scripts
│   ├── CICD_SETUP.md              # CI/CD deployment guide
│   ├── README.md                   # Backend-specific documentation
│   └── webhook_delivery/           # Main Spring Boot application
│       ├── pom.xml                 # Maven dependencies
│       ├── Dockerfile              # Container image definition
│       └── src/
│           ├── main/
│           │   ├── java/com/example/webhook_delivery/
│           │   │   ├── config/            # RabbitMQ, CORS, RestTemplate
│           │   │   ├── controller/        # REST API endpoints
│           │   │   ├── dto/               # Data transfer objects
│           │   │   ├── entity/            # JPA entities
│           │   │   ├── repository/        # Data access layer
│           │   │   ├── service/           # Business logic
│           │   │   └── rabbitmq/          # Message queue models
│           │   └── resources/
│           │       └── application.properties
│           └── test/                      # Unit & integration tests
│
└── frontend/                        # Frontend (React + TypeScript)
    ├── package.json                # Node dependencies
    ├── vite.config.ts              # Vite configuration
    ├── tailwind.config.js          # Tailwind CSS config
    ├── setup.bat                   # Windows setup script
    ├── README.md                   # Frontend-specific documentation
    ├── QUICKSTART.md              # Quick start guide
    └── src/
        ├── components/             # React components
        │   ├── SubscriptionManager.tsx
        │   ├── WebhookSender.tsx
        │   ├── DeliveryLogs.tsx
        │   ├── Card.tsx
        │   └── StatusBadge.tsx
        ├── services/
        │   └── api.ts              # Backend API integration
        ├── types/
        │   └── index.ts            # TypeScript type definitions
        ├── App.tsx                 # Main application component
        └── main.tsx                # Application entry point
```

---

## 🚀 Quick Start

### Prerequisites
- **Docker** and **Docker Compose** (for backend dependencies)
- **Java 17+** and **Maven** (for backend development)
- **Node.js 18+** and **npm** (for frontend)
- **Git**

### Option 1: Full Stack Setup (Recommended)

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd webhook
```

#### 2. Start Backend Infrastructure
```bash
cd HookHub
docker-compose up -d
```

This starts:
- PostgreSQL on `localhost:5432`
- RabbitMQ on `localhost:5672` (Management UI: `localhost:15672`)
- Redis on `localhost:6379`

#### 3. Start Backend Application
```bash
cd webhook_delivery
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run
```

Backend will be available at `http://localhost:8080`

#### 4. Start Frontend
```bash
cd ../../frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

#### 5. Open Your Browser
Navigate to `http://localhost:5173` and start managing webhooks!

### Option 2: Quick Start Scripts

**Windows:**
```bash
# Backend
cd HookHub
start.bat

# Frontend
cd frontend
setup.bat
```

**Linux/Mac:**
```bash
# Backend
cd HookHub
./start.sh

# Frontend
cd frontend
npm install && npm run dev
```

---

## 💡 Usage

### Creating a Webhook Subscription

**Via Frontend:**
1. Navigate to the **Subscriptions** tab
2. Click **New Subscription**
3. Fill in:
   - **Target URL**: Your webhook endpoint (e.g., `https://your-app.com/webhook`)
   - **Event Type**: Event identifier (e.g., `user.created`, `order.completed`)
4. Click **Create**

**Via API:**
```bash
curl -X POST http://localhost:8080/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "targetUrl": "https://your-app.com/webhook",
    "eventType": "user.created"
  }'
```

### Sending a Webhook

**Via Frontend:**
1. Navigate to the **Send Webhook** tab
2. Select an **Event Type**
3. Edit the JSON payload
4. Click **Send Webhook**

**Via API:**
```bash
curl -X POST http://localhost:8080/api/webhooks/send \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "user.created",
    "payload": {
      "userId": "12345",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }'
```

### Monitoring Delivery Status

**Via Frontend:**
1. Navigate to the **Delivery Logs** tab
2. View all delivery attempts with:
   - Status (Success, Failed, Pending)
   - Target URL
   - Timestamp
   - Response details

**Via API:**
```bash
curl http://localhost:8080/api/delivery-logs
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Endpoints

#### Subscriptions

| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| GET    | `/subscriptions`          | Get all subscriptions          |
| GET    | `/subscriptions/{id}`     | Get subscription by ID         |
| POST   | `/subscriptions`          | Create new subscription        |
| DELETE | `/subscriptions/{id}`     | Delete subscription            |

#### Webhooks

| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| POST   | `/webhooks/send`          | Send webhook event             |

#### Delivery Logs

| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| GET    | `/delivery-logs`          | Get all delivery logs          |
| GET    | `/delivery-logs/{id}`     | Get delivery log by ID         |

### Example Requests

**Create Subscription:**
```json
POST /api/subscriptions
{
  "targetUrl": "https://example.com/webhook",
  "eventType": "user.created"
}
```

**Send Webhook:**
```json
POST /api/webhooks/send
{
  "eventType": "user.created",
  "payload": {
    "userId": "123",
    "email": "test@example.com"
  }
}
```

---

## 🔧 Development

### Backend Development

#### Running Tests
```bash
cd HookHub/webhook_delivery
./mvnw test
```

#### Building the Application
```bash
./mvnw clean package
```

#### Running with Docker
```bash
cd HookHub/webhook_delivery
docker build -t hookhub-backend .
docker run -p 8080:8080 hookhub-backend
```

#### Configuration
Edit `HookHub/webhook_delivery/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/webhook_db
spring.datasource.username=postgres
spring.datasource.password=postgres123

# RabbitMQ
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672

# Redis
spring.data.redis.host=localhost
spring.data.redis.port=6379
```

### Frontend Development

#### Running in Development Mode
```bash
cd frontend
npm run dev
```

#### Building for Production
```bash
npm run build
```

#### Running Production Build
```bash
npm run preview
```

#### Linting
```bash
npm run lint
```

#### Configuration
Edit `frontend/src/services/api.ts` to change the backend URL:

```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

---

## 🚢 CI/CD

The project includes GitHub Actions workflow for automated deployment. See [CICD_SETUP.md](HookHub/CICD_SETUP.md) for detailed instructions.

**Features:**
- Automated builds on push/PR
- Docker image creation
- Automated deployment to cloud platforms
- Environment-based configuration

---

## 🌐 Access Points

Once running, access the following:

| Service                | URL                                  | Credentials        |
| ---------------------- | ------------------------------------ | ------------------ |
| Frontend Dashboard     | http://localhost:5173                | -                  |
| Backend API           | http://localhost:8080                | -                  |
| RabbitMQ Management   | http://localhost:15672               | guest / guest      |
| PostgreSQL            | localhost:5432                       | postgres / postgres123 |
| Redis                 | localhost:6379                       | -                  |

---

## 🔒 Security Features

- **HMAC Signature**: Webhooks are signed with HMAC-SHA256
- **CORS Configuration**: Properly configured CORS for frontend-backend communication
- **Input Validation**: Request validation on all API endpoints
- **Secure Storage**: Sensitive data stored in PostgreSQL with proper constraints

---


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- Backend: [Manjeet2001](https://github.com/Manjeet2001)
- Frontend: [maaz1604](https://github.com/maaz1604)

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- RabbitMQ for reliable message queuing
- React team for the powerful UI library
- All contributors and testers

---

---

## 🗺️ Roadmap

- [ ] Authentication & Authorization
- [ ] Webhook signature validation on subscriber side
- [ ] Rate limiting
- [ ] Metrics & monitoring dashboard
- [ ] GraphQL support
- [ ] Webhook replay functionality
- [ ] Custom retry policies per subscription
- [ ] Multi-tenancy support

---

Made with ❤️ by the HookHub Team
