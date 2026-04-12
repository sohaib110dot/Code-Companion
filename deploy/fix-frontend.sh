#!/bin/bash
set -e

echo "=== FastAudio Frontend Fix ==="

# Step 1: Check frontend files
echo "[1/4] Checking frontend files..."
if [ ! -f /var/www/fastaudio/public/index.html ]; then
    echo "❌ Frontend files missing!"
    exit 1
fi
echo "✓ Frontend files exist: $(ls -1 /var/www/fastaudio/public/ | wc -l) files"

# Step 2: Create Nginx config without SSL (temporary)
echo "[2/4] Creating Nginx config..."
cat > /etc/nginx/sites-available/fastaudio << 'NGINX'
server {
    listen 80;
    server_name fastaudio.cc www.fastaudio.cc;

    root /var/www/fastaudio/public;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # API routes to backend
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 300s;
    }

    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Serve index.html for all routes (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/fastaudio /etc/nginx/sites-enabled/fastaudio
rm -f /etc/nginx/sites-enabled/default
echo "✓ Nginx config updated"

# Step 3: Test Nginx config
echo "[3/4] Testing Nginx config..."
nginx -t
echo "✓ Nginx config is valid"

# Step 4: Reload Nginx
echo "[4/4] Reloading Nginx..."
systemctl reload nginx
echo "✓ Nginx reloaded"

echo ""
echo "=== FIXED! ==="
echo "App should now be live at:"
echo "  http://fastaudio.cc"
echo ""
echo "Frontend: $(ls -1 /var/www/fastaudio/public/assets/ 2>/dev/null | grep -c '.*' || echo '0') asset files"
echo "Backend: $(pgrep -f 'node.*index.cjs' | wc -l) Node process running"
