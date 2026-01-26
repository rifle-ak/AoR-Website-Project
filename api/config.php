<?php
/**
 * Art of Rust - API Configuration
 *
 * This file contains all configuration settings for the PHP backend.
 * Copy this to config.php and update values for your environment.
 */

// Prevent direct access
if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
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
define('DB_HOST', 'localhost');
define('DB_NAME', 'artofrust_db');
define('DB_USER', 'artofrust_user');
define('DB_PASS', 'your_database_password_here');
define('DB_CHARSET', 'utf8mb4');

// =============================================================================
// SITE CONFIGURATION
// =============================================================================
define('SITE_URL', 'https://artofrust.art'); // Your website URL (no trailing slash)
define('API_URL', SITE_URL . '/api');

// =============================================================================
// RUST SERVER CONFIGURATION
// =============================================================================
define('RUST_SERVER_IP', '188.64.33.62');
define('RUST_SERVER_PORT', 28017);
define('RUST_SERVER_NAME', 'Art of Rust');

// =============================================================================
// STEAM AUTHENTICATION
// =============================================================================
// Get your Steam API key from: https://steamcommunity.com/dev/apikey
define('STEAM_API_KEY', 'your_steam_api_key_here');

// =============================================================================
// SECURITY
// =============================================================================
// Generate a random 64-character string for JWT signing
// You can use: php -r "echo bin2hex(random_bytes(32));"
define('JWT_SECRET', 'change_this_to_a_random_64_character_string_for_security');
define('JWT_EXPIRY', 60 * 60 * 24 * 7); // 7 days in seconds

// Session configuration
define('SESSION_NAME', 'aor_session');
define('SESSION_LIFETIME', 60 * 60 * 24 * 7); // 7 days

// =============================================================================
// CORS CONFIGURATION
// =============================================================================
// Allowed origins (comma-separated, or * for all)
define('CORS_ORIGINS', SITE_URL);

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================
// Server status cache duration in seconds
define('SERVER_STATUS_CACHE', 30);

// =============================================================================
// ADMIN CONFIGURATION
// =============================================================================
// Steam IDs of users who should automatically be admins
// Add your Steam ID here (find it at steamid.io)
define('ADMIN_STEAM_IDS', [
    // '76561198000000000', // Example Steam ID
]);

// =============================================================================
// FEATURE FLAGS
// =============================================================================
define('ENABLE_REGISTRATION', true);
define('ENABLE_LEADERBOARDS', true);
define('ENABLE_NEWS', true);
define('ENABLE_WIPES', true);
