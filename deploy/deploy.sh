#!/bin/bash
set -e

VPS_IP="187.77.159.58"
VPS_USER="root"
DEPLOY_DIR="/var/www/fastaudio"

echo "=========================================="
echo "  FastAudio Deployment Script"
echo "  Deploying to $VPS_IP (fastaudio.cc)"
echo "=========================================="

# Go to project root
cd "$(dirname "$0")/.."

# Step 1: Build frontend
echo ""
echo "[1/5] Building frontend (React + Vite)..."
PORT=5000 BASE_PATH=/ NODE_ENV=production pnpm --filter @workspace/yt-mp3 run build
echo "✓ Frontend built: artifacts/yt-mp3/dist/public/"

# Step 2: Build backend
echo ""
echo "[2/5] Building backend (Express)..."
pnpm --filter @workspace/api-server run build
echo "✓ Backend built: artifacts/api-server/dist/index.cjs"

# Step 3: Upload frontend static files
echo ""
echo "[3/5] Uploading frontend..."
ssh $VPS_USER@$VPS_IP "rm -rf $DEPLOY_DIR/public/*"
scp -r artifacts/yt-mp3/dist/public/* $VPS_USER@$VPS_IP:$DEPLOY_DIR/public/
echo "✓ Frontend uploaded"

# Step 4: Upload backend
echo ""
echo "[4/5] Uploading backend..."
scp artifacts/api-server/dist/index.cjs $VPS_USER@$VPS_IP:$DEPLOY_DIR/api/
scp deploy/api-package.json $VPS_USER@$VPS_IP:$DEPLOY_DIR/api/package.json
scp deploy/ecosystem.config.cjs $VPS_USER@$VPS_IP:$DEPLOY_DIR/
scp deploy/nginx.conf $VPS_USER@$VPS_IP:/tmp/fastaudio-nginx.conf
echo "✓ Backend uploaded"

# Step 5: Install deps, restart app, reload nginx
echo ""
echo "[5/5] Starting app on VPS..."
ssh $VPS_USER@$VPS_IP << 'ENDSSH'
    set -e

    # Install backend dependencies
    cd /var/www/fastaudio/api
    npm install --production --silent
    echo "✓ Dependencies installed"

    # Update nginx config
    cp /tmp/fastaudio-nginx.conf /etc/nginx/sites-available/fastaudio
    ln -sf /etc/nginx/sites-available/fastaudio /etc/nginx/sites-enabled/fastaudio
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl reload nginx
    echo "✓ Nginx updated"

    # Restart PM2 app
    cd /var/www/fastaudio
    pm2 delete fastaudio-api 2>/dev/null || true
    pm2 start ecosystem.config.cjs
    pm2 save
    echo "✓ App started"

    echo ""
    pm2 status
ENDSSH

echo ""
echo "=========================================="
echo "  DEPLOYMENT COMPLETE!"
echo "  Live at: https://fastaudio.cc"
echo "=========================================="
