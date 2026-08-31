<?php /** Site footer. */ ?>
<footer class="bg-dark-800 border-t border-dark-700 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-3 gap-8">
            <div>
                <div class="flex items-center space-x-2 mb-4">
                    <div class="w-8 h-8 bg-rust-500 rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-sm">AOR</span>
                    </div>
                    <span class="text-white font-bold text-xl"><?= e(SITE_NAME) ?></span>
                </div>
                <p class="text-dark-400 text-sm">
                    The ultimate Rust gaming experience with dedicated servers and an amazing community.
                </p>
            </div>

            <div>
                <h3 class="text-white font-semibold mb-4">Quick Links</h3>
                <ul class="space-y-2 text-sm">
                    <li><a href="/" class="text-dark-400 hover:text-rust-500 transition-colors">Home</a></li>
                    <li><a href="/commands" class="text-dark-400 hover:text-rust-500 transition-colors">Server Commands</a></li>
                    <li><a href="/gallery" class="text-dark-400 hover:text-rust-500 transition-colors">Gallery</a></li>
                    <li>
                        <a href="<?= e(DONATE_URL) ?>" target="_blank" rel="noopener noreferrer"
                           class="text-dark-400 hover:text-rust-500 transition-colors flex items-center space-x-1">
                            <span>Donate</span>
                            <?= icon('external-link', 'w-3 h-3') ?>
                        </a>
                    </li>
                </ul>
            </div>

            <div>
                <h3 class="text-white font-semibold mb-4">Contact</h3>
                <div class="space-y-2 text-sm">
                    <a href="mailto:<?= e(CONTACT_EMAIL) ?>" class="text-dark-400 hover:text-rust-500 transition-colors flex items-center space-x-2">
                        <?= icon('mail', 'w-4 h-4') ?>
                        <span><?= e(CONTACT_EMAIL) ?></span>
                    </a>
                </div>
            </div>
        </div>

        <div class="mt-8 pt-8 border-t border-dark-700 text-center text-sm text-dark-400">
            <p>Copyright &copy; <?= e(date('Y')) ?> Art Of Rust - All Rights Reserved.</p>
            <p class="mt-2">Rust and associated Rust images are copyright of Facepunch Studios LTD.</p>
        </div>
    </div>
</footer>
