<?php
/**
 * Art of Rust - View and request helpers
 */

if (!defined('AOR_APP')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

// =============================================================================
// COMPATIBILITY
// =============================================================================

// str_contains() arrived in PHP 8.0. Shared hosts still offer 7.4, and nothing
// else here needs a newer runtime, so keep the site working there too.
if (!function_exists('str_contains')) {
    function str_contains(string $haystack, string $needle): bool {
        return $needle === '' || strpos($haystack, $needle) !== false;
    }
}

// =============================================================================
// OUTPUT ESCAPING
// =============================================================================

/**
 * Escape a value for HTML output. Every dynamic string in a template goes
 * through this.
 */
function e($value): string {
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Escape a value for embedding in a JavaScript literal.
 */
function json_attr($value): string {
    return e(json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

// =============================================================================
// ICONS
// =============================================================================

/**
 * Render an inline lucide icon. Sizing comes from the CSS class, matching how
 * the icons were sized before.
 */
function icon(string $name, string $class = 'w-5 h-5', array $attrs = []): string {
    $body = ICON_PATHS[$name] ?? null;

    if ($body === null) {
        return '';
    }

    $extra = '';
    foreach ($attrs as $key => $value) {
        $extra .= ' ' . e($key) . '="' . e($value) . '"';
    }

    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"'
        . ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"'
        . ' stroke-linejoin="round" class="' . e($class) . '" aria-hidden="true"' . $extra . '>'
        . $body . '</svg>';
}

/**
 * The Discord logo, which lucide does not ship.
 */
function discord_icon(string $class = 'w-5 h-5', string $fill = 'currentColor'): string {
    return '<svg class="' . e($class) . '" viewBox="0 0 24 24" fill="' . e($fill) . '" aria-hidden="true">'
        . '<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>'
        . '</svg>';
}

// =============================================================================
// REQUEST AND ROUTING
// =============================================================================

/**
 * The current request path, without query string or trailing slash.
 */
function current_path(): string {
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $path = '/' . trim($path, '/');

    return $path === '/' ? '/' : rtrim($path, '/');
}

/**
 * Whether a nav link points at the page being viewed.
 */
function is_active(string $path): bool {
    return current_path() === $path;
}

/**
 * Send a redirect and stop.
 */
function redirect(string $path, int $status = 302): void {
    // Only ever redirect within this site.
    if (!preg_match('#^/[^/\\\\]#', $path) && $path !== '/') {
        $path = '/';
    }

    header('Location: ' . $path, true, $status);
    exit;
}

/**
 * A query-string value, trimmed, with a default.
 */
function query(string $key, string $default = ''): string {
    $value = $_GET[$key] ?? $default;

    return is_string($value) ? trim($value) : $default;
}

/**
 * A posted value, trimmed, with a default.
 */
function input(string $key, string $default = ''): string {
    $value = $_POST[$key] ?? $default;

    return is_string($value) ? trim($value) : $default;
}

/**
 * Whether a checkbox was ticked.
 */
function input_bool(string $key): bool {
    return !empty($_POST[$key]);
}

// =============================================================================
// CSRF
// =============================================================================

/**
 * The per-session CSRF token, created on first use.
 */
function csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

/**
 * Hidden input carrying the CSRF token.
 */
function csrf_field(): string {
    return '<input type="hidden" name="csrf_token" value="' . e(csrf_token()) . '">';
}

/**
 * Reject a POST whose CSRF token is missing or wrong.
 */
function csrf_verify(): void {
    $token = $_POST['csrf_token'] ?? '';

    if (!is_string($token) || !hash_equals(csrf_token(), $token)) {
        http_response_code(419);
        exit('Your session expired. Go back, reload the page and try again.');
    }
}

// =============================================================================
// FLASH MESSAGES
// =============================================================================

/**
 * Queue a message for the next page load. Type is success | error | info.
 */
function flash(string $type, string $message): void {
    $_SESSION['flash'][] = ['type' => $type, 'message' => $message];
}

/**
 * Take the queued messages, clearing them.
 */
function take_flashes(): array {
    $flashes = $_SESSION['flash'] ?? [];
    unset($_SESSION['flash']);

    return $flashes;
}

// =============================================================================
// FORMATTING
// =============================================================================

/**
 * "January 1, 2026"
 */
function format_date(?string $date): string {
    if (!$date) {
        return '';
    }

    return date('F j, Y', strtotime($date));
}

/**
 * "1/1/2026" - the short form used in list rows.
 */
function format_short_date(?string $date): string {
    if (!$date) {
        return '';
    }

    return date('n/j/Y', strtotime($date));
}

/**
 * "January 1, 2026, 7:00 PM UTC"
 */
function format_datetime(?string $date): string {
    if (!$date) {
        return '';
    }

    return date('F j, Y, g:i A T', strtotime($date));
}

/**
 * "Today", "Tomorrow", "In 3 days", or the full date beyond a week out.
 */
function format_relative_date(?string $date): string {
    if (!$date) {
        return '';
    }

    $days = (int) floor((strtotime($date) - time()) / 86400);

    if ($days === 0) {
        return 'Today';
    }
    if ($days === 1) {
        return 'Tomorrow';
    }
    if ($days > 1 && $days < 7) {
        return "In $days days";
    }

    return format_datetime($date);
}

/**
 * Playtime in hours as "3d 4h" once it passes a day.
 */
function format_playtime(int $hours): string {
    if ($hours >= 24) {
        return floor($hours / 24) . 'd ' . ($hours % 24) . 'h';
    }

    return $hours . 'h';
}

/**
 * Kills/deaths as a ratio, treating a deathless player as their kill count.
 */
function format_kd(int $kills, int $deaths): string {
    return number_format($deaths > 0 ? $kills / $deaths : $kills, 2);
}

/**
 * Human label for a wipe type.
 */
function wipe_type_label(string $type): string {
    return ['full' => 'Full Wipe', 'map' => 'Map Only', 'bp' => 'BP Wipe'][$type] ?? 'Unknown';
}

/**
 * Badge colour class for a wipe type.
 */
function wipe_type_color(string $type): string {
    return ['full' => 'bg-red-500', 'map' => 'bg-yellow-500', 'bp' => 'bg-blue-500'][$type] ?? 'bg-gray-500';
}

// =============================================================================
// VIEWS
// =============================================================================

/**
 * Render a view file and return its output.
 */
function render(string $view, array $data = []): string {
    $file = APP_PATH . '/views/' . $view . '.php';

    if (!is_file($file)) {
        throw new RuntimeException("View not found: $view");
    }

    extract($data, EXTR_SKIP);
    ob_start();
    require $file;

    return (string) ob_get_clean();
}

/**
 * Render a partial straight to the output buffer.
 */
function partial(string $name, array $data = []): void {
    echo render('partials/' . $name, $data);
}

/**
 * Render a page inside the site layout.
 *
 * $meta accepts: title, description, keywords, image, type.
 */
function render_page(string $view, array $data = [], array $meta = []): void {
    $content = render('pages/' . $view, $data);

    echo render('layout', ['content' => $content, 'meta' => $meta]);
}

/**
 * Render the 404 page with the right status code.
 */
function render_not_found(): void {
    http_response_code(404);
    render_page('not-found', [], [
        'title' => 'Page Not Found',
        'description' => "The page you're looking for doesn't exist or has been moved.",
    ]);
    exit;
}

// =============================================================================
// COUNTDOWNS
// =============================================================================

/**
 * Days/hours/minutes/seconds remaining until a date, clamped at zero.
 */
function countdown_parts(?string $date): array {
    $remaining = $date ? max(0, strtotime($date) - time()) : 0;

    return [
        'days' => (int) floor($remaining / 86400),
        'hours' => (int) floor(($remaining % 86400) / 3600),
        'minutes' => (int) floor(($remaining % 3600) / 60),
        'seconds' => $remaining % 60,
    ];
}

/**
 * The compact "3d 4h" form used on the server status card.
 */
function countdown_short(?string $date): string {
    $parts = countdown_parts($date);

    return $parts['days'] . 'd ' . $parts['hours'] . 'h';
}
