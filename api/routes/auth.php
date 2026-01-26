<?php
/**
 * Authentication Routes
 *
 * Handles Steam OpenID authentication
 */

if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

/**
 * Handle Steam OpenID callback
 */
function handleSteamCallback(): void {
    // Validate Steam OpenID response
    $steamId = SteamAuth::validate();

    if (!$steamId) {
        // Redirect to frontend with error
        header('Location: ' . SITE_URL . '?error=auth_failed');
        exit;
    }

    // Get user profile from Steam
    $profile = SteamAuth::getUserProfile($steamId);

    // Check if user exists in database
    $user = Database::queryOne(
        'SELECT * FROM users WHERE steam_id = ?',
        [$steamId]
    );

    // Check if this Steam ID should be auto-admin
    $isAutoAdmin = in_array($steamId, ADMIN_STEAM_IDS);

    if (!$user) {
        // Create new user
        Database::insert(
            'INSERT INTO users (steam_id, display_name, avatar_url, is_admin) VALUES (?, ?, ?, ?)',
            [
                $steamId,
                $profile['displayName'],
                $profile['avatar'],
                $isAutoAdmin ? 1 : 0
            ]
        );

        $user = Database::queryOne(
            'SELECT * FROM users WHERE steam_id = ?',
            [$steamId]
        );
    } else {
        // Update existing user
        Database::execute(
            'UPDATE users SET display_name = ?, avatar_url = ?, last_login = NOW() WHERE steam_id = ?',
            [
                $profile['displayName'],
                $profile['avatar'],
                $steamId
            ]
        );

        // Refresh user data
        $user = Database::queryOne(
            'SELECT * FROM users WHERE steam_id = ?',
            [$steamId]
        );
    }

    // Generate JWT token
    $token = JWT::create([
        'id' => $user['steam_id'],
        'steamId' => $user['steam_id'],
        'displayName' => $user['display_name'],
        'isAdmin' => (bool) $user['is_admin']
    ]);

    // Redirect to frontend with token
    header('Location: ' . SITE_URL . '?token=' . urlencode($token));
    exit;
}

/**
 * Get current authenticated user
 */
function getCurrentUser(): void {
    $user = JWT::requireAuth();

    // Get fresh user data from database
    $dbUser = Database::queryOne(
        'SELECT steam_id, display_name, avatar_url, is_admin, is_vip, created_at, last_login FROM users WHERE steam_id = ?',
        [$user['steamId']]
    );

    if (!$dbUser) {
        Response::notFound('User not found');
    }

    Response::json([
        'id' => $dbUser['steam_id'],
        'steamId' => $dbUser['steam_id'],
        'displayName' => $dbUser['display_name'],
        'avatarUrl' => $dbUser['avatar_url'],
        'isAdmin' => (bool) $dbUser['is_admin'],
        'isVip' => (bool) $dbUser['is_vip'],
        'createdAt' => $dbUser['created_at'],
        'lastLogin' => $dbUser['last_login']
    ]);
}

/**
 * Logout (client-side token removal)
 */
function logout(): void {
    // JWT tokens are stateless, so logout is handled client-side
    // This endpoint exists for API consistency
    Response::success(null, 'Logged out successfully');
}
