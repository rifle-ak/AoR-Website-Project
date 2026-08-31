<?php
/**
 * Art of Rust - Front controller
 *
 * Every non-file request lands here (see .htaccess) and is dispatched to a page
 * or an action. Pure PHP: there is nothing to compile, so the repository can be
 * deployed to public_html as-is.
 */

require_once __DIR__ . '/app/bootstrap.php';

$path = current_path();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$isPost = $method === 'POST';

try {
    switch (true) {

        // =====================================================================
        // AUTHENTICATION
        // =====================================================================

        case $path === '/auth/steam':
            header('Location: ' . SteamAuth::getLoginUrl(Auth::steamReturnUrl()));
            exit;

        case $path === '/auth/steam/callback':
            require_once APP_PATH . '/actions/auth.php';
            handle_steam_callback();
            break;

        case $path === '/logout' && $isPost:
            csrf_verify();
            Auth::logout();
            Auth::startSession();
            flash('success', 'You have been signed out.');
            redirect('/');
            break;

        // =====================================================================
        // PUBLIC PAGES
        // =====================================================================

        case $path === '/':
            render_page('home', [
                'status' => data_server_status(),
                'schedule' => data_wipe_schedule(),
            ]);
            break;

        case $path === '/commands':
            render_page('commands', ['search' => query('q')], [
                'title' => 'Server Commands',
                'description' => 'Complete list of Rust server commands available on Art of Rust servers. Find commands for teleportation, economy, clan system, and admin features.',
                'keywords' => 'rust commands, server commands, rust admin commands, rust economy, rust teleportation, clan commands',
            ]);
            break;

        case $path === '/gallery':
            render_page('gallery', ['category' => query('category', 'all')], [
                'title' => 'Community Gallery',
                'description' => 'Amazing screenshots and moments captured by the Art of Rust community. Browse bases, raids, events, and epic Rust gameplay moments.',
                'keywords' => 'rust gallery, rust screenshots, rust bases, rust raids, rust events, gaming gallery',
            ]);
            break;

        case $path === '/leaderboards':
            if (!ENABLE_LEADERBOARDS) {
                render_not_found();
            }
            render_page('leaderboards', [
                'board' => data_leaderboards(query('category', 'kills'), 100),
                'search' => query('q'),
            ], [
                'title' => 'Leaderboards',
                'description' => 'Check out the top players on Art of Rust. View player statistics, rankings, and achievements.',
            ]);
            break;

        case $path === '/wipe-schedule':
            render_page('wipe-schedule', ['schedule' => data_wipe_schedule()], [
                'title' => 'Wipe Schedule',
                'description' => 'View the wipe schedule for Art of Rust servers. Stay updated on upcoming map and blueprint wipes.',
            ]);
            break;

        case $path === '/news':
            render_page('news', ['posts' => data_news(20)], [
                'title' => 'News & Updates',
                'description' => 'Stay updated with the latest news, announcements, and events from Art of Rust.',
            ]);
            break;

        case $path === '/rules':
            render_page('rules', [], [
                'title' => 'Server Rules & Information',
                'description' => 'Read the official Art of Rust server rules, rates, and information. Follow these guidelines for the best gaming experience.',
            ]);
            break;

        case $path === '/login':
            if (Auth::check()) {
                redirect('/profile');
            }
            require_once APP_PATH . '/actions/auth.php';
            $form = $isPost ? handle_login_post() : login_form_state();
            render_page('login', $form, [
                'title' => $form['mode'] === 'register' ? 'Create Account' : 'Sign In',
                'description' => 'Sign in to your Art of Rust account to access member features, track your stats, and manage your profile.',
            ]);
            break;

        // =====================================================================
        // MEMBER PAGES
        // =====================================================================

        case $path === '/profile':
            $user = Auth::requireLogin();
            render_page('profile', [
                'user' => $user,
                'stats' => data_player_stats($user['steamId']),
            ], [
                'title' => $user['displayName'] . "'s Profile",
                'description' => 'View ' . $user['displayName'] . "'s player statistics and profile on Art of Rust.",
            ]);
            break;

        // =====================================================================
        // ADMIN
        // =====================================================================

        case $path === '/admin':
            Auth::requireAdmin();
            render_page('admin/dashboard', ['dashboard' => data_dashboard_stats()], [
                'title' => 'Admin Dashboard',
                'description' => 'Art of Rust server administration dashboard',
            ]);
            break;

        case $path === '/admin/news':
            Auth::requireAdmin();
            require_once APP_PATH . '/actions/admin.php';
            if ($isPost) {
                handle_admin_news_post();
            }
            render_page('admin/news', [
                'posts' => data_news(100, true),
                'editing' => admin_news_editing(),
            ], ['title' => 'News Management', 'description' => 'Manage news and announcements']);
            break;

        case $path === '/admin/users':
            Auth::requireAdmin();
            require_once APP_PATH . '/actions/admin.php';
            if ($isPost) {
                handle_admin_users_post();
            }
            render_page('admin/users', [
                'users' => data_users(),
                'search' => query('q'),
            ], ['title' => 'User Management', 'description' => 'Manage users and permissions']);
            break;

        case $path === '/admin/wipes':
            Auth::requireAdmin();
            require_once APP_PATH . '/actions/admin.php';
            if ($isPost) {
                handle_admin_wipes_post();
            }
            render_page('admin/wipes', ['wipes' => data_all_wipes()], [
                'title' => 'Wipe Management',
                'description' => 'Manage server wipes and schedule',
            ]);
            break;

        // =====================================================================
        // 404
        // =====================================================================

        default:
            render_not_found();
    }
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    http_response_code(503);
    render_page('error', ['message' => 'The database is temporarily unavailable. Please try again in a moment.'], [
        'title' => 'Service Unavailable',
    ]);
} catch (Throwable $e) {
    error_log('Site error: ' . $e->getMessage());
    http_response_code(500);
    render_page('error', ['message' => 'Something went wrong on our end. Please try again.'], [
        'title' => 'Something Went Wrong',
    ]);
}
