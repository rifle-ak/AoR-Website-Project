<?php
/**
 * Art of Rust - API Router
 *
 * Main entry point for all API requests.
 * Routes requests to appropriate handlers.
 */

// Guards allowing the shared includes to load.
define('AOR_API', true);
define('AOR_APP', true);
define('ROOT_PATH', dirname(__DIR__));
define('APP_PATH', ROOT_PATH . '/app');

// Load configuration
require_once __DIR__ . '/config.php';

// Load includes
require_once __DIR__ . '/includes/Database.php';
require_once __DIR__ . '/includes/JWT.php';
require_once __DIR__ . '/includes/Response.php';
require_once __DIR__ . '/includes/SteamAuth.php';
require_once __DIR__ . '/includes/SteamQuery.php';

// The data layer the HTML site renders from. Routes below expose the same
// functions as JSON so both halves of the site cannot drift apart.
require_once APP_PATH . '/Data.php';

// Set JSON content type
header('Content-Type: application/json; charset=utf-8');

// Handle CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = array_map('trim', explode(',', CORS_ORIGINS));

if (CORS_ORIGINS === '*' || in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
} else {
    header('Access-Control-Allow-Origin: ' . SITE_URL);
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Get request path
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$basePath = '/api';

// Remove base path and query string
$path = parse_url($requestUri, PHP_URL_PATH);
if (strpos($path, $basePath) === 0) {
    $path = substr($path, strlen($basePath));
}
$path = '/' . trim($path, '/');

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Get JSON body for POST/PUT requests
$input = [];
if (in_array($method, ['POST', 'PUT', 'PATCH'])) {
    $rawInput = file_get_contents('php://input');
    if ($rawInput) {
        $input = json_decode($rawInput, true) ?? [];
    }
}

// =============================================================================
// ROUTING
// =============================================================================

try {
    // Health check
    if ($path === '/health' || $path === '/') {
        Response::json([
            'status' => 'ok',
            'timestamp' => date('c'),
            'version' => '1.0.0'
        ]);
    }

    // ==========================================================================
    // AUTH ROUTES
    // ==========================================================================

    // Steam login redirect
    if ($path === '/auth/steam' && $method === 'GET') {
        $returnUrl = API_URL . '/auth/steam/callback';
        $loginUrl = SteamAuth::getLoginUrl($returnUrl);
        header('Location: ' . $loginUrl);
        exit;
    }

    // Steam callback
    if ($path === '/auth/steam/callback' && $method === 'GET') {
        require_once __DIR__ . '/routes/auth.php';
        handleSteamCallback();
    }

    // Get current user
    if ($path === '/auth/me' && $method === 'GET') {
        require_once __DIR__ . '/routes/auth.php';
        getCurrentUser();
    }

    // Logout
    if ($path === '/auth/logout' && $method === 'POST') {
        require_once __DIR__ . '/routes/auth.php';
        logout();
    }

    // ==========================================================================
    // SERVER ROUTES
    // ==========================================================================

    // Get server status
    if ($path === '/server/status' && $method === 'GET') {
        require_once __DIR__ . '/routes/server.php';
        getServerStatus();
    }

    // Get server history
    if ($path === '/server/history' && $method === 'GET') {
        require_once __DIR__ . '/routes/server.php';
        getServerHistory();
    }

    // ==========================================================================
    // WIPE ROUTES
    // ==========================================================================

    // Get wipe schedule
    if ($path === '/wipes/schedule' && $method === 'GET') {
        require_once __DIR__ . '/routes/wipes.php';
        getWipeSchedule();
    }

    // Create wipe (admin only)
    if ($path === '/wipes' && $method === 'POST') {
        require_once __DIR__ . '/routes/wipes.php';
        createWipe($input);
    }

    // Complete wipe (admin only)
    if (preg_match('#^/wipes/(\d+)/complete$#', $path, $matches) && $method === 'POST') {
        require_once __DIR__ . '/routes/wipes.php';
        completeWipe((int) $matches[1]);
    }

    // ==========================================================================
    // LEADERBOARD ROUTES
    // ==========================================================================

    // Get leaderboards
    if ($path === '/leaderboards' && $method === 'GET') {
        require_once __DIR__ . '/routes/leaderboards.php';
        getLeaderboards();
    }

    // Get player stats
    if (preg_match('#^/players/(\d+)$#', $path, $matches) && $method === 'GET') {
        require_once __DIR__ . '/routes/leaderboards.php';
        getPlayerStats($matches[1]);
    }

    // ==========================================================================
    // NEWS ROUTES
    // ==========================================================================

    // Get all news
    if ($path === '/news' && $method === 'GET') {
        require_once __DIR__ . '/routes/news.php';
        getNews();
    }

    // Get single news post
    if (preg_match('#^/news/(\d+)$#', $path, $matches) && $method === 'GET') {
        require_once __DIR__ . '/routes/news.php';
        getNewsPost((int) $matches[1]);
    }

    // Create news (admin only)
    if ($path === '/news' && $method === 'POST') {
        require_once __DIR__ . '/routes/news.php';
        createNews($input);
    }

    // Update news (admin only)
    if (preg_match('#^/news/(\d+)$#', $path, $matches) && $method === 'PUT') {
        require_once __DIR__ . '/routes/news.php';
        updateNews((int) $matches[1], $input);
    }

    // Delete news (admin only)
    if (preg_match('#^/news/(\d+)$#', $path, $matches) && $method === 'DELETE') {
        require_once __DIR__ . '/routes/news.php';
        deleteNews((int) $matches[1]);
    }

    // ==========================================================================
    // ADMIN ROUTES
    // ==========================================================================

    // Get dashboard stats
    if ($path === '/admin/dashboard' && $method === 'GET') {
        require_once __DIR__ . '/routes/admin.php';
        getDashboardStats();
    }

    // Get all users
    if ($path === '/admin/users' && $method === 'GET') {
        require_once __DIR__ . '/routes/admin.php';
        getUsers();
    }

    // Update user privileges
    if (preg_match('#^/admin/users/(\d+)$#', $path, $matches) && $method === 'PUT') {
        require_once __DIR__ . '/routes/admin.php';
        updateUserPrivileges($matches[1], $input);
    }

    // Update player stats
    if ($path === '/admin/players/stats' && $method === 'POST') {
        require_once __DIR__ . '/routes/admin.php';
        updatePlayerStats($input);
    }

    // ==========================================================================
    // 404 - Route not found
    // ==========================================================================
    Response::notFound('Endpoint not found: ' . $method . ' ' . $path);

} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    Response::serverError('Database error');
} catch (Exception $e) {
    error_log('API error: ' . $e->getMessage());
    Response::serverError('An error occurred');
}
