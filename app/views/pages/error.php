<?php
/**
 * Fallback page for database outages and unexpected failures.
 *
 * @var string $message
 */
?>
<div class="min-h-600 flex items-center justify-center px-4">
    <div class="text-center max-w-md">
        <div class="mb-8 flex justify-center">
            <?= icon('alert-triangle', 'w-16 h-16 text-rust-500') ?>
        </div>
        <h1 class="text-3xl font-bold text-white mb-4">We hit a snag</h1>
        <p class="text-dark-300 mb-8"><?= e($message) ?></p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/" class="btn-primary inline-flex items-center justify-center gap-2">
                <?= icon('home', 'w-4 h-4') ?>
                Go Home
            </a>
            <a href="<?= e(DISCORD_INVITE) ?>" target="_blank" rel="noopener noreferrer" class="btn-secondary inline-flex items-center justify-center gap-2">
                Report on Discord
            </a>
        </div>
    </div>
</div>
