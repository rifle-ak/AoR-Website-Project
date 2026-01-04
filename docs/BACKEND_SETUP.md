# Backend Setup Guide

Complete guide to deploying the Art of Rust backend API for real server data.

## Overview

The backend provides:
- ✅ Real-time server status (via Rust+ API)
- ✅ Player statistics and leaderboards
- ✅ Wipe schedule management
- ✅ Historical server data
- ✅ RESTful API endpoints

## Quick Start

### 1. Deploy Backend (Docker - Recommended)

```bash
cd backend

# Create .env file
cp .env.example .env

# Edit with your server details
nano .env

# Start with Docker
docker-compose up -d
```

### 2. Configure Frontend

Update your website's `.env`:

```bash
# Enable backend API
VITE_ENABLE_REAL_SERVER_STATUS=true
VITE_API_URL=http://localhost:3001/api

# Optional: Enable leaderboards if you have player data
VITE_ENABLE_LEADERBOARDS=true
```

### 3. Rebuild & Deploy

```bash
npm run build
cp -r dist/* /your/web/root/
```

Done! Your site now shows real server data.

---

## Backend Configuration

### Required Settings

```bash
# Backend .env
RUST_SERVER_IP=188.64.33.62
RUST_SERVER_PORT=28017
```

### Optional: Rust+ Integration (for real-time data)

```bash
ENABLE_RUST_PLUS=true
RUST_PLUS_PORT=28082
RUST_PLAYER_TOKEN=your_token_here
```

**Getting Rust+ Token:**
1. Enable Rust+ on your server (`app.port 28082`)
2. Pair your server in the Rust+ mobile app
3. Extract token using [rustplus.js documentation](https://github.com/liamcottle/rustplus.js#pairing)

### Optional: Battlemetrics Integration

```bash
ENABLE_BATTLEMETRICS=true
BATTLEMETRICS_API_KEY=your_api_key
```

Get API key from [Battlemetrics](https://www.battlemetrics.com/developers)

---

## Deployment Options

### Option 1: Docker (Easiest)

```bash
cd backend
docker-compose up -d
```

Pros:
- No dependencies to install
- Automatic restarts
- Isolated environment

### Option 2: Node.js Direct

```bash
cd backend
npm install
npm run build
npm start
```

Pros:
- Direct control
- Easier debugging

### Option 3: systemd Service

```bash
# Install
cd backend
npm install
npm run build

# Create service
sudo nano /etc/systemd/system/aor-backend.service
```

```ini
[Unit]
Description=Art of Rust Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/aor-backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl enable aor-backend
sudo systemctl start aor-backend
sudo systemctl status aor-backend
```

---

## Production Setup

### Behind Nginx (Recommended)

```nginx
# /etc/nginx/sites-available/artofrust.art

server {
    listen 80;
    server_name artofrust.art;

    # Frontend
    root /var/www/artofrust.art;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then update frontend `.env`:
```bash
VITE_API_URL=https://artofrust.art/api
```

### SSL with Let's Encrypt

```bash
sudo certbot --nginx -d artofrust.art
```

---

## Data Management

### Adding Player Stats

#### From Oxide/uMod Logs

```bash
# Export from your server
# Then import to database
sqlite3 backend/data/aor.db

# Import CSV
.mode csv
.import players.csv players
```

#### Manual Entry

```sql
INSERT INTO players (steam_id, name, kills, deaths, headshots, playtime)
VALUES ('76561198123456789', 'PlayerName', 100, 50, 25, 48);
```

### Managing Wipe Schedule

```bash
# Add upcoming wipe via API
curl -X POST http://localhost:3001/api/wipes \
  -H "Content-Type: application/json" \
  -d '{
    "type": "full",
    "date": "2026-02-05T19:00:00Z",
    "map_size": 4500,
    "notes": "Monthly force wipe"
  }'
```

Or directly in database:
```sql
INSERT INTO wipes (type, date, map_size, notes)
VALUES ('full', '2026-02-05 19:00:00', 4500, 'Monthly force wipe');
```

---

## Monitoring

### Health Check

```bash
curl http://localhost:3001/api/health
```

### View Logs

Docker:
```bash
docker-compose logs -f
```

systemd:
```bash
journalctl -u aor-backend -f
```

Direct:
```bash
npm run dev  # Shows logs in console
```

### Database Inspection

```bash
sqlite3 backend/data/aor.db

# View tables
.tables

# Check player count
SELECT COUNT(*) FROM players;

# View recent stats
SELECT * FROM server_stats ORDER BY timestamp DESC LIMIT 10;
```

---

## Troubleshooting

### Backend won't start

**Check logs:**
```bash
docker-compose logs
# or
journalctl -u aor-backend
```

**Common issues:**
- Port 3001 already in use: Change `PORT` in .env
- Missing .env file: Copy from .env.example
- Database locked: Stop duplicate instances

### Rust+ won't connect

**Verify:**
1. Rust+ enabled on server: `app.port 28082` in server.cfg
2. Firewall allows port 28082
3. Token is correct (regenerate if needed)

**Test connection:**
```bash
# In backend directory
npm run dev

# Look for "✅ Connected to Rust+ API"
```

### No player data

**Options:**
1. Import existing logs (see "Adding Player Stats" above)
2. Wait for players to join and be recorded automatically
3. Add sample data for testing:
```sql
-- Sample players for testing
INSERT INTO players VALUES
  ('1', 'TestPlayer1', 150, 75, 45, 100, 250, datetime('now'), datetime('now')),
  ('2', 'TestPlayer2', 200, 100, 60, 150, 300, datetime('now'), datetime('now'));
```

### Frontend shows "Failed to fetch"

**Check:**
1. Backend is running: `curl http://localhost:3001/api/health`
2. CORS is configured: Add your domain to `CORS_ORIGIN` in backend .env
3. API URL is correct in frontend .env: `VITE_API_URL=http://localhost:3001/api`
4. Frontend was rebuilt after env changes: `npm run build`

---

## Performance Tips

### Database Optimization

```sql
-- Run periodically
VACUUM;
ANALYZE;

-- Index optimization (already created in schema)
CREATE INDEX IF NOT EXISTS idx_players_kills ON players(kills DESC);
```

### Caching

Backend caches Rust+ data for 30 seconds automatically.

For high traffic, add Redis:
```bash
# docker-compose.yml
services:
  redis:
    image: redis:alpine
    restart: unless-stopped
```

### Rate Limiting

Add rate limiting for public APIs:
```bash
npm install express-rate-limit
```

---

## Backup

### Automated Backup

```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
sqlite3 /path/to/backend/data/aor.db ".backup /backups/aor_$DATE.db"
find /backups -name "aor_*.db" -mtime +30 -delete
```

Add to crontab:
```bash
0 2 * * * /path/to/backup-script.sh
```

### Restore

```bash
cp /backups/aor_20260104_020000.db backend/data/aor.db
```

---

## Next Steps

1. ✅ Backend running
2. ✅ Frontend configured
3. 📊 Add player statistics (optional)
4. 🔄 Set up automated backups
5. 📈 Monitor performance
6. 🎮 Enjoy real server data!

For issues, check:
- Backend logs
- Frontend browser console
- `docs/API_INTEGRATION.md` for detailed API specs
