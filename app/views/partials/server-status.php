<?php
/**
 * Live server status card plus quick-connect actions.
 *
 * Rendered from a fresh A2S query (cached for SERVER_STATUS_CACHE seconds) and
 * refreshed in place every 30 seconds from /api/server/status.
 *
 * @var array $status   From data_server_status().
 * @var array $schedule From data_wipe_schedule().
 */

$maxPlayers = max(1, (int) $status['maxPlayers']);
$percentage = min(100, ($status['players'] / $maxPlayers) * 100);
$barColor = $percentage >= 90 ? 'bg-red-500' : ($percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500');
$textColor = $percentage >= 90 ? 'text-red-500' : ($percentage >= 70 ? 'text-yellow-500' : 'text-green-500');

$nextWipeDate = $status['nextWipe'] ?? ($schedule['next']['date'] ?? null);
$lastWipeDate = $status['lastWipe'] ?? ($schedule['history'][0]['date'] ?? null);

$connectCommand = 'connect ' . RUST_SERVER_IP . ':' . RUST_SERVER_PORT;
?>
<div class="space-y-4">
    <div class="card" data-server-status>
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
                <?= icon('server', 'w-6 h-6 text-rust-500') ?>
                <span data-field="name"><?= e($status['name']) ?></span>
            </h3>
            <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full animate-pulse <?= $status['online'] ? 'bg-green-500' : 'bg-red-500' ?>" data-field="dot"></span>
                <span class="text-sm text-dark-300" data-field="state"><?= $status['online'] ? 'Online' : 'Offline' ?></span>
            </div>
        </div>

        <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                    <?= icon('users', 'w-5 h-5 text-dark-400') ?>
                    <span class="text-dark-300">Players Online</span>
                </div>
                <span class="text-lg font-bold <?= $textColor ?>" data-field="players">
                    <?= e($status['players']) ?> / <?= e($status['maxPlayers']) ?>
                </span>
            </div>
            <div class="w-full bg-dark-700 rounded-full h-2">
                <div class="h-2 rounded-full transition-all duration-500 <?= $barColor ?>"
                     style="width: <?= e(round($percentage, 2)) ?>%" data-field="bar"></div>
            </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-dark-900 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                    <?= icon('clock', 'w-4 h-4 text-rust-500') ?>
                    <span class="text-xs text-dark-400">Queue</span>
                </div>
                <p class="text-lg font-bold text-white" data-field="queue"><?= e($status['queue']) ?></p>
            </div>

            <div class="bg-dark-900 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                    <?= icon('zap', 'w-4 h-4 text-rust-500') ?>
                    <span class="text-xs text-dark-400">FPS</span>
                </div>
                <p class="text-lg font-bold text-white" data-field="fps"><?= e($status['fps']) ?></p>
            </div>

            <div class="bg-dark-900 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                    <?= icon('map', 'w-4 h-4 text-rust-500') ?>
                    <span class="text-xs text-dark-400">Map</span>
                </div>
                <p class="text-sm font-bold text-white truncate" data-field="map"><?= e($status['map']) ?></p>
            </div>

            <div class="bg-dark-900 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                    <?= icon('calendar', 'w-4 h-4 text-rust-500') ?>
                    <span class="text-xs text-dark-400">Next Wipe</span>
                </div>
                <p class="text-sm font-bold text-white" data-countdown-short="<?= e($nextWipeDate ? date('c', strtotime($nextWipeDate)) : '') ?>">
                    <?= e($nextWipeDate ? countdown_short($nextWipeDate) : '--') ?>
                </p>
            </div>
        </div>

        <div class="mt-4 pt-4 border-t border-dark-700">
            <div class="flex items-center justify-between text-sm">
                <span class="text-dark-400">Uptime: <span data-field="uptime"><?= e($status['uptime']) ?></span></span>
                <span class="text-dark-400">Last Wipe: <?= e($lastWipeDate ? format_short_date($lastWipeDate) : 'Unknown') ?></span>
            </div>
        </div>
    </div>

    <div class="card">
        <h4 class="font-semibold text-white mb-3">Quick Connect</h4>
        <div class="space-y-2">
            <button type="button" class="btn-primary w-full" data-copy="<?= e($connectCommand) ?>">
                <span data-copy-label>Copy Connect Command</span>
            </button>
            <a href="steam://connect/<?= e(RUST_SERVER_IP) ?>:<?= e(RUST_SERVER_PORT) ?>" class="btn-secondary w-full block text-center">
                Connect via Steam
            </a>
        </div>
    </div>
</div>
