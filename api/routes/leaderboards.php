<?php
/**
 * Leaderboard Routes
 *
 * Handles player statistics and rankings
 */

if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

/**
 * Get leaderboards
 */
function getLeaderboards(): void {
    $category = $_GET['category'] ?? 'kills';
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 100;
    $limit = min(max($limit, 1), 500); // 1 to 500

    // Validate category and build ORDER BY clause
    $validCategories = ['kills', 'kd', 'playtime', 'headshots'];
    if (!in_array($category, $validCategories)) {
        $category = 'kills';
    }

    switch ($category) {
        case 'kills':
            $orderBy = 'kills DESC';
            break;
        case 'kd':
            $orderBy = '(kills / NULLIF(deaths, 0)) DESC';
            break;
        case 'playtime':
            $orderBy = 'playtime DESC';
            break;
        case 'headshots':
            $orderBy = 'headshots DESC';
            break;
        default:
            $orderBy = 'kills DESC';
    }

    $players = Database::query(
        "SELECT
            steam_id,
            name,
            kills,
            deaths,
            ROUND(kills / NULLIF(deaths, 0), 2) as kd,
            headshots,
            playtime,
            longest_kill
        FROM players
        WHERE kills > 0 OR deaths > 0
        ORDER BY $orderBy
        LIMIT ?",
        [$limit]
    );

    // Add rank to each player
    $rankedPlayers = array_map(function($player, $index) {
        return [
            'rank' => $index + 1,
            'steam_id' => $player['steam_id'],
            'name' => $player['name'],
            'kills' => (int) $player['kills'],
            'deaths' => (int) $player['deaths'],
            'kd' => $player['kd'] !== null ? (float) $player['kd'] : 0,
            'headshots' => (int) $player['headshots'],
            'playtime' => (int) $player['playtime'],
            'longest_kill' => (float) $player['longest_kill']
        ];
    }, $players, array_keys($players));

    Response::json([
        'category' => $category,
        'updated' => date('c'),
        'players' => $rankedPlayers
    ]);
}

/**
 * Get individual player stats
 */
function getPlayerStats(string $steamId): void {
    $player = Database::queryOne(
        'SELECT * FROM players WHERE steam_id = ?',
        [$steamId]
    );

    if (!$player) {
        Response::notFound('Player not found');
    }

    Response::json([
        'steam_id' => $player['steam_id'],
        'name' => $player['name'],
        'kills' => (int) $player['kills'],
        'deaths' => (int) $player['deaths'],
        'kd' => $player['deaths'] > 0 ? round($player['kills'] / $player['deaths'], 2) : (float) $player['kills'],
        'headshots' => (int) $player['headshots'],
        'playtime' => (int) $player['playtime'],
        'longest_kill' => (float) $player['longest_kill'],
        'last_seen' => $player['last_seen'],
        'created_at' => $player['created_at']
    ]);
}
