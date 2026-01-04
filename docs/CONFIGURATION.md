# Site Configuration Guide

This guide shows you how to configure the Art of Rust website without touching code.

## Quick Start

1. **Copy the example environment file:**
```bash
cp .env.example .env
```

2. **Edit `.env` with your server details:**
```bash
nano .env
```

3. **Rebuild and deploy:**
```bash
npm run build
cp -r dist/* .
```

---

## Configuration Options

### Server Information

```bash
# Your Rust server details
VITE_SERVER_NAME=Art of Rust | Main Server
VITE_SERVER_ADDRESS=188.64.33.62:28017
VITE_SERVER_IP=188.64.33.62
VITE_SERVER_PORT=28017
VITE_SERVER_MAX_PLAYERS=200
```

**Effect:** Updates server status dashboard, connect buttons, and player capacity.

---

### Wipe Schedule

```bash
# Next wipe configuration
VITE_NEXT_WIPE_DATE=2026-01-08T19:00:00Z
VITE_NEXT_WIPE_TYPE=full        # Options: full, map, bp
VITE_LAST_WIPE_DATE=2026-01-01T19:00:00Z
VITE_MAP_SIZE=4000
```

**Effect:**
- Sets the countdown timer on home page
- Configures wipe schedule page
- Shows correct wipe type (Full/Map/BP)

**Wipe Types:**
- `full` - Full wipe including blueprints
- `map` - Map only, blueprints preserved
- `bp` - Blueprints only (rare)

---

### Feature Toggles

```bash
# Enable/disable features
VITE_ENABLE_LEADERBOARDS=false      # Set to 'true' to show leaderboards
VITE_ENABLE_DISCORD_BOT=false       # Set to 'true' for Discord integration
VITE_ENABLE_REAL_SERVER_STATUS=false # Set to 'true' when API is ready
VITE_ENABLE_AUTH=false              # Set to 'true' for Steam login
```

**Effect:**
- `LEADERBOARDS=false` - Hides leaderboards link in navigation (default)
- `DISCORD_BOT=true` - Shows Discord server stats (requires bot setup)
- `REAL_SERVER_STATUS=true` - Uses API instead of mock data
- `AUTH=true` - Enables login functionality

---

### Links & Contact

```bash
# Social media & contact
VITE_DISCORD_INVITE=https://discord.gg/artofrust
VITE_TWITTER_URL=https://x.com/ArtofRust
VITE_YOUTUBE_URL=https://youtube.com/@ArtofRust
VITE_INSTAGRAM_URL=https://www.instagram.com/ArtofRust
VITE_DONATE_URL=https://www.paypal.com/donate/?hosted_button_id=3XT3JB75XG84W
VITE_CONTACT_EMAIL=ArtofRustMedia@gmail.com
```

**Effect:** Updates all social media icons and footer links.

---

## Common Tasks

### Update Next Wipe Date

When scheduling a new wipe:

```bash
# Edit .env
nano .env

# Change this line:
VITE_NEXT_WIPE_DATE=2026-01-15T19:00:00Z
VITE_NEXT_WIPE_TYPE=map

# Rebuild
npm run build
cp -r dist/* .
```

The countdown timer will automatically update!

---

### Enable Leaderboards

When you have real player data:

```bash
# Edit .env
nano .env

# Change this line:
VITE_ENABLE_LEADERBOARDS=true

# Rebuild
npm run build
cp -r dist/* .
```

Leaderboards will appear in the navigation menu.

---

### Change Server IP/Port

If your server IP changes:

```bash
# Edit .env
nano .env

# Update these lines:
VITE_SERVER_IP=new.ip.address.here
VITE_SERVER_PORT=28015

# Rebuild
npm run build
cp -r dist/* .
```

Connect buttons will use the new IP automatically.

---

## Production Checklist

Before going live, ensure:

- [ ] `.env` file exists with your values
- [ ] Server IP and port are correct
- [ ] Wipe dates are accurate
- [ ] Discord invite link works
- [ ] Donation link is correct
- [ ] Features you don't need are disabled
- [ ] Rebuilt: `npm run build`
- [ ] Deployed: `cp -r dist/* .`
- [ ] Browser cache cleared (Ctrl+Shift+R)

---

## Troubleshooting

**Q: Changes not showing after rebuild?**
A: Clear browser cache with Ctrl+Shift+R or Cmd+Shift+R (Mac)

**Q: Leaderboards showing when they shouldn't?**
A: Set `VITE_ENABLE_LEADERBOARDS=false` in `.env` and rebuild

**Q: Wrong server IP in connect button?**
A: Check `VITE_SERVER_IP` and `VITE_SERVER_PORT` in `.env`

**Q: Wipe countdown showing wrong date?**
A: Update `VITE_NEXT_WIPE_DATE` in `.env` (format: YYYY-MM-DDTHH:MM:SSZ)

---

## Getting Real Data

Currently the site shows mock/demo data. To display real information:

### Option 1: Manual Updates
Update `.env` values manually after each wipe/change

### Option 2: Backend API (Recommended)
See `docs/API_INTEGRATION.md` for full backend setup guide

**Quick backend options:**
- Rust+ API (free, official)
- Battlemetrics API (player tracking)
- Custom Node.js/Python backend

---

## Need Help?

- Check `docs/API_INTEGRATION.md` for backend setup
- Check `docs/DEPLOYMENT.md` for deployment issues
- GitHub Issues: https://github.com/rifle-ak/AoR-Website-Project/issues
