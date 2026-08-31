<?php
/** Sticky top navigation, with the mobile drawer and the signed-in user menu. */

$user = Auth::user();

$navigation = array_values(array_filter([
    ['name' => 'Home', 'href' => '/'],
    ['name' => 'News', 'href' => '/news'],
    ENABLE_LEADERBOARDS ? ['name' => 'Leaderboards', 'href' => '/leaderboards'] : null,
    ['name' => 'Wipe Schedule', 'href' => '/wipe-schedule'],
    ['name' => 'Commands', 'href' => '/commands'],
    ['name' => 'Rules', 'href' => '/rules'],
    ['name' => 'Gallery', 'href' => '/gallery'],
]));

$socialLinks = [
    ['icon' => 'discord', 'href' => DISCORD_INVITE, 'label' => 'Discord'],
    ['icon' => 'twitter', 'href' => TWITTER_URL, 'label' => 'Twitter'],
    ['icon' => 'youtube', 'href' => YOUTUBE_URL, 'label' => 'YouTube'],
    ['icon' => 'instagram', 'href' => INSTAGRAM_URL, 'label' => 'Instagram'],
];

/** Social icons appear in both the desktop bar and the mobile drawer. */
$renderSocial = function () use ($socialLinks) {
    foreach ($socialLinks as $social) {
        echo '<a href="' . e($social['href']) . '" target="_blank" rel="noopener noreferrer"'
            . ' class="text-dark-400 hover:text-rust-500 transition-colors" aria-label="' . e($social['label']) . '">'
            . ($social['icon'] === 'discord' ? discord_icon('w-5 h-5') : icon($social['icon'], 'w-5 h-5'))
            . '</a>';
    }
};
?>
<nav class="bg-dark-800 border-b border-dark-700 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center gap-4 h-16">
            <div class="flex items-center flex-shrink-0">
                <a href="/" class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-rust-500 rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-sm">AOR</span>
                    </div>
                    <span class="text-white font-bold text-xl whitespace-nowrap"><?= e(SITE_NAME) ?></span>
                </a>
            </div>

            <div class="hidden md:flex items-center space-x-6">
                <?php foreach ($navigation as $item): ?>
                    <a href="<?= e($item['href']) ?>"
                       class="text-sm font-medium whitespace-nowrap transition-colors <?= is_active($item['href']) ? 'text-rust-500' : 'text-dark-300 hover:text-white' ?>"
                       <?= is_active($item['href']) ? 'aria-current="page"' : '' ?>>
                        <?= e($item['name']) ?>
                    </a>
                <?php endforeach; ?>
            </div>

            <div class="hidden md:flex items-center space-x-4">
                <?php $renderSocial(); ?>
                <?php partial('theme-switcher'); ?>

                <?php if ($user): ?>
                    <div class="relative" data-dropdown>
                        <button type="button" class="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                                data-dropdown-toggle aria-expanded="false" aria-haspopup="true">
                            <?php if ($user['avatarUrl']): ?>
                                <img src="<?= e($user['avatarUrl']) ?>" alt="" class="w-8 h-8 rounded-full border-2 border-rust-500">
                            <?php endif; ?>
                            <span class="text-white text-sm font-medium"><?= e($user['displayName']) ?></span>
                        </button>

                        <div class="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-lg shadow-lg z-20" data-dropdown-menu hidden>
                            <a href="/profile" class="flex items-center gap-2 px-4 py-3 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors">
                                <?= icon('user', 'w-4 h-4') ?>
                                My Profile
                            </a>
                            <?php if ($user['isAdmin']): ?>
                                <a href="/admin" class="flex items-center gap-2 px-4 py-3 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors">
                                    <?= icon('shield', 'w-4 h-4') ?>
                                    Admin Panel
                                </a>
                            <?php endif; ?>
                            <form method="post" action="/logout">
                                <?= csrf_field() ?>
                                <button type="submit" class="flex items-center gap-2 w-full px-4 py-3 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors border-t border-dark-700">
                                    <?= icon('log-out', 'w-4 h-4') ?>
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                <?php else: ?>
                    <a href="/auth/steam" class="btn-primary text-sm whitespace-nowrap">Login with Steam</a>
                <?php endif; ?>
            </div>

            <div class="md:hidden flex items-center">
                <button type="button" class="text-dark-300 hover:text-white" data-mobile-toggle
                        aria-expanded="false" aria-controls="mobile-menu" aria-label="Toggle navigation">
                    <span data-mobile-icon="closed"><?= icon('menu', 'w-6 h-6') ?></span>
                    <span data-mobile-icon="open" hidden><?= icon('x', 'w-6 h-6') ?></span>
                </button>
            </div>
        </div>
    </div>

    <div class="md:hidden bg-dark-800 border-t border-dark-700" id="mobile-menu" data-mobile-menu hidden>
        <div class="px-2 pt-2 pb-3 space-y-1">
            <?php foreach ($navigation as $item): ?>
                <a href="<?= e($item['href']) ?>"
                   class="block px-3 py-2 rounded-md text-base font-medium <?= is_active($item['href']) ? 'text-rust-500 bg-dark-700' : 'text-dark-300 hover:text-white hover:bg-dark-700' ?>">
                    <?= e($item['name']) ?>
                </a>
            <?php endforeach; ?>

            <div class="flex items-center space-x-4 px-3 py-2">
                <?php $renderSocial(); ?>
            </div>

            <div class="px-3 py-2">
                <?php partial('theme-switcher', ['id' => 'mobile']); ?>
            </div>

            <?php if ($user): ?>
                <div class="px-3 py-2">
                    <div class="flex items-center space-x-3 mb-3 pb-3 border-b border-dark-700">
                        <?php if ($user['avatarUrl']): ?>
                            <img src="<?= e($user['avatarUrl']) ?>" alt="" class="w-8 h-8 rounded-full border-2 border-rust-500">
                        <?php endif; ?>
                        <span class="text-white text-sm font-medium"><?= e($user['displayName']) ?></span>
                    </div>
                    <a href="/profile" class="flex items-center gap-2 px-3 py-2 rounded-md text-dark-300 hover:text-white hover:bg-dark-700 mb-2">
                        <?= icon('user', 'w-4 h-4') ?>
                        My Profile
                    </a>
                    <?php if ($user['isAdmin']): ?>
                        <a href="/admin" class="flex items-center gap-2 px-3 py-2 rounded-md text-dark-300 hover:text-white hover:bg-dark-700 mb-2">
                            <?= icon('shield', 'w-4 h-4') ?>
                            Admin Panel
                        </a>
                    <?php endif; ?>
                    <form method="post" action="/logout">
                        <?= csrf_field() ?>
                        <button type="submit" class="w-full btn-secondary text-sm mt-2">Logout</button>
                    </form>
                </div>
            <?php else: ?>
                <div class="px-3 py-2">
                    <a href="/auth/steam" class="w-full btn-primary text-sm block text-center">Login with Steam</a>
                </div>
            <?php endif; ?>
        </div>
    </div>
</nav>
