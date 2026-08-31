<?php
/**
 * Art of Rust - Data layer
 *
 * Every database and Rust-server read/write the site performs lives here, as
 * plain functions that return arrays and never emit output. The HTML pages
 * render these directly; the JSON API under /api wraps the same functions in
 * Response::json(). One implementation, two presentations.
 */

if (!defined('AOR_APP')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

// =============================================================================
// CONNECTIVITY
// =============================================================================

/**
 * Whether MySQL is reachable. Checked once per request so pages can degrade to
 * an "unavailable" state instead of a fatal error on a half-configured install.
 */
function db_available(): bool {
    static $available = null;

    if ($available === null) {
        try {
            Database::getInstance();
            $available = true;
        } catch (PDOException $e) {
            $available = false;
        }
    }

    return $available;
}

// =============================================================================
// SERVER STATUS
// =============================================================================

/**
 * Live server status, queried over A2S and cached briefly on disk.
 *
 * Returns the same shape whether the server answers or not, with `online`
 * reporting which happened.
 */
function data_server_status(): array {
    $cacheFile = sys_get_temp_dir() . '/aor_server_status.json';

    if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < SERVER_STATUS_CACHE) {
        $cached = json_decode((string) file_get_contents($cacheFile), true);
        if (is_array($cached)) {
            return $cached;
        }
    }

    $query = new SteamQuery(RUST_SERVER_IP, RUST_SERVER_PORT);
    $info = $query->getInfo();

    if ($info && $info['online']) {
        $lastWipe = null;
        $nextWipe = null;

        if (db_available()) {
            $lastWipe = Database::queryOne('SELECT date FROM wipes WHERE completed = 1 ORDER BY date DESC LIMIT 1');
            $nextWipe = Database::queryOne('SELECT date FROM wipes WHERE completed = 0 AND date > NOW() ORDER BY date ASC LIMIT 1');
            record_server_sample($info);
        }

        $status = [
            'name' => $info['name'],
            'players' => $info['players'],
            'maxPlayers' => $info['maxPlayers'],
            'queue' => $info['queue'],
            'map' => $info['map'],
            'fps' => 60,        // A2S does not report server FPS
            'uptime' => '0d 0h', // would need the Rust+ API
            'lastWipe' => $lastWipe['date'] ?? null,
            'nextWipe' => $nextWipe['date'] ?? null,
            'online' => true,
        ];
    } else {
        $status = [
            'name' => SERVER_DISPLAY_NAME,
            'players' => 0,
            'maxPlayers' => SERVER_MAX_PLAYERS,
            'queue' => 0,
            'map' => 'Procedural Map',
            'fps' => 0,
            'uptime' => '0d 0h',
            'lastWipe' => null,
            'nextWipe' => null,
            'online' => false,
        ];
    }

    @file_put_contents($cacheFile, json_encode($status));

    return $status;
}

/**
 * Record a player-count sample at most once every five minutes, and prune
 * samples older than 30 days.
 */
function record_server_sample(array $info): void {
    $last = Database::queryOne('SELECT timestamp FROM server_stats ORDER BY id DESC LIMIT 1');

    if ($last && (time() - strtotime($last['timestamp'])) < 300) {
        return;
    }

    Database::insert(
        'INSERT INTO server_stats (players, queue, fps, uptime) VALUES (?, ?, ?, ?)',
        [$info['players'], $info['queue'], 60, 0]
    );

    Database::execute('DELETE FROM server_stats WHERE timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY)');
}

/**
 * Historical player counts for the last N hours.
 */
function data_server_history(int $hours = 24): array {
    if (!db_available()) {
        return [];
    }

    $hours = min(max($hours, 1), 720);

    return Database::query(
        'SELECT id, timestamp, players, queue, fps, uptime
         FROM server_stats
         WHERE timestamp > DATE_SUB(NOW(), INTERVAL ? HOUR)
         ORDER BY timestamp ASC',
        [$hours]
    );
}

// =============================================================================
// WIPES
// =============================================================================

/**
 * Normalise a `wipes` row into the shape the pages and API expose.
 */
function format_wipe(?array $wipe): ?array {
    if (!$wipe) {
        return null;
    }

    return [
        'id' => (int) $wipe['id'],
        'type' => $wipe['type'],
        'date' => $wipe['date'],
        'mapSize' => $wipe['map_size'] !== null ? (int) $wipe['map_size'] : null,
        'mapSeed' => $wipe['map_seed'],
        'notes' => $wipe['notes'],
        'completed' => (bool) $wipe['completed'],
    ];
}

/**
 * The wipe schedule: the next wipe, the ones after it, and recent history.
 *
 * With no scheduled wipes in the database the next wipe falls back to the dates
 * in config, so a fresh install still shows a working countdown.
 */
function data_wipe_schedule(): array {
    $next = null;
    $upcoming = [];
    $history = [];

    if (db_available()) {
        $rows = Database::query('SELECT * FROM wipes WHERE completed = 0 AND date > NOW() ORDER BY date ASC LIMIT 5');
        $upcoming = array_map('format_wipe', $rows);
        $next = $upcoming[0] ?? null;
        $upcoming = array_slice($upcoming, 1);

        $history = array_map(
            'format_wipe',
            Database::query('SELECT * FROM wipes WHERE completed = 1 ORDER BY date DESC LIMIT 10')
        );
    }

    if (!$next) {
        $next = fallback_next_wipe();
    }

    if (!$history) {
        $history = [[
            'id' => 'fallback-last',
            'type' => 'full',
            'date' => date('Y-m-d H:i:s', strtotime(LAST_WIPE_DATE)),
            'mapSize' => MAP_SIZE,
            'mapSeed' => null,
            'notes' => 'Last server wipe',
            'completed' => true,
        ]];
    }

    return ['next' => $next, 'upcoming' => $upcoming, 'history' => $history];
}

/**
 * Config-driven stand-in used when no wipe is scheduled in the database.
 */
function fallback_next_wipe(): array {
    $type = in_array(NEXT_WIPE_TYPE, ['full', 'map', 'bp'], true) ? NEXT_WIPE_TYPE : 'full';

    return [
        'id' => 'fallback-next',
        'type' => $type,
        'date' => date('Y-m-d H:i:s', strtotime(NEXT_WIPE_DATE)),
        'mapSize' => MAP_SIZE,
        'mapSeed' => null,
        'notes' => $type === 'full'
            ? 'Monthly force wipe - Full wipe including blueprints'
            : 'Map wipe only - Blueprints preserved',
        'completed' => false,
    ];
}

/**
 * Every wipe, newest first - the admin view.
 */
function data_all_wipes(): array {
    if (!db_available()) {
        return [];
    }

    return Database::query('SELECT * FROM wipes ORDER BY date DESC');
}

/**
 * Schedule a wipe. Returns the new row id.
 *
 * @throws InvalidArgumentException when type or date is unusable.
 */
function data_create_wipe(array $input): int {
    $type = $input['type'] ?? '';
    if (!in_array($type, ['full', 'map', 'bp'], true)) {
        throw new InvalidArgumentException('Invalid wipe type. Must be: full, map, or bp');
    }

    $date = strtotime((string) ($input['date'] ?? ''));
    if (!$date) {
        throw new InvalidArgumentException('A valid wipe date is required');
    }

    $mapSize = isset($input['map_size']) && $input['map_size'] !== '' ? (int) $input['map_size'] : null;
    $mapSeed = isset($input['map_seed']) && $input['map_seed'] !== '' ? trim((string) $input['map_seed']) : null;
    $notes = isset($input['notes']) && $input['notes'] !== '' ? trim((string) $input['notes']) : null;

    return Database::insert(
        'INSERT INTO wipes (type, date, map_size, map_seed, notes) VALUES (?, ?, ?, ?, ?)',
        [$type, date('Y-m-d H:i:s', $date), $mapSize, $mapSeed, $notes]
    );
}

/**
 * Mark a wipe complete. Returns false when no such wipe exists.
 */
function data_complete_wipe(int $id): bool {
    if (!Database::queryOne('SELECT id FROM wipes WHERE id = ?', [$id])) {
        return false;
    }

    Database::execute('UPDATE wipes SET completed = 1 WHERE id = ?', [$id]);

    return true;
}

// =============================================================================
// LEADERBOARDS
// =============================================================================

/**
 * Ranked players for one leaderboard category.
 */
function data_leaderboards(string $category = 'kills', int $limit = 100): array {
    $valid = ['kills', 'kd', 'playtime', 'headshots'];
    if (!in_array($category, $valid, true)) {
        $category = 'kills';
    }

    if (!db_available()) {
        return ['category' => $category, 'updated' => date('c'), 'players' => []];
    }

    $limit = min(max($limit, 1), 500);

    // Fixed clauses chosen by whitelist above - never interpolated user input.
    $orderBy = [
        'kills' => 'kills DESC',
        'kd' => '(kills / NULLIF(deaths, 0)) DESC',
        'playtime' => 'playtime DESC',
        'headshots' => 'headshots DESC',
    ][$category];

    $players = Database::query(
        "SELECT steam_id, name, kills, deaths,
                ROUND(kills / NULLIF(deaths, 0), 2) AS kd,
                headshots, playtime, longest_kill
         FROM players
         WHERE kills > 0 OR deaths > 0
         ORDER BY $orderBy
         LIMIT ?",
        [$limit]
    );

    $ranked = [];
    foreach ($players as $index => $player) {
        $ranked[] = [
            'rank' => $index + 1,
            'steam_id' => $player['steam_id'],
            'name' => $player['name'],
            'kills' => (int) $player['kills'],
            'deaths' => (int) $player['deaths'],
            'kd' => $player['kd'] !== null ? (float) $player['kd'] : (float) $player['kills'],
            'headshots' => (int) $player['headshots'],
            'playtime' => (int) $player['playtime'],
            'longest_kill' => (float) $player['longest_kill'],
        ];
    }

    return ['category' => $category, 'updated' => date('c'), 'players' => $ranked];
}

/**
 * One player's statistics, or null when they have never been seen.
 */
function data_player_stats(string $steamId): ?array {
    if (!db_available()) {
        return null;
    }

    $player = Database::queryOne('SELECT * FROM players WHERE steam_id = ?', [$steamId]);

    if (!$player) {
        return null;
    }

    return [
        'steam_id' => $player['steam_id'],
        'name' => $player['name'],
        'kills' => (int) $player['kills'],
        'deaths' => (int) $player['deaths'],
        'kd' => $player['deaths'] > 0 ? round($player['kills'] / $player['deaths'], 2) : (float) $player['kills'],
        'headshots' => (int) $player['headshots'],
        'playtime' => (int) $player['playtime'],
        'longest_kill' => (float) $player['longest_kill'],
        'last_seen' => $player['last_seen'],
        'created_at' => $player['created_at'],
    ];
}

// =============================================================================
// NEWS
// =============================================================================

/**
 * Normalise a joined `news` row.
 */
function format_news(array $post): array {
    return [
        'id' => (int) $post['id'],
        'title' => $post['title'],
        'content' => $post['content'],
        'excerpt' => $post['excerpt'],
        'author_name' => $post['author_name'] ?? 'Anonymous',
        'author_avatar' => $post['author_avatar'] ?? null,
        'published' => (bool) $post['published'],
        'created_at' => $post['created_at'],
        'updated_at' => $post['updated_at'],
    ];
}

/**
 * News posts, newest first. Drafts are included only for the admin view.
 */
function data_news(int $limit = 10, bool $includeDrafts = false): array {
    if (!db_available()) {
        return [];
    }

    $limit = min(max($limit, 1), 100);
    $where = $includeDrafts ? '' : 'WHERE n.published = 1';

    $rows = Database::query(
        "SELECT n.*, u.display_name AS author_name, u.avatar_url AS author_avatar
         FROM news n
         LEFT JOIN users u ON n.author_steam_id = u.steam_id
         $where
         ORDER BY n.created_at DESC
         LIMIT ?",
        [$limit]
    );

    return array_map('format_news', $rows);
}

/**
 * A single published news post, or null.
 */
function data_news_post(int $id): ?array {
    if (!db_available()) {
        return null;
    }

    $post = Database::queryOne(
        'SELECT n.*, u.display_name AS author_name, u.avatar_url AS author_avatar
         FROM news n
         LEFT JOIN users u ON n.author_steam_id = u.steam_id
         WHERE n.id = ? AND n.published = 1',
        [$id]
    );

    return $post ? format_news($post) : null;
}

/**
 * Create a news post. Returns the new row id.
 *
 * @throws InvalidArgumentException when title or content is missing.
 */
function data_create_news(array $input, string $authorSteamId): int {
    $title = trim((string) ($input['title'] ?? ''));
    $content = trim((string) ($input['content'] ?? ''));

    if ($title === '' || $content === '') {
        throw new InvalidArgumentException('Title and content are required');
    }

    $excerpt = trim((string) ($input['excerpt'] ?? ''));
    if ($excerpt === '') {
        $excerpt = mb_substr($content, 0, 150) . (mb_strlen($content) > 150 ? '...' : '');
    }

    return Database::insert(
        'INSERT INTO news (title, content, excerpt, author_steam_id, published) VALUES (?, ?, ?, ?, ?)',
        [$title, $content, $excerpt, $authorSteamId, !empty($input['published']) ? 1 : 0]
    );
}

/**
 * Update a news post. Returns false when the post does not exist.
 *
 * @throws InvalidArgumentException when title or content is blanked out.
 */
function data_update_news(int $id, array $input): bool {
    if (!Database::queryOne('SELECT id FROM news WHERE id = ?', [$id])) {
        return false;
    }

    $updates = [];
    $params = [];

    if (isset($input['title'])) {
        $title = trim((string) $input['title']);
        if ($title === '') {
            throw new InvalidArgumentException('Title cannot be empty');
        }
        $updates[] = 'title = ?';
        $params[] = $title;
    }

    if (isset($input['content'])) {
        $content = trim((string) $input['content']);
        if ($content === '') {
            throw new InvalidArgumentException('Content cannot be empty');
        }
        $updates[] = 'content = ?';
        $params[] = $content;
    }

    if (isset($input['excerpt'])) {
        $updates[] = 'excerpt = ?';
        $params[] = trim((string) $input['excerpt']);
    }

    if (isset($input['published'])) {
        $updates[] = 'published = ?';
        $params[] = $input['published'] ? 1 : 0;
    }

    if (!$updates) {
        throw new InvalidArgumentException('No fields to update');
    }

    $updates[] = 'updated_at = NOW()';
    $params[] = $id;

    Database::execute('UPDATE news SET ' . implode(', ', $updates) . ' WHERE id = ?', $params);

    return true;
}

/**
 * Delete a news post. Returns false when it does not exist.
 */
function data_delete_news(int $id): bool {
    if (!Database::queryOne('SELECT id FROM news WHERE id = ?', [$id])) {
        return false;
    }

    Database::execute('DELETE FROM news WHERE id = ?', [$id]);

    return true;
}

// =============================================================================
// USERS AND ADMIN
// =============================================================================

/**
 * Counts and recent activity for the admin dashboard.
 */
function data_dashboard_stats(): array {
    if (!db_available()) {
        return [
            'stats' => ['totalPlayers' => 0, 'totalNews' => 0, 'totalWipes' => 0, 'totalUsers' => 0],
            'recentPlayers' => [],
            'recentStats' => [],
        ];
    }

    $count = function (string $table): int {
        return (int) Database::queryOne("SELECT COUNT(*) AS count FROM $table")['count'];
    };

    $recentPlayers = Database::query(
        'SELECT name, kills, deaths, playtime, last_seen FROM players ORDER BY last_seen DESC LIMIT 10'
    );

    return [
        'stats' => [
            'totalPlayers' => $count('players'),
            'totalNews' => $count('news'),
            'totalWipes' => $count('wipes'),
            'totalUsers' => $count('users'),
        ],
        'recentPlayers' => array_map(function ($p) {
            return [
                'name' => $p['name'],
                'kills' => (int) $p['kills'],
                'deaths' => (int) $p['deaths'],
                'playtime' => (int) $p['playtime'],
                'last_seen' => $p['last_seen'],
            ];
        }, $recentPlayers),
        'recentStats' => Database::query(
            'SELECT timestamp, players, queue FROM server_stats ORDER BY timestamp DESC LIMIT 24'
        ),
    ];
}

/**
 * Every registered user, most recently seen first.
 */
function data_users(): array {
    if (!db_available()) {
        return [];
    }

    $users = Database::query(
        'SELECT steam_id, display_name, avatar_url, is_admin, is_vip, created_at, last_login
         FROM users ORDER BY last_login DESC'
    );

    return array_map(function ($user) {
        return [
            'steam_id' => $user['steam_id'],
            'display_name' => $user['display_name'],
            'avatar_url' => $user['avatar_url'],
            'is_admin' => (bool) $user['is_admin'],
            'is_vip' => (bool) $user['is_vip'],
            'created_at' => $user['created_at'],
            'last_login' => $user['last_login'],
        ];
    }, $users);
}

/**
 * Grant or revoke admin/VIP. Returns false when the user does not exist.
 *
 * @throws InvalidArgumentException when neither privilege is supplied.
 */
function data_update_user_privileges(string $steamId, array $input): bool {
    if (!Database::queryOne('SELECT steam_id FROM users WHERE steam_id = ?', [$steamId])) {
        return false;
    }

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

    if (!$updates) {
        throw new InvalidArgumentException('No fields to update');
    }

    $params[] = $steamId;

    Database::execute('UPDATE users SET ' . implode(', ', $updates) . ' WHERE steam_id = ?', $params);

    return true;
}

/**
 * Create or update a player's statistics by hand.
 *
 * @throws InvalidArgumentException when the Steam ID is missing.
 */
function data_update_player_stats(array $input): void {
    $steamId = trim((string) ($input['steamId'] ?? ''));

    if ($steamId === '') {
        throw new InvalidArgumentException('Steam ID is required');
    }

    $name = trim((string) ($input['name'] ?? '')) ?: 'Unknown';
    $kills = (int) ($input['kills'] ?? 0);
    $deaths = (int) ($input['deaths'] ?? 0);
    $headshots = (int) ($input['headshots'] ?? 0);
    $playtime = (int) ($input['playtime'] ?? 0);

    if (Database::queryOne('SELECT steam_id FROM players WHERE steam_id = ?', [$steamId])) {
        Database::execute(
            'UPDATE players SET name = ?, kills = ?, deaths = ?, headshots = ?, playtime = ?, last_seen = NOW()
             WHERE steam_id = ?',
            [$name, $kills, $deaths, $headshots, $playtime, $steamId]
        );
    } else {
        Database::insert(
            'INSERT INTO players (steam_id, name, kills, deaths, headshots, playtime) VALUES (?, ?, ?, ?, ?, ?)',
            [$steamId, $name, $kills, $deaths, $headshots, $playtime]
        );
    }
}

/**
 * Create or refresh the user record behind a Steam login, and return it.
 */
function data_upsert_steam_user(array $profile): array {
    $steamId = $profile['steamId'];
    $existing = Database::queryOne('SELECT * FROM users WHERE steam_id = ?', [$steamId]);

    if ($existing) {
        Database::execute(
            'UPDATE users SET display_name = ?, avatar_url = ?, last_login = NOW() WHERE steam_id = ?',
            [$profile['displayName'], $profile['avatar'], $steamId]
        );
    } else {
        Database::insert(
            'INSERT INTO users (steam_id, display_name, avatar_url, is_admin) VALUES (?, ?, ?, ?)',
            [
                $steamId,
                $profile['displayName'],
                $profile['avatar'],
                in_array($steamId, ADMIN_STEAM_IDS, true) ? 1 : 0,
            ]
        );
    }

    return Database::queryOne('SELECT * FROM users WHERE steam_id = ?', [$steamId]);
}

/**
 * Look up a user by Steam ID.
 */
function data_find_user(string $steamId): ?array {
    if (!db_available()) {
        return null;
    }

    return Database::queryOne(
        'SELECT steam_id, display_name, avatar_url, is_admin, is_vip, created_at, last_login
         FROM users WHERE steam_id = ?',
        [$steamId]
    );
}
