<?php
/**
 * Art of Rust - Configuration
 *
 * IMPORTANT: Edit this file with your actual settings before deploying!
 *
 * To keep credentials out of git (recommended), copy the values you need into
 * api/config.local.php instead. That file is loaded first and is gitignored, so
 * anything it defines wins over the defaults below and survives a `git pull`.
 */

// Prevent direct access
if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

// Load the gitignored local overrides first - whatever it defines wins.
if (file_exists(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
}

/**
 * Define a constant unless config.local.php already set it.
 */
function aor_config(string $name, $value): void {
    if (!defined($name)) {
        define($name, $value);
    }
}

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', '0'); // Set to '1' for debugging
ini_set('log_errors', '1');

// Timezone
date_default_timezone_set('UTC');

// =============================================================================
// DATABASE CONFIGURATION (MySQL)
// =============================================================================
aor_config('DB_HOST', 'localhost');
aor_config('DB_NAME', 'artofrust_db');
aor_config('DB_USER', 'artofrust_user');
aor_config('DB_PASS', 'your_database_password_here');
aor_config('DB_CHARSET', 'utf8mb4');

// =============================================================================
// SITE CONFIGURATION
// =============================================================================
aor_config('SITE_URL', 'https://artofrust.art'); // Your website URL (no trailing slash)
aor_config('API_URL', SITE_URL . '/api');
aor_config('SITE_NAME', 'Art of Rust');
aor_config('SITE_TAGLINE', 'Art of Rust - Premium Rust Gaming Community');
aor_config('SITE_DESCRIPTION', 'Join the Art of Rust gaming community. Experience premium Rust servers with active admins, custom events, and an amazing player base.');
aor_config('SITE_KEYWORDS', 'rust, rust game, gaming server, multiplayer, survival, pvp, Art of Rust, AOR');
aor_config('SITE_OG_IMAGE', '/assets/og-image.png');

// =============================================================================
// RUST SERVER CONFIGURATION
// =============================================================================
aor_config('RUST_SERVER_IP', '188.64.33.62');
aor_config('RUST_SERVER_PORT', 28017);
aor_config('RUST_SERVER_NAME', 'Art of Rust');
aor_config('SERVER_DISPLAY_NAME', 'Art of Rust | Main Server');
aor_config('SERVER_MAX_PLAYERS', 200);
aor_config('MAP_SIZE', 4500);

// Fallback wipe dates, used only when the `wipes` table has no matching rows.
aor_config('NEXT_WIPE_DATE', '2026-09-04T19:00:00Z');
aor_config('NEXT_WIPE_TYPE', 'full');
aor_config('LAST_WIPE_DATE', '2026-08-07T19:00:00Z');

// =============================================================================
// COMMUNITY LINKS
// =============================================================================
aor_config('DISCORD_INVITE', 'https://discord.gg/artofrust');
aor_config('TWITTER_URL', 'https://x.com/ArtofRust');
aor_config('YOUTUBE_URL', 'https://youtube.com/@ArtofRust');
aor_config('INSTAGRAM_URL', 'https://www.instagram.com/ArtofRust');
aor_config('DONATE_URL', 'https://www.paypal.com/donate/?hosted_button_id=3XT3JB75XG84W');
aor_config('CONTACT_EMAIL', 'ArtofRustMedia@gmail.com');

// =============================================================================
// STEAM AUTHENTICATION
// =============================================================================
// Get your Steam API key from: https://steamcommunity.com/dev/apikey
aor_config('STEAM_API_KEY', 'your_steam_api_key_here');

// =============================================================================
// SECURITY
// =============================================================================
// Generate a random 64-character string for JWT signing
// You can use: php -r "echo bin2hex(random_bytes(32));"
aor_config('JWT_SECRET', 'change_this_to_a_random_64_character_string_for_security');
aor_config('JWT_EXPIRY', 60 * 60 * 24 * 7); // 7 days in seconds

// Session configuration
aor_config('SESSION_NAME', 'aor_session');
aor_config('SESSION_LIFETIME', 60 * 60 * 24 * 7); // 7 days

// =============================================================================
// CORS CONFIGURATION
// =============================================================================
// Allowed origins (comma-separated, or * for all)
aor_config('CORS_ORIGINS', SITE_URL);

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================
// Server status cache duration in seconds
aor_config('SERVER_STATUS_CACHE', 30);

// =============================================================================
// ADMIN CONFIGURATION
// =============================================================================
// Steam IDs of users who should automatically be admins
// Add your Steam ID here (find it at steamid.io)
aor_config('ADMIN_STEAM_IDS', [
    // '76561198000000000', // Example Steam ID
]);

// =============================================================================
// FEATURE FLAGS
// =============================================================================
aor_config('ENABLE_REGISTRATION', true);
aor_config('ENABLE_LEADERBOARDS', true);
aor_config('ENABLE_NEWS', true);
aor_config('ENABLE_WIPES', true);
