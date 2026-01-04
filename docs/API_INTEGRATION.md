# Backend API Integration Guide

This document outlines the API endpoints needed to replace mock data with real server information.

## API Endpoints

### Server Status

**Endpoint:** `GET /api/server/status`

**Response:**
```json
{
  "name": "Art of Rust | Main Server",
  "players": 150,
  "maxPlayers": 200,
  "queue": 5,
  "map": "Procedural Map",
  "mapSeed": "12345678",
  "mapSize": 4000,
  "fps": 58,
  "uptime": "5d 12h 34m",
  "lastWipe": "2026-01-01T19:00:00Z",
  "nextWipe": "2026-01-08T19:00:00Z",
  "online": true,
  "ip": "188.64.33.62",
  "port": 28017
}
```

**Used in:** `src/components/ServerStatus.tsx`

**Update frequency:** Every 30 seconds

---

### Player Leaderboards

**Endpoint:** `GET /api/leaderboards?category={category}&limit={limit}`

**Parameters:**
- `category`: `kills`, `kd`, `playtime`, `headshots`
- `limit`: Number of results (default: 100)

**Response:**
```json
{
  "category": "kills",
  "updated": "2026-01-04T12:00:00Z",
  "players": [
    {
      "steamId": "76561198123456789",
      "name": "PlayerName",
      "rank": 1,
      "kills": 1234,
      "deaths": 567,
      "kd": 2.18,
      "playtime": 456,
      "headshots": 234,
      "longestKill": 350
    }
  ]
}
```

**Used in:** `src/pages/Leaderboards.tsx`

**Update frequency:** Every 5 minutes

---

### Wipe Schedule

**Endpoint:** `GET /api/wipes/schedule`

**Response:**
```json
{
  "next": {
    "id": "wipe-123",
    "type": "full",
    "date": "2026-01-08T19:00:00Z",
    "mapSize": 4000,
    "notes": "Monthly force wipe"
  },
  "upcoming": [
    {
      "id": "wipe-124",
      "type": "map",
      "date": "2026-01-15T19:00:00Z",
      "mapSize": 4000,
      "notes": "Weekly map wipe"
    }
  ],
  "history": [
    {
      "id": "wipe-122",
      "type": "full",
      "date": "2026-01-01T19:00:00Z",
      "completed": true,
      "mapSeed": "12345678",
      "mapSize": 4000
    }
  ]
}
```

**Used in:** `src/pages/WipeSchedule.tsx`

**Update frequency:** Once per day

---

## Data Source Options

### Option 1: Rust+ API (Official)
- **Documentation:** https://companion-rust.facepunch.com/doc/
- **Provides:** Real-time server info, player data, team info
- **Requirements:** Server needs Rust+ enabled
- **Pros:** Official, reliable, free
- **Cons:** Limited historical data

### Option 2: Battlemetrics API
- **Documentation:** https://www.battlemetrics.com/developers
- **Provides:** Server stats, player tracking, ban lists
- **Requirements:** Battlemetrics account
- **Pros:** Rich historical data, advanced player tracking
- **Cons:** Rate limits on free tier

### Option 3: Custom Backend (Recommended)
Create a Node.js/Python backend that:
1. Polls Rust+ API every 30s for real-time data
2. Stores player stats in database (PostgreSQL/MongoDB)
3. Calculates leaderboards daily
4. Manages wipe schedule via admin interface

**Example Stack:**
- **Backend:** Node.js + Express or Python + FastAPI
- **Database:** PostgreSQL with TimescaleDB for time-series data
- **Cache:** Redis for real-time data
- **Hosting:** Any VPS with Docker support

---

## Environment Variables

Update `.env` file with your API endpoint:

```bash
# API Configuration
VITE_API_URL=https://api.artofrust.art
VITE_API_TIMEOUT=10000

# Feature Flags - Enable when backend is ready
VITE_ENABLE_REAL_SERVER_STATUS=true
VITE_ENABLE_DISCORD_BOT=true
```

---

## Integration Steps

### 1. Set up Backend Server
```bash
# Example with Node.js
npm init -y
npm install express cors dotenv
```

### 2. Create API Service Layer
Update `src/services/api.ts` (to be created) to replace mock data:

```typescript
const API_URL = import.meta.env.VITE_API_URL

export async function getServerStatus() {
  const response = await fetch(`${API_URL}/server/status`)
  return response.json()
}

export async function getLeaderboards(category: string) {
  const response = await fetch(`${API_URL}/leaderboards?category=${category}`)
  return response.json()
}
```

### 3. Update Components
Replace mock data in components with API calls:

```typescript
// Before
const [players, setPlayers] = useState(mockData)

// After
useEffect(() => {
  async function fetchData() {
    const data = await getLeaderboards('kills')
    setPlayers(data.players)
  }
  fetchData()
}, [])
```

---

## Discord Bot Integration

When `VITE_ENABLE_DISCORD_BOT=true`, the site can:
- Display Discord server stats in real-time
- Show online members count
- Link Discord roles to website features

**Required Discord Bot Permissions:**
- Read Messages
- Send Messages
- Manage Roles (if implementing role sync)

**Discord API Endpoints:**
- Guild Info: `GET https://discord.com/api/guilds/{guild_id}`
- Member Count: `GET https://discord.com/api/guilds/{guild_id}/preview`

---

## Security Considerations

1. **CORS:** Configure backend to only allow requests from artofrust.art
2. **Rate Limiting:** Implement rate limits on all endpoints
3. **API Keys:** Use API keys for authenticated requests
4. **Data Validation:** Validate all input data server-side
5. **HTTPS Only:** Enforce HTTPS for all API calls

---

## Testing

Mock API server for local development:

```bash
# Install json-server
npm install -g json-server

# Create mock data file
echo '{"status": {...}, "leaderboards": {...}}' > db.json

# Run mock server
json-server --watch db.json --port 3001
```

Then update `.env`:
```
VITE_API_URL=http://localhost:3001
```

---

## Need Help?

Common integration scenarios:

1. **Using Rust+ directly from frontend?**
   ❌ Not recommended - requires WebSocket, no CORS support

2. **Existing server management panel?**
   ✅ Most panels (Pterodactyl, TCAdmin) have APIs you can use

3. **Want automated wipe detection?**
   ✅ Monitor server files or use Battlemetrics webhooks

4. **Need player authentication?**
   ✅ Implement Steam OpenID login (guide in STEAM_AUTH.md)
