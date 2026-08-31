<?php
/**
 * Admin dashboard.
 *
 * @var array $dashboard From data_dashboard_stats().
 */

$stats = $dashboard['stats'];
$recentPlayers = $dashboard['recentPlayers'];

$statCards = [
    ['icon' => 'users', 'label' => 'Total Players', 'value' => $stats['totalPlayers'], 'color' => 'text-blue-500', 'bg' => 'bg-blue-500-20'],
    ['icon' => 'database', 'label' => 'Registered Users', 'value' => $stats['totalUsers'], 'color' => 'text-green-500', 'bg' => 'bg-green-500-20'],
    ['icon' => 'newspaper', 'label' => 'News Posts', 'value' => $stats['totalNews'], 'color' => 'text-purple-500', 'bg' => 'bg-purple-500-20'],
    ['icon' => 'calendar', 'label' => 'Total Wipes', 'value' => $stats['totalWipes'], 'color' => 'text-rust-500', 'bg' => 'bg-rust-500-20'],
];

$quickActions = [
    ['href' => '/admin/news', 'icon' => 'newspaper', 'color' => 'text-rust-500', 'title' => 'Manage News',
     'description' => 'Create, edit, and publish server announcements and news posts.', 'cta' => 'Open News Manager'],
    ['href' => '/admin/users', 'icon' => 'users', 'color' => 'text-blue-500', 'title' => 'Manage Users',
     'description' => 'View and manage user accounts, roles, and permissions.', 'cta' => 'Open User Manager'],
    ['href' => '/admin/wipes', 'icon' => 'calendar', 'color' => 'text-purple-500', 'title' => 'Wipe Schedule',
     'description' => 'Manage server wipe schedule and configuration.', 'cta' => 'Manage Wipes'],
];
?>
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <?= icon('shield', 'w-10 h-10 text-rust-500') ?>
            Admin Dashboard
        </h1>
        <p class="text-dark-300 text-lg">Manage your <?= e(SITE_NAME) ?> server, users, and content.</p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <?php foreach ($statCards as $stat): ?>
            <div class="card">
                <div class="flex items-center justify-between mb-3">
                    <div class="p-3 rounded-lg <?= e($stat['bg']) ?>">
                        <?= icon($stat['icon'], 'w-6 h-6 ' . $stat['color']) ?>
                    </div>
                    <?= icon('trending-up', 'w-5 h-5 text-dark-600') ?>
                </div>
                <p class="text-dark-400 text-sm mb-1"><?= e($stat['label']) ?></p>
                <p class="text-3xl font-bold text-white"><?= e(number_format($stat['value'])) ?></p>
            </div>
        <?php endforeach; ?>
    </div>

    <div class="card mb-8">
        <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <?= icon('users', 'w-6 h-6 text-rust-500') ?>
            Recent Players
        </h2>
        <?php if ($recentPlayers): ?>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-dark-700">
                            <th class="text-left py-3 px-4 text-dark-400 font-medium">Player</th>
                            <th class="text-left py-3 px-4 text-dark-400 font-medium">Kills</th>
                            <th class="text-left py-3 px-4 text-dark-400 font-medium">Deaths</th>
                            <th class="text-left py-3 px-4 text-dark-400 font-medium">K/D</th>
                            <th class="text-left py-3 px-4 text-dark-400 font-medium">Playtime</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recentPlayers as $player): ?>
                            <tr class="border-b border-dark-800 hover:bg-dark-800-50">
                                <td class="py-3 px-4 text-white font-medium"><?= e($player['name']) ?></td>
                                <td class="py-3 px-4 text-green-500"><?= e(number_format($player['kills'])) ?></td>
                                <td class="py-3 px-4 text-red-500"><?= e(number_format($player['deaths'])) ?></td>
                                <td class="py-3 px-4 text-rust-500"><?= e(format_kd($player['kills'], $player['deaths'])) ?></td>
                                <td class="py-3 px-4 text-dark-300"><?= e($player['playtime']) ?>h</td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php else: ?>
            <p class="text-dark-400 text-center py-8">No recent player activity</p>
        <?php endif; ?>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <?php foreach ($quickActions as $action): ?>
            <a href="<?= e($action['href']) ?>" class="card card-interactive card-hover-accent transition-colors block">
                <?= icon($action['icon'], 'w-8 h-8 mb-3 ' . $action['color']) ?>
                <h3 class="text-lg font-bold text-white mb-2"><?= e($action['title']) ?></h3>
                <p class="text-dark-400 text-sm mb-4"><?= e($action['description']) ?></p>
                <span class="btn-primary w-full text-sm block text-center"><?= e($action['cta']) ?></span>
            </a>
        <?php endforeach; ?>
    </div>
</div>
