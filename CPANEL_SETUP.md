# Art of Rust - cPanel Deployment Guide

How to deploy the Art of Rust website to a cPanel hosting account.

## Overview

The whole site is PHP, so it runs directly on standard cPanel hosting:

- **Pages**: server-rendered PHP
- **API**: PHP under `/api`
- **Database**: MySQL

**Nothing needs to be compiled.** There is no `npm install`, no build step and
no Node.js requirement anywhere - on the server or on your machine. You can
clone this repository straight into `public_html` and it works.

## Prerequisites

- cPanel hosting account
- PHP 7.4 or newer (8.0+ recommended)
- MySQL 5.7+ or MariaDB 10.2+
- The `pdo_mysql` PHP extension (enabled by default on virtually all hosts)
- SSH, FTP or cPanel File Manager access

## Step 1: Get the files onto the server

### Option A - Clone with git (easiest to update)

If your host offers SSH or cPanel's Git Version Control:

```bash
cd ~/public_html
git clone <repository-url> .
```

Updating later is then just `git pull`.

### Option B - Upload a zip

On your own machine:

```bash
./deploy.sh
```

That produces `artofrust-deploy-YYYYMMDD-HHMMSS.zip`. Upload it to
`public_html` via cPanel File Manager and extract it there.

Either way, `public_html` should end up looking like this:

```
public_html/
├── index.php          # Front controller
├── .htaccess          # Routing and security headers
├── app/               # Application source (not web-accessible)
├── api/               # JSON API
├── assets/            # CSS, JavaScript, images
└── README.md
```

## Step 2: Create the database

1. In cPanel, open **MySQL Databases**
2. Create a database, e.g. `yourusername_artofrust`
3. Create a user, e.g. `yourusername_aoruser`, with a strong password
4. Add the user to the database with **ALL PRIVILEGES**
5. Note the database name, user and password - you need them in step 4

## Step 3: Import the schema

1. Open **phpMyAdmin** in cPanel
2. Select your new database
3. Click **Import**, choose `api/schema.sql`, then **Go**

That creates the `users`, `players`, `wipes`, `news` and `server_stats` tables,
plus two sample wipe entries you can delete from the admin panel later.

## Step 4: Configure the site

Create **`public_html/api/config.local.php`**. This file overrides the defaults
in `api/config.php`, is ignored by git, and survives a `git pull` - so your
credentials never end up in the repository:

```php
<?php
// Database
define('DB_NAME', 'yourusername_artofrust');
define('DB_USER', 'yourusername_aoruser');
define('DB_PASS', 'your_database_password');

// Your domain, no trailing slash
define('SITE_URL', 'https://artofrust.art');

// Rust server
define('RUST_SERVER_IP', '188.64.33.62');
define('RUST_SERVER_PORT', 28017);

// Steam API key from https://steamcommunity.com/dev/apikey
define('STEAM_API_KEY', 'your_steam_api_key_here');

// Random 64-character string - generate with:
//   php -r "echo bin2hex(random_bytes(32));"
define('JWT_SECRET', 'your_random_64_char_string_here');

// Your Steam ID, so your account becomes an admin on first sign-in
define('ADMIN_STEAM_IDS', [
    '76561198000000000',
]);
```

Look through `api/config.php` for everything else you can override: Discord
invite, social links, donation URL, contact email, map size, fallback wipe
dates and the feature flags.

## Step 5: Check file permissions

Via File Manager or FTP:

```
Directories (app, api, assets and everything inside)   755
Files (*.php, *.css, *.js, .htaccess)                  644
```

`api/config.local.php` should also be `644`. It sits behind a `Require all
denied` rule and is never served, but PHP still needs to read it.

## Step 6: Verify

1. Visit your domain - the home page should load with the navigation and the
   server status card.
2. Visit `https://yourdomain.com/api/health` - you should get:
   ```json
   {"status":"ok","timestamp":"2026-01-01T00:00:00+00:00","version":"1.0.0"}
   ```
3. Click **Login with Steam**. After approving, you should come back signed in,
   with an **Admin Panel** entry in your user menu if you added your Steam ID
   in step 4.

## Updating the site

With git:

```bash
cd ~/public_html && git pull
```

That is the whole process. Your `api/config.local.php` is untouched, and since
nothing is compiled, the new code is live immediately.

With a zip: run `./deploy.sh` locally, upload, extract, overwrite.

## Troubleshooting

### 500 Internal Server Error

1. Check cPanel **Metrics → Errors** for the PHP error.
2. Confirm your PHP version is 7.4 or newer (**Select PHP Version** in cPanel).
3. Temporarily add `ini_set('display_errors', '1');` to
   `api/config.local.php` to see the message, then remove it.

### "The database is temporarily unavailable"

The site renders this instead of crashing when it cannot reach MySQL.

1. Recheck the credentials in `api/config.local.php`.
2. Confirm the user is attached to the database with ALL PRIVILEGES.
3. Some hosts need `127.0.0.1` rather than `localhost`:
   `define('DB_HOST', '127.0.0.1');`

### Every page except the home page gives 404

`mod_rewrite` is not active, so `.htaccess` is not routing requests.

1. Confirm `.htaccess` uploaded - some FTP clients hide dotfiles.
2. Ask your host to enable `mod_rewrite` and `AllowOverride All`.

### Styles are missing

Check that `assets/css/app.css` loads (open it directly in a browser). If it
404s, the `assets` directory did not upload completely.

### Steam login fails or loops

1. `SITE_URL` must exactly match the address in the browser, including
   `https://` and without a trailing slash.
2. Steam must be able to reach your callback at
   `https://yourdomain.com/auth/steam/callback`.
3. Confirm `STEAM_API_KEY` is set - without it, names and avatars fall back to
   placeholders.

### Server status always shows offline

The status card queries the Rust server over UDP with the Steam A2S protocol.

1. Many shared hosts block outbound UDP - ask your host.
2. Confirm `RUST_SERVER_IP` and `RUST_SERVER_PORT` are the **query** port.

### Leaderboards are empty

Nothing has recorded player statistics yet. Either enter them from the admin
panel, or have a server-side plugin post to `/api/admin/players/stats` with an
admin bearer token.

## Security checklist

- [ ] `JWT_SECRET` set to a random 64-character string
- [ ] Real database credentials in `api/config.local.php`, not `config.php`
- [ ] Your Steam ID in `ADMIN_STEAM_IDS`
- [ ] `display_errors` off (it is off by default)
- [ ] HTTPS enabled, and `SITE_URL` using `https://`
- [ ] `https://yourdomain.com/app/Data.php` returns 403, not source code
- [ ] Once HTTPS works, uncomment the `Strict-Transport-Security` header in
      `.htaccess`

## Support

1. Work through the troubleshooting section above
2. Check the cPanel error logs
3. Confirm PHP and MySQL meet the versions listed in the prerequisites
