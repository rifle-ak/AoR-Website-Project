<?php
/**
 * Server commands reference.
 *
 * Filtering happens in the browser so typing is instant; the ?q= parameter
 * keeps the same view shareable and working without JavaScript.
 *
 * @var string $search
 */

$needle = mb_strtolower($search);

$categories = [];
foreach (RUST_COMMANDS as $group) {
    $matches = array_values(array_filter($group['commands'], function ($cmd) use ($needle) {
        return $needle === ''
            || str_contains(mb_strtolower($cmd['command']), $needle)
            || str_contains(mb_strtolower($cmd['description']), $needle);
    }));

    if ($matches) {
        $categories[] = ['category' => $group['category'], 'commands' => $matches];
    }
}
?>
<div class="min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-white mb-4">Rust Server Commands</h1>
            <p class="text-lg text-dark-300 max-w-3xl mx-auto">
                Complete list of commands available on our <?= e(SITE_NAME) ?> servers. Click on any command to copy it to your clipboard.
            </p>
        </div>

        <div class="mb-8">
            <form method="get" action="/commands" class="relative max-w-md mx-auto" data-filter-form>
                <?= icon('search', 'w-5 h-5 input-icon text-dark-400') ?>
                <label for="command-search" class="sr-only">Search commands</label>
                <input type="search" id="command-search" name="q" value="<?= e($search) ?>"
                       placeholder="Search commands..." class="input-field w-full pl-10"
                       data-filter-input data-filter-target="[data-command]" data-filter-group="[data-command-group]">
            </form>
        </div>

        <div class="space-y-8">
            <?php foreach ($categories as $group): ?>
                <div class="card" data-command-group>
                    <h2 class="text-2xl font-bold text-white mb-6 flex items-center">
                        <?= icon('terminal', 'w-6 h-6 text-rust-500 mr-3') ?>
                        <?= e($group['category']) ?>
                    </h2>
                    <div class="grid md:grid-cols-2 gap-4">
                        <?php foreach ($group['commands'] as $cmd): ?>
                            <div class="bg-dark-700 border border-dark-600 rounded-lg p-4 hover:border-rust-500 transition-colors"
                                 data-command data-search="<?= e(mb_strtolower($cmd['command'] . ' ' . $cmd['description'])) ?>">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <code class="text-rust-400 font-mono text-sm"><?= e($cmd['command']) ?></code>
                                        <p class="text-dark-300 text-sm mt-1"><?= e($cmd['description']) ?></p>
                                    </div>
                                    <button type="button"
                                            class="ml-3 flex items-center space-x-1 text-rust-500 hover:text-rust-400 transition-colors flex-shrink-0"
                                            data-copy="<?= e($cmd['command']) ?>"
                                            title="Copy command"
                                            aria-label="Copy <?= e($cmd['command']) ?>">
                                        <span data-copy-icon="idle"><?= icon('copy', 'w-4 h-4') ?></span>
                                        <span data-copy-icon="done" hidden><?= icon('check', 'w-4 h-4 text-green-500') ?></span>
                                        <span data-copy-icon="error" hidden><?= icon('alert-circle', 'w-4 h-4 text-red-500') ?></span>
                                    </button>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="text-center py-12" data-filter-empty <?= $categories ? 'hidden' : '' ?>>
            <p class="text-dark-400 text-lg">
                No commands found matching &ldquo;<span data-filter-term><?= e($search) ?></span>&rdquo;
            </p>
        </div>

        <div class="mt-12 card">
            <h3 class="text-xl font-semibold text-white mb-4">Quick Tips</h3>
            <ul class="space-y-2 text-dark-300">
                <li>&bull; Use the <code class="text-rust-400">/help</code> command in-game to see all available commands</li>
                <li>&bull; Most commands require you to type them in the game chat</li>
                <li>&bull; Admin commands require special permissions</li>
                <li>&bull; Some commands may have cooldowns to prevent spam</li>
            </ul>
        </div>
    </div>
</div>
