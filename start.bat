@echo off
REM HookHub - Docker Quick Start Script for Windows
REM This script helps you get HookHub up and running quickly

echo.
echo 🚀 Starting HookHub - Reliable Webhook Delivery System
echo ==================================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from .env.example...
    copy .env.example .env
    echo ✅ .env file created. Please modify it if needed.
)

echo.
echo 🏗️  Building and starting all services...
echo This may take a few minutes on first run...
echo.

REM Build and start services
docker-compose up -d --build

echo.
echo ⏳ Waiting for services to be healthy...
timeout /t 15 /nobreak >nul

REM Check service status
echo.
echo 📊 Service Status:
docker-compose ps

echo.
echo ✅ HookHub is now running!
echo.
echo 🌐 Access Points:
echo    - HookHub API: http://localhost:8080
echo    - RabbitMQ Management UI: http://localhost:15672 (guest/guest)
echo    - Health Check: http://localhost:8080/actuator/health
echo.
echo 📚 Quick Commands:
echo    - View logs: docker-compose logs -f hookhub-app
echo    - Stop services: docker-compose down
echo    - Stop and remove volumes: docker-compose down -v
echo.
echo 🎉 Happy webhook delivery!
echo.
pause

