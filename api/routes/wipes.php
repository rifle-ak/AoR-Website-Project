<?php
/**
 * Wipe Schedule Routes
 *
 * Handles wipe schedule management
 */

if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

/**
 * Get wipe schedule
 */
function getWipeSchedule(): void {
    // Get next upcoming wipe
    $nextWipe = Database::queryOne(
        'SELECT * FROM wipes WHERE completed = 0 AND date > NOW() ORDER BY date ASC LIMIT 1'
    );

    // Get all upcoming wipes
    $upcomingWipes = Database::query(
        'SELECT * FROM wipes WHERE completed = 0 AND date > NOW() ORDER BY date ASC LIMIT 5'
    );

    // Get wipe history
    $history = Database::query(
        'SELECT * FROM wipes WHERE completed = 1 ORDER BY date DESC LIMIT 10'
    );

    // Format response
    $formatWipe = function($wipe) {
        if (!$wipe) return null;
        return [
            'id' => (int) $wipe['id'],
            'type' => $wipe['type'],
            'date' => $wipe['date'],
            'mapSize' => $wipe['map_size'] ? (int) $wipe['map_size'] : null,
            'mapSeed' => $wipe['map_seed'],
            'notes' => $wipe['notes'],
            'completed' => (bool) $wipe['completed']
        ];
    };

    Response::json([
        'next' => $formatWipe($nextWipe),
        'upcoming' => array_map($formatWipe, $upcomingWipes),
        'history' => array_map($formatWipe, $history)
    ]);
}

/**
 * Create a new wipe (admin only)
 */
function createWipe(array $input): void {
    JWT::requireAdmin();

    // Validate input
    if (empty($input['type']) || empty($input['date'])) {
        Response::error('Type and date are required', 400);
    }

    $validTypes = ['full', 'map', 'bp'];
    if (!in_array($input['type'], $validTypes)) {
        Response::error('Invalid wipe type. Must be: full, map, or bp', 400);
    }

    // Validate date
    $date = strtotime($input['date']);
    if (!$date) {
        Response::error('Invalid date format', 400);
    }

    $id = Database::insert(
        'INSERT INTO wipes (type, date, map_size, map_seed, notes) VALUES (?, ?, ?, ?, ?)',
        [
            $input['type'],
            date('Y-m-d H:i:s', $date),
            $input['map_size'] ?? null,
            $input['map_seed'] ?? null,
            $input['notes'] ?? null
        ]
    );

    Response::json([
        'id' => $id,
        'type' => $input['type'],
        'date' => date('c', $date),
        'mapSize' => $input['map_size'] ?? null,
        'mapSeed' => $input['map_seed'] ?? null,
        'notes' => $input['notes'] ?? null,
        'completed' => false
    ], 201);
}

/**
 * Mark a wipe as completed (admin only)
 */
function completeWipe(int $id): void {
    JWT::requireAdmin();

    $wipe = Database::queryOne('SELECT * FROM wipes WHERE id = ?', [$id]);

    if (!$wipe) {
        Response::notFound('Wipe not found');
    }

    Database::execute('UPDATE wipes SET completed = 1 WHERE id = ?', [$id]);

    Response::success(null, 'Wipe marked as completed');
}
