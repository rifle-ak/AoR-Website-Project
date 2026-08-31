<?php
/**
 * API authentication routes.
 *
 * The website itself signs users in with a session cookie (see app/Auth.php).
 * These routes exist for programmatic clients - a server-side plugin pushing
 * player statistics, for instance - which authenticate with a bearer token
 * instead.
 */

if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

/**
 * GET /api/auth/steam/callback
 *
 * Completes Steam OpenID and returns a bearer token as JSON rather than
 * redirecting, since the caller here is a client, not a browser session.
 */
function handleSteamCallback(): void {
    $steamId = SteamAuth::validate();

    if (!$steamId) {
        Response::unauthorized('Steam authentication failed');
    }

    $profile = SteamAuth::getUserProfile($steamId);
    $user = data_upsert_steam_user($profile);

    $token = JWT::create([
        'id' => $user['steam_id'],
        'steamId' => $user['steam_id'],
        'displayName' => $user['display_name'],
        'isAdmin' => (bool) $user['is_admin'],
    ]);

    Response::json([
        'token' => $token,
        'expiresIn' => JWT_EXPIRY,
        'user' => [
            'steamId' => $user['steam_id'],
            'displayName' => $user['display_name'],
            'avatarUrl' => $user['avatar_url'],
            'isAdmin' => (bool) $user['is_admin'],
            'isVip' => (bool) $user['is_vip'],
        ],
    ]);
}

/**
 * GET /api/auth/me
 */
function getCurrentUser(): void {
    $token = JWT::requireAuth();
    $user = data_find_user($token['steamId']);

    if (!$user) {
        Response::notFound('User not found');
    }

    Response::json([
        'id' => $user['steam_id'],
        'steamId' => $user['steam_id'],
        'displayName' => $user['display_name'],
        'avatarUrl' => $user['avatar_url'],
        'isAdmin' => (bool) $user['is_admin'],
        'isVip' => (bool) $user['is_vip'],
        'createdAt' => $user['created_at'],
        'lastLogin' => $user['last_login'],
    ]);
}

/**
 * POST /api/auth/logout
 *
 * Bearer tokens are stateless, so the client simply discards its token. The
 * endpoint exists so callers have something to call.
 */
function logout(): void {
    Response::success(null, 'Logged out successfully');
}
