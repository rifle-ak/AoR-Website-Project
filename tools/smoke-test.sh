#!/bin/bash
#
# Art of Rust - Smoke test
#
# Requests every public route and API endpoint against a running site and
# checks the status codes. Used by CI and handy locally:
#
#   php -S localhost:8000 -t . tools/router.php &
#   ./tools/smoke-test.sh http://localhost:8000
#

set -u

BASE="${1:-http://localhost:8000}"
failures=0

check() {
    local path="$1" expected="$2"
    local actual
    actual=$(curl -s -o /dev/null -w '%{http_code}' "$BASE$path")

    if [ "$actual" = "$expected" ]; then
        printf '  ok    %-28s %s\n' "$path" "$actual"
    else
        printf '  FAIL  %-28s expected %s, got %s\n' "$path" "$expected" "$actual"
        failures=$((failures + 1))
    fi
}

echo "Smoke-testing $BASE"
echo ""
echo "Public pages:"
check /                200
check /news            200
check /leaderboards    200
check /wipe-schedule   200
check /commands        200
check /rules           200
check /gallery         200
check /login           200
check /no-such-page    404

echo ""
echo "Redirects for signed-out visitors:"
check /profile         302
check /admin           302
check /admin/news      302
check /admin/users     302
check /admin/wipes     302

echo ""
echo "JSON API:"
check /api/health          200
check /api/news            200
check /api/leaderboards    200
check /api/wipes/schedule  200
check /api/server/status   200
check /api/admin/dashboard 401
check /api/nope            404

echo ""
echo "Assets:"
check /assets/css/app.css  200
check /assets/js/app.js    200

echo ""
echo "Source protection:"
check /app/Data.php        403
check /app/bootstrap.php   403

echo ""
if [ "$failures" -eq 0 ]; then
    echo "All checks passed."
    exit 0
fi

echo "$failures check(s) failed."
exit 1
