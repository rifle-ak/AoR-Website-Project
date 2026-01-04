# 🎮 Art of Rust Website - Complete Deployment Guide

## 🚀 What's Been Built

### Frontend (React + TypeScript + Vite)
- ✅ Official Rust game branding (#CD412B red)
- ✅ Server status dashboard (real-time updates)
- ✅ Player leaderboards (kills, K/D, playtime, headshots)
- ✅ Wipe schedule with countdown timer
- ✅ Commands reference page
- ✅ Gallery for screenshots
- ✅ Fully responsive design
- ✅ SEO optimized

### Backend (Node.js + Express + TypeScript)
- ✅ Rust+ API integration (real-time server data)
- ✅ RESTful API endpoints
- ✅ SQLite database (player stats, wipe history)
- ✅ Scheduled tasks (auto-record stats every 5 min)
- ✅ Docker support
- ✅ Production-ready

### Configuration System
- ✅ All settings in `.env` files
- ✅ Feature flags for everything
- ✅ Manual stats when no API available
- ✅ Easy to update wipe dates

---

## 📦 Quick Deployment (Current Setup)

### 1. Deploy Current Build (No Backend)

```bash
cd /home/artofrust/public_html

# Pull latest code
git pull origin claude/review-aor-website-Hdmsd

# Your .env should have:
cat > .env << 'EOF'
VITE_SERVER_NAME=Art of Rust | Main Server
VITE_SERVER_IP=188.64.33.62
VITE_SERVER_PORT=28017
VITE_SERVER_MAX_PLAYERS=200

# Current stats (update manually as needed)
VITE_CURRENT_PLAYERS=20
VITE_CURRENT_QUEUE=0
VITE_SERVER_FPS=60
VITE_SERVER_UPTIME=5d 12h

# Wipe schedule
VITE_NEXT_WIPE_DATE=2026-02-05T19:00:00Z
VITE_NEXT_WIPE_TYPE=full
VITE_LAST_WIPE_DATE=2026-01-01T19:00:00Z
VITE_MAP_SIZE=4500

# Feature flags
VITE_ENABLE_LEADERBOARDS=false
VITE_ENABLE_REAL_SERVER_STATUS=false
VITE_ENABLE_DISCORD_BOT=false

# Links
VITE_DISCORD_INVITE=https://discord.gg/artofrust
VITE_DONATE_URL=https://www.paypal.com/donate/?hosted_button_id=3XT3JB75XG84W
VITE_CONTACT_EMAIL=owners@artofrust.art
EOF

# Build
npm run build

# Deploy
cp -r dist/* .
chown -R artofrust:artofrust assets/ index.html
```

**Result:** Static site with manually configured stats ✅

---

## 🔥 Full Setup (With Real-Time Data)

### 1. Deploy Backend

```bash
cd backend

# Configure
cp .env.example .env
nano .env
```

**Minimum configuration:**
```bash
RUST_SERVER_IP=188.64.33.62
RUST_SERVER_PORT=28017
CORS_ORIGIN=https://artofrust.art
```

**Optional - Rust+ for real-time data:**
```bash
ENABLE_RUST_PLUS=true
RUST_PLUS_PORT=28082
RUST_PLAYER_TOKEN=get_from_rust_plus_app
```

**Start backend:**
```bash
# Option A: Docker (recommended)
docker-compose up -d

# Option B: Node.js
npm install
npm run build
npm start
```

### 2. Enable Backend in Frontend

```bash
cd /home/artofrust/public_html
nano .env
```

Add/update:
```bash
VITE_ENABLE_REAL_SERVER_STATUS=true
VITE_API_URL=http://localhost:3001/api
```

### 3. Rebuild & Deploy

```bash
npm run build
cp -r dist/* .
```

**Result:** Real-time server data! 🎉

---

## 📊 Enabling Leaderboards

### Option 1: Sample Data (for testing)

```bash
cd backend
sqlite3 data/aor.db

-- Add test players
INSERT INTO players (steam_id, name, kills, deaths, headshots, playtime) VALUES
  ('1', 'TopPlayer1', 500, 200, 150, 250),
  ('2', 'TopPlayer2', 450, 180, 120, 200),
  ('3', 'TopPlayer3', 400, 190, 100, 180);
```

### Option 2: Real Data

Import from your server logs (see `docs/BACKEND_SETUP.md`)

### Enable in Frontend

```bash
# Frontend .env
VITE_ENABLE_LEADERBOARDS=true
```

Rebuild and leaderboards appear! ✅

---

## 🗓️ Updating Wipe Schedule

### Without Backend

```bash
# Frontend .env
VITE_NEXT_WIPE_DATE=2026-02-12T19:00:00Z
VITE_NEXT_WIPE_TYPE=map

# Rebuild
npm run build && cp -r dist/* .
```

### With Backend

```bash
# Add via API
curl -X POST http://localhost:3001/api/wipes \
  -H "Content-Type: application/json" \
  -d '{
    "type": "full",
    "date": "2026-02-12T19:00:00Z",
    "map_size": 4500,
    "notes": "Monthly wipe"
  }'
```

---

## 🔧 Updating Player Count (Manual)

```bash
# Frontend .env
VITE_CURRENT_PLAYERS=25

# Quick update (from server)
cd /home/artofrust/public_html
sed -i 's/VITE_CURRENT_PLAYERS=.*/VITE_CURRENT_PLAYERS=25/' .env
npm run build && cp -r dist/* .
```

**Or** set up backend for automatic updates!

---

## 📁 Project Structure

```
/home/artofrust/public_html/
├── backend/               # Backend API (NEW!)
│   ├── src/              # TypeScript source
│   ├── data/             # SQLite database
│   ├── docker-compose.yml
│   └── README.md
├── src/                  # Frontend source
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   └── hooks/           # Custom React hooks (NEW!)
├── docs/                # Documentation
│   ├── CONFIGURATION.md      # Config guide
│   ├── DEPLOYMENT.md         # Deploy guide
│   ├── BACKEND_SETUP.md      # Backend guide (NEW!)
│   └── API_INTEGRATION.md    # API specs
├── dist/                # Built frontend
├── .env                 # Frontend config
└── package.json
```

---

## 🎯 Common Tasks

### Update Server Info
```bash
nano .env  # Edit VITE_SERVER_* values
npm run build && cp -r dist/* .
```

### Update Wipe Date
```bash
nano .env  # Edit VITE_NEXT_WIPE_DATE
npm run build && cp -r dist/* .
```

### Update Player Count
```bash
nano .env  # Edit VITE_CURRENT_PLAYERS
npm run build && cp -r dist/* .
```

### Enable/Disable Features
```bash
nano .env  # Toggle VITE_ENABLE_* flags
npm run build && cp -r dist/* .
```

---

## 📚 Documentation Index

1. **`docs/CONFIGURATION.md`** - All `.env` settings explained
2. **`docs/DEPLOYMENT.md`** - Frontend deployment guide
3. **`docs/BACKEND_SETUP.md`** - Backend setup & deployment
4. **`docs/API_INTEGRATION.md`** - API endpoints reference
5. **`backend/README.md`** - Backend-specific docs

---

## 🐛 Troubleshooting

### Site shows old data
```bash
# Clear browser cache (Ctrl+Shift+R)
# Or rebuild:
rm -rf dist/ assets/
npm run build
cp -r dist/* .
```

### Backend won't start
```bash
# Check logs
docker-compose logs
# Or
journalctl -u aor-backend
```

### Leaderboards empty
```bash
# Add sample data (see "Enabling Leaderboards" above)
# Or import real data from server logs
```

### Colors still orange
```bash
# You already fixed this! Should be Rust red (#CD412B)
# If not, hard refresh: Ctrl+Shift+R
```

---

## 🎉 What You Have Now

### Current State (No Backend)
- ✅ Beautiful Rust-themed website
- ✅ Server info (manual updates)
- ✅ Wipe schedule countdown
- ✅ Commands page
- ✅ Gallery
- ⚠️ Player count needs manual updates
- ⚠️ Leaderboards disabled (no data)

### With Backend
- ✅ Everything above, PLUS:
- ✅ Real-time player count
- ✅ Automatic stats recording
- ✅ Player leaderboards
- ✅ Historical data graphs
- ✅ API for future features

---

## 🚀 Next Steps

1. **Immediate:** Deploy current build (see "Quick Deployment" above) ✅
2. **When ready:** Set up backend for real-time data
3. **Optional:** Import player statistics
4. **Optional:** Set up Rust+ integration
5. **Future:** Add Steam authentication, team features, etc.

---

## 💡 Pro Tips

1. **Automate updates:** Write a script to update `.env` and rebuild
2. **Scheduled builds:** Use cron to rebuild nightly
3. **Monitoring:** Set up uptime monitoring on the backend
4. **Backups:** Backup `backend/data/aor.db` regularly
5. **Discord bot:** Integrate with backend API for Discord notifications

---

## 📞 Support

- Documentation: `docs/` folder
- Backend API: `backend/README.md`
- Issues: Check browser console & server logs
- Questions: Review `docs/API_INTEGRATION.md`

---

## ✨ Summary

You now have a **production-ready Rust community website** with:
- Official Rust branding
- Configurable everything
- Optional real-time backend
- Complete documentation
- Easy deployment

**Just pull, configure `.env`, build, and deploy!** 🎮
