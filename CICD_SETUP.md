# 🚀 CI/CD Deployment Pipeline Setup Guide

This guide will help you set up an automated deployment pipeline from GitHub to your AWS EC2 instance.

## 📋 Overview

When you push code to the `main` branch, GitHub Actions will automatically:
1. Connect to your EC2 instance via SSH
2. Pull the latest code
3. Stop old containers
4. Build and start new containers with updated code
5. Verify deployment health

---

## 🔧 Setup Instructions

### Step 1: Prepare Your EC2 Instance

#### 1.1 Install Docker and Docker Compose (if not already installed)

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version

# Log out and back in for group changes to take effect
exit
```

#### 1.2 Initial Project Setup on EC2

```bash
# SSH back into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Clone the repository (first time only)
cd ~
git clone https://github.com/Manjeet2001/HookHub.git
cd HookHub

# Create .env file with production settings
cp .env.example .env
nano .env
# Update passwords and settings, then save (Ctrl+X, Y, Enter)

# Initial deployment
docker-compose up -d --build

# Verify it's working
docker-compose ps
curl http://localhost:8080/actuator/health
```

### Step 2: Configure EC2 Security Group

Ensure your EC2 Security Group allows:

| Type | Protocol | Port | Source | Description |
|------|----------|------|--------|-------------|
| SSH | TCP | 22 | Your IP | SSH access |
| Custom TCP | TCP | 8080 | 0.0.0.0/0 | HookHub API |
| Custom TCP | TCP | 15672 | Your IP | RabbitMQ Management (optional) |

### Step 3: Set Up GitHub Secrets

#### 3.1 Get Your EC2 Private Key

```bash
# On your local machine, view your EC2 private key
cat your-key.pem
# Copy the entire content including:
# -----BEGIN RSA PRIVATE KEY-----
# ... key content ...
# -----END RSA PRIVATE KEY-----
```

#### 3.2 Add Secrets to GitHub Repository

1. Go to your GitHub repository: https://github.com/Manjeet2001/HookHub
2. Click **Settings** (top navigation)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**

Add these three secrets:

**Secret 1: EC2_HOST**
- Name: `EC2_HOST`
- Value: Your EC2 public IP or DNS (e.g., `3.110.123.456` or `ec2-3-110-123-456.ap-south-1.compute.amazonaws.com`)

**Secret 2: EC2_USERNAME**
- Name: `EC2_USERNAME`
- Value: `ubuntu` (for Ubuntu AMI) or `ec2-user` (for Amazon Linux)

**Secret 3: EC2_SSH_KEY**
- Name: `EC2_SSH_KEY`
- Value: Paste your entire private key content (from Step 3.1)

### Step 4: Push the Workflow File to GitHub

The workflow file has already been created at `.github/workflows/deploy.yml`.

```bash
# On your local machine
cd C:\Users\LENOVO\OneDrive\Desktop\HookHub

# Add the workflow file
git add .github/workflows/deploy.yml

# Commit
git commit -m "Add CI/CD deployment pipeline"

# Push to GitHub
git push origin main
```

### Step 5: Test the Pipeline

#### Option A: Automatic Trigger (Push to main branch)

```bash
# Make any change to trigger deployment
echo "# Test deployment" >> README.md
git add README.md
git commit -m "Test CI/CD pipeline"
git push origin main
```

#### Option B: Manual Trigger

1. Go to your GitHub repository
2. Click **Actions** tab
3. Click **Deploy to AWS EC2** workflow
4. Click **Run workflow** button
5. Select `main` branch
6. Click **Run workflow**

### Step 6: Monitor Deployment

1. Go to **Actions** tab in GitHub
2. Click on the running workflow
3. Click on the **deploy** job
4. Watch the deployment steps in real-time

---

## 📊 Pipeline Features

### What the Pipeline Does

✅ **Automatic Deployment**: Deploys on every push to `main`  
✅ **Manual Deployment**: Can be triggered manually from GitHub UI  
✅ **Smart Updates**: Only pulls changed code  
✅ **Zero Downtime**: Uses Docker Compose rolling updates  
✅ **Health Checks**: Verifies deployment success  
✅ **Logging**: Shows recent application logs  
✅ **Cleanup**: Removes old Docker images to save space  

### Pipeline Workflow

```
1. Push to main branch
   ↓
2. GitHub Actions triggers
   ↓
3. SSH into EC2 instance
   ↓
4. Pull latest code from GitHub
   ↓
5. Stop existing containers
   ↓
6. Build new Docker images
   ↓
7. Start new containers
   ↓
8. Verify health endpoint
   ↓
9. Show deployment status
   ↓
10. ✅ Deployment complete!
```

---

## 🔒 Security Best Practices

### EC2 Instance Security

1. **Use SSH Key Authentication** (already configured)
2. **Restrict SSH Access** to your IP only
3. **Keep System Updated**:
   ```bash
   sudo apt-get update
   sudo apt-get upgrade -y
   ```

4. **Use Production Passwords**: Update `.env` file on EC2 with strong passwords
   ```bash
   nano ~/HookHub/.env
   # Change POSTGRES_PASSWORD, RABBITMQ_PASSWORD, etc.
   ```

5. **Enable UFW Firewall** (optional):
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 8080/tcp
   sudo ufw enable
   ```

### GitHub Secrets Security

✅ **Never commit** `.env` or private keys to repository  
✅ **Use GitHub Secrets** for sensitive data  
✅ **Rotate keys** periodically  
✅ **Limit access** to repository settings  

---

## 🐛 Troubleshooting

### Deployment Fails to Connect to EC2

**Problem**: SSH connection timeout or refused

**Solutions**:
1. Verify EC2_HOST is correct (public IP, not private)
2. Check Security Group allows SSH (port 22) from GitHub IPs
3. Verify EC2 instance is running
4. Check EC2_SSH_KEY is complete and formatted correctly

### Deployment Fails During Build

**Problem**: Docker build errors

**Solutions**:
```bash
# SSH into EC2 and check manually
ssh -i your-key.pem ubuntu@your-ec2-ip
cd HookHub
docker-compose logs hookhub-app
docker-compose down -v
docker-compose up -d --build
```

### Health Check Fails

**Problem**: Application doesn't respond to health check

**Solutions**:
```bash
# Check if containers are running
docker-compose ps

# Check application logs
docker-compose logs hookhub-app

# Verify database connection
docker-compose logs postgres

# Check RabbitMQ
docker-compose logs rabbitmq
```

### Disk Space Issues

**Problem**: "No space left on device"

**Solutions**:
```bash
# Clean up old Docker images and containers
docker system prune -a -f

# Remove unused volumes
docker volume prune -f

# Check disk usage
df -h
```

---

## 🔄 Updating Your Deployment

### Regular Updates

Just push to main branch:
```bash
git add .
git commit -m "Update feature"
git push origin main
# Automatic deployment triggered!
```

### Rollback to Previous Version

```bash
# On EC2 instance
cd ~/HookHub
git log --oneline  # Find commit hash to rollback to
git reset --hard COMMIT_HASH
docker-compose down
docker-compose up -d --build
```

### Update Environment Variables

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip
cd HookHub
nano .env
# Make changes, save

# Restart services to apply changes
docker-compose down
docker-compose up -d
```

---

## 📈 Advanced Pipeline Features (Optional)

### Add Build and Test Stage

Create `.github/workflows/test.yml`:

```yaml
name: Test

on:
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - name: Run tests
        run: |
          cd webhook_delivery
          ./mvnw test
```

### Add Slack Notifications

Add to `deploy.yml`:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Add Deployment Approval

Add to `deploy.yml` under `jobs`:

```yaml
deploy:
  runs-on: ubuntu-latest
  environment:
    name: production
    url: http://your-ec2-ip:8080
```

Then configure environment protection rules in GitHub Settings.

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [AWS EC2 Security Groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html)
- [SSH Action Documentation](https://github.com/appleboy/ssh-action)

---

## ✅ Deployment Checklist

Before going to production:

- [ ] EC2 instance has Docker and Docker Compose installed
- [ ] Initial deployment tested manually on EC2
- [ ] Production `.env` file configured with strong passwords
- [ ] EC2 Security Group configured correctly
- [ ] GitHub Secrets added (EC2_HOST, EC2_USERNAME, EC2_SSH_KEY)
- [ ] Workflow file pushed to repository
- [ ] Pipeline tested with a test commit
- [ ] Health check endpoint accessible
- [ ] Application logs verified
- [ ] Backup strategy in place for database

---

## 🎉 Success!

Once set up, you'll have:
- ✅ Automatic deployments on every push to main
- ✅ Manual deployment option via GitHub UI
- ✅ Deployment logs and status in GitHub Actions
- ✅ Health verification after each deployment
- ✅ Easy rollback capability

Your development workflow:
1. Make changes locally
2. Commit and push to GitHub
3. Pipeline automatically deploys to EC2
4. Verify deployment in GitHub Actions
5. Test on production URL

**That's it! Your CI/CD pipeline is ready!** 🚀

