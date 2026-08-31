<?php /** 404. */ ?>
<div class="min-h-600 flex items-center justify-center px-4">
    <div class="text-center max-w-md">
        <div class="mb-8">
            <h1 class="text-9xl font-bold text-primary-500 mb-2">404</h1>
            <div class="flex items-center justify-center gap-2 text-text-tertiary">
                <?= icon('search', 'w-5 h-5') ?>
                <p class="text-lg">Page Not Found</p>
            </div>
        </div>

        <p class="text-text-secondary mb-8">The page you're looking for doesn't exist or has been moved.</p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/" class="btn-primary inline-flex items-center justify-center gap-2">
                <?= icon('home', 'w-4 h-4') ?>
                Go Home
            </a>
            <button type="button" class="btn-secondary inline-flex items-center justify-center gap-2" data-history-back>
                <?= icon('arrow-left', 'w-4 h-4') ?>
                Go Back
            </button>
        </div>

        <div class="mt-12">
            <p class="text-sm text-text-tertiary mb-4">Looking for something specific?</p>
            <div class="flex flex-wrap gap-2 justify-center text-sm">
                <a href="/commands" class="text-primary-500 hover:text-primary-400 transition-colors">Commands</a>
                <span class="text-text-disabled">&bull;</span>
                <a href="/gallery" class="text-primary-500 hover:text-primary-400 transition-colors">Gallery</a>
                <span class="text-text-disabled">&bull;</span>
                <a href="/login" class="text-primary-500 hover:text-primary-400 transition-colors">Login</a>
            </div>
        </div>
    </div>
</div>
