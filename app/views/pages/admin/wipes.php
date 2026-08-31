<?php
/**
 * Wipe management.
 *
 * @var array $wipes Raw rows from data_all_wipes(), newest first.
 */

$formOpen = query('new') === '1';
$now = time();

$upcoming = [];
$past = [];
foreach ($wipes as $wipe) {
    if (!$wipe['completed'] && strtotime($wipe['date']) >= $now) {
        $upcoming[] = $wipe;
    } else {
        $past[] = $wipe;
    }
}
// Upcoming reads best soonest-first; history stays newest-first.
usort($upcoming, fn($a, $b) => strtotime($a['date']) <=> strtotime($b['date']));

$typeBadge = [
    'full' => 'badge-red',
    'map' => 'badge-blue',
    'bp' => 'badge-yellow',
];

$typeName = ['full' => 'Full Wipe', 'map' => 'Map Wipe', 'bp' => 'BP Wipe'];
?>
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
            <h1 class="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <?= icon('calendar', 'w-10 h-10 text-rust-500') ?>
                Wipe Management
            </h1>
            <p class="text-dark-300">Schedule and track server wipes</p>
        </div>
        <?php if (!$formOpen): ?>
            <a href="/admin/wipes?new=1" class="btn-primary flex items-center gap-2">
                <?= icon('plus', 'w-5 h-5') ?>
                Schedule Wipe
            </a>
        <?php endif; ?>
    </div>

    <?php if ($formOpen): ?>
        <div class="card mb-8">
            <h2 class="text-xl font-bold text-white mb-4">Schedule New Wipe</h2>
            <form method="post" action="/admin/wipes" class="space-y-4">
                <?= csrf_field() ?>
                <input type="hidden" name="action" value="create">

                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label for="wipe-type" class="block text-dark-300 text-sm font-medium mb-2">Wipe Type</label>
                        <select id="wipe-type" name="type" class="input-field w-full">
                            <option value="full">Full Wipe (Map + BP)</option>
                            <option value="map">Map Only</option>
                            <option value="bp">Blueprint Only</option>
                        </select>
                    </div>

                    <div>
                        <label for="wipe-date" class="block text-dark-300 text-sm font-medium mb-2">
                            Wipe Date &amp; Time <span class="text-dark-500">(UTC)</span>
                        </label>
                        <input type="datetime-local" id="wipe-date" name="date" required class="input-field w-full">
                    </div>

                    <div>
                        <label for="wipe-map-size" class="block text-dark-300 text-sm font-medium mb-2">Map Size</label>
                        <input type="number" id="wipe-map-size" name="map_size" value="<?= e(MAP_SIZE) ?>"
                               min="1000" max="6000" step="500" class="input-field w-full">
                    </div>

                    <div>
                        <label for="wipe-map-seed" class="block text-dark-300 text-sm font-medium mb-2">Map Seed (Optional)</label>
                        <input type="text" id="wipe-map-seed" name="map_seed" maxlength="50"
                               placeholder="Leave empty for random" class="input-field w-full">
                    </div>
                </div>

                <div>
                    <label for="wipe-notes" class="block text-dark-300 text-sm font-medium mb-2">Notes (Optional)</label>
                    <textarea id="wipe-notes" name="notes" rows="3"
                              placeholder="Any additional information about this wipe..." class="input-field w-full"></textarea>
                </div>

                <div class="flex gap-3 flex-wrap">
                    <button type="submit" class="btn-primary">Schedule Wipe</button>
                    <a href="/admin/wipes" class="btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    <?php endif; ?>

    <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-4">Upcoming Wipes</h2>
        <?php if ($upcoming): ?>
            <div class="space-y-4">
                <?php foreach ($upcoming as $wipe): ?>
                    <div class="card card-hover-accent transition-colors">
                        <div class="flex items-start justify-between gap-4 flex-wrap">
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-3 mb-2 flex-wrap">
                                    <span class="px-3 py-1 rounded text-sm font-medium <?= e($typeBadge[$wipe['type']] ?? 'badge-neutral') ?>">
                                        <?= e($typeName[$wipe['type']] ?? $wipe['type']) ?>
                                    </span>
                                    <span class="text-white font-bold"><?= e(format_datetime($wipe['date'])) ?></span>
                                </div>
                                <div class="flex items-center gap-4 text-sm text-dark-300 mb-2 flex-wrap">
                                    <span>Map Size: <?= e($wipe['map_size'] ?: '-') ?></span>
                                    <?php if ($wipe['map_seed']): ?>
                                        <span>Seed: <?= e($wipe['map_seed']) ?></span>
                                    <?php endif; ?>
                                </div>
                                <?php if ($wipe['notes']): ?>
                                    <p class="text-dark-400 text-sm"><?= e($wipe['notes']) ?></p>
                                <?php endif; ?>
                            </div>
                            <form method="post" action="/admin/wipes" class="flex-shrink-0">
                                <?= csrf_field() ?>
                                <input type="hidden" name="action" value="complete">
                                <input type="hidden" name="id" value="<?= e($wipe['id']) ?>">
                                <button type="submit" class="btn-primary text-sm flex items-center gap-2">
                                    <?= icon('check-circle', 'w-4 h-4') ?>
                                    Mark Complete
                                </button>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <div class="card text-center py-8">
                <div class="flex justify-center mb-3"><?= icon('calendar', 'w-12 h-12 text-dark-600') ?></div>
                <p class="text-dark-400">No upcoming wipes scheduled</p>
            </div>
        <?php endif; ?>
    </div>

    <div>
        <h2 class="text-2xl font-bold text-white mb-4">Past Wipes</h2>
        <?php if ($past): ?>
            <div class="space-y-3">
                <?php foreach (array_slice($past, 0, 10) as $wipe): ?>
                    <div class="card opacity-60">
                        <div class="flex items-center gap-4 flex-wrap">
                            <?= icon('check-circle', 'w-5 h-5 text-green-500') ?>
                            <span class="px-2 py-1 rounded text-xs font-medium <?= e($typeBadge[$wipe['type']] ?? 'badge-neutral') ?>">
                                <?= e($typeName[$wipe['type']] ?? $wipe['type']) ?>
                            </span>
                            <span class="text-dark-300"><?= e(format_date($wipe['date'])) ?></span>
                            <span class="text-dark-400 text-sm">Map Size: <?= e($wipe['map_size'] ?: '-') ?></span>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <div class="card text-center py-8">
                <p class="text-dark-400">No past wipes</p>
            </div>
        <?php endif; ?>
    </div>
</div>
