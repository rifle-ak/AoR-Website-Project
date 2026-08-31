<?php
/**
 * Sign in / create account.
 *
 * Steam is the working sign-in path; the account form below it validates on
 * both sides but says plainly that password accounts are not enabled yet.
 *
 * @var string $mode   login | register
 * @var array  $errors Field name => message, plus an optional "form" key.
 * @var array  $values Sticky values for username and email.
 */

$isLogin = $mode === 'login';

/** Border colour for a field that has been submitted and rejected. */
$fieldClass = function (string $field) use ($errors): string {
    return 'input-field w-full pl-10 pr-10' . (isset($errors[$field]) ? ' border-red-500 focus-ring-red' : '');
};
?>
<div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
        <div class="text-center">
            <div class="flex justify-center mb-6">
                <div class="w-16 h-16 bg-rust-500 rounded-lg flex items-center justify-center">
                    <span class="text-white font-bold text-xl">AOR</span>
                </div>
            </div>
            <h2 class="text-3xl font-bold text-white mb-2"><?= $isLogin ? 'Sign In' : 'Create Account' ?></h2>
            <p class="text-dark-300">
                <?= $isLogin ? 'Welcome back to ' . e(SITE_NAME) : 'Join the ' . e(SITE_NAME) . ' community' ?>
            </p>
        </div>

        <div class="card">
            <a href="/auth/steam" class="btn-primary w-full flex items-center justify-center gap-2">
                <?= icon('log-in', 'w-5 h-5') ?>
                Sign in with Steam
            </a>
            <p class="text-xs text-dark-400 text-center mt-3">
                Signing in with Steam creates your account automatically - no password needed.
            </p>
        </div>

        <div class="divider"><span>or use an account</span></div>

        <div class="card">
            <?php if (isset($errors['form'])): ?>
                <div class="alert alert-error mb-6">
                    <?= icon('alert-circle', 'w-5 h-5 flex-shrink-0') ?>
                    <span><?= e($errors['form']) ?></span>
                </div>
            <?php endif; ?>

            <form method="post" action="/login" class="space-y-6" novalidate data-login-form>
                <?= csrf_field() ?>
                <input type="hidden" name="mode" value="<?= e($mode) ?>" data-login-mode>

                <?php if (!$isLogin): ?>
                    <div>
                        <label for="username" class="block text-sm font-medium text-dark-300 mb-2">Username</label>
                        <div class="relative">
                            <?= icon('user', 'w-5 h-5 input-icon text-dark-400') ?>
                            <input id="username" name="username" type="text" value="<?= e($values['username']) ?>"
                                   class="<?= e($fieldClass('username')) ?>" placeholder="Choose a username"
                                   <?= isset($errors['username']) ? 'aria-invalid="true" aria-describedby="username-error"' : '' ?>>
                        </div>
                        <?php if (isset($errors['username'])): ?>
                            <p id="username-error" class="mt-1 text-sm text-red-400 flex items-center gap-1">
                                <?= icon('alert-circle', 'w-4 h-4') ?>
                                <?= e($errors['username']) ?>
                            </p>
                        <?php endif; ?>
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-dark-300 mb-2">Email Address</label>
                        <div class="relative">
                            <?= icon('mail', 'w-5 h-5 input-icon text-dark-400') ?>
                            <input id="email" name="email" type="email" value="<?= e($values['email']) ?>"
                                   class="<?= e($fieldClass('email')) ?>" placeholder="your@email.com"
                                   <?= isset($errors['email']) ? 'aria-invalid="true" aria-describedby="email-error"' : '' ?>>
                        </div>
                        <?php if (isset($errors['email'])): ?>
                            <p id="email-error" class="mt-1 text-sm text-red-400 flex items-center gap-1">
                                <?= icon('alert-circle', 'w-4 h-4') ?>
                                <?= e($errors['email']) ?>
                            </p>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>

                <div>
                    <label for="password" class="block text-sm font-medium text-dark-300 mb-2">Password</label>
                    <div class="relative">
                        <?= icon('lock', 'w-5 h-5 input-icon text-dark-400') ?>
                        <input id="password" name="password" type="password"
                               class="<?= e($fieldClass('password')) ?>"
                               placeholder="<?= $isLogin ? 'Enter your password' : 'Create a password' ?>"
                               data-password-input
                               <?= isset($errors['password']) ? 'aria-invalid="true" aria-describedby="password-error"' : '' ?>>
                        <button type="button" class="input-action text-dark-400 hover:text-dark-300"
                                data-toggle-password="password" aria-label="Show password">
                            <span data-eye="show"><?= icon('eye', 'w-5 h-5') ?></span>
                            <span data-eye="hide" hidden><?= icon('eye-off', 'w-5 h-5') ?></span>
                        </button>
                    </div>
                    <?php if (isset($errors['password'])): ?>
                        <p id="password-error" class="mt-1 text-sm text-red-400 flex items-center gap-1">
                            <?= icon('alert-circle', 'w-4 h-4') ?>
                            <?= e($errors['password']) ?>
                        </p>
                    <?php endif; ?>

                    <?php if (!$isLogin): ?>
                        <div class="mt-2" data-password-strength hidden>
                            <div class="flex items-center justify-between text-xs text-dark-400 mb-1">
                                <span>Password strength</span>
                                <span data-strength-label></span>
                            </div>
                            <div class="w-full bg-dark-600 rounded-full h-1">
                                <div class="h-1 rounded-full transition-all duration-300" data-strength-bar style="width: 0%"></div>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>

                <?php if (!$isLogin): ?>
                    <div>
                        <label for="confirm_password" class="block text-sm font-medium text-dark-300 mb-2">Confirm Password</label>
                        <div class="relative">
                            <?= icon('lock', 'w-5 h-5 input-icon text-dark-400') ?>
                            <input id="confirm_password" name="confirm_password" type="password"
                                   class="<?= e($fieldClass('confirm_password')) ?>" placeholder="Confirm your password"
                                   <?= isset($errors['confirm_password']) ? 'aria-invalid="true" aria-describedby="confirm-password-error"' : '' ?>>
                            <button type="button" class="input-action text-dark-400 hover:text-dark-300"
                                    data-toggle-password="confirm_password" aria-label="Show password">
                                <span data-eye="show"><?= icon('eye', 'w-5 h-5') ?></span>
                                <span data-eye="hide" hidden><?= icon('eye-off', 'w-5 h-5') ?></span>
                            </button>
                        </div>
                        <?php if (isset($errors['confirm_password'])): ?>
                            <p id="confirm-password-error" class="mt-1 text-sm text-red-400 flex items-center gap-1">
                                <?= icon('alert-circle', 'w-4 h-4') ?>
                                <?= e($errors['confirm_password']) ?>
                            </p>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>

                <?php if ($isLogin): ?>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input id="remember-me" name="remember_me" type="checkbox" class="checkbox">
                            <label for="remember-me" class="ml-2 block text-sm text-dark-300">Remember me</label>
                        </div>
                        <div class="text-sm">
                            <a href="<?= e(DISCORD_INVITE) ?>" target="_blank" rel="noopener noreferrer" class="text-rust-500 hover:text-rust-400">
                                Need help?
                            </a>
                        </div>
                    </div>
                <?php endif; ?>

                <div>
                    <button type="submit" class="btn-primary w-full flex items-center justify-center">
                        <?= $isLogin ? 'Sign In' : 'Create Account' ?>
                    </button>
                </div>

                <div class="text-center">
                    <a href="/login?mode=<?= $isLogin ? 'register' : 'login' ?>" class="text-rust-500 hover:text-rust-400 text-sm">
                        <?= $isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in' ?>
                    </a>
                </div>
            </form>
        </div>

        <div class="text-center text-sm text-dark-400">
            <p>
                By continuing, you agree to our
                <a href="/rules" class="text-rust-500 hover:text-rust-400">server rules</a>.
            </p>
        </div>
    </div>
</div>
