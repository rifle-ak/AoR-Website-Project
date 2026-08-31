<?php
/**
 * News management.
 *
 * @var array      $posts   All posts, drafts included.
 * @var array|null $editing The post being edited, when ?edit=<id> was given.
 */

$isEditing = $editing !== null;
$formOpen = $isEditing || query('new') === '1';
?>
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
            <h1 class="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <?= icon('newspaper', 'w-10 h-10 text-rust-500') ?>
                News Management
            </h1>
            <p class="text-dark-300">Create and manage server announcements</p>
        </div>
        <?php if (!$formOpen): ?>
            <a href="/admin/news?new=1" class="btn-primary flex items-center gap-2">
                <?= icon('plus', 'w-5 h-5') ?>
                Create Post
            </a>
        <?php endif; ?>
    </div>

    <?php if ($formOpen): ?>
        <div class="card mb-8">
            <h2 class="text-xl font-bold text-white mb-4"><?= $isEditing ? 'Edit Post' : 'Create New Post' ?></h2>
            <form method="post" action="/admin/news" class="space-y-4">
                <?= csrf_field() ?>
                <input type="hidden" name="action" value="<?= $isEditing ? 'update' : 'create' ?>">
                <?php if ($isEditing): ?>
                    <input type="hidden" name="id" value="<?= e($editing['id']) ?>">
                <?php endif; ?>

                <div>
                    <label for="news-title" class="block text-dark-300 text-sm font-medium mb-2">Title</label>
                    <input type="text" id="news-title" name="title" required maxlength="255"
                           value="<?= e($isEditing ? $editing['title'] : '') ?>" class="input-field w-full">
                </div>

                <div>
                    <label for="news-excerpt" class="block text-dark-300 text-sm font-medium mb-2">Excerpt (Optional)</label>
                    <input type="text" id="news-excerpt" name="excerpt" maxlength="500"
                           value="<?= e($isEditing ? (string) $editing['excerpt'] : '') ?>"
                           placeholder="Short summary for preview..." class="input-field w-full">
                </div>

                <div>
                    <label for="news-content" class="block text-dark-300 text-sm font-medium mb-2">Content</label>
                    <textarea id="news-content" name="content" required class="input-field w-full min-h-200"><?= e($isEditing ? $editing['content'] : '') ?></textarea>
                </div>

                <div class="flex items-center gap-2">
                    <input type="checkbox" id="published" name="published" value="1" class="checkbox"
                           <?= $isEditing && $editing['published'] ? 'checked' : '' ?>>
                    <label for="published" class="text-dark-300 text-sm">
                        <?= $isEditing ? 'Published' : 'Publish immediately' ?>
                    </label>
                </div>

                <div class="flex gap-3 flex-wrap">
                    <button type="submit" class="btn-primary flex items-center gap-2">
                        <?= icon('save', 'w-4 h-4') ?>
                        <?= $isEditing ? 'Update Post' : 'Create Post' ?>
                    </button>
                    <a href="/admin/news" class="btn-secondary flex items-center gap-2">
                        <?= icon('x', 'w-4 h-4') ?>
                        Cancel
                    </a>
                </div>
            </form>
        </div>
    <?php endif; ?>

    <?php if ($posts): ?>
        <div class="space-y-4">
            <?php foreach ($posts as $post): ?>
                <div class="card card-hover-accent transition-colors">
                    <div class="flex items-start justify-between gap-4 flex-wrap">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 class="text-xl font-bold text-white"><?= e($post['title']) ?></h3>
                                <?php if ($post['published']): ?>
                                    <span class="px-2 py-1 rounded badge-green text-xs font-medium flex items-center gap-1">
                                        <?= icon('eye', 'w-3 h-3') ?>
                                        Published
                                    </span>
                                <?php else: ?>
                                    <span class="px-2 py-1 rounded badge-yellow text-xs font-medium flex items-center gap-1">
                                        <?= icon('eye-off', 'w-3 h-3') ?>
                                        Draft
                                    </span>
                                <?php endif; ?>
                            </div>
                            <p class="text-dark-300 mb-3">
                                <?= e($post['excerpt'] ?: mb_substr($post['content'], 0, 150) . '...') ?>
                            </p>
                            <div class="flex items-center gap-4 text-sm text-dark-400 flex-wrap">
                                <span>By <?= e($post['author_name']) ?></span>
                                <span>&bull;</span>
                                <span><?= e(format_short_date($post['created_at'])) ?></span>
                            </div>
                        </div>
                        <div class="flex gap-2 flex-shrink-0">
                            <form method="post" action="/admin/news">
                                <?= csrf_field() ?>
                                <input type="hidden" name="action" value="toggle">
                                <input type="hidden" name="id" value="<?= e($post['id']) ?>">
                                <?php if (!$post['published']): ?>
                                    <input type="hidden" name="published" value="1">
                                <?php endif; ?>
                                <button type="submit" class="icon-btn icon-btn-green"
                                        title="<?= $post['published'] ? 'Unpublish' : 'Publish' ?>"
                                        aria-label="<?= $post['published'] ? 'Unpublish' : 'Publish' ?> <?= e($post['title']) ?>">
                                    <?= icon($post['published'] ? 'eye-off' : 'eye', 'w-4 h-4') ?>
                                </button>
                            </form>
                            <a href="/admin/news?edit=<?= e($post['id']) ?>" class="icon-btn icon-btn-blue" title="Edit"
                               aria-label="Edit <?= e($post['title']) ?>">
                                <?= icon('edit', 'w-4 h-4') ?>
                            </a>
                            <form method="post" action="/admin/news"
                                  data-confirm="Delete &quot;<?= e($post['title']) ?>&quot;? This cannot be undone.">
                                <?= csrf_field() ?>
                                <input type="hidden" name="action" value="delete">
                                <input type="hidden" name="id" value="<?= e($post['id']) ?>">
                                <button type="submit" class="icon-btn icon-btn-red" title="Delete"
                                        aria-label="Delete <?= e($post['title']) ?>">
                                    <?= icon('trash-2', 'w-4 h-4') ?>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php else: ?>
        <div class="card text-center py-12">
            <div class="flex justify-center mb-4"><?= icon('newspaper', 'w-16 h-16 text-dark-600') ?></div>
            <h3 class="text-xl font-semibold text-dark-300 mb-2">No News Posts</h3>
            <p class="text-dark-400 mb-4">Create your first announcement to get started.</p>
            <a href="/admin/news?new=1" class="btn-primary inline-flex items-center gap-2">
                <?= icon('plus', 'w-4 h-4') ?>
                Create Post
            </a>
        </div>
    <?php endif; ?>
</div>
