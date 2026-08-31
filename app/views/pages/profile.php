<?php
/**
 * Signed-in player's profile and statistics.
 *
 * @var array      $user
 * @var array|null $stats From data_player_stats().
 */

$kdr = $stats ? format_kd($stats['kills'], $stats['deaths']) : '0.00';
$headshotPct = $stats && $stats['kills'] > 0
    ? number_format(($stats['headshots'] / $stats['kills']) * 100, 1)
    : '0.0';

$statCards = $stats ? [
    ['icon' => 'target', 'label' => 'Kills', 'value' => number_format($stats['kills']), 'color' => 'text-green-500'],
    ['icon' => 'crosshair', 'label' => 'Deaths', 'value' => number_format($stats['deaths']), 'color' => 'text-red-500'],
    ['icon' => 'trophy', 'label' => 'K/D Ratio', 'value' => $kdr, 'color' => 'text-rust-500'],
    ['icon' => 'crosshair', 'label' => 'Headshots', 'value' => number_format($stats['headshots']), 'color' => 'text-yellow-500'],
    ['icon' => 'trending-up', 'label' => 'HS %', 'value' => $headshotPct . '%', 'color' => 'text-blue-500'],
    ['icon' => 'clock', 'label' => 'Playtime', 'value' => $stats['playtime'] . 'h', 'color' => 'text-purple-500'],
] : [];
?>
<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="card mb-8">
        <div class="flex items-center gap-6 flex-wrap">
            <?php if ($user['avatarUrl']): ?>
                <img src="<?= e($user['avatarUrl']) ?>" alt="" class="w-24 h-24 rounded-full border-4 border-rust-500">
            <?php else: ?>
                <div class="w-24 h-24 rounded-full bg-rust-500-20 border-4 border-rust-500 flex items-center justify-center">
                    <?= icon('user', 'w-12 h-12 text-rust-500') ?>
                </div>
            <?php endif; ?>
            <div class="flex-1">
                <h1 class="text-3xl font-bold text-white mb-2"><?= e($user['displayName']) ?></h1>
                <div class="flex items-center gap-4 text-sm flex-wrap">
                    <span class="text-dark-400">Steam ID: <?= e($user['steamId']) ?></span>
                    <?php if ($user['isAdmin']): ?>
                        <span class="px-2 py-1 rounded badge-red font-medium">Admin</span>
                    <?php endif; ?>
                    <?php if ($user['isVip']): ?>
                        <span class="px-2 py-1 rounded badge-yellow font-medium">VIP</span>
                    <?php endif; ?>
                </div>
                <?php if ($stats): ?>
                    <p class="text-dark-300 text-sm mt-2">Last seen: <?= e(format_datetime($stats['last_seen'])) ?></p>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <?php if ($stats): ?>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <?php foreach ($statCards as $stat): ?>
                <div class="card">
                    <div class="flex items-center gap-3">
                        <?= icon($stat['icon'], 'w-8 h-8 ' . $stat['color']) ?>
                        <div>
                            <p class="text-dark-400 text-sm"><?= e($stat['label']) ?></p>
                            <p class="text-2xl font-bold text-white"><?= e($stat['value']) ?></p>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="card">
            <h2 class="text-xl font-bold text-white mb-4">Additional Statistics</h2>
            <div class="grid md:grid-cols-2 gap-4">
                <div class="flex justify-between items-center p-3 rounded bg-dark-800">
                    <span class="text-dark-300">Longest Kill</span>
                    <span class="text-white font-semibold"><?= e(number_format($stats['longest_kill'], 0)) ?>m</span>
                </div>
                <div class="flex justify-between items-center p-3 rounded bg-dark-800">
                    <span class="text-dark-300">Total Playtime</span>
                    <span class="text-white font-semibold"><?= e($stats['playtime']) ?> hours</span>
                </div>
                <div class="flex justify-between items-center p-3 rounded bg-dark-800">
                    <span class="text-dark-300">K/D Ratio</span>
                    <span class="text-white font-semibold"><?= e($kdr) ?></span>
                </div>
                <div class="flex justify-between items-center p-3 rounded bg-dark-800">
                    <span class="text-dark-300">Headshot Accuracy</span>
                    <span class="text-white font-semibold"><?= e($headshotPct) ?>%</span>
                </div>
            </div>
        </div>
    <?php else: ?>
        <div class="card text-center py-12">
            <div class="flex justify-center mb-4"><?= icon('user', 'w-16 h-16 text-dark-600') ?></div>
            <h3 class="text-xl font-semibold text-dark-300 mb-2">No Stats Available</h3>
            <p class="text-dark-400">Your stats will appear here once you've played on the server.</p>
        </div>
    <?php endif; ?>
</div>
