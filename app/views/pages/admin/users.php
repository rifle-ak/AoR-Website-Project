<?php
/**
 * User management.
 *
 * @var array  $users  From data_users().
 * @var string $search
 */

$current = Auth::user();
$adminCount = count(array_filter($users, fn($u) => $u['is_admin']));
$vipCount = count(array_filter($users, fn($u) => $u['is_vip']));
$needle = mb_strtolower($search);
?>
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <?= icon('users', 'w-10 h-10 text-rust-500') ?>
            User Management
        </h1>
        <p class="text-dark-300">Manage user accounts and permissions</p>
    </div>

    <div class="card mb-6">
        <form method="get" action="/admin/users" class="relative" data-filter-form>
            <?= icon('search', 'w-5 h-5 input-icon text-dark-400') ?>
            <label for="user-search" class="sr-only">Search users</label>
            <input type="search" id="user-search" name="q" value="<?= e($search) ?>"
                   placeholder="Search by name or Steam ID..." class="input-field w-full pl-10"
                   data-filter-input data-filter-target="[data-user]">
        </form>
    </div>

    <div class="grid md:grid-cols-3 gap-4 mb-8">
        <div class="card">
            <div class="flex items-center gap-3">
                <?= icon('users', 'w-8 h-8 text-blue-500') ?>
                <div>
                    <p class="text-dark-400 text-sm">Total Users</p>
                    <p class="text-2xl font-bold text-white"><?= e(count($users)) ?></p>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="flex items-center gap-3">
                <?= icon('shield', 'w-8 h-8 text-red-500') ?>
                <div>
                    <p class="text-dark-400 text-sm">Admins</p>
                    <p class="text-2xl font-bold text-white"><?= e($adminCount) ?></p>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="flex items-center gap-3">
                <?= icon('crown', 'w-8 h-8 text-yellow-500') ?>
                <div>
                    <p class="text-dark-400 text-sm">VIP Members</p>
                    <p class="text-2xl font-bold text-white"><?= e($vipCount) ?></p>
                </div>
            </div>
        </div>
    </div>

    <?php if ($users): ?>
        <div class="card overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-dark-700">
                            <th class="text-left py-4 px-4 text-dark-400 font-medium">User</th>
                            <th class="text-left py-4 px-4 text-dark-400 font-medium">Steam ID</th>
                            <th class="text-left py-4 px-4 text-dark-400 font-medium">Joined</th>
                            <th class="text-left py-4 px-4 text-dark-400 font-medium">Last Login</th>
                            <th class="text-center py-4 px-4 text-dark-400 font-medium">Roles</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($users as $u): ?>
                            <?php
                            $haystack = mb_strtolower($u['display_name']) . ' ' . $u['steam_id'];
                            $hidden = $needle !== '' && !str_contains($haystack, $needle);
                            $isSelf = $u['steam_id'] === $current['steamId'];
                            ?>
                            <tr class="border-b border-dark-800 hover:bg-dark-800-50"
                                data-user data-search="<?= e($haystack) ?>" <?= $hidden ? 'hidden' : '' ?>>
                                <td class="py-4 px-4">
                                    <div class="flex items-center gap-3">
                                        <?php if ($u['avatar_url']): ?>
                                            <img src="<?= e($u['avatar_url']) ?>" alt="" class="w-10 h-10 rounded-full border-2 border-rust-500">
                                        <?php else: ?>
                                            <div class="w-10 h-10 rounded-full bg-rust-500-20 border-2 border-rust-500 flex items-center justify-center">
                                                <?= icon('users', 'w-5 h-5 text-rust-500') ?>
                                            </div>
                                        <?php endif; ?>
                                        <span class="text-white font-medium"><?= e($u['display_name']) ?></span>
                                    </div>
                                </td>
                                <td class="py-4 px-4">
                                    <span class="text-dark-300 font-mono text-sm"><?= e($u['steam_id']) ?></span>
                                </td>
                                <td class="py-4 px-4">
                                    <span class="text-dark-300 text-sm"><?= e(format_short_date($u['created_at'])) ?></span>
                                </td>
                                <td class="py-4 px-4">
                                    <span class="text-dark-300 text-sm"><?= e(format_short_date($u['last_login'])) ?></span>
                                </td>
                                <td class="py-4 px-4">
                                    <div class="flex justify-center gap-2">
                                        <form method="post" action="/admin/users"
                                              <?= $isSelf ? '' : 'data-confirm="' . ($u['is_admin'] ? 'Remove admin privileges from ' : 'Grant admin privileges to ') . e($u['display_name']) . '?"' ?>>
                                            <?= csrf_field() ?>
                                            <input type="hidden" name="role" value="admin">
                                            <input type="hidden" name="steam_id" value="<?= e($u['steam_id']) ?>">
                                            <?php if (!$u['is_admin']): ?>
                                                <input type="hidden" name="value" value="1">
                                            <?php endif; ?>
                                            <button type="submit" <?= $isSelf ? 'disabled' : '' ?>
                                                    class="role-btn <?= $u['is_admin'] ? 'role-btn-admin-on' : 'role-btn-off' ?>"
                                                    title="<?= $isSelf ? 'Cannot modify own admin status' : 'Toggle admin' ?>">
                                                <?= icon('shield', 'w-3 h-3 inline-icon') ?>
                                                Admin
                                            </button>
                                        </form>
                                        <form method="post" action="/admin/users">
                                            <?= csrf_field() ?>
                                            <input type="hidden" name="role" value="vip">
                                            <input type="hidden" name="steam_id" value="<?= e($u['steam_id']) ?>">
                                            <?php if (!$u['is_vip']): ?>
                                                <input type="hidden" name="value" value="1">
                                            <?php endif; ?>
                                            <button type="submit" class="role-btn <?= $u['is_vip'] ? 'role-btn-vip-on' : 'role-btn-off' ?>"
                                                    title="Toggle VIP">
                                                <?= icon('crown', 'w-3 h-3 inline-icon') ?>
                                                VIP
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>

                <div class="text-center py-12" data-filter-empty hidden>
                    <p class="text-dark-400">No users found matching your search.</p>
                </div>
            </div>
        </div>
    <?php else: ?>
        <div class="card text-center py-12">
            <div class="flex justify-center mb-4"><?= icon('users', 'w-16 h-16 text-dark-600') ?></div>
            <h3 class="text-xl font-semibold text-dark-300 mb-2">No Users Found</h3>
            <p class="text-dark-400">No users have signed in yet.</p>
        </div>
    <?php endif; ?>
</div>
