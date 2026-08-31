<?php
/**
 * Art of Rust - Session authentication
 *
 * Steam OpenID sign-in backed by a PHP session cookie. Only the Steam ID is
 * kept in the session; the profile and privilege flags are read from the
 * database on each request, so promoting or demoting an admin takes effect
 * immediately rather than when their token happens to expire.
 */

if (!defined('AOR_APP')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

class Auth {
    private static ?array $cached = null;
    private static bool $loaded = false;

    /**
     * Start the session with hardened cookie settings.
     */
    public static function startSession(): void {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';

        session_name(SESSION_NAME);
        session_set_cookie_params([
            'lifetime' => SESSION_LIFETIME,
            'path' => '/',
            'secure' => $secure,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        session_start();
    }

    /**
     * The signed-in user, or null. Cached for the life of the request.
     */
    public static function user(): ?array {
        if (self::$loaded) {
            return self::$cached;
        }

        self::$loaded = true;
        self::$cached = null;

        $steamId = $_SESSION['steam_id'] ?? null;
        if (!$steamId) {
            return null;
        }

        $user = data_find_user((string) $steamId);
        if (!$user) {
            // The account was deleted, or the database is unreachable.
            return null;
        }

        self::$cached = [
            'steamId' => $user['steam_id'],
            'displayName' => $user['display_name'],
            'avatarUrl' => $user['avatar_url'],
            'isAdmin' => (bool) $user['is_admin'],
            'isVip' => (bool) $user['is_vip'],
            'createdAt' => $user['created_at'],
            'lastLogin' => $user['last_login'],
        ];

        return self::$cached;
    }

    public static function check(): bool {
        return self::user() !== null;
    }

    public static function isAdmin(): bool {
        $user = self::user();

        return $user !== null && $user['isAdmin'];
    }

    /**
     * Establish a session for a Steam ID, rotating the session id to close off
     * session fixation.
     */
    public static function login(string $steamId): void {
        session_regenerate_id(true);
        $_SESSION['steam_id'] = $steamId;
        self::$loaded = false;
        self::$cached = null;
    }

    /**
     * Destroy the session and its cookie.
     */
    public static function logout(): void {
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', [
                'expires' => time() - 42000,
                'path' => $params['path'],
                'domain' => $params['domain'],
                'secure' => $params['secure'],
                'httponly' => $params['httponly'],
                'samesite' => 'Lax',
            ]);
        }

        session_destroy();
        self::$loaded = true;
        self::$cached = null;
    }

    /**
     * Send anonymous visitors to the login page, remembering where they were
     * headed.
     */
    public static function requireLogin(): array {
        $user = self::user();

        if (!$user) {
            $_SESSION['intended'] = $_SERVER['REQUEST_URI'] ?? '/';
            redirect('/login');
        }

        return $user;
    }

    /**
     * Admin-only pages. Anonymous visitors get the login page; signed-in
     * non-admins get sent home rather than told an admin area exists.
     */
    public static function requireAdmin(): array {
        $user = self::requireLogin();

        if (!$user['isAdmin']) {
            redirect('/');
        }

        return $user;
    }

    /**
     * Where Steam should send the user after they approve the login.
     */
    public static function steamReturnUrl(): string {
        return SITE_URL . '/auth/steam/callback';
    }
}
