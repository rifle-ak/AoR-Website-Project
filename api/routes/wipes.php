<?php
/**
 * Wipe schedule routes.
 *
 * Thin JSON wrappers over the shared data layer in app/Data.php.
 */

if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

/**
 * GET /api/wipes/schedule
 */
function getWipeSchedule(): void {
    Response::json(data_wipe_schedule());
}

/**
 * POST /api/wipes (admin)
 */
function createWipe(array $input): void {
    JWT::requireAdmin();

    try {
        $id = data_create_wipe($input);
    } catch (InvalidArgumentException $e) {
        Response::error($e->getMessage(), 400);
        return;
    }

    Response::json(format_wipe(Database::queryOne('SELECT * FROM wipes WHERE id = ?', [$id])), 201);
}

/**
 * POST /api/wipes/{id}/complete (admin)
 */
function completeWipe(int $id): void {
    JWT::requireAdmin();

    if (!data_complete_wipe($id)) {
        Response::notFound('Wipe not found');
    }

    Response::success(null, 'Wipe marked as completed');
}
