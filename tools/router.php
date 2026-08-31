<?php
/**
 * Development router for PHP's built-in server.
 *
 * Reproduces what .htaccess does on Apache, so `php -S` behaves like the real
 * host. Not used in production - Apache reads .htaccess instead.
 *
 *   php -S localhost:8000 -t . tools/router.php
 */

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$file = __DIR__ . '/..' . $path;

// The application source is never served.
if (preg_match('#^/(app|tools)/#', $path)) {
    http_response_code(403);
    exit('Forbidden');
}

// The JSON API has its own front controller.
if ($path === '/api' || strpos($path, '/api/') === 0) {
    require __DIR__ . '/../api/index.php';
    return true;
}

// Serve real files (assets) as-is.
if ($path !== '/' && is_file($file)) {
    return false;
}

require __DIR__ . '/../index.php';
