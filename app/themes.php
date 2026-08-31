<?php
/**
 * Art of Rust - Theme definitions
 *
 * Each theme is a set of CSS custom properties written onto <html> when the page
 * is rendered, so the chosen theme is already applied on first paint - no
 * flash of the default palette while JavaScript boots.
 */

if (!defined('AOR_APP')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

const THEMES = [
    'rust' => [
        'name' => 'Rust',
        'description' => 'Official Rust game theme with post-apocalyptic aesthetics',
        'colors' => [
            'primary' => [
                50 => '#fef7ed', 100 => '#fdedd3', 200 => '#fbd8a5', 300 => '#f8bc6d',
                400 => '#f59446', 500 => '#f37320', 600 => '#e45a16', 700 => '#bd4315',
                800 => '#973618', 900 => '#7b2e16',
            ],
            'background' => ['main' => '#0f172a', 'secondary' => '#1e293b', 'tertiary' => '#0a0e1a'],
            'surface' => ['main' => '#1e293b', 'secondary' => '#334155', 'hover' => '#475569', 'border' => '#475569'],
            'text' => [
                'primary' => '#f8fafc', 'secondary' => '#cbd5e1', 'tertiary' => '#94a3b8',
                'disabled' => '#64748b', 'inverse' => '#0f172a',
            ],
            'status' => ['success' => '#22c55e', 'warning' => '#eab308', 'error' => '#ef4444', 'info' => '#3b82f6'],
        ],
        'effects' => [
            'shadow' => '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
            'borderRadius' => '0.5rem',
            'glowColor' => 'rgba(243, 115, 32, 0.2)',
        ],
    ],
    'dark' => [
        'name' => 'Dark',
        'description' => 'Clean and modern dark theme',
        'colors' => [
            'primary' => [
                50 => '#f0f9ff', 100 => '#e0f2fe', 200 => '#bae6fd', 300 => '#7dd3fc',
                400 => '#38bdf8', 500 => '#0ea5e9', 600 => '#0284c7', 700 => '#0369a1',
                800 => '#075985', 900 => '#0c4a6e',
            ],
            'background' => ['main' => '#000000', 'secondary' => '#18181b', 'tertiary' => '#09090b'],
            'surface' => ['main' => '#18181b', 'secondary' => '#27272a', 'hover' => '#3f3f46', 'border' => '#3f3f46'],
            'text' => [
                'primary' => '#fafafa', 'secondary' => '#d4d4d8', 'tertiary' => '#a1a1aa',
                'disabled' => '#71717a', 'inverse' => '#000000',
            ],
            'status' => ['success' => '#10b981', 'warning' => '#f59e0b', 'error' => '#f43f5e', 'info' => '#3b82f6'],
        ],
        'effects' => [
            'shadow' => '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
            'borderRadius' => '0.5rem',
        ],
    ],
    'light' => [
        'name' => 'Light',
        'description' => 'Clean and bright light theme',
        'colors' => [
            'primary' => [
                50 => '#fef7ed', 100 => '#fdedd3', 200 => '#fbd8a5', 300 => '#f8bc6d',
                400 => '#f59446', 500 => '#f37320', 600 => '#e45a16', 700 => '#bd4315',
                800 => '#973618', 900 => '#7b2e16',
            ],
            'background' => ['main' => '#ffffff', 'secondary' => '#f8fafc', 'tertiary' => '#f1f5f9'],
            'surface' => ['main' => '#ffffff', 'secondary' => '#f8fafc', 'hover' => '#e2e8f0', 'border' => '#e2e8f0'],
            'text' => [
                'primary' => '#0f172a', 'secondary' => '#475569', 'tertiary' => '#64748b',
                'disabled' => '#94a3b8', 'inverse' => '#ffffff',
            ],
            'status' => ['success' => '#16a34a', 'warning' => '#ca8a04', 'error' => '#dc2626', 'info' => '#2563eb'],
        ],
        'effects' => [
            'shadow' => '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            'borderRadius' => '0.5rem',
        ],
    ],
    'forest' => [
        'name' => 'Forest',
        'description' => 'Nature-inspired dark green theme',
        'colors' => [
            'primary' => [
                50 => '#f0fdf4', 100 => '#dcfce7', 200 => '#bbf7d0', 300 => '#86efac',
                400 => '#4ade80', 500 => '#22c55e', 600 => '#16a34a', 700 => '#15803d',
                800 => '#166534', 900 => '#14532d',
            ],
            'background' => ['main' => '#0a1810', 'secondary' => '#1a2820', 'tertiary' => '#0d1f17'],
            'surface' => ['main' => '#1a2820', 'secondary' => '#2d3f35', 'hover' => '#3d5046', 'border' => '#3d5046'],
            'text' => [
                'primary' => '#f0fdf4', 'secondary' => '#bbf7d0', 'tertiary' => '#86efac',
                'disabled' => '#4d7c5f', 'inverse' => '#0a1810',
            ],
            'status' => ['success' => '#22c55e', 'warning' => '#fbbf24', 'error' => '#ef4444', 'info' => '#06b6d4'],
        ],
        'effects' => [
            'shadow' => '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
            'borderRadius' => '0.5rem',
            'glowColor' => 'rgba(34, 197, 94, 0.15)',
        ],
    ],
    'ocean' => [
        'name' => 'Ocean',
        'description' => 'Deep ocean blue theme',
        'colors' => [
            'primary' => [
                50 => '#ecfeff', 100 => '#cffafe', 200 => '#a5f3fc', 300 => '#67e8f9',
                400 => '#22d3ee', 500 => '#06b6d4', 600 => '#0891b2', 700 => '#0e7490',
                800 => '#155e75', 900 => '#164e63',
            ],
            'background' => ['main' => '#0a1628', 'secondary' => '#162642', 'tertiary' => '#0d1f35'],
            'surface' => ['main' => '#162642', 'secondary' => '#1e3a5f', 'hover' => '#2d4b73', 'border' => '#2d4b73'],
            'text' => [
                'primary' => '#ecfeff', 'secondary' => '#a5f3fc', 'tertiary' => '#67e8f9',
                'disabled' => '#475569', 'inverse' => '#0a1628',
            ],
            'status' => ['success' => '#14b8a6', 'warning' => '#f59e0b', 'error' => '#f43f5e', 'info' => '#06b6d4'],
        ],
        'effects' => [
            'shadow' => '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
            'borderRadius' => '0.5rem',
            'glowColor' => 'rgba(6, 182, 212, 0.15)',
        ],
    ],
];

const DEFAULT_THEME = 'rust';
const THEME_COOKIE = 'aor-theme';

/**
 * The theme id requested by this visitor, falling back to the default.
 */
function current_theme_id(): string {
    $id = $_COOKIE[THEME_COOKIE] ?? '';
    return isset(THEMES[$id]) ? $id : DEFAULT_THEME;
}

/**
 * Build the inline `style` value that applies a theme's custom properties.
 */
function theme_css_vars(string $themeId): string {
    $theme = THEMES[$themeId] ?? THEMES[DEFAULT_THEME];
    $vars = [];

    foreach ($theme['colors']['primary'] as $shade => $value) {
        $vars["--color-primary-$shade"] = $value;
    }
    foreach ($theme['colors']['background'] as $key => $value) {
        $vars["--color-bg-$key"] = $value;
    }
    foreach ($theme['colors']['surface'] as $key => $value) {
        $vars["--color-surface-$key"] = $value;
    }
    foreach ($theme['colors']['text'] as $key => $value) {
        $vars["--color-text-$key"] = $value;
    }
    foreach ($theme['colors']['status'] as $key => $value) {
        $vars["--color-$key"] = $value;
    }

    $vars['--shadow'] = $theme['effects']['shadow'];
    $vars['--border-radius'] = $theme['effects']['borderRadius'];
    if (isset($theme['effects']['glowColor'])) {
        $vars['--glow-color'] = $theme['effects']['glowColor'];
    }

    $out = '';
    foreach ($vars as $name => $value) {
        $out .= $name . ':' . $value . ';';
    }
    return $out;
}
