#!/bin/bash

# Art of Rust - Auto Deployment Script
# This script is triggered by Git webhooks to auto-deploy code changes

# Configuration
PROJECT_DIR="/home/artofrust/public_html"
BRANCH="claude/review-aor-website-Hdmsd"
LOG_FILE="$PROJECT_DIR/deploy.log"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Start deployment
log "========================================="
log "Starting deployment..."
log "========================================="

# Navigate to project directory
cd "$PROJECT_DIR" || exit 1
log "Working directory: $(pwd)"

# Fetch latest changes
log "Fetching from remote..."
git fetch origin 2>&1 | tee -a "$LOG_FILE"

# Check current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
log "Current branch: $CURRENT_BRANCH"

# Checkout and pull the correct branch
log "Checking out branch: $BRANCH"
git checkout "$BRANCH" 2>&1 | tee -a "$LOG_FILE"

log "Pulling latest changes..."
git pull origin "$BRANCH" 2>&1 | tee -a "$LOG_FILE"

# Get latest commit info
COMMIT=$(git log -1 --pretty=format:"%h - %s (%an)")
log "Latest commit: $COMMIT"

# Backend deployment
if [ -d "backend" ]; then
    log "Deploying backend..."
    cd backend || exit 1

    log "Installing backend dependencies..."
    npm install 2>&1 | tee -a "$LOG_FILE"

    log "Building backend..."
    npm run build 2>&1 | tee -a "$LOG_FILE"

    log "Restarting backend service..."
    # If using PM2:
    if command -v pm2 &> /dev/null; then
        pm2 restart aor-backend 2>&1 | tee -a "$LOG_FILE" || pm2 start dist/index.js --name aor-backend 2>&1 | tee -a "$LOG_FILE"
    # If using systemd:
    elif systemctl is-active --quiet aor-backend; then
        systemctl restart aor-backend 2>&1 | tee -a "$LOG_FILE"
    else
        log "Warning: No process manager found. Backend needs manual restart."
    fi

    cd "$PROJECT_DIR" || exit 1
fi

# Frontend deployment
log "Deploying frontend..."
log "Installing frontend dependencies..."
npm install 2>&1 | tee -a "$LOG_FILE"

log "Building frontend..."
npm run build 2>&1 | tee -a "$LOG_FILE"

# Set proper permissions
log "Setting permissions..."
chown -R artofrust:artofrust "$PROJECT_DIR/dist" 2>&1 | tee -a "$LOG_FILE"
chmod -R 755 "$PROJECT_DIR/dist" 2>&1 | tee -a "$LOG_FILE"

log "========================================="
log "Deployment completed successfully!"
log "========================================="

# Send notification (optional)
# curl -X POST https://discord.com/api/webhooks/YOUR_WEBHOOK \
#   -H "Content-Type: application/json" \
#   -d "{\"content\": \"✅ Deployment successful: $COMMIT\"}"

exit 0
