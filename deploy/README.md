# FastAudio Deployment Guide

**Domain:** fastaudio.cc  
**VPS IP:** 187.77.159.58

---

## STEP 1: Hostinger DNS Setup (Pehle ye karo)

1. Hostinger hPanel → **Domains** → **fastaudio.cc** → **Manage**
2. Left sidebar mein **DNS / Nameservers** click karo
3. **DNS Records** section mein **Add Record** karo:

| Type | Name (Host) | Value (Points to) | TTL |
|------|-------------|-------------------|-----|
| **A** | **@** | **187.77.159.58** | 3600 |
| **A** | **www** | **187.77.159.58** | 3600 |

4. Save karo aur **10-15 minute wait karo**

DNS check karo (kisi bhi computer se):
```bash
nslookup fastaudio.cc
# Result mein 187.77.159.58 aana chahiye
```

---

## STEP 2: VPS Setup (Ek baar karna hai)

SSH se VPS login karo:
```bash
ssh root@187.77.159.58
```

Setup script copy karke run karo:
```bash
# Replit se copy karo deploy/setup-vps.sh ka poora content
# VPS mein paste karo:
nano setup.sh
# Content paste karo, Ctrl+X, Y, Enter

chmod +x setup.sh
./setup.sh
```

---

## STEP 3: App Deploy karo (Replit se)

Replit terminal mein run karo:
```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

Ye automatically karega:
- Frontend build (React)
- Backend build (Express)
- VPS par upload (rsync)
- App start (PM2)
- Nginx reload

---

## STEP 4: Test karo

Browser mein open karo:
- http://fastaudio.cc → https par redirect hona chahiye
- https://fastaudio.cc → App kaam karna chahiye
- https://www.fastaudio.cc → Same app

---

## VPS Management Commands

```bash
# SSH se connect
ssh root@187.77.159.58

# App status
pm2 status

# App logs live
pm2 logs fastaudio-api

# App restart
pm2 restart fastaudio-api

# Nginx restart
systemctl restart nginx

# SSL certificate renew
certbot renew --dry-run

# Disk space check
df -h
```

---

## Architecture

```
User Browser
    ↓ HTTPS (port 443)
Nginx (SSL termination)
    ├── Static files → /var/www/fastaudio/public/
    └── /api/* → Express (port 3000)
                    ↓
            YouTube API + ffmpeg
```

---

## File Locations on VPS

| File | Location |
|------|----------|
| Frontend (HTML/CSS/JS) | `/var/www/fastaudio/public/` |
| Backend (Node.js) | `/var/www/fastaudio/api/index.cjs` |
| Downloaded audio files | `/var/www/fastaudio/downloads/` |
| Nginx config | `/etc/nginx/sites-available/fastaudio` |
| PM2 config | `/var/www/fastaudio/ecosystem.config.cjs` |
| App logs | `/var/log/fastaudio/` |
| SSL certs | `/etc/letsencrypt/live/fastaudio.cc/` |
