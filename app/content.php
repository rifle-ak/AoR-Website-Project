<?php
/**
 * Art of Rust - Editable page content
 *
 * The copy that used to live inside the React components. Everything here is a
 * plain PHP array, so it can be edited straight on the server without a build
 * step. Database-backed content (news, wipes, players) lives in MySQL instead.
 */

if (!defined('AOR_APP')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

/** Home page feature cards. */
const HOME_FEATURES = [
    ['icon' => 'server', 'title' => 'High Performance', 'description' => 'Optimized servers with minimal lag and maximum uptime'],
    ['icon' => 'shield', 'title' => 'Active Admins', 'description' => '24/7 admin support to ensure fair gameplay'],
    ['icon' => 'zap', 'title' => 'Custom Events', 'description' => 'Regular events and unique gameplay experiences'],
];

/** In-game commands, grouped by category. */
const RUST_COMMANDS = [
    [
        'category' => 'Basic Commands',
        'commands' => [
            ['command' => '/help', 'description' => 'Shows all available commands'],
            ['command' => '/stats', 'description' => 'Display your player statistics'],
            ['command' => '/info', 'description' => 'Show server information'],
            ['command' => '/rules', 'description' => 'Display server rules'],
            ['command' => '/kit starter', 'description' => 'Get a starter kit'],
        ],
    ],
    [
        'category' => 'Teleportation',
        'commands' => [
            ['command' => '/home', 'description' => 'Teleport to your home base'],
            ['command' => '/sethome', 'description' => 'Set your home location'],
            ['command' => '/tpa <player>', 'description' => 'Send teleport request to player'],
            ['command' => '/tpaccept', 'description' => 'Accept teleport request'],
            ['command' => '/tpdeny', 'description' => 'Deny teleport request'],
        ],
    ],
    [
        'category' => 'Economy',
        'commands' => [
            ['command' => '/balance', 'description' => 'Check your balance'],
            ['command' => '/pay <player> <amount>', 'description' => 'Pay money to another player'],
            ['command' => '/shop', 'description' => 'Open the server shop'],
            ['command' => '/sell', 'description' => 'Sell items in your hand'],
            ['command' => '/worth', 'description' => 'Check value of items in hand'],
        ],
    ],
    [
        'category' => 'Clan System',
        'commands' => [
            ['command' => '/clan create <name>', 'description' => 'Create a new clan'],
            ['command' => '/clan invite <player>', 'description' => 'Invite player to clan'],
            ['command' => '/clan join <clan>', 'description' => 'Join a clan'],
            ['command' => '/clan leave', 'description' => 'Leave your current clan'],
            ['command' => '/clan info', 'description' => 'Show clan information'],
        ],
    ],
    [
        'category' => 'Admin Commands',
        'commands' => [
            ['command' => '/kick <player>', 'description' => 'Kick a player from server'],
            ['command' => '/ban <player>', 'description' => 'Ban a player from server'],
            ['command' => '/mute <player>', 'description' => 'Mute a player'],
            ['command' => '/vanish', 'description' => 'Become invisible'],
            ['command' => '/godmode', 'description' => 'Enable god mode'],
        ],
    ],
];

/** Server rules. Severity drives the icon and badge: ban | warning | info. */
const SERVER_RULES = [
    [
        'title' => 'No Cheating or Exploiting',
        'description' => 'Use of hacks, scripts, exploits, or any third-party software that gives unfair advantages is strictly prohibited. This includes ESP, aimbot, speedhacks, and similar tools.',
        'severity' => 'ban',
    ],
    [
        'title' => 'No Racism, Hate Speech, or Harassment',
        'description' => 'Treat all players with respect. Racism, homophobia, sexism, or targeted harassment of any kind will result in immediate removal from the server.',
        'severity' => 'ban',
    ],
    [
        'title' => 'No Stream Sniping',
        'description' => 'Targeting streamers based on information from their stream is not allowed. Play fair and respect content creators.',
        'severity' => 'warning',
    ],
    [
        'title' => 'No Excessive Griefing',
        'description' => 'While raiding is part of Rust, excessive griefing (foundation wiping, despawning loot, etc.) ruins the experience for everyone. Raid for loot, not destruction.',
        'severity' => 'warning',
    ],
    [
        'title' => 'No Blocking Monuments or Resources',
        'description' => 'Building on or excessively blocking monuments, caves, or key resource areas is prohibited. Everyone needs access to game content.',
        'severity' => 'warning',
    ],
    [
        'title' => 'No Offensive Base Designs',
        'description' => 'Bases with offensive symbols, shapes, or inappropriate designs will be removed. Keep it appropriate.',
        'severity' => 'warning',
    ],
    [
        'title' => 'English in Global Chat',
        'description' => 'Keep global chat primarily in English so everyone can understand. Use team chat or Discord for other languages.',
        'severity' => 'info',
    ],
    [
        'title' => 'No Spam or Advertising',
        'description' => "Don't spam chat with repeated messages or advertise other servers/services. Discord links and trading are fine.",
        'severity' => 'info',
    ],
];

/**
 * Server facts shown on the Rules page. MAP_SIZE comes from config so it stays
 * in step with the value used elsewhere on the site.
 */
function server_info_rows(): array {
    return [
        ['label' => 'Gather Rate', 'value' => '2x'],
        ['label' => 'Max Team Size', 'value' => '4 Players'],
        ['label' => 'Raid Protection', 'value' => 'Offline Raid Protection Enabled'],
        ['label' => 'Map Size', 'value' => (string) MAP_SIZE],
        ['label' => 'Wipe Schedule', 'value' => 'Bi-Weekly (Forced Wipe + Mid-Month)'],
        ['label' => 'Admin Support', 'value' => '24/7 Ticket System'],
    ];
}

/** Gallery categories. */
const GALLERY_CATEGORIES = [
    ['value' => 'all', 'label' => 'All Images'],
    ['value' => 'bases', 'label' => 'Bases'],
    ['value' => 'raids', 'label' => 'Raids'],
    ['value' => 'screenshots', 'label' => 'Screenshots'],
    ['value' => 'events', 'label' => 'Events'],
];

/**
 * Community gallery entries. Drop new screenshots into /assets/gallery and add
 * a row here - `image` may be a site-relative path or a full URL.
 */
const GALLERY_ITEMS = [
    ['id' => 1, 'title' => 'Epic Base Build', 'author' => 'RustMaster', 'date' => '2024-01-15', 'category' => 'bases', 'image' => 'https://images.unsplash.com/photo-1579546929518-9e396f3a803d?w=800&h=600&fit=crop'],
    ['id' => 2, 'title' => 'Helicopter Raid', 'author' => 'BanditKing', 'date' => '2024-01-14', 'category' => 'raids', 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop'],
    ['id' => 3, 'title' => 'Sunset at Monument', 'author' => 'Explorer', 'date' => '2024-01-13', 'category' => 'screenshots', 'image' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'],
    ['id' => 4, 'title' => 'Clan Victory', 'author' => 'Warrior', 'date' => '2024-01-12', 'category' => 'events', 'image' => 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop'],
    ['id' => 5, 'title' => 'Underwater Base', 'author' => 'BuilderPro', 'date' => '2024-01-11', 'category' => 'bases', 'image' => 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop'],
    ['id' => 6, 'title' => 'Tank Battle', 'author' => 'TankCommander', 'date' => '2024-01-10', 'category' => 'raids', 'image' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'],
];

/** Leaderboard tabs. */
const LEADERBOARD_CATEGORIES = [
    ['id' => 'kills', 'label' => 'Top Kills', 'icon' => 'skull'],
    ['id' => 'kd', 'label' => 'Best K/D', 'icon' => 'target'],
    ['id' => 'playtime', 'label' => 'Most Playtime', 'icon' => 'clock'],
    ['id' => 'headshots', 'label' => 'Headshot Kings', 'icon' => 'trending-up'],
];
