# Art of Rust Website

Official website for the Art of Rust gaming community - a premium Rust gaming
experience with dedicated servers and an amazing community.

**There is no build step.** The site is plain PHP: clone it into `public_html`,
fill in one config file, and it runs. No Node, no npm, no compiled bundle.

## Tech stack

- **Language:** PHP 7.4+ (8.0+ recommended)
- **Database:** MySQL 5.7+ / MariaDB 10.2+
- **Authentication:** Steam OpenID, session cookies for the site and JWT bearer
  tokens for the JSON API
- **Server query:** Steam A2S protocol
- **Front end:** server-rendered HTML, hand-written CSS, ~500 lines of vanilla
  JavaScript. No frameworks and no dependencies to install.

## Layout

```
index.php            Front controller - every page request enters here
.htaccess            Routing, security headers, caching
app/                 Application source (never served directly)
  bootstrap.php        Config, includes, session
  Auth.php             Steam sign-in and session handling
  Data.php             Every database and server query the site makes
  helpers.php          Escaping, formatting, view rendering
  themes.php           The five colour themes
  content.php          Editable page copy: commands, rules, gallery
  icons.php            Inline SVG icons (generated - see tools/)
  actions/             Form handlers for sign-in and the admin pages
  views/               Layout, partials and one file per page
api/                  JSON API - same data, different presentation
  config.php           All configuration lives here
  schema.sql           Database schema
assets/               CSS, JavaScript, images
tools/                Development helpers, not deployed
```

`app/Data.php` is the single source of truth for data access. The HTML pages
render its return values; the JSON API wraps the same functions in
`Response::json()`. Neither half can drift away from the other.

## Local development

You need PHP with `pdo_mysql`, and a MySQL or MariaDB server.

```bash
# 1. Create the database and import the schema
mysql -u root -p -e "CREATE DATABASE artofrust_db"
mysql -u root -p artofrust_db < api/schema.sql

# 2. Point the site at it (this file is gitignored)
cat > api/config.local.php <<'PHP'
<?php
define('DB_USER', 'root');
define('DB_PASS', 'your_password');
define('SITE_URL', 'http://localhost:8000');
PHP

# 3. Run it
php -S localhost:8000 -t . tools/router.php
```

Open <http://localhost:8000>. `tools/router.php` reproduces what `.htaccess`
does on Apache, so the built-in server behaves like the real host.

To check everything responds:

```bash
./tools/smoke-test.sh http://localhost:8000
```

## Configuration

Everything is in `api/config.php`: database credentials, your domain, the Rust
server address, Steam API key, Discord and social links, and feature flags.

Rather than editing that file directly, create **`api/config.local.php`** and
define only the values you want to change. It is loaded first and wins over the
defaults, and it is gitignored - so your credentials stay out of the repository
and survive a `git pull`.

```php
<?php
define('DB_NAME', 'yourusername_artofrust');
define('DB_USER', 'yourusername_aoruser');
define('DB_PASS', 'your_database_password');
define('SITE_URL', 'https://artofrust.art');
define('STEAM_API_KEY', 'your_steam_api_key');
define('JWT_SECRET', 'a_random_64_character_string');
define('ADMIN_STEAM_IDS', ['76561198000000000']);
```

Generate a JWT secret with:

```bash
php -r "echo bin2hex(random_bytes(32));"
```

## Becoming an admin

Add your Steam ID (from [steamid.io](https://steamid.io/)) to
`ADMIN_STEAM_IDS`, then sign in with Steam. The account is created with admin
rights on first sign-in. After that, admins can promote others from
**Admin → User Management**.

## Editing content

- **News** - written in the admin panel, stored in MySQL.
- **Wipes** - scheduled in the admin panel. With none scheduled, the countdown
  falls back to `NEXT_WIPE_DATE` in the config.
- **Commands, rules, gallery** - PHP arrays in `app/content.php`. Edit the file
  and save; the change is live.
- **Player statistics** - posted to `/api/admin/players/stats` by a server-side
  plugin, or entered by an admin.

## JSON API

Public endpoints need no authentication:

| Endpoint | Description |
| --- | --- |
| `GET /api/health` | Liveness check |
| `GET /api/server/status` | Live player count, map, queue |
| `GET /api/server/history?hours=24` | Historical player counts |
| `GET /api/wipes/schedule` | Next, upcoming and past wipes |
| `GET /api/leaderboards?category=kills` | Rankings: `kills`, `kd`, `playtime`, `headshots` |
| `GET /api/players/{steamId}` | One player's statistics |
| `GET /api/news` | Published news posts |

Write endpoints need an admin bearer token, obtained by completing Steam
OpenID against `/api/auth/steam/callback`:

```
Authorization: Bearer <token>
```

| Endpoint | Description |
| --- | --- |
| `POST /api/admin/players/stats` | Create or update a player's statistics |
| `POST /api/news`, `PUT/DELETE /api/news/{id}` | Manage news |
| `POST /api/wipes`, `POST /api/wipes/{id}/complete` | Manage wipes |
| `GET /api/admin/dashboard`, `GET /api/admin/users` | Admin data |
| `PUT /api/admin/users/{steamId}` | Grant or revoke admin/VIP |

## Themes

Five themes ship with the site: Rust, Dark, Light, Forest and Ocean. The choice
is stored in a cookie and applied when the page is rendered, so there is no
flash of the wrong palette on load. Themes are defined in `app/themes.php`;
adding one is a matter of adding an entry to that array.

## Deployment

See [CPANEL_SETUP.md](CPANEL_SETUP.md). The short version: put these files in
`public_html`, create `api/config.local.php`, import `api/schema.sql`.

## Regenerating the icons

`app/icons.php` is generated from the lucide icon set and is committed, so
nothing needs to be installed to run the site. To add an icon, add its name to
the list in `tools/gen-icons.mjs` and run it once with Node and lucide-react
available:

```bash
npm install lucide-react@0.294.0 && node tools/gen-icons.mjs
```

## Licence

Rust and associated Rust images are copyright of Facepunch Studios LTD.
Icons are from [lucide](https://lucide.dev) (ISC).
