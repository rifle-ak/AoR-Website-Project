# Art of Rust - cPanel Deployment Guide

This guide explains how to deploy the Art of Rust website to a cPanel hosting environment.

## Overview

The website consists of:
- **Frontend**: React SPA (built static files)
- **Backend**: PHP API (runs natively on cPanel)
- **Database**: MySQL

Everything runs on standard cPanel hosting - no Node.js required!

## Prerequisites

- cPanel hosting account
- PHP 7.4+ (PHP 8.0+ recommended)
- MySQL 5.7+ or MariaDB 10.2+
- FTP access or cPanel File Manager
- Node.js 18+ on your LOCAL machine (for building only)

## IMPORTANT: Build Locally, Upload Files

> **DO NOT** clone this repository directly into `public_html`!
>
> The repo contains source files that need to be compiled. You must:
> 1. Build on your local machine
> 2. Upload only the compiled files to your server

## Step 1: Build the Frontend (On Your Local Machine)

```bash
# Clone the repo locally (NOT on the server)
git clone <repository-url>
cd AoR-Website-Project

# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist` folder with the compiled frontend.

### Quick Package Option

Or use the deploy script to create a ready-to-upload zip:

```bash
./deploy.sh
```

This creates `artofrust-deploy-YYYYMMDD-HHMMSS.zip` containing everything you need.

## Step 2: Create MySQL Database

1. Log into cPanel
2. Go to **MySQL Databases**
3. Create a new database (e.g., `yourusername_artofrust`)
4. Create a new user (e.g., `yourusername_aoruser`)
5. Add the user to the database with **ALL PRIVILEGES**
6. Note down:
   - Database name
   - Database user
   - Database password

## Step 3: Import Database Schema

1. Go to **phpMyAdmin** in cPanel
2. Select your new database
3. Click **Import**
4. Upload `api/schema.sql`
5. Click **Go** to import

## Step 4: Upload Files

Upload the following to your `public_html` folder:

```
public_html/
├── api/                    # Upload entire api folder
│   ├── config.php
│   ├── index.php
│   ├── schema.sql
│   ├── .htaccess
│   ├── includes/
│   └── routes/
├── assets/                 # From dist folder
├── index.html              # From dist folder
├── .htaccess               # From public folder (important!)
└── (other files from dist)
```

### Upload Methods:

**Option A: FTP**
1. Connect via FTP (FileZilla, etc.)
2. Upload `dist/*` contents to `public_html/`
3. Upload `api/` folder to `public_html/api/`
4. Upload `public/.htaccess` to `public_html/.htaccess`

**Option B: cPanel File Manager**
1. Zip the files locally
2. Upload via File Manager
3. Extract in `public_html`

## Step 5: Configure the API

Edit `public_html/api/config.php`:

```php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'yourusername_artofrust');  // Your database name
define('DB_USER', 'yourusername_aoruser');    // Your database user
define('DB_PASS', 'your_secure_password');    // Your database password

// Site Configuration
define('SITE_URL', 'https://artofrust.art');  // Your domain (no trailing slash)

// Rust Server Configuration
define('RUST_SERVER_IP', '188.64.33.62');     // Your Rust server IP
define('RUST_SERVER_PORT', 28017);             // Your Rust server port

// Steam API Key (get from https://steamcommunity.com/dev/apikey)
define('STEAM_API_KEY', 'your_steam_api_key_here');

// JWT Secret (generate a random 64-character string)
// Run: php -r "echo bin2hex(random_bytes(32));"
define('JWT_SECRET', 'your_random_64_char_string_here');

// Admin Steam IDs (your Steam ID for auto-admin)
define('ADMIN_STEAM_IDS', [
    '76561198000000000', // Replace with your Steam ID
]);
```

## Step 6: Set File Permissions

Via cPanel File Manager or FTP:

```
api/               755
api/config.php     644
api/index.php      644
api/.htaccess      644
api/includes/      755
api/routes/        755
.htaccess          644
index.html         644
assets/            755
```

## Step 7: Verify Installation

1. Visit your domain - you should see the React app
2. Visit `https://yourdomain.com/api/health` - should return JSON:
   ```json
   {"status":"ok","timestamp":"2024-01-01T00:00:00+00:00","version":"1.0.0"}
   ```
3. Try logging in with Steam

## Troubleshooting

### "500 Internal Server Error"

1. Check cPanel Error Logs (Metrics > Errors)
2. Verify PHP version (PHP 7.4+)
3. Check file permissions
4. Enable error display temporarily in `api/config.php`:
   ```php
   ini_set('display_errors', '1');
   ```

### Blank white page

1. Check browser console (F12) for JavaScript errors
2. Verify `index.html` exists in `public_html` root (not in a subfolder)
3. Verify `assets/` folder with `.js` and `.css` files exists
4. Check that you uploaded from `dist/` folder, not the source repo

### "Request exceeded the limit of 10 internal redirects"

This is an infinite redirect loop. Causes:
1. **Wrong file structure**: You may have cloned the repo into `public_html` instead of uploading built files
2. **Missing index.html**: The `.htaccess` can't find `index.html` to serve

**Fix:**
1. Delete everything in `public_html`
2. Upload ONLY: `dist/*` contents, `api/` folder, and `public/.htaccess`
3. Verify `index.html` is at `public_html/index.html` (not in a subfolder)

### "404 Not Found" on page refresh

The `.htaccess` isn't working. Check:
1. `.htaccess` is uploaded to `public_html` root
2. `mod_rewrite` is enabled (contact host)
3. The `.htaccess` file wasn't renamed (some FTP clients hide dotfiles)

### "Database connection failed"

1. Verify database credentials in `config.php`
2. Ensure database user has proper permissions
3. Check if `localhost` should be `127.0.0.1`

### Steam login not working

1. Verify `STEAM_API_KEY` is correct
2. Ensure `SITE_URL` matches your actual domain
3. Check if your host allows outbound connections

### Server status showing offline

1. Your host may block outbound UDP (required for Steam Query)
2. Try using a different port
3. Contact host about firewall rules

## Getting Your Steam API Key

1. Go to https://steamcommunity.com/dev/apikey
2. Log in with your Steam account
3. Enter your domain name
4. Copy the API key to `config.php`

## Getting Your Steam ID

1. Go to https://steamid.io/
2. Enter your Steam profile URL
3. Copy the "steamID64" value
4. Add it to `ADMIN_STEAM_IDS` in `config.php`

## Updating the Site

1. Make changes locally
2. Run `npm run build`
3. Upload new `dist/*` files to `public_html`
4. Upload any changed `api/` files

## Security Checklist

- [ ] Changed `JWT_SECRET` to a random string
- [ ] Set proper database credentials
- [ ] Added your Steam ID to `ADMIN_STEAM_IDS`
- [ ] Disabled `display_errors` in production
- [ ] Enabled HTTPS (SSL certificate)
- [ ] Verified `.htaccess` files are working

## File Structure After Deployment

```
public_html/
├── api/
│   ├── config.php          # Configuration (edit this!)
│   ├── index.php           # API router
│   ├── schema.sql          # Database schema
│   ├── .htaccess           # API routing rules
│   ├── includes/
│   │   ├── Database.php
│   │   ├── JWT.php
│   │   ├── Response.php
│   │   ├── SteamAuth.php
│   │   └── SteamQuery.php
│   └── routes/
│       ├── admin.php
│       ├── auth.php
│       ├── leaderboards.php
│       ├── news.php
│       ├── server.php
│       └── wipes.php
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
├── index.html
└── .htaccess
```

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review cPanel error logs
3. Ensure PHP and MySQL versions meet requirements
