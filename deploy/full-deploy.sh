#!/bin/bash
# Full automated deployment for fastaudio.cc
# Run from: /home/runner/workspace
# Usage: bash deploy/full-deploy.sh

set -e

VPS_IP="187.77.159.58"
VPS_USER="root"
VPS_PASS="Sohaib@11078"
DOMAIN="fastaudio.cc"
SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=30"

ssh_run() {
  sshpass -p "$VPS_PASS" ssh $SSH_OPTS "$VPS_USER@$VPS_IP" "$@"
}

scp_upload() {
  sshpass -p "$VPS_PASS" scp $SSH_OPTS "$@"
}

echo "========================================"
echo " FastAudio Full Deployment"
echo "========================================"

# ─── STEP 1: Build frontend ──────────────────
echo ""
echo ">>> STEP 1: Building frontend..."
cd artifacts/yt-mp3
PORT=5000 BASE_PATH=/ NODE_ENV=production pnpm run build
cd ../..
echo "✅ Frontend built"

# ─── STEP 2: Build backend ───────────────────
echo ""
echo ">>> STEP 2: Building backend..."
cd artifacts/api-server
pnpm run build
cd ../..
echo "✅ Backend built"

# ─── STEP 3: Create frontend tarball ─────────
echo ""
echo ">>> STEP 3: Creating frontend archive..."
tar -czf /tmp/fastaudio-frontend.tar.gz -C artifacts/yt-mp3/dist/public .
echo "✅ Frontend archived ($(du -sh /tmp/fastaudio-frontend.tar.gz | cut -f1))"

# ─── STEP 4: Upload files to VPS ─────────────
echo ""
echo ">>> STEP 4: Uploading files to VPS..."

echo "  → Uploading frontend archive..."
scp_upload /tmp/fastaudio-frontend.tar.gz "$VPS_USER@$VPS_IP:/tmp/fastaudio-frontend.tar.gz"

echo "  → Uploading backend..."
scp_upload artifacts/api-server/dist/index.cjs "$VPS_USER@$VPS_IP:/var/www/fastaudio/api/index.cjs"

echo "  → Uploading PM2 config..."
scp_upload deploy/ecosystem.config.cjs "$VPS_USER@$VPS_IP:/var/www/fastaudio/ecosystem.config.cjs"

echo "✅ Files uploaded"

# ─── STEP 5: Setup VPS ───────────────────────
echo ""
echo ">>> STEP 5: Setting up VPS..."

ssh_run bash << 'REMOTE'
set -e

echo "  → Creating directories..."
mkdir -p /var/www/fastaudio/{public,api,downloads}
mkdir -p /var/log/fastaudio
mkdir -p /var/www/certbot

echo "  → Extracting frontend..."
tar -xzf /tmp/fastaudio-frontend.tar.gz -C /var/www/fastaudio/public/
ls -la /var/www/fastaudio/public/

echo "  → Fixing permissions..."
chown -R www-data:www-data /var/www/fastaudio/public/ 2>/dev/null || chmod -R 755 /var/www/fastaudio/public/
chmod -R 755 /var/www/fastaudio/

echo "  → Installing ffmpeg..."
if ! command -v ffmpeg &>/dev/null; then
  apt-get install -y ffmpeg --quiet 2>&1 | tail -3
  echo "    ffmpeg installed: $(ffmpeg -version 2>&1 | head -1)"
else
  echo "    ffmpeg already installed: $(ffmpeg -version 2>&1 | head -1)"
fi

echo "  → Installing yt-dlp..."
YT_DLP_URL="https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp"
curl -sSL "$YT_DLP_URL" -o /usr/local/bin/yt-dlp
chmod +x /usr/local/bin/yt-dlp
echo "    yt-dlp version: $(yt-dlp --version)"

echo "  → Checking backend deps..."
cd /var/www/fastaudio/api
if [ ! -f package.json ]; then
  cat > package.json << 'PKG'
{
  "name": "fastaudio-api",
  "version": "1.0.0",
  "dependencies": {}
}
PKG
fi
echo "    No extra npm deps needed (uses system yt-dlp + ffmpeg)"

echo "  → Writing Nginx config with HTTPS..."
cat > /etc/nginx/sites-available/fastaudio << 'NGINX'
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name fastaudio.cc www.fastaudio.cc;
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl;
    server_name fastaudio.cc www.fastaudio.cc;
    ssl_certificate /etc/letsencrypt/live/fastaudio.cc/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fastaudio.cc/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/fastaudio/public;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 1000;

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 600s;
        proxy_connect_timeout 75s;
        proxy_send_timeout 600s;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX

ln -sf /etc/nginx/sites-available/fastaudio /etc/nginx/sites-enabled/fastaudio
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

echo "  → Testing Nginx config..."
nginx -t

echo "  → Restarting Nginx..."
systemctl restart nginx
systemctl status nginx --no-pager | head -5

echo "  → Restarting API with PM2..."
cd /var/www/fastaudio
pm2 delete fastaudio-api 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save

echo "  → Waiting for API to start..."
sleep 3
pm2 status

echo "  → Testing API..."
curl -s http://127.0.0.1:3000 | head -20 || echo "API not responding yet"

echo "  → Testing Nginx serving frontend..."
curl -s http://127.0.0.1 | head -5 || echo "Nginx not serving frontend"

echo ""
echo "✅ VPS setup complete!"
REMOTE

echo ""
echo "========================================"
echo " DEPLOYMENT COMPLETE!"
echo "========================================"
echo ""
echo "Site: http://fastaudio.cc"
echo "API:  http://fastaudio.cc/api"
echo ""
echo "Next step - enable SSL (run on VPS):"
echo "  certbot --nginx -d fastaudio.cc -d www.fastaudio.cc --non-interactive --agree-tos -m sonujee@proton.me"
echo ""
