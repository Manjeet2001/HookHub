#!/bin/bash

# HookHub - Docker Quick Start Script
# This script helps you get HookHub up and running quickly

set -e

echo "🚀 Starting HookHub - Reliable Webhook Delivery System"
echo "=================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please modify it if needed."
fi

echo ""
echo "🏗️  Building and starting all services..."
echo "This may take a few minutes on first run..."
echo ""

# Build and start services
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ HookHub is now running!"
echo ""
echo "🌐 Access Points:"
echo "   - HookHub API: http://localhost:8080"
echo "   - RabbitMQ Management UI: http://localhost:15672 (guest/guest)"
echo "   - Health Check: http://localhost:8080/actuator/health"
echo ""
echo "📚 Quick Commands:"
echo "   - View logs: docker-compose logs -f hookhub-app"
echo "   - Stop services: docker-compose down"
echo "   - Stop and remove volumes: docker-compose down -v"
echo ""
echo "🎉 Happy webhook delivery!"

