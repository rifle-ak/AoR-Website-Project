#!/bin/bash
#
# Art of Rust - Package the site for upload to cPanel.
#
# There is no build step: the site is plain PHP. This script just collects the
# files that belong in public_html into a zip you can upload and extract.
#

set -e

DEPLOY_DIR="deploy-package"
ZIP_NAME="artofrust-deploy-$(date +%Y%m%d-%H%M%S).zip"

echo "======================================"
echo "Art of Rust - Package for cPanel"
echo "======================================"
echo ""

# Fail early on a syntax error rather than uploading a broken page.
echo "Checking PHP syntax..."
find . -name '*.php' -not -path './deploy-package/*' -not -path './.git/*' -print0 \
    | xargs -0 -n1 php -l > /dev/null
echo "  all files parse cleanly"
echo ""

rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

echo "Collecting files..."
cp -r api app assets index.php .htaccess "$DEPLOY_DIR/"

# Local credentials and development tooling never ship.
rm -f "$DEPLOY_DIR/api/config.local.php"

cd "$DEPLOY_DIR"
zip -rq "../$ZIP_NAME" . -x "*.DS_Store" -x "__MACOSX/*"
cd ..

echo ""
echo "======================================"
echo "Package ready: $ZIP_NAME"
echo "======================================"
echo ""
echo "Next steps:"
echo "  1. Upload $ZIP_NAME to public_html via cPanel File Manager"
echo "  2. Extract it there (right-click > Extract)"
echo "  3. Create api/config.local.php with your database password,"
echo "     Steam API key and JWT secret (see CPANEL_SETUP.md)"
echo "  4. Import api/schema.sql into MySQL via phpMyAdmin"
echo ""
echo "Note: you can also just 'git pull' inside public_html - there is"
echo "nothing to compile, so the repository runs as-is."
echo ""
