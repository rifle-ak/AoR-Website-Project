<?php
/**
 * Admin routes.
 *
 * Thin JSON wrappers over the shared data layer in app/Data.php.
 */

if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

/**
 * GET /api/admin/dashboard (admin)
 */
function getDashboardStats(): void {
    JWT::requireAdmin();

    Response::json(data_dashboard_stats());
}

/**
 * GET /api/admin/users (admin)
 */
function getUsers(): void {
    JWT::requireAdmin();

    Response::json(data_users());
}

/**
 * PUT /api/admin/users/{steamId} (admin)
 */
function updateUserPrivileges(string $steamId, array $input): void {
    $current = JWT::requireAdmin();

    if (isset($input['isAdmin']) && $steamId === ($current['steamId'] ?? '')) {
        Response::error('You cannot change your own admin status', 400);
    }

    try {
        $updated = data_update_user_privileges($steamId, $input);
    } catch (InvalidArgumentException $e) {
        Response::error($e->getMessage(), 400);
        return;
    }

    if (!$updated) {
        Response::notFound('User not found');
    }

    Response::success(null, 'User privileges updated');
}

/**
 * POST /api/admin/players/stats (admin)
 *
 * The endpoint a server-side plugin posts match statistics to.
 */
function updatePlayerStats(array $input): void {
    JWT::requireAdmin();

    try {
        data_update_player_stats($input);
    } catch (InvalidArgumentException $e) {
        Response::error($e->getMessage(), 400);
        return;
    }

    Response::success(null, 'Player stats updated');
}
