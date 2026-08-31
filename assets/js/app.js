/*
 * Art of Rust - Front-end behaviour
 *
 * Vanilla ES2015+, no dependencies, no build step. Everything here enhances
 * markup the server already rendered: with JavaScript off the site still
 * navigates, filters (via form submit), signs in and administers content.
 */

(function () {
    'use strict';

    var API = '/api';

    // =========================================================================
    // DROPDOWNS (user menu, theme picker)
    // =========================================================================

    function initDropdowns() {
        var dropdowns = Array.prototype.slice.call(document.querySelectorAll('[data-dropdown]'));

        dropdowns.forEach(function (dropdown) {
            var toggle = dropdown.querySelector('[data-dropdown-toggle]');
            var menu = dropdown.querySelector('[data-dropdown-menu]');
            if (!toggle || !menu) return;

            toggle.addEventListener('click', function (event) {
                event.stopPropagation();
                var willOpen = menu.hidden;
                closeAll();
                menu.hidden = !willOpen;
                toggle.setAttribute('aria-expanded', String(willOpen));
            });
        });

        function closeAll() {
            dropdowns.forEach(function (dropdown) {
                var toggle = dropdown.querySelector('[data-dropdown-toggle]');
                var menu = dropdown.querySelector('[data-dropdown-menu]');
                if (menu) menu.hidden = true;
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            });
        }

        document.addEventListener('click', function (event) {
            if (!event.target.closest('[data-dropdown]')) closeAll();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeAll();
        });
    }

    // =========================================================================
    // MOBILE NAVIGATION
    // =========================================================================

    function initMobileMenu() {
        var toggle = document.querySelector('[data-mobile-toggle]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!toggle || !menu) return;

        var closedIcon = toggle.querySelector('[data-mobile-icon="closed"]');
        var openIcon = toggle.querySelector('[data-mobile-icon="open"]');

        toggle.addEventListener('click', function () {
            var willOpen = menu.hidden;
            menu.hidden = !willOpen;
            toggle.setAttribute('aria-expanded', String(willOpen));
            if (closedIcon) closedIcon.hidden = willOpen;
            if (openIcon) openIcon.hidden = !willOpen;
        });
    }

    // =========================================================================
    // THEME SWITCHING
    // =========================================================================

    function initThemeSwitcher() {
        var root = document.documentElement;

        document.querySelectorAll('[data-theme-option]').forEach(function (button) {
            button.addEventListener('click', function () {
                var themeId = button.getAttribute('data-theme-option');
                var vars = button.getAttribute('data-theme-vars');
                var label = button.getAttribute('data-theme-label');

                // Apply immediately, then remember it for the next page load.
                root.setAttribute('style', vars);
                root.setAttribute('data-theme', themeId);
                document.cookie = 'aor-theme=' + encodeURIComponent(themeId) +
                    ';path=/;max-age=' + (60 * 60 * 24 * 365) + ';samesite=lax';

                document.querySelectorAll('[data-theme-name]').forEach(function (node) {
                    node.textContent = label;
                });

                document.querySelectorAll('[data-theme-option]').forEach(function (option) {
                    var selected = option === button ||
                        option.getAttribute('data-theme-option') === themeId;
                    var check = option.querySelector('[data-theme-check]');
                    if (check) check.hidden = !selected;
                    option.classList.toggle('bg-primary-500-10', selected);
                    option.classList.toggle('border-primary-500-30', selected);
                    option.classList.toggle('border-transparent', !selected);
                    option.classList.toggle('hover:bg-surface-hover', !selected);
                });

                var meta = document.querySelector('meta[name="theme-color"]');
                var background = vars.match(/--color-bg-main:([^;]+)/);
                if (meta && background) meta.setAttribute('content', background[1].trim());
            });
        });
    }

    // =========================================================================
    // COPY TO CLIPBOARD
    // =========================================================================

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }

        // Fallback for http:// and older browsers.
        return new Promise(function (resolve, reject) {
            var area = document.createElement('textarea');
            area.value = text;
            area.setAttribute('readonly', '');
            area.style.position = 'fixed';
            area.style.left = '-9999px';
            document.body.appendChild(area);
            area.select();

            var ok = false;
            try {
                ok = document.execCommand('copy');
            } catch (error) {
                ok = false;
            }

            document.body.removeChild(area);
            ok ? resolve() : reject(new Error('Copy failed'));
        });
    }

    function initCopyButtons() {
        document.querySelectorAll('[data-copy]').forEach(function (button) {
            button.addEventListener('click', function () {
                copyText(button.getAttribute('data-copy'))
                    .then(function () { showCopyState(button, 'done', 'Copied!'); })
                    .catch(function () { showCopyState(button, 'error', 'Press Ctrl+C to copy'); });
            });
        });
    }

    function showCopyState(button, state, label) {
        var icons = button.querySelectorAll('[data-copy-icon]');
        var text = button.querySelector('[data-copy-label]');
        var original = text ? text.textContent : null;

        icons.forEach(function (node) {
            node.hidden = node.getAttribute('data-copy-icon') !== state;
        });
        if (text) text.textContent = label;

        window.setTimeout(function () {
            icons.forEach(function (node) {
                node.hidden = node.getAttribute('data-copy-icon') !== 'idle';
            });
            if (text && original !== null) text.textContent = original;
        }, 2000);
    }

    // =========================================================================
    // LIVE LIST FILTERING
    // =========================================================================

    function initFilters() {
        document.querySelectorAll('[data-filter-input]').forEach(function (input) {
            var form = input.closest('form');
            var targetSelector = input.getAttribute('data-filter-target');
            var groupSelector = input.getAttribute('data-filter-group');
            var empty = document.querySelector('[data-filter-empty]');
            var term = document.querySelector('[data-filter-term]');

            // With JavaScript running, filter as you type instead of round-tripping.
            if (form) {
                form.addEventListener('submit', function (event) {
                    event.preventDefault();
                });
            }

            input.addEventListener('input', function () {
                var needle = input.value.trim().toLowerCase();
                var visible = 0;

                document.querySelectorAll(targetSelector).forEach(function (item) {
                    var match = needle === '' ||
                        (item.getAttribute('data-search') || '').indexOf(needle) !== -1;
                    item.hidden = !match;
                    if (match) visible++;
                });

                // Hide a whole category once none of its rows match.
                if (groupSelector) {
                    document.querySelectorAll(groupSelector).forEach(function (group) {
                        var shown = group.querySelectorAll(targetSelector + ':not([hidden])');
                        group.hidden = shown.length === 0;
                    });
                }

                if (term) term.textContent = input.value.trim();
                if (empty) empty.hidden = visible !== 0;
            });
        });
    }

    // =========================================================================
    // GALLERY LIGHTBOX
    // =========================================================================

    function initLightbox() {
        var modal = document.querySelector('[data-lightbox-modal]');
        if (!modal) return;

        var image = modal.querySelector('[data-lightbox-image]');
        var title = modal.querySelector('[data-lightbox-title]');
        var author = modal.querySelector('[data-lightbox-author]');
        var date = modal.querySelector('[data-lightbox-date]');
        var download = modal.querySelector('[data-lightbox-download]');
        var lastTrigger = null;

        document.querySelectorAll('[data-lightbox]').forEach(function (trigger) {
            trigger.addEventListener('click', function () {
                lastTrigger = trigger;
                image.src = trigger.getAttribute('data-image');
                image.alt = trigger.getAttribute('data-title');
                title.textContent = trigger.getAttribute('data-title');
                author.textContent = trigger.getAttribute('data-author');
                date.textContent = trigger.getAttribute('data-date');
                download.href = trigger.getAttribute('data-image');
                modal.hidden = false;
                document.body.style.overflow = 'hidden';
                modal.querySelector('[data-lightbox-close]').focus();
            });
        });

        function close() {
            modal.hidden = true;
            document.body.style.overflow = '';
            if (lastTrigger) lastTrigger.focus();
        }

        modal.addEventListener('click', function (event) {
            if (event.target === modal || event.target.closest('[data-lightbox-close]')) close();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && !modal.hidden) close();
        });
    }

    // =========================================================================
    // COUNTDOWNS
    // =========================================================================

    function initCountdowns() {
        var full = document.querySelector('[data-countdown]');
        var shorts = Array.prototype.slice.call(document.querySelectorAll('[data-countdown-short]'));
        if (!full && !shorts.length) return;

        function remaining(iso) {
            return Math.max(0, new Date(iso).getTime() - Date.now());
        }

        function tick() {
            if (full) {
                var distance = remaining(full.getAttribute('data-countdown'));
                var units = {
                    days: Math.floor(distance / 86400000),
                    hours: Math.floor((distance % 86400000) / 3600000),
                    minutes: Math.floor((distance % 3600000) / 60000),
                    seconds: Math.floor((distance % 60000) / 1000)
                };

                Object.keys(units).forEach(function (unit) {
                    var node = full.querySelector('[data-countdown-unit="' + unit + '"]');
                    if (node) node.textContent = String(units[unit]).padStart(2, '0');
                });
            }

            shorts.forEach(function (node) {
                var iso = node.getAttribute('data-countdown-short');
                if (!iso) return;
                var distance = remaining(iso);
                node.textContent = Math.floor(distance / 86400000) + 'd ' +
                    Math.floor((distance % 86400000) / 3600000) + 'h';
            });
        }

        tick();
        window.setInterval(tick, 1000);
    }

    // =========================================================================
    // LIVE SERVER STATUS
    // =========================================================================

    function initServerStatus() {
        var card = document.querySelector('[data-server-status]');
        if (!card) return;

        function field(name) {
            return card.querySelector('[data-field="' + name + '"]');
        }

        function refresh() {
            fetch(API + '/server/status', { headers: { Accept: 'application/json' } })
                .then(function (response) {
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    return response.json();
                })
                .then(function (status) {
                    setConnected(true);

                    var max = Math.max(1, status.maxPlayers);
                    var percent = Math.min(100, (status.players / max) * 100);
                    var tone = percent >= 90 ? 'red' : percent >= 70 ? 'yellow' : 'green';

                    setText(field('name'), status.name);
                    setText(field('state'), status.online ? 'Online' : 'Offline');
                    setText(field('players'), status.players + ' / ' + status.maxPlayers);
                    setText(field('queue'), status.queue);
                    setText(field('fps'), status.fps);
                    setText(field('map'), status.map);
                    setText(field('uptime'), status.uptime);

                    var dot = field('dot');
                    if (dot) {
                        dot.classList.toggle('bg-green-500', !!status.online);
                        dot.classList.toggle('bg-red-500', !status.online);
                    }

                    var players = field('players');
                    if (players) {
                        players.classList.remove('text-red-500', 'text-yellow-500', 'text-green-500');
                        players.classList.add('text-' + tone + '-500');
                    }

                    var bar = field('bar');
                    if (bar) {
                        bar.style.width = percent + '%';
                        bar.classList.remove('bg-red-500', 'bg-yellow-500', 'bg-green-500');
                        bar.classList.add('bg-' + tone + '-500');
                    }
                })
                .catch(function () {
                    setConnected(false);
                });
        }

        refresh();
        window.setInterval(refresh, 30000);
    }

    function setText(node, value) {
        if (node) node.textContent = String(value);
    }

    function setConnected(connected) {
        var banner = document.querySelector('[data-connection-status]');
        if (banner) banner.hidden = connected;
    }

    // =========================================================================
    // DISCORD WIDGET
    // =========================================================================

    function initDiscordWidget() {
        var widget = document.querySelector('[data-discord-widget]');
        if (!widget) return;

        var invite = widget.getAttribute('data-invite') || '';
        var guildId = invite.split('/').filter(Boolean).pop();
        if (!guildId || !/^\d+$/.test(guildId)) return;

        function refresh() {
            fetch('https://discord.com/api/guilds/' + guildId + '/widget.json')
                .then(function (response) {
                    if (!response.ok) throw new Error('Widget disabled');
                    return response.json();
                })
                .then(function (data) {
                    if (typeof data.presence_count === 'number') {
                        setText(widget.querySelector('[data-discord-online]'), data.presence_count);
                        widget.querySelector('[data-discord-presence]').hidden = false;
                    }
                    if (data.approximate_member_count) {
                        setText(widget.querySelector('[data-discord-total]'), data.approximate_member_count);
                        widget.querySelector('[data-discord-members]').hidden = false;
                    }
                })
                .catch(function () {
                    // The guild widget is off, or Discord is unreachable. The card
                    // still shows its invite button, so there is nothing to report.
                });
        }

        refresh();
        window.setInterval(refresh, 60000);
    }

    // =========================================================================
    // FORMS
    // =========================================================================

    /** Confirm destructive submissions before they leave the page. */
    function initConfirms() {
        document.querySelectorAll('[data-confirm]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!window.confirm(form.getAttribute('data-confirm'))) {
                    event.preventDefault();
                }
            });
        });
    }

    function initPasswordToggles() {
        document.querySelectorAll('[data-toggle-password]').forEach(function (button) {
            button.addEventListener('click', function () {
                var input = document.getElementById(button.getAttribute('data-toggle-password'));
                if (!input) return;

                var reveal = input.type === 'password';
                input.type = reveal ? 'text' : 'password';
                button.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
                button.querySelector('[data-eye="show"]').hidden = reveal;
                button.querySelector('[data-eye="hide"]').hidden = !reveal;
            });
        });
    }

    /** Mirror of password_strength() in app/actions/auth.php. */
    function passwordStrength(password) {
        var score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        var message = score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : score <= 5 ? 'Strong' : 'Very Strong';

        return { score: score, message: message };
    }

    function initPasswordStrength() {
        var input = document.querySelector('[data-password-input]');
        var meter = document.querySelector('[data-password-strength]');
        if (!input || !meter) return;

        var bar = meter.querySelector('[data-strength-bar]');
        var label = meter.querySelector('[data-strength-label]');

        input.addEventListener('input', function () {
            if (!input.value) {
                meter.hidden = true;
                return;
            }

            var strength = passwordStrength(input.value);
            meter.hidden = false;
            bar.style.width = (strength.score / 6) * 100 + '%';
            label.textContent = strength.message;

            bar.classList.remove('bg-red-500', 'bg-yellow-500', 'bg-green-500');
            bar.classList.add(strength.score <= 2 ? 'bg-red-500' : strength.score <= 4 ? 'bg-yellow-500' : 'bg-green-500');

            label.classList.remove('text-red-500', 'text-yellow-500', 'text-green-500');
            label.classList.add(strength.score <= 2 ? 'text-red-500' : strength.score <= 4 ? 'text-yellow-500' : 'text-green-500');
        });
    }

    // =========================================================================
    // MISC
    // =========================================================================

    function initFlashDismiss() {
        document.querySelectorAll('[data-dismiss-flash]').forEach(function (button) {
            button.addEventListener('click', function () {
                var flash = button.closest('.flash');
                if (flash) flash.remove();
            });
        });
    }

    function initHistoryBack() {
        document.querySelectorAll('[data-history-back]').forEach(function (button) {
            button.addEventListener('click', function () {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = '/';
                }
            });
        });
    }

    // =========================================================================
    // BOOT
    // =========================================================================

    function boot() {
        initDropdowns();
        initMobileMenu();
        initThemeSwitcher();
        initCopyButtons();
        initFilters();
        initLightbox();
        initCountdowns();
        initServerStatus();
        initDiscordWidget();
        initConfirms();
        initPasswordToggles();
        initPasswordStrength();
        initFlashDismiss();
        initHistoryBack();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
