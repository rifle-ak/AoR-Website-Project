<?php
/**
 * News Routes
 *
 * Handles news posts and announcements
 */

if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

/**
 * Get all published news
 */
function getNews(): void {
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
    $limit = min(max($limit, 1), 100);

    $news = Database::query(
        'SELECT n.*, u.display_name as author_name, u.avatar_url as author_avatar
         FROM news n
         LEFT JOIN users u ON n.author_steam_id = u.steam_id
         WHERE n.published = 1
         ORDER BY n.created_at DESC
         LIMIT ?',
        [$limit]
    );

    $formattedNews = array_map(function($post) {
        return [
            'id' => (int) $post['id'],
            'title' => $post['title'],
            'content' => $post['content'],
            'excerpt' => $post['excerpt'],
            'author_name' => $post['author_name'] ?? 'Anonymous',
            'author_avatar' => $post['author_avatar'],
            'published' => (bool) $post['published'],
            'created_at' => $post['created_at'],
            'updated_at' => $post['updated_at']
        ];
    }, $news);

    Response::json($formattedNews);
}

/**
 * Get single news post
 */
function getNewsPost(int $id): void {
    $post = Database::queryOne(
        'SELECT n.*, u.display_name as author_name, u.avatar_url as author_avatar
         FROM news n
         LEFT JOIN users u ON n.author_steam_id = u.steam_id
         WHERE n.id = ? AND n.published = 1',
        [$id]
    );

    if (!$post) {
        Response::notFound('News post not found');
    }

    Response::json([
        'id' => (int) $post['id'],
        'title' => $post['title'],
        'content' => $post['content'],
        'excerpt' => $post['excerpt'],
        'author_name' => $post['author_name'] ?? 'Anonymous',
        'author_avatar' => $post['author_avatar'],
        'published' => (bool) $post['published'],
        'created_at' => $post['created_at'],
        'updated_at' => $post['updated_at']
    ]);
}

/**
 * Create news post (admin only)
 */
function createNews(array $input): void {
    $user = JWT::requireAdmin();

    // Validate input
    if (empty($input['title']) || empty($input['content'])) {
        Response::error('Title and content are required', 400);
    }

    $title = trim($input['title']);
    $content = trim($input['content']);
    $excerpt = isset($input['excerpt']) ? trim($input['excerpt']) : substr($content, 0, 150) . '...';
    $published = !empty($input['published']);

    $id = Database::insert(
        'INSERT INTO news (title, content, excerpt, author_steam_id, published) VALUES (?, ?, ?, ?, ?)',
        [
            $title,
            $content,
            $excerpt,
            $user['steamId'],
            $published ? 1 : 0
        ]
    );

    Response::json([
        'id' => $id,
        'title' => $title,
        'content' => $content,
        'excerpt' => $excerpt,
        'published' => $published
    ], 201);
}

/**
 * Update news post (admin only)
 */
function updateNews(int $id, array $input): void {
    JWT::requireAdmin();

    // Check if post exists
    $post = Database::queryOne('SELECT * FROM news WHERE id = ?', [$id]);

    if (!$post) {
        Response::notFound('News post not found');
    }

    // Build update fields
    $updates = [];
    $params = [];

    if (isset($input['title'])) {
        $updates[] = 'title = ?';
        $params[] = trim($input['title']);
    }

    if (isset($input['content'])) {
        $updates[] = 'content = ?';
        $params[] = trim($input['content']);
    }

    if (isset($input['excerpt'])) {
        $updates[] = 'excerpt = ?';
        $params[] = trim($input['excerpt']);
    }

    if (isset($input['published'])) {
        $updates[] = 'published = ?';
        $params[] = $input['published'] ? 1 : 0;
    }

    if (empty($updates)) {
        Response::error('No fields to update', 400);
    }

    $updates[] = 'updated_at = NOW()';
    $params[] = $id;

    Database::execute(
        'UPDATE news SET ' . implode(', ', $updates) . ' WHERE id = ?',
        $params
    );

    Response::success(null, 'News post updated');
}

/**
 * Delete news post (admin only)
 */
function deleteNews(int $id): void {
    JWT::requireAdmin();

    // Check if post exists
    $post = Database::queryOne('SELECT * FROM news WHERE id = ?', [$id]);

    if (!$post) {
        Response::notFound('News post not found');
    }

    Database::execute('DELETE FROM news WHERE id = ?', [$id]);

    Response::success(null, 'News post deleted');
}
