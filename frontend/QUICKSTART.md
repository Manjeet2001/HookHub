# HookHub Frontend - Quick Start Guide

## 🚀 Quick Setup (3 Steps)

### 1. Install Dependencies

**Option A - Using Setup Script (Windows)**:
```bash
setup.bat
```

**Option B - Manual Installation**:
```bash
npm install
```

### 2. Start Backend

Navigate to the HookHub directory and start the backend:

```bash
cd ..\HookHub
docker-compose up -d
cd webhook_delivery
mvnw spring-boot:run
```

### 3. Start Frontend

```bash
npm run dev
```

Open http://localhost:5173 in your browser!

---

## 📋 What You Need

- ✅ Node.js 18+ and npm
- ✅ HookHub backend running on port 8080
- ✅ Docker (for backend dependencies)

---

## 🎯 Quick Test

1. **Create a Subscription**
   - Go to https://webhook.site and copy your unique URL
   - In HookHub frontend, click "New Subscription"
   - Paste the URL, enter event type "user.created"
   - Click Create

2. **Send a Webhook**
   - Go to "Send Webhook" tab
   - Select your subscription
   - Click "Send Webhook"

3. **Check Logs**
   - Go to "Delivery Logs" tab
   - Enter your subscription ID
   - Click Search
   - See the delivery status!

---

## 🐛 Troubleshooting

**Problem**: `Cannot find module 'axios'`  
**Solution**: Run `npm install`

**Problem**: CORS errors in browser console  
**Solution**: Make sure backend is running and CORS is configured

**Problem**: Connection refused  
**Solution**: Start the backend on port 8080

---

## 📚 Full Documentation

See [README.md](./README.md) for complete documentation and advanced features.
