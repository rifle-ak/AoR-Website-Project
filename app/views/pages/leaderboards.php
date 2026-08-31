<?php
/**
 * Player leaderboards.
 *
 * @var array  $board  From data_leaderboards().
 * @var string $search
 */

$category = $board['category'];
$players = $board['players'];

$activeLabel = 'Top Kills';
foreach (LEADERBOARD_CATEGORIES as $cat) {
    if ($cat['id'] === $category) {
        $activeLabel = $cat['label'];
    }
}

/** The value shown in the highlighted column for the active category. */
$categoryValue = function (array $player) use ($category): string {
    switch ($category) {
        case 'kd':
            return number_format($player['kd'], 2);
        case 'playtime':
            return format_playtime($player['playtime']);
        case 'headshots':
            return number_format($player['headshots']);
        default:
            return number_format($player['kills']);
    }
};

$rankColor = function (int $rank): string {
    if ($rank === 1) {
        return 'text-yellow-500';
    }
    if ($rank === 2) {
        return 'text-gray-400';
    }
    if ($rank === 3) {
        return 'text-orange-600';
    }

    return 'text-dark-400';
};

$totalKills = array_sum(array_column($players, 'kills'));
$totalPlaytime = array_sum(array_column($players, 'playtime'));
$avgKd = $players ? array_sum(array_column($players, 'kd')) / count($players) : 0;
?>
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <?= icon('trophy', 'w-10 h-10 text-rust-500') ?>
            Leaderboards
        </h1>
        <p class="text-dark-300 text-lg">Compete with the best. Track your stats and climb the ranks.</p>
    </div>

    <div class="flex flex-wrap gap-2 mb-6">
        <?php foreach (LEADERBOARD_CATEGORIES as $cat): ?>
            <a href="/leaderboards?category=<?= e($cat['id']) ?>"
               class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors <?= $category === $cat['id'] ? 'bg-rust-500 text-white' : 'bg-dark-800 text-dark-300 hover:bg-dark-700' ?>">
                <?= icon($cat['icon'], 'w-4 h-4') ?>
                <?= e($cat['label']) ?>
            </a>
        <?php endforeach; ?>
    </div>

    <div class="mb-6">
        <form method="get" action="/leaderboards" class="relative max-w-md" data-filter-form>
            <input type="hidden" name="category" value="<?= e($category) ?>">
            <?= icon('search', 'w-5 h-5 input-icon text-dark-400') ?>
            <label for="player-search" class="sr-only">Search players</label>
            <input type="search" id="player-search" name="q" value="<?= e($search) ?>"
                   placeholder="Search players..." class="input-field w-full pl-10"
                   data-filter-input data-filter-target="[data-player]">
        </form>
    </div>

    <div class="card overflow-hidden">
        <?php if (!$players): ?>
            <div class="text-center py-12">
                <div class="flex justify-center mb-4"><?= icon('trophy', 'w-16 h-16 text-dark-600') ?></div>
                <h3 class="text-xl font-semibold text-dark-300 mb-2">No stats recorded yet</h3>
                <p class="text-dark-400 max-w-md mx-auto">
                    Rankings appear here as soon as player statistics are recorded. Admins can add them from the
                    admin panel, or push them in from the server with the <code class="text-rust-400">/api/admin/players/stats</code> endpoint.
                </p>
            </div>
        <?php else: ?>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-dark-900 border-b border-dark-700">
                        <tr>
                            <th class="px-6 py-4 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">Rank</th>
                            <th class="px-6 py-4 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">Player</th>
                            <th class="px-6 py-4 text-right text-xs font-semibold text-dark-400 uppercase tracking-wider"><?= e($activeLabel) ?></th>
                            <th class="px-6 py-4 text-right text-xs font-semibold text-dark-400 uppercase tracking-wider">K/D</th>
                            <th class="px-6 py-4 text-right text-xs font-semibold text-dark-400 uppercase tracking-wider">Playtime</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-dark-700">
                        <?php foreach ($players as $player): ?>
                            <?php
                            $hidden = $search !== '' && !str_contains(mb_strtolower($player['name']), mb_strtolower($search));
                            ?>
                            <tr class="hover:bg-dark-900 transition-colors"
                                data-player data-search="<?= e(mb_strtolower($player['name'])) ?>" <?= $hidden ? 'hidden' : '' ?>>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <?php if ($player['rank'] <= 3): ?>
                                            <?= icon('trophy', 'w-5 h-5 ' . $rankColor($player['rank'])) ?>
                                        <?php else: ?>
                                            <span class="text-dark-400 text-sm">#<?= e($player['rank']) ?></span>
                                        <?php endif; ?>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-2">
                                        <?= icon('user', 'w-4 h-4 text-dark-400') ?>
                                        <span class="text-white font-medium"><?= e($player['name']) ?></span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right">
                                    <span class="text-rust-500 font-bold text-lg"><?= e($categoryValue($player)) ?></span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right">
                                    <span class="text-dark-300"><?= e(number_format($player['kd'], 2)) ?></span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right">
                                    <span class="text-dark-300"><?= e(format_playtime($player['playtime'])) ?></span>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>

                <div class="text-center py-12" data-filter-empty hidden>
                    <p class="text-dark-400">No players found matching your search.</p>
                </div>
            </div>
        <?php endif; ?>
    </div>

    <div class="grid md:grid-cols-4 gap-4 mt-8">
        <div class="card">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-dark-400 text-sm">Total Players</p>
                    <p class="text-2xl font-bold text-white mt-1"><?= e(number_format(count($players))) ?></p>
                </div>
                <?= icon('user', 'w-8 h-8 text-rust-500') ?>
            </div>
        </div>
        <div class="card">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-dark-400 text-sm">Total Kills</p>
                    <p class="text-2xl font-bold text-white mt-1"><?= e(number_format($totalKills)) ?></p>
                </div>
                <?= icon('skull', 'w-8 h-8 text-rust-500') ?>
            </div>
        </div>
        <div class="card">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-dark-400 text-sm">Avg K/D</p>
                    <p class="text-2xl font-bold text-white mt-1"><?= e(number_format($avgKd, 2)) ?></p>
                </div>
                <?= icon('target', 'w-8 h-8 text-rust-500') ?>
            </div>
        </div>
        <div class="card">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-dark-400 text-sm">Total Playtime</p>
                    <p class="text-2xl font-bold text-white mt-1"><?= e(format_playtime($totalPlaytime)) ?></p>
                </div>
                <?= icon('clock', 'w-8 h-8 text-rust-500') ?>
            </div>
        </div>
    </div>
</div>
