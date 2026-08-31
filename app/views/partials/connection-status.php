<?php
/**
 * Offline notice. Hidden until the JSON API stops answering, then shown in the
 * corner so visitors know why live data has gone stale.
 */
?>
<div class="fixed bottom-4 right-4 z-50" data-connection-status hidden>
    <div class="bg-red-500-90 text-white px-4 py-3 rounded-lg shadow-lg border border-red-400 max-w-sm">
        <div class="flex items-start gap-3">
            <?= icon('wifi-off', 'w-5 h-5 mt-1 flex-shrink-0') ?>
            <div>
                <p class="font-semibold text-sm mb-1">Connection Lost</p>
                <p class="text-xs text-red-100">
                    We can't reach the server right now, so live stats may be out of date.
                    Everything else on the page still works.
                </p>
            </div>
        </div>
    </div>
</div>
