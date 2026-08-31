<?php
/** Server rules and rates. */

$severityIcon = [
    'ban' => ['alert-triangle', 'text-red-500'],
    'warning' => ['shield', 'text-yellow-500'],
    'info' => ['info', 'text-blue-500'],
];

$severityBadge = [
    'ban' => ['Instant Ban', 'badge-red'],
    'warning' => ['Warning/Kick', 'badge-yellow'],
    'info' => ['Info', 'badge-blue'],
];
?>
<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-12 text-center">
        <h1 class="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <?= icon('shield', 'w-10 h-10 text-rust-500') ?>
            Server Rules &amp; Information
        </h1>
        <p class="text-dark-300 text-lg max-w-2xl mx-auto">
            Please read and follow these rules to ensure a fair and enjoyable experience for everyone on <?= e(SITE_NAME) ?>.
        </p>
    </div>

    <div class="mb-12">
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <?= icon('info', 'w-6 h-6 text-rust-500') ?>
            Server Information
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <?php foreach (server_info_rows() as $info): ?>
                <div class="card">
                    <div class="flex items-center justify-between">
                        <span class="text-dark-400 text-sm"><?= e($info['label']) ?></span>
                        <?= icon('check-circle', 'w-4 h-4 text-green-500') ?>
                    </div>
                    <p class="text-white font-semibold mt-2"><?= e($info['value']) ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <div>
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <?= icon('alert-triangle', 'w-6 h-6 text-rust-500') ?>
            Server Rules
        </h2>
        <div class="space-y-4">
            <?php foreach (SERVER_RULES as $index => $rule): ?>
                <?php
                [$iconName, $iconClass] = $severityIcon[$rule['severity']] ?? $severityIcon['info'];
                [$badgeLabel, $badgeClass] = $severityBadge[$rule['severity']] ?? $severityBadge['info'];
                ?>
                <div class="card card-hover-accent transition-colors">
                    <div class="flex items-start gap-4">
                        <div class="mt-1"><?= icon($iconName, 'w-5 h-5 ' . $iconClass) ?></div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between mb-2 gap-3">
                                <h3 class="text-lg font-bold text-white"><?= e($index + 1) ?>. <?= e($rule['title']) ?></h3>
                                <span class="text-xs px-2 py-1 rounded font-medium flex-shrink-0 <?= e($badgeClass) ?>"><?= e($badgeLabel) ?></span>
                            </div>
                            <p class="text-dark-300"><?= e($rule['description']) ?></p>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="mt-12 card card-accent">
        <div class="flex items-start gap-3">
            <?= icon('info', 'w-5 h-5 text-rust-500 mt-1') ?>
            <div>
                <h3 class="text-white font-bold mb-2">Have Questions?</h3>
                <p class="text-dark-300 mb-3">
                    If you have questions about the rules or need to report a player, please open a ticket on our Discord server. Our admin team is here to help!
                </p>
                <a href="<?= e(DISCORD_INVITE) ?>" target="_blank" rel="noopener noreferrer" class="btn-primary inline-block text-sm">
                    Open Discord Ticket
                </a>
            </div>
        </div>
    </div>
</div>
