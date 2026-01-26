<?php
/**
 * Admin Routes
 *
 * Handles admin dashboard and management
 */

if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

/**
 * Get dashboard statistics
 */
function getDashboardStats(): void {
    JWT::requireAdmin();

    // Get counts
    $totalPlayers = Database::queryOne('SELECT COUNT(*) as count FROM players')['count'];
    $totalNews = Database::queryOne('SELECT COUNT(*) as count FROM news')['count'];
    $totalWipes = Database::queryOne('SELECT COUNT(*) as count FROM wipes')['count'];
    $totalUsers = Database::queryOne('SELECT COUNT(*) as count FROM users')['count'];

    // Get recent players
    $recentPlayers = Database::query(
        'SELECT name, kills, deaths, playtime, last_seen
         FROM players
         ORDER BY last_seen DESC
         LIMIT 10'
    );

    // Get recent server stats
    $recentStats = Database::query(
        'SELECT timestamp, players, queue
         FROM server_stats
         ORDER BY timestamp DESC
         LIMIT 24'
    );

    Response::json([
        'stats' => [
            'totalPlayers' => (int) $totalPlayers,
            'totalNews' => (int) $totalNews,
            'totalWipes' => (int) $totalWipes,
            'totalUsers' => (int) $totalUsers
        ],
        'recentPlayers' => array_map(function($p) {
            return [
                'name' => $p['name'],
                'kills' => (int) $p['kills'],
                'deaths' => (int) $p['deaths'],
                'playtime' => (int) $p['playtime'],
                'last_seen' => $p['last_seen']
            ];
        }, $recentPlayers),
        'recentStats' => $recentStats
    ]);
}

/**
 * Get all users
 */
function getUsers(): void {
    JWT::requireAdmin();

    $users = Database::query(
        'SELECT steam_id, display_name, avatar_url, is_admin, is_vip, created_at, last_login
         FROM users
         ORDER BY last_login DESC'
    );

    $formattedUsers = array_map(function($user) {
        return [
            'steam_id' => $user['steam_id'],
            'display_name' => $user['display_name'],
            'avatar_url' => $user['avatar_url'],
            'is_admin' => (bool) $user['is_admin'],
            'is_vip' => (bool) $user['is_vip'],
            'created_at' => $user['created_at'],
            'last_login' => $user['last_login']
        ];
    }, $users);

    Response::json($formattedUsers);
}

/**
 * Update user privileges
 */
function updateUserPrivileges(string $steamId, array $input): void {
    JWT::requireAdmin();

    // Check if user exists
    $user = Database::queryOne('SELECT * FROM users WHERE steam_id = ?', [$steamId]);

    if (!$user) {
        Response::notFound('User not found');
    }

    // Build update
    $updates = [];
    $params = [];

    if (isset($input['isAdmin'])) {
        $updates[] = 'is_admin = ?';
        $params[] = $input['isAdmin'] ? 1 : 0;
    }

    if (isset($input['isVip'])) {
        $updates[] = 'is_vip = ?';
        $params[] = $input['isVip'] ? 1 : 0;
    }

    if (empty($updates)) {
        Response::error('No fields to update', 400);
    }

    $params[] = $steamId;

    Database::execute(
        'UPDATE users SET ' . implode(', ', $updates) . ' WHERE steam_id = ?',
        $params
    );

    Response::success(null, 'User privileges updated');
}

/**
 * Update player stats (manual entry)
 */
function updatePlayerStats(array $input): void {
    JWT::requireAdmin();

    // Validate input
    if (empty($input['steamId'])) {
        Response::error('Steam ID is required', 400);
    }

    $steamId = $input['steamId'];
    $name = $input['name'] ?? 'Unknown';
    $kills = isset($input['kills']) ? (int) $input['kills'] : 0;
    $deaths = isset($input['deaths']) ? (int) $input['deaths'] : 0;
    $headshots = isset($input['headshots']) ? (int) $input['headshots'] : 0;
    $playtime = isset($input['playtime']) ? (int) $input['playtime'] : 0;

    // Check if player exists
    $existing = Database::queryOne('SELECT * FROM players WHERE steam_id = ?', [$steamId]);

    if ($existing) {
        Database::execute(
            'UPDATE players SET name = ?, kills = ?, deaths = ?, headshots = ?, playtime = ?, last_seen = NOW() WHERE steam_id = ?',
            [$name, $kills, $deaths, $headshots, $playtime, $steamId]
        );
    } else {
        Database::insert(
            'INSERT INTO players (steam_id, name, kills, deaths, headshots, playtime) VALUES (?, ?, ?, ?, ?, ?)',
            [$steamId, $name, $kills, $deaths, $headshots, $playtime]
        );
    }

    Response::success(null, 'Player stats updated');
}
