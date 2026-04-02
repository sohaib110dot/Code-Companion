#!/bin/bash
set -e

echo "=========================================="
echo "  FastAudio VPS Setup Script"
echo "  VPS: 187.77.150.58 | Domain: fastaudio.cc"
echo "=========================================="

# Update system
echo "[1/8] Updating system..."
apt-get update -y && apt-get upgrade -y

# Install system dependencies
echo "[2/8] Installing system dependencies..."
apt-get install -y curl wget git nginx certbot python3-certbot-nginx ffmpeg unzip python3

# Install yt-dlp (needed for video conversion)
echo "[3/8] Installing yt-dlp..."
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
chmod a+rx /usr/local/bin/yt-dlp
yt-dlp --version

# Install Node.js 20
echo "[4/8] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node --version && npm --version

# Install PM2
echo "[5/8] Installing PM2..."
npm install -g pm2
pm2 startup systemd -u root --hp /root
systemctl enable pm2-root 2>/dev/null || true

# Create directories
echo "[6/8] Creating app directories..."
mkdir -p /var/www/fastaudio/public
mkdir -p /var/www/fastaudio/api
mkdir -p /var/www/fastaudio/downloads
mkdir -p /var/log/fastaudio
mkdir -p /var/www/certbot

# Setup Nginx (temp HTTP config for certbot)
echo "[7/8] Configuring Nginx (HTTP only first)..."
cat > /etc/nginx/sites-available/fastaudio << 'NGINX_TEMP'
server {
    listen 80;
    server_name fastaudio.cc www.fastaudio.cc;
    root /var/www/fastaudio/public;
    index index.html;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 300s;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX_TEMP

ln -sf /etc/nginx/sites-available/fastaudio /etc/nginx/sites-enabled/fastaudio
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl enable nginx && systemctl restart nginx

# Get SSL certificate
echo "[8/8] Setting up SSL certificate..."
echo ""
echo "IMPORTANT: DNS A record must point fastaudio.cc → 187.77.150.58"
echo "Check with: nslookup fastaudio.cc"
echo ""
read -p "Is DNS ready? (y/n): " dns_ready

if [ "$dns_ready" = "y" ]; then
    certbot --nginx -d fastaudio.cc -d www.fastaudio.cc \
        --non-interactive --agree-tos --email sonujee@proton.me
    systemctl enable certbot.timer && systemctl start certbot.timer
    echo "✓ SSL certificate installed"
else
    echo "Skipping SSL. Run this later:"
    echo "  certbot --nginx -d fastaudio.cc -d www.fastaudio.cc --non-interactive --agree-tos --email sonujee@proton.me"
fi

echo ""
echo "=========================================="
echo "  VPS SETUP COMPLETE!"
echo "  Now run: ./deploy.sh (from Replit)"
echo "=========================================="
