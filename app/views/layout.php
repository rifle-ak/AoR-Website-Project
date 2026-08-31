<?php
/**
 * Site layout.
 *
 * @var string $content Rendered page body.
 * @var array  $meta    title, description, keywords, image, type.
 */

$themeId = current_theme_id();
$theme = THEMES[$themeId];

$title = isset($meta['title']) ? $meta['title'] . ' | ' . SITE_NAME : SITE_TAGLINE;
$description = $meta['description'] ?? SITE_DESCRIPTION;
$keywords = $meta['keywords'] ?? SITE_KEYWORDS;
$image = $meta['image'] ?? SITE_OG_IMAGE;
$type = $meta['type'] ?? 'website';
$canonical = SITE_URL . current_path();
$flashes = take_flashes();
?>
<!doctype html>
<html lang="en" data-theme="<?= e($themeId) ?>" style="<?= e(theme_css_vars($themeId)) ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($title) ?></title>
    <meta name="description" content="<?= e($description) ?>">
    <meta name="keywords" content="<?= e($keywords) ?>">
    <meta name="author" content="<?= e(SITE_NAME) ?>">
    <meta name="theme-color" content="<?= e($theme['colors']['background']['main']) ?>">
    <link rel="canonical" href="<?= e($canonical) ?>">
    <link rel="icon" type="image/svg+xml" href="/assets/rust-icon.svg">

    <meta property="og:title" content="<?= e($title) ?>">
    <meta property="og:description" content="<?= e($description) ?>">
    <meta property="og:image" content="<?= e($image) ?>">
    <meta property="og:url" content="<?= e($canonical) ?>">
    <meta property="og:type" content="<?= e($type) ?>">
    <meta property="og:site_name" content="<?= e(SITE_NAME) ?>">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= e($title) ?>">
    <meta name="twitter:description" content="<?= e($description) ?>">
    <meta name="twitter:image" content="<?= e($image) ?>">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap">
    <link rel="stylesheet" href="/assets/css/app.css?v=<?= e(ASSET_VERSION) ?>">
</head>
<body class="min-h-screen flex flex-col">
    <?php partial('navbar'); ?>

    <main class="flex-grow">
        <?php if ($flashes): ?>
            <div class="flash-stack" role="status" aria-live="polite">
                <?php foreach ($flashes as $flashMessage): ?>
                    <div class="flash flash-<?= e($flashMessage['type']) ?>">
                        <span><?= e($flashMessage['message']) ?></span>
                        <button type="button" class="flash-close" data-dismiss-flash aria-label="Dismiss">
                            <?= icon('x', 'w-4 h-4') ?>
                        </button>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <?= $content ?>
    </main>

    <?php partial('footer'); ?>
    <?php partial('connection-status'); ?>

    <script src="/assets/js/app.js?v=<?= e(ASSET_VERSION) ?>" defer></script>
</body>
</html>
