<?php
/**
 * Steam Server Query
 *
 * Queries Rust servers using the Steam A2S protocol
 * https://developer.valvesoftware.com/wiki/Server_queries
 */

if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

class SteamQuery {
    private string $ip;
    private int $port;
    private int $timeout;
    private $socket = null;

    // A2S Query constants
    private const A2S_INFO = "\xFF\xFF\xFF\xFF\x54Source Engine Query\x00";
    private const A2S_PLAYER = "\xFF\xFF\xFF\xFF\x55";
    private const A2S_RULES = "\xFF\xFF\xFF\xFF\x56";

    public function __construct(string $ip, int $port, int $timeout = 3) {
        $this->ip = $ip;
        $this->port = $port;
        $this->timeout = $timeout;
    }

    /**
     * Get server information
     */
    public function getInfo(): ?array {
        try {
            $this->connect();
            $this->send(self::A2S_INFO);
            $response = $this->receive();
            $this->disconnect();

            if ($response === null) {
                return null;
            }

            return $this->parseInfoResponse($response);
        } catch (Exception $e) {
            error_log('Steam Query Error: ' . $e->getMessage());
            $this->disconnect();
            return null;
        }
    }

    /**
     * Connect to server
     */
    private function connect(): void {
        $this->socket = @fsockopen(
            'udp://' . $this->ip,
            $this->port,
            $errno,
            $errstr,
            $this->timeout
        );

        if (!$this->socket) {
            throw new Exception("Failed to connect: $errstr ($errno)");
        }

        stream_set_timeout($this->socket, $this->timeout);
    }

    /**
     * Send data to server
     */
    private function send(string $data): void {
        fwrite($this->socket, $data);
    }

    /**
     * Receive data from server
     */
    private function receive(): ?string {
        $response = fread($this->socket, 4096);

        if ($response === false || strlen($response) < 5) {
            return null;
        }

        // Check if this is a challenge response
        if (ord($response[4]) === 0x41) {
            // Server sent a challenge, resend with challenge number
            $challenge = substr($response, 5, 4);
            $this->send(self::A2S_INFO . $challenge);
            $response = fread($this->socket, 4096);
        }

        return $response;
    }

    /**
     * Disconnect from server
     */
    private function disconnect(): void {
        if ($this->socket) {
            fclose($this->socket);
            $this->socket = null;
        }
    }

    /**
     * Parse A2S_INFO response
     */
    private function parseInfoResponse(string $data): ?array {
        // Skip header (4 bytes) and type (1 byte)
        $pos = 5;

        // Check response type
        $type = ord($data[4]);

        if ($type === 0x49) {
            // Source Engine Response
            return $this->parseSourceResponse($data, $pos);
        } elseif ($type === 0x6D) {
            // GoldSource Response (older)
            return $this->parseGoldSourceResponse($data, $pos);
        }

        return null;
    }

    /**
     * Parse Source Engine response
     */
    private function parseSourceResponse(string $data, int $pos): array {
        // Protocol version
        $protocol = ord($data[$pos++]);

        // Server name
        $name = $this->readString($data, $pos);

        // Map
        $map = $this->readString($data, $pos);

        // Folder
        $folder = $this->readString($data, $pos);

        // Game
        $game = $this->readString($data, $pos);

        // Steam App ID
        $appId = $this->readShort($data, $pos);

        // Players
        $players = ord($data[$pos++]);

        // Max Players
        $maxPlayers = ord($data[$pos++]);

        // Bots
        $bots = ord($data[$pos++]);

        // Server type
        $serverType = $data[$pos++];

        // Environment
        $environment = $data[$pos++];

        // Visibility (password)
        $visibility = ord($data[$pos++]);

        // VAC
        $vac = ord($data[$pos++]);

        // Parse keywords for queue info (Rust-specific)
        $queue = 0;
        if (isset($data[$pos]) && strlen($data) > $pos + 10) {
            // Try to find keywords which may contain queue info
            $remaining = substr($data, $pos);
            if (preg_match('/cp(\d+)/', $remaining, $matches)) {
                $queue = (int) $matches[1];
            }
        }

        return [
            'name' => $name,
            'map' => $map,
            'game' => $game,
            'players' => $players,
            'maxPlayers' => $maxPlayers,
            'bots' => $bots,
            'queue' => $queue,
            'vac' => (bool) $vac,
            'password' => (bool) $visibility,
            'online' => true
        ];
    }

    /**
     * Parse GoldSource response (fallback)
     */
    private function parseGoldSourceResponse(string $data, int $pos): array {
        // Address
        $address = $this->readString($data, $pos);

        // Name
        $name = $this->readString($data, $pos);

        // Map
        $map = $this->readString($data, $pos);

        // Folder
        $folder = $this->readString($data, $pos);

        // Game
        $game = $this->readString($data, $pos);

        // Players
        $players = ord($data[$pos++]);

        // Max Players
        $maxPlayers = ord($data[$pos++]);

        // Protocol
        $protocol = ord($data[$pos++]);

        return [
            'name' => $name,
            'map' => $map,
            'game' => $game,
            'players' => $players,
            'maxPlayers' => $maxPlayers,
            'bots' => 0,
            'queue' => 0,
            'vac' => false,
            'password' => false,
            'online' => true
        ];
    }

    /**
     * Read null-terminated string
     */
    private function readString(string $data, int &$pos): string {
        $str = '';
        while ($pos < strlen($data) && $data[$pos] !== "\x00") {
            $str .= $data[$pos++];
        }
        $pos++; // Skip null terminator
        return $str;
    }

    /**
     * Read short (2 bytes, little endian)
     */
    private function readShort(string $data, int &$pos): int {
        $val = unpack('v', substr($data, $pos, 2))[1];
        $pos += 2;
        return $val;
    }

    /**
     * Read long (4 bytes, little endian)
     */
    private function readLong(string $data, int &$pos): int {
        $val = unpack('V', substr($data, $pos, 4))[1];
        $pos += 4;
        return $val;
    }
}
