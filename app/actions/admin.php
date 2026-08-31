<?php
/**
 * Art of Rust - Admin actions
 *
 * Form handlers for the admin pages. Each verifies the CSRF token, applies the
 * change through the data layer, then redirects so a refresh cannot repeat the
 * write.
 */

if (!defined('AOR_APP')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

/**
 * Create, update, publish or delete a news post.
 */
function handle_admin_news_post(): void {
    csrf_verify();
    $user = Auth::requireAdmin();
    $action = input('action');

    try {
        switch ($action) {
            case 'create':
                data_create_news([
                    'title' => input('title'),
                    'content' => input('content'),
                    'excerpt' => input('excerpt'),
                    'published' => input_bool('published'),
                ], $user['steamId']);
                flash('success', 'News post created.');
                break;

            case 'update':
                $id = (int) input('id');
                $updated = data_update_news($id, [
                    'title' => input('title'),
                    'content' => input('content'),
                    'excerpt' => input('excerpt'),
                    'published' => input_bool('published'),
                ]);
                flash($updated ? 'success' : 'error', $updated ? 'News post updated.' : 'That post no longer exists.');
                break;

            case 'toggle':
                $id = (int) input('id');
                $updated = data_update_news($id, ['published' => input_bool('published')]);
                flash($updated ? 'success' : 'error', $updated ? 'Post visibility updated.' : 'That post no longer exists.');
                break;

            case 'delete':
                $id = (int) input('id');
                $deleted = data_delete_news($id);
                flash($deleted ? 'success' : 'error', $deleted ? 'News post deleted.' : 'That post no longer exists.');
                break;

            default:
                flash('error', 'Unknown action.');
        }
    } catch (InvalidArgumentException $e) {
        flash('error', $e->getMessage());
    }

    redirect('/admin/news');
}

/**
 * The post being edited, when the page was opened with ?edit=<id>.
 */
function admin_news_editing(): ?array {
    $id = (int) query('edit');

    if ($id <= 0 || !db_available()) {
        return null;
    }

    $post = Database::queryOne('SELECT * FROM news WHERE id = ?', [$id]);

    return $post ? format_news($post) : null;
}

/**
 * Grant or revoke admin and VIP.
 */
function handle_admin_users_post(): void {
    csrf_verify();
    $current = Auth::requireAdmin();

    $steamId = input('steam_id');
    $role = input('role');
    $value = input_bool('value');

    if ($role === 'admin' && $steamId === $current['steamId']) {
        flash('error', 'You cannot change your own admin status.');
        redirect('/admin/users');
    }

    if (!in_array($role, ['admin', 'vip'], true)) {
        flash('error', 'Unknown role.');
        redirect('/admin/users');
    }

    try {
        $updated = data_update_user_privileges(
            $steamId,
            $role === 'admin' ? ['isAdmin' => $value] : ['isVip' => $value]
        );
        flash(
            $updated ? 'success' : 'error',
            $updated ? 'User privileges updated.' : 'That user no longer exists.'
        );
    } catch (InvalidArgumentException $e) {
        flash('error', $e->getMessage());
    }

    redirect('/admin/users');
}

/**
 * Schedule a wipe or mark one complete.
 */
function handle_admin_wipes_post(): void {
    csrf_verify();
    Auth::requireAdmin();
    $action = input('action');

    try {
        switch ($action) {
            case 'create':
                data_create_wipe([
                    'type' => input('type'),
                    'date' => input('date'),
                    'map_size' => input('map_size'),
                    'map_seed' => input('map_seed'),
                    'notes' => input('notes'),
                ]);
                flash('success', 'Wipe scheduled.');
                break;

            case 'complete':
                $id = (int) input('id');
                $done = data_complete_wipe($id);
                flash($done ? 'success' : 'error', $done ? 'Wipe marked complete.' : 'That wipe no longer exists.');
                break;

            default:
                flash('error', 'Unknown action.');
        }
    } catch (InvalidArgumentException $e) {
        flash('error', $e->getMessage());
    }

    redirect('/admin/wipes');
}
