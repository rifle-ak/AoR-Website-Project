<?php
/**
 * Leaderboard routes.
 *
 * Thin JSON wrappers over the shared data layer in app/Data.php.
 */

if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

/**
 * GET /api/leaderboards?category=kills&limit=100
 */
function getLeaderboards(): void {
    $category = isset($_GET['category']) ? (string) $_GET['category'] : 'kills';
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 100;

    Response::json(data_leaderboards($category, $limit));
}

/**
 * GET /api/players/{steamId}
 */
function getPlayerStats(string $steamId): void {
    $player = data_player_stats($steamId);

    if (!$player) {
        Response::notFound('Player not found');
    }

    Response::json($player);
}
