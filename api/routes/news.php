<?php
/**
 * News routes.
 *
 * Thin JSON wrappers over the shared data layer in app/Data.php.
 */

if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

/**
 * GET /api/news?limit=10 - published posts; admins also see drafts.
 */
function getNews(): void {
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
    $viewer = JWT::getAuthUser();

    Response::json(data_news($limit, !empty($viewer['isAdmin'])));
}

/**
 * GET /api/news/{id}
 */
function getNewsPost(int $id): void {
    $post = data_news_post($id);

    if (!$post) {
        Response::notFound('News post not found');
    }

    Response::json($post);
}

/**
 * POST /api/news (admin)
 */
function createNews(array $input): void {
    $user = JWT::requireAdmin();

    try {
        $id = data_create_news($input, $user['steamId']);
    } catch (InvalidArgumentException $e) {
        Response::error($e->getMessage(), 400);
        return;
    }

    Response::json(data_news_post($id) ?? ['id' => $id], 201);
}

/**
 * PUT /api/news/{id} (admin)
 */
function updateNews(int $id, array $input): void {
    JWT::requireAdmin();

    try {
        $updated = data_update_news($id, $input);
    } catch (InvalidArgumentException $e) {
        Response::error($e->getMessage(), 400);
        return;
    }

    if (!$updated) {
        Response::notFound('News post not found');
    }

    Response::success(null, 'News post updated');
}

/**
 * DELETE /api/news/{id} (admin)
 */
function deleteNews(int $id): void {
    JWT::requireAdmin();

    if (!data_delete_news($id)) {
        Response::notFound('News post not found');
    }

    Response::success(null, 'News post deleted');
}
