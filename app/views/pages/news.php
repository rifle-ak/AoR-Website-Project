<?php
/**
 * News and announcements.
 *
 * @var array $posts From data_news().
 */
?>
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <?= icon('newspaper', 'w-10 h-10 text-rust-500') ?>
            News &amp; Updates
        </h1>
        <p class="text-dark-300 text-lg">Latest server news, events, and announcements</p>
    </div>

    <?php if (!$posts): ?>
        <div class="card text-center py-12">
            <div class="flex justify-center mb-4"><?= icon('newspaper', 'w-16 h-16 text-dark-600') ?></div>
            <h3 class="text-xl font-semibold text-dark-300 mb-2">No news yet</h3>
            <p class="text-dark-400">Check back later for updates!</p>
        </div>
    <?php else: ?>
        <div class="space-y-6">
            <?php foreach ($posts as $post): ?>
                <article class="card card-hover-accent transition-colors">
                    <h2 class="text-2xl font-bold text-white mb-3"><?= e($post['title']) ?></h2>

                    <div class="flex items-center gap-4 text-sm text-dark-400 mb-4 flex-wrap">
                        <span class="flex items-center gap-2">
                            <?= icon('calendar', 'w-4 h-4') ?>
                            <?= e(format_date($post['created_at'])) ?>
                        </span>
                        <?php if ($post['author_name']): ?>
                            <span class="flex items-center gap-2">
                                <?= icon('user', 'w-4 h-4') ?>
                                <?= e($post['author_name']) ?>
                            </span>
                        <?php endif; ?>
                    </div>

                    <div class="text-dark-200 prose-content"><?= nl2br(e($post['content'])) ?></div>
                </article>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>
