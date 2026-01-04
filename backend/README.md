# Art of Rust Backend API

Real-time Rust server statistics API with player leaderboards and wipe schedule management.

## Features

- ✅ **Real-time Server Status** - Rust+ API integration or manual updates
- ✅ **Player Leaderboards** - Kills, K/D, Playtime, Headshots
- ✅ **Wipe Schedule Management** - Track and manage wipe schedules
- ✅ **Historical Data** - Server statistics over time
- ✅ **SQLite Database** - Lightweight, zero-config database
- ✅ **Scheduled Tasks** - Automatic stats recording
- ✅ **Docker Support** - Easy deployment

## Quick Start

### Option 1: Docker (Recommended)

```bash
cd backend
cp .env.example .env
# Edit .env with your settings
docker-compose up -d
```

### Option 2: Node.js

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

## Configuration

Create `.env` file:

```bash
# Required
RUST_SERVER_IP=188.64.33.62
RUST_SERVER_PORT=28017

# Optional - Rust+ Integration
ENABLE_RUST_PLUS=true
RUST_PLUS_PORT=28082
RUST_PLAYER_TOKEN=your_token_here

# Optional - Battlemetrics
ENABLE_BATTLEMETRICS=false
BATTLEMETRICS_API_KEY=your_key_here
```

### Getting Rust+ Token

1. Enable Rust+ on your server
2. Pair with your server in the Rust+ mobile app
3. Extract token from app data (see [rustplus.js docs](https://github.com/liamcottle/rustplus.js))

## API Endpoints

### Server Status

```bash
GET /api/server/status
```

Response:
```json
{
  "name": "Art of Rust | Main Server",
  "players": 150,
  "maxPlayers": 200,
  "queue": 5,
  "map": "Procedural Map",
  "mapSize": 4000,
  "fps": 58,
  "online": true
}
```

### Leaderboards

```bash
GET /api/leaderboards?category=kills&limit=100
```

Categories: `kills`, `kd`, `playtime`, `headshots`

### Wipe Schedule

```bash
GET /api/wipes/schedule
```

Response:
```json
{
  "next": {
    "type": "full",
    "date": "2026-02-05T19:00:00Z"
  },
  "upcoming": [...],
  "history": [...]
}
```

### Create Wipe (Admin)

```bash
POST /api/wipes
Content-Type: application/json

{
  "type": "full",
  "date": "2026-02-05T19:00:00Z",
  "map_size": 4500,
  "notes": "Monthly force wipe"
}
```

## Data Sources

### Rust+ API (Recommended)

- Real-time server data
- Official Facepunch API
- Requires Rust+ enabled on server
- **Pros**: Free, accurate, real-time
- **Cons**: Requires mobile app pairing

### Battlemetrics API

- Player tracking
- Historical data
- Ban lists
- **Pros**: Rich data, no server config needed
- **Cons**: Rate limits on free tier

### Manual Updates

If no API is configured, the backend serves static data that can be updated via:

```bash
# Update current player count
POST /api/server/status
{
  "players": 20,
  "queue": 0
}
```

## Database Schema

### Players Table
- `steam_id` - Primary key
- `name` - Player name
- `kills`, `deaths`, `headshots` - Stats
- `playtime` - Hours played
- `longest_kill` - Meters

### Wipes Table
- `type` - full, map, or bp
- `date` - Scheduled wipe time
- `completed` - Boolean flag

### Server Stats Table
- `timestamp` - Record time
- `players`, `queue`, `fps` - Metrics
- Auto-recorded every 5 minutes
- Auto-cleanup after 30 days

## Importing Player Data

### From Oxide/uMod logs

```bash
# Parse logs and import
npm run import:players -- ./path/to/logs
```

### From CSV

```sql
-- Import via SQL
.mode csv
.import players.csv players
```

## Production Deployment

### With Docker

```bash
docker-compose up -d
```

### With systemd

```ini
[Unit]
Description=AoR Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/aor-backend
ExecStart=/usr/bin/node dist/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

### Behind Nginx

```nginx
location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Monitoring

Health check:
```bash
curl http://localhost:3001/api/health
```

View logs:
```bash
# Docker
docker-compose logs -f

# systemd
journalctl -u aor-backend -f
```

## Troubleshooting

**Rust+ won't connect:**
- Verify Rust+ is enabled on server
- Check firewall allows port 28082
- Confirm player token is correct

**No player data:**
- Import existing data from logs
- Or wait for players to join and be recorded

**Database locked:**
- SQLite WAL mode enabled by default
- Shouldn't happen, but restart server if it does

## Development

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run test       # Run tests
npm run lint       # Lint code
```

## License

MIT
