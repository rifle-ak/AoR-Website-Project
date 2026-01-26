<?php
/**
 * Steam OpenID Authentication
 *
 * Handles Steam login using OpenID 2.0
 */

if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

class SteamAuth {
    private const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login';
    private const STEAM_API_URL = 'https://api.steampowered.com';

    /**
     * Get the Steam login URL
     */
    public static function getLoginUrl(string $returnUrl): string {
        $params = [
            'openid.ns' => 'http://specs.openid.net/auth/2.0',
            'openid.mode' => 'checkid_setup',
            'openid.return_to' => $returnUrl,
            'openid.realm' => self::getRealm($returnUrl),
            'openid.identity' => 'http://specs.openid.net/auth/2.0/identifier_select',
            'openid.claimed_id' => 'http://specs.openid.net/auth/2.0/identifier_select',
        ];

        return self::STEAM_OPENID_URL . '?' . http_build_query($params);
    }

    /**
     * Validate the OpenID response and extract Steam ID
     */
    public static function validate(): ?string {
        // Check if we have the required OpenID response parameters
        if (empty($_GET['openid_assoc_handle']) || empty($_GET['openid_signed']) || empty($_GET['openid_sig'])) {
            return null;
        }

        // Build verification request
        $params = [
            'openid.assoc_handle' => $_GET['openid_assoc_handle'],
            'openid.signed' => $_GET['openid_signed'],
            'openid.sig' => $_GET['openid_sig'],
            'openid.ns' => 'http://specs.openid.net/auth/2.0',
            'openid.mode' => 'check_authentication',
        ];

        // Add all signed parameters
        $signed = explode(',', $_GET['openid_signed']);
        foreach ($signed as $item) {
            $key = 'openid_' . str_replace('.', '_', $item);
            if (isset($_GET[$key])) {
                $params['openid.' . $item] = $_GET[$key];
            }
        }

        // Verify with Steam
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => 'Content-Type: application/x-www-form-urlencoded',
                'content' => http_build_query($params),
                'timeout' => 10,
            ]
        ]);

        $response = @file_get_contents(self::STEAM_OPENID_URL, false, $context);

        if ($response === false || strpos($response, 'is_valid:true') === false) {
            error_log('Steam OpenID validation failed');
            return null;
        }

        // Extract Steam ID from claimed_id
        $claimedId = $_GET['openid_claimed_id'] ?? '';
        if (preg_match('/^https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/', $claimedId, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Get Steam user profile using Steam API
     */
    public static function getUserProfile(string $steamId): ?array {
        if (empty(STEAM_API_KEY) || STEAM_API_KEY === 'your_steam_api_key_here') {
            // Return basic info if no API key
            return [
                'steamId' => $steamId,
                'displayName' => 'Steam User',
                'avatar' => ''
            ];
        }

        $url = self::STEAM_API_URL . '/ISteamUser/GetPlayerSummaries/v0002/?' . http_build_query([
            'key' => STEAM_API_KEY,
            'steamids' => $steamId
        ]);

        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
            ]
        ]);

        $response = @file_get_contents($url, false, $context);

        if ($response === false) {
            error_log('Failed to fetch Steam profile for: ' . $steamId);
            return [
                'steamId' => $steamId,
                'displayName' => 'Steam User',
                'avatar' => ''
            ];
        }

        $data = json_decode($response, true);
        $player = $data['response']['players'][0] ?? null;

        if (!$player) {
            return [
                'steamId' => $steamId,
                'displayName' => 'Steam User',
                'avatar' => ''
            ];
        }

        return [
            'steamId' => $player['steamid'],
            'displayName' => $player['personaname'],
            'avatar' => $player['avatarfull'] ?? $player['avatarmedium'] ?? $player['avatar'] ?? ''
        ];
    }

    /**
     * Get realm from return URL
     */
    private static function getRealm(string $url): string {
        $parsed = parse_url($url);
        return $parsed['scheme'] . '://' . $parsed['host'] . (isset($parsed['port']) ? ':' . $parsed['port'] : '');
    }
}
