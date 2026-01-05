# Quick Start Guide - Art of Rust Website

Get your server website up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Steam API Key (get one at https://steamcommunity.com/dev/apikey)

## Step 1: Backend Setup (5 minutes)

### 1.1 Run the setup script

```bash
cd backend
./setup.sh
```

This will:
- Install all dependencies
- Create your `.env` file
- Generate secure session secrets
- Build the backend

### 1.2 Add your Steam API Key

1. Go to https://steamcommunity.com/dev/apikey
2. Register your domain (use `localhost` for local development)
3. Copy your API key
4. Open `backend/.env` and add your key:

```bash
STEAM_API_KEY=YOUR_ACTUAL_STEAM_API_KEY_HERE
```

### 1.3 Start the backend

```bash
npm start
```

You should see:
```
🚀 Art of Rust Backend API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server: http://localhost:3001
🔧 Environment: development
🎮 Rust+: ❌ Disabled
📊 Battlemetrics: ❌ Disabled
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Keep this terminal running!**

## Step 2: Frontend Setup (2 minutes)

Open a **new terminal** window:

### 2.1 Install dependencies

```bash
cd /home/user/AoR-Website-Project
npm install
```

### 2.2 Configure the frontend

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work for local development):

```bash
VITE_API_URL=http://localhost:3001/api
VITE_SERVER_NAME=Art of Rust | Main Server
VITE_DISCORD_INVITE=https://discord.gg/artofrust
```

### 2.3 Start the development server

```bash
npm run dev
```

Open http://localhost:5173 in your browser!

## Step 3: Test Steam Login

1. Click **"Login with Steam"** in the top right
2. You'll be redirected to Steam
3. Authorize the application
4. You'll be redirected back with your profile!

## Step 4: Grant Admin Access

After your first login, make yourself an admin:

```bash
# Get your Steam ID from the URL when you view your Steam profile
# It looks like: 76561198XXXXXXXXX

# Open the database
sqlite3 backend/data/aor.db

# Run this query (replace with your Steam ID)
UPDATE users SET is_admin = 1 WHERE steam_id = 'YOUR_STEAM_ID';

# Exit
.quit
```

Refresh the page and you'll see **"Admin Panel"** in your user dropdown!

## Step 5: Create Your First News Post

1. Click your profile picture → **Admin Panel**
2. Click **"Manage News"**
3. Click **"Create Post"**
4. Fill in the form and check **"Publish immediately"**
5. Click **"Create Post"**

Your first announcement is live! 🎉

## Troubleshooting

### "Login with Steam" doesn't work

**Check:**
1. Is the backend running? You should see it at http://localhost:3001/api/health
2. Did you add your Steam API key to `backend/.env`?
3. Check the browser console (F12) for error messages

### Backend won't start

**Check:**
1. Is port 3001 already in use? Try `lsof -i :3001` (macOS/Linux) or `netstat -ano | findstr :3001` (Windows)
2. Did you run `npm install` in the backend directory?
3. Check for errors in the terminal output

### Frontend shows "Cannot connect to server"

**Check:**
1. Is VITE_API_URL in `.env` correct? (should be `http://localhost:3001/api`)
2. Is the backend running on port 3001?
3. Check browser console for CORS errors

## Production Deployment

### Backend

1. Update `backend/.env`:
```bash
NODE_ENV=production
CALLBACK_URL=https://yourdomain.com/api/auth/steam/callback
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
```

2. Build and start:
```bash
npm run build
npm start
```

### Frontend

1. Update `.env`:
```bash
VITE_API_URL=https://yourdomain.com/api
```

2. Build:
```bash
npm run build
```

3. Deploy the `dist/` folder to your web server

## Next Steps

- **Configure Server Info**: Edit `.env` to set server rates, wipe schedule, etc.
- **Add Server Rules**: Customize `src/pages/Rules.tsx` with your server rules
- **Upload Gallery Images**: Add screenshots to the gallery
- **Customize Branding**: Update colors, logos, and text throughout the site
- **Connect Rust+ API**: Enable real-time server data (optional)
- **Set Up Discord Bot**: Automate announcements and stats (optional)

## Need Help?

- **Documentation**: See `/docs` folder for detailed guides
- **Issues**: Report bugs at https://github.com/anthropics/claude-code/issues
- **Discord**: Join the Art of Rust community for support

Happy gaming! 🎮
