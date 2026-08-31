<?php
/**
 * Discord presence card. Member counts come from the guild widget endpoint,
 * which only answers when the server has its widget enabled - the card renders
 * fine either way.
 */
?>
<div class="card" data-discord-widget data-invite="<?= e(DISCORD_INVITE) ?>">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <?= discord_icon('w-6 h-6', '#5865F2') ?>
            Discord
        </h3>
        <div class="flex items-center gap-2 text-green-500 text-sm" data-discord-presence hidden>
            <?= icon('circle', 'w-2 h-2 fill-current') ?>
            <span data-discord-online></span> online
        </div>
    </div>

    <div class="mb-4" data-discord-members hidden>
        <div class="flex items-center justify-between text-sm mb-2">
            <span class="text-dark-400">Total Members</span>
            <span class="text-white font-semibold flex items-center gap-1">
                <?= icon('users', 'w-4 h-4') ?>
                <span data-discord-total>&mdash;</span>
            </span>
        </div>
    </div>

    <a href="<?= e(DISCORD_INVITE) ?>" target="_blank" rel="noopener noreferrer" class="btn-primary w-full text-center block">
        Join Our Discord
    </a>
</div>
