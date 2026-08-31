<?php
/**
 * Wipe schedule with a live countdown.
 *
 * @var array $schedule From data_wipe_schedule().
 */

$next = $schedule['next'];
$upcoming = $schedule['upcoming'];
$history = $schedule['history'];
$parts = countdown_parts($next['date'] ?? null);
?>
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <?= icon('calendar', 'w-10 h-10 text-rust-500') ?>
            Wipe Schedule
        </h1>
        <p class="text-dark-300 text-lg">Plan your gameplay around our regular wipe schedule. Never miss a fresh start!</p>
    </div>

    <?php if ($next): ?>
        <div class="card card-next-wipe mb-8">
            <div class="flex items-start justify-between mb-6">
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-3 py-1 rounded-full text-xs font-bold text-white <?= e(wipe_type_color($next['type'])) ?>">
                            <?= e(wipe_type_label($next['type'])) ?>
                        </span>
                        <?= icon('refresh-cw', 'w-4 h-4 text-rust-500') ?>
                    </div>
                    <h2 class="text-2xl font-bold text-white">Next Wipe</h2>
                    <p class="text-dark-300 text-sm mt-1"><?= e(format_datetime($next['date'])) ?></p>
                </div>
                <?= icon('alert-circle', 'w-8 h-8 text-rust-500') ?>
            </div>

            <div class="grid grid-cols-4 gap-4 mb-6" data-countdown="<?= e(date('c', strtotime($next['date']))) ?>">
                <?php foreach (['days' => 'Days', 'hours' => 'Hours', 'minutes' => 'Minutes', 'seconds' => 'Seconds'] as $key => $label): ?>
                    <div class="bg-dark-900-50 rounded-lg p-4 text-center">
                        <div class="text-3xl md:text-4xl font-bold text-rust-500 mb-1" data-countdown-unit="<?= e($key) ?>">
                            <?= e(str_pad((string) $parts[$key], 2, '0', STR_PAD_LEFT)) ?>
                        </div>
                        <div class="text-xs text-dark-400 uppercase tracking-wide"><?= e($label) ?></div>
                    </div>
                <?php endforeach; ?>
            </div>

            <?php if ($next['notes']): ?>
                <div class="bg-dark-900-30 rounded-lg p-4 border border-dark-700">
                    <p class="text-dark-200 text-sm"><?= e($next['notes']) ?></p>
                    <?php if ($next['mapSize']): ?>
                        <div class="flex items-center gap-4 mt-3 text-xs text-dark-400">
                            <span class="flex items-center gap-1">
                                <?= icon('map-pin', 'w-4 h-4') ?>
                                Map Size: <?= e($next['mapSize']) ?>
                            </span>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <div class="grid lg:grid-cols-2 gap-8">
        <div class="card">
            <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <?= icon('clock', 'w-6 h-6 text-rust-500') ?>
                Upcoming Wipes
            </h3>
            <?php if ($upcoming): ?>
                <div class="space-y-3">
                    <?php foreach ($upcoming as $wipe): ?>
                        <div class="bg-dark-900 rounded-lg p-4 border border-dark-700 card-hover-accent transition-colors">
                            <div class="flex items-start justify-between mb-2 gap-3">
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full <?= e(wipe_type_color($wipe['type'])) ?>"></span>
                                    <span class="text-white font-semibold"><?= e(wipe_type_label($wipe['type'])) ?></span>
                                </div>
                                <span class="text-xs text-dark-400 flex-shrink-0"><?= e(format_relative_date($wipe['date'])) ?></span>
                            </div>
                            <p class="text-sm text-dark-300 mb-1"><?= e(format_datetime($wipe['date'])) ?></p>
                            <?php if ($wipe['notes']): ?>
                                <p class="text-xs text-dark-400 mt-2"><?= e($wipe['notes']) ?></p>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <p class="text-dark-400 text-sm">No further wipes scheduled beyond the next one.</p>
            <?php endif; ?>
        </div>

        <div class="card">
            <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <?= icon('history', 'w-6 h-6 text-rust-500') ?>
                Recent Wipes
            </h3>
            <div class="space-y-3">
                <?php foreach ($history as $wipe): ?>
                    <div class="bg-dark-900 rounded-lg p-4 border border-dark-700 opacity-75">
                        <div class="flex items-start justify-between mb-2 gap-3">
                            <div class="flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full <?= e(wipe_type_color($wipe['type'])) ?>"></span>
                                <span class="text-white font-semibold"><?= e(wipe_type_label($wipe['type'])) ?></span>
                            </div>
                            <span class="text-xs text-dark-400 flex-shrink-0"><?= e(format_short_date($wipe['date'])) ?></span>
                        </div>
                        <?php if ($wipe['mapSeed']): ?>
                            <div class="text-xs text-dark-400 font-mono">Seed: <?= e($wipe['mapSeed']) ?></div>
                        <?php endif; ?>
                        <?php if ($wipe['notes']): ?>
                            <p class="text-xs text-dark-400 mt-2"><?= e($wipe['notes']) ?></p>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>

    <div class="card card-accent mt-8">
        <h3 class="text-lg font-bold text-white mb-4">Wipe Information</h3>
        <div class="space-y-3 text-sm text-dark-300">
            <div class="flex items-start gap-3">
                <span class="w-3 h-3 rounded-full bg-red-500 mt-1 flex-shrink-0"></span>
                <div>
                    <strong class="text-white">Full Wipe:</strong> Everything is wiped including blueprints.
                    Fresh start for all players. Occurs on Facepunch force wipe (first Thursday of each month).
                </div>
            </div>
            <div class="flex items-start gap-3">
                <span class="w-3 h-3 rounded-full bg-yellow-500 mt-1 flex-shrink-0"></span>
                <div>
                    <strong class="text-white">Map Wipe:</strong> Only the map is wiped.
                    Players keep their blueprints. Occurs weekly on Thursdays.
                </div>
            </div>
            <div class="flex items-start gap-3">
                <span class="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></span>
                <div>
                    <strong class="text-white">BP Wipe:</strong> Only blueprints are wiped.
                    Map remains. Rare occurrence for special events.
                </div>
            </div>
        </div>
    </div>
</div>
