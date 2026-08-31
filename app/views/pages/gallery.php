<?php
/**
 * Community gallery with category filter and a lightbox.
 *
 * @var string $category Selected category slug, or "all".
 */

$valid = array_column(GALLERY_CATEGORIES, 'value');
if (!in_array($category, $valid, true)) {
    $category = 'all';
}

$items = array_values(array_filter(GALLERY_ITEMS, function ($item) use ($category) {
    return $category === 'all' || $item['category'] === $category;
}));
?>
<div class="min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-white mb-4">Community Gallery</h1>
            <p class="text-lg text-dark-300 max-w-3xl mx-auto">
                Amazing moments captured by our community members. Submit your screenshots in Discord to be featured!
            </p>
        </div>

        <div class="mb-8 flex justify-center">
            <div class="flex flex-wrap gap-2">
                <?php foreach (GALLERY_CATEGORIES as $option): ?>
                    <a href="/gallery?category=<?= e($option['value']) ?>"
                       class="px-4 py-2 rounded-lg font-medium transition-colors <?= $category === $option['value'] ? 'bg-rust-500 text-white' : 'bg-dark-700 text-dark-300 hover:bg-dark-600' ?>">
                        <?= e($option['label']) ?>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php foreach ($items as $item): ?>
                <button type="button" class="card card-interactive group hover:border-rust-500 transition-all duration-300 text-left"
                        data-lightbox
                        data-image="<?= e($item['image']) ?>"
                        data-title="<?= e($item['title']) ?>"
                        data-author="<?= e($item['author']) ?>"
                        data-date="<?= e(format_short_date($item['date'])) ?>">
                    <div class="relative overflow-hidden rounded-lg mb-4">
                        <img src="<?= e($item['image']) ?>" alt="<?= e($item['title']) ?>" loading="lazy"
                             class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
                        <div class="absolute inset-0 gallery-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h3 class="text-lg font-semibold text-white mb-2"><?= e($item['title']) ?></h3>
                    <div class="flex items-center justify-between text-sm text-dark-400">
                        <span class="flex items-center space-x-1">
                            <?= icon('user', 'w-4 h-4') ?>
                            <span><?= e($item['author']) ?></span>
                        </span>
                        <span class="flex items-center space-x-1">
                            <?= icon('calendar', 'w-4 h-4') ?>
                            <span><?= e(format_short_date($item['date'])) ?></span>
                        </span>
                    </div>
                </button>
            <?php endforeach; ?>
        </div>

        <?php if (!$items): ?>
            <div class="text-center py-12">
                <p class="text-dark-400 text-lg">No images found in this category</p>
            </div>
        <?php endif; ?>

        <div class="mt-12 text-center">
            <p class="text-dark-300 mb-4">Want to submit your own screenshots? Join our Discord server!</p>
            <a href="<?= e(DISCORD_INVITE) ?>" target="_blank" rel="noopener noreferrer" class="btn-primary">Join Discord</a>
        </div>
    </div>
</div>

<div class="lightbox" data-lightbox-modal hidden>
    <div class="lightbox-inner">
        <button type="button" class="lightbox-close text-white hover:text-rust-500 transition-colors" data-lightbox-close aria-label="Close">
            <?= icon('x', 'w-8 h-8') ?>
        </button>

        <div class="bg-dark-800 rounded-lg overflow-hidden">
            <img src="" alt="" class="w-full h-auto lightbox-image" data-lightbox-image>
            <div class="p-6">
                <h2 class="text-2xl font-bold text-white mb-2" data-lightbox-title></h2>
                <div class="flex items-center justify-between text-dark-300 flex-wrap gap-4">
                    <div class="flex items-center space-x-4">
                        <span class="flex items-center space-x-2">
                            <?= icon('user', 'w-5 h-5') ?>
                            <span data-lightbox-author></span>
                        </span>
                        <span class="flex items-center space-x-2">
                            <?= icon('calendar', 'w-5 h-5') ?>
                            <span data-lightbox-date></span>
                        </span>
                    </div>
                    <a href="#" target="_blank" rel="noopener noreferrer"
                       class="flex items-center space-x-2 text-rust-500 hover:text-rust-400 transition-colors" data-lightbox-download>
                        <?= icon('download', 'w-5 h-5') ?>
                        <span>Open full size</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
