<?php
/**
 * Art of Rust - Application bootstrap
 *
 * Loads configuration, shared includes and the session for the server-rendered
 * site. The JSON API under /api boots itself the same way, so both halves of
 * the site share one configuration file and one database layer.
 */

// Guards used by the app and API includes to refuse direct HTTP access.
define('AOR_APP', true);
if (!defined('AOR_API')) {
    define('AOR_API', true);
}

define('ROOT_PATH', dirname(__DIR__));
define('APP_PATH', __DIR__);

require_once ROOT_PATH . '/api/config.php';

// Shared data/auth helpers, reused verbatim from the API.
require_once ROOT_PATH . '/api/includes/Database.php';
require_once ROOT_PATH . '/api/includes/SteamAuth.php';
require_once ROOT_PATH . '/api/includes/SteamQuery.php';

require_once APP_PATH . '/icons.php';
require_once APP_PATH . '/themes.php';
require_once APP_PATH . '/content.php';
require_once APP_PATH . '/helpers.php';
require_once APP_PATH . '/Data.php';
require_once APP_PATH . '/Auth.php';

// Cache-busting suffix for the CSS/JS bundles: they change only when edited.
define('ASSET_VERSION', (string) @filemtime(ROOT_PATH . '/assets/css/app.css') ?: '1');

Auth::startSession();
