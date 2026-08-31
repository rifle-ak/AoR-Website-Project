<?php
/**
 * Server status routes.
 *
 * Thin JSON wrappers over the shared data layer in app/Data.php.
 */

if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

/**
 * GET /api/server/status
 */
function getServerStatus(): void {
    Response::json(data_server_status());
}

/**
 * GET /api/server/history?hours=24
 */
function getServerHistory(): void {
    $hours = isset($_GET['hours']) ? (int) $_GET['hours'] : 24;

    Response::json(data_server_history($hours));
}
