<?php
/**
 * Home page.
 *
 * @var array $status   From data_server_status().
 * @var array $schedule From data_wipe_schedule().
 */
?>
<div class="space-y-16">
    <section class="relative bg-gradient-dark py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-8 items-start">
                <div>
                    <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                        Welcome to <span class="text-rust-500"><?= e(SITE_NAME) ?></span>
                    </h1>
                    <p class="text-xl text-dark-300 mb-8">
                        Experience Rust like never before. Join our thriving community of survivors, builders, and warriors in the ultimate survival adventure.
                    </p>
                    <p class="text-lg text-dark-50 italic mb-4">&ldquo;Explore. Build. Survive.&rdquo;</p>
                    <div class="flex flex-wrap gap-4">
                        <a href="<?= e(DISCORD_INVITE) ?>" target="_blank" rel="noopener noreferrer" class="btn-primary">Join Discord</a>
                        <a href="/commands" class="btn-secondary">View Commands</a>
                    </div>
                </div>

                <div class="space-y-4">
                    <?php partial('server-status', ['status' => $status, 'schedule' => $schedule]); ?>
                    <?php partial('discord-widget'); ?>
                </div>
            </div>
        </div>
    </section>

    <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose <?= e(SITE_NAME) ?>?</h2>
                <p class="text-lg text-dark-300 max-w-2xl mx-auto">
                    We provide the best Rust gaming experience with dedicated servers and an amazing community.
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <?php foreach (HOME_FEATURES as $feature): ?>
                    <div class="card text-center">
                        <div class="w-12 h-12 bg-rust-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <?= icon($feature['icon'], 'w-6 h-6 text-white') ?>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-2"><?= e($feature['title']) ?></h3>
                        <p class="text-dark-300"><?= e($feature['description']) ?></p>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <section class="py-16 bg-dark-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h2 class="text-3xl md:text-4xl font-bold text-white mb-8">Join Our Community</h2>
                <div class="flex flex-wrap justify-center gap-4">
                    <a href="<?= e(DISCORD_INVITE) ?>" target="_blank" rel="noopener noreferrer" class="btn-primary">Join Discord</a>
                    <a href="/gallery" class="btn-secondary">View Gallery</a>
                    <a href="/commands" class="btn-secondary">Server Commands</a>
                </div>
            </div>
        </div>
    </section>
</div>
