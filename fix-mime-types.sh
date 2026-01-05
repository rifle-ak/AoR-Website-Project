#!/bin/bash
# Fix MIME type issues on cPanel server

set -e

echo "=================================="
echo "Fixing MIME Types for Art of Rust"
echo "=================================="

# Create cPanel user include directory
echo "Creating cPanel user include directory..."
mkdir -p /home/artofrust/.cpanel/apache_includes

# Create custom Apache configuration for MIME types
echo "Creating custom MIME type configuration..."
cat > /home/artofrust/.cpanel/apache_includes/artofrust_mime.conf << 'EOF'
<Directory "/home/artofrust/public_html/dist">
    <IfModule mod_mime.c>
        RemoveType .js
        AddType application/javascript .js .mjs
        AddType text/css .css
        AddType image/svg+xml .svg
        AddType application/json .json
        AddType text/html .html
    </IfModule>

    # Enable following symlinks (needed for some frameworks)
    Options +FollowSymLinks

    # Allow .htaccess overrides
    AllowOverride All
</Directory>

<Directory "/home/artofrust/public_html/dist/assets">
    <IfModule mod_mime.c>
        RemoveType .js
        AddType application/javascript .js .mjs
        AddType text/css .css
        AddType image/svg+xml .svg
        AddType application/json .json
    </IfModule>
</Directory>
EOF

# Also create/update .htaccess in dist directory as a backup
echo "Creating .htaccess file..."
cat > /home/artofrust/public_html/dist/.htaccess << 'EOF'
# MIME Types
<IfModule mod_mime.c>
    AddType application/javascript .js .mjs
    AddType text/css .css
    AddType image/svg+xml .svg
    AddType application/json .json
</IfModule>

# Rewrite rules for SPA
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Don't rewrite files or directories
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d

    # Rewrite everything else to index.html
    RewriteRule . /index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
    # Prevent MIME type sniffing
    Header set X-Content-Type-Options "nosniff"

    # Enable browser XSS protection
    Header set X-XSS-Protection "1; mode=block"

    # Prevent clickjacking
    Header set X-Frame-Options "SAMEORIGIN"
</IfModule>

# Cache control
<IfModule mod_expires.c>
    ExpiresActive On

    # JavaScript and CSS
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"

    # Images
    ExpiresByType image/svg+xml "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"

    # HTML
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>
EOF

# Set proper ownership
echo "Setting ownership..."
chown -R artofrust:artofrust /home/artofrust/.cpanel 2>/dev/null || echo "Note: Running as non-root, skipping ownership change"
chown artofrust:artofrust /home/artofrust/public_html/dist/.htaccess 2>/dev/null || echo "Note: Running as non-root, skipping ownership change"

# Set proper permissions
chmod 644 /home/artofrust/public_html/dist/.htaccess
chmod 644 /home/artofrust/.cpanel/apache_includes/artofrust_mime.conf

echo ""
echo "Configuration files created!"
echo ""
echo "Next steps:"
echo "1. If you have root access, run: /scripts/rebuildhttpdconf && /scripts/restartsrv_httpd"
echo "2. If using cPanel UI, go to: Home > Service Configuration > Apache Configuration > Include Editor"
echo "3. Then test with: curl -I https://artofrust.art/assets/index-*.js | grep Content-Type"
echo ""
echo "Expected output: Content-Type: application/javascript"
echo "=================================="
