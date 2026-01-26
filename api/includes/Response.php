<?php
/**
 * API Response Helper
 *
 * Standardizes JSON API responses
 */

if (!defined('AOR_API')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

class Response {
    /**
     * Send a JSON response and exit
     */
    public static function json($data, int $statusCode = 200): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    /**
     * Send a success response
     */
    public static function success($data = null, string $message = 'Success'): void {
        self::json($data ?? ['success' => true, 'message' => $message]);
    }

    /**
     * Send an error response
     */
    public static function error(string $message, int $statusCode = 400, $details = null): void {
        $response = ['error' => $message];
        if ($details !== null) {
            $response['details'] = $details;
        }
        self::json($response, $statusCode);
    }

    /**
     * Send a 404 Not Found response
     */
    public static function notFound(string $message = 'Resource not found'): void {
        self::error($message, 404);
    }

    /**
     * Send a 401 Unauthorized response
     */
    public static function unauthorized(string $message = 'Authentication required'): void {
        self::error($message, 401);
    }

    /**
     * Send a 403 Forbidden response
     */
    public static function forbidden(string $message = 'Access denied'): void {
        self::error($message, 403);
    }

    /**
     * Send a 500 Internal Server Error response
     */
    public static function serverError(string $message = 'Internal server error'): void {
        self::error($message, 500);
    }

    /**
     * Send a 405 Method Not Allowed response
     */
    public static function methodNotAllowed(array $allowedMethods = ['GET']): void {
        header('Allow: ' . implode(', ', $allowedMethods));
        self::error('Method not allowed', 405);
    }
}
