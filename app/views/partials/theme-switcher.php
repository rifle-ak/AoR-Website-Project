<?php
/**
 * Theme picker. The choice is stored in a cookie so the next page render
 * already carries the right palette, and applied immediately in the browser so
 * the switch feels instant.
 *
 * @var string $id Suffix keeping ids unique when the switcher appears twice.
 */

$id = $id ?? 'desktop';
$themeId = current_theme_id();
$theme = THEMES[$themeId];
?>
<div class="relative" data-dropdown>
    <button type="button"
            class="flex items-center space-x-2 px-3 py-2 rounded-lg bg-surface-main hover:bg-surface-hover transition-colors border border-surface-border"
            data-dropdown-toggle aria-label="Select theme" aria-expanded="false" aria-haspopup="true">
        <?= icon('palette', 'w-5 h-5 text-primary-500') ?>
        <span class="text-sm font-medium text-text-primary hidden sm:inline" data-theme-name><?= e($theme['name']) ?></span>
    </button>

    <div class="absolute right-0 mt-2 w-72 bg-surface-main border border-surface-border rounded-lg shadow-lg z-50 overflow-hidden"
         data-dropdown-menu hidden>
        <div class="p-3 border-b border-surface-border">
            <h3 class="text-sm font-semibold text-text-primary flex items-center gap-2">
                <?= icon('palette', 'w-4 h-4') ?>
                Choose Theme
            </h3>
        </div>

        <div class="p-2 max-h-96 overflow-y-auto">
            <?php foreach (THEMES as $optionId => $option): ?>
                <?php $isSelected = $optionId === $themeId; ?>
                <button type="button"
                        data-theme-option="<?= e($optionId) ?>"
                        data-theme-vars="<?= e(theme_css_vars($optionId)) ?>"
                        data-theme-label="<?= e($option['name']) ?>"
                        class="theme-option w-full text-left px-3 py-3 rounded-lg transition-colors <?= $isSelected ? 'bg-primary-500-10 border border-primary-500-30' : 'hover:bg-surface-hover border border-transparent' ?>"
                        <?= $isSelected ? 'aria-current="true"' : '' ?>>
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="font-medium text-sm <?= $isSelected ? 'text-primary-500' : 'text-text-primary' ?>">
                                    <?= e($option['name']) ?>
                                </span>
                                <span data-theme-check <?= $isSelected ? '' : 'hidden' ?>>
                                    <?= icon('check', 'w-4 h-4 text-primary-500 flex-shrink-0') ?>
                                </span>
                            </div>
                            <p class="text-xs text-text-tertiary"><?= e($option['description']) ?></p>

                            <div class="flex gap-1 mt-2">
                                <span class="w-4 h-4 rounded-full border border-surface-border" style="background-color: <?= e($option['colors']['primary'][500]) ?>" title="Primary color"></span>
                                <span class="w-4 h-4 rounded-full border border-surface-border" style="background-color: <?= e($option['colors']['background']['main']) ?>" title="Background color"></span>
                                <span class="w-4 h-4 rounded-full border border-surface-border" style="background-color: <?= e($option['colors']['surface']['main']) ?>" title="Surface color"></span>
                            </div>
                        </div>
                    </div>
                </button>
            <?php endforeach; ?>
        </div>

        <div class="p-2 border-t border-surface-border bg-surface-secondary-50">
            <p class="text-xs text-text-tertiary text-center">Theme preference saved to this browser</p>
        </div>
    </div>
</div>
