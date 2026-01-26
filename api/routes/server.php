<?php
/**
 * Server Status Routes
 *
 * Handles Rust server status queries
 */

if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

/**
 * Get current server status
 */
function getServerStatus(): void {
    // Check cache first
    $cacheFile = sys_get_temp_dir() . '/aor_server_status.json';
    $cacheValid = false;

    if (file_exists($cacheFile)) {
        $cacheAge = time() - filemtime($cacheFile);
        if ($cacheAge < SERVER_STATUS_CACHE) {
            $cached = json_decode(file_get_contents($cacheFile), true);
            if ($cached) {
                Response::json($cached);
            }
        }
    }

    // Query server
    $query = new SteamQuery(RUST_SERVER_IP, RUST_SERVER_PORT);
    $info = $query->getInfo();

    if ($info && $info['online']) {
        // Get last wipe date from database
        $lastWipe = Database::queryOne(
            'SELECT date FROM wipes WHERE completed = 1 ORDER BY date DESC LIMIT 1'
        );

        // Get next wipe date from database
        $nextWipe = Database::queryOne(
            'SELECT date FROM wipes WHERE completed = 0 AND date > NOW() ORDER BY date ASC LIMIT 1'
        );

        $status = [
            'name' => $info['name'],
            'players' => $info['players'],
            'maxPlayers' => $info['maxPlayers'],
            'queue' => $info['queue'],
            'map' => $info['map'],
            'fps' => 60, // Steam Query doesn't provide FPS
            'uptime' => '0d 0h', // Would need Rust+ for this
            'lastWipe' => $lastWipe['date'] ?? null,
            'nextWipe' => $nextWipe['date'] ?? null,
            'online' => true
        ];

        // Save to cache
        file_put_contents($cacheFile, json_encode($status));

        // Record stats to database (every 5 minutes based on cache)
        $lastStatRecord = Database::queryOne(
            'SELECT timestamp FROM server_stats ORDER BY id DESC LIMIT 1'
        );

        $shouldRecord = true;
        if ($lastStatRecord) {
            $lastTime = strtotime($lastStatRecord['timestamp']);
            $shouldRecord = (time() - $lastTime) >= 300; // 5 minutes
        }

        if ($shouldRecord) {
            Database::insert(
                'INSERT INTO server_stats (players, queue, fps, uptime) VALUES (?, ?, ?, ?)',
                [$info['players'], $info['queue'], 60, 0]
            );

            // Cleanup old stats (keep 30 days)
            Database::execute(
                'DELETE FROM server_stats WHERE timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY)'
            );
        }

        Response::json($status);
    }

    // Server offline - return fallback
    $status = [
        'name' => RUST_SERVER_NAME,
        'players' => 0,
        'maxPlayers' => 200,
        'queue' => 0,
        'map' => 'Procedural Map',
        'fps' => 0,
        'uptime' => '0d 0h',
        'lastWipe' => null,
        'nextWipe' => null,
        'online' => false
    ];

    // Still cache the offline status
    file_put_contents($cacheFile, json_encode($status));

    Response::json($status);
}

/**
 * Get server history
 */
function getServerHistory(): void {
    $hours = isset($_GET['hours']) ? (int) $_GET['hours'] : 24;
    $hours = min(max($hours, 1), 720); // 1 hour to 30 days

    $stats = Database::query(
        'SELECT id, timestamp, players, queue, fps, uptime
         FROM server_stats
         WHERE timestamp > DATE_SUB(NOW(), INTERVAL ? HOUR)
         ORDER BY timestamp ASC',
        [$hours]
    );

    Response::json($stats);
}
