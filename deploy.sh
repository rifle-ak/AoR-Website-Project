#!/bin/bash
#
# Art of Rust - Build and Package for cPanel Deployment
#
# This script builds the frontend and packages everything for upload to cPanel.
#

set -e

echo "======================================"
echo "Art of Rust - Build for cPanel"
echo "======================================"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the frontend
echo "Building frontend..."
npm run build

# Create deployment package directory
DEPLOY_DIR="deploy-package"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

echo "Creating deployment package..."

# Copy built frontend
cp -r dist/* "$DEPLOY_DIR/"

# Copy .htaccess for SPA routing
cp public/.htaccess "$DEPLOY_DIR/.htaccess"

# Copy API folder
cp -r api "$DEPLOY_DIR/api"

# Create zip file for easy upload
ZIP_NAME="artofrust-deploy-$(date +%Y%m%d-%H%M%S).zip"
cd "$DEPLOY_DIR"
zip -r "../$ZIP_NAME" . -x "*.DS_Store" -x "__MACOSX/*"
cd ..

echo ""
echo "======================================"
echo "Build Complete!"
echo "======================================"
echo ""
echo "Deployment package created: $ZIP_NAME"
echo "Package contents: $DEPLOY_DIR/"
echo ""
echo "Next steps:"
echo "1. Clear your public_html folder (backup existing files first!)"
echo "2. Upload $ZIP_NAME to public_html via cPanel File Manager"
echo "3. Extract the zip (right-click > Extract)"
echo "4. Edit api/config.php with your database credentials, Steam API key, etc."
echo "5. Import api/schema.sql into your MySQL database via phpMyAdmin"
echo ""
echo "See CPANEL_SETUP.md for detailed instructions."
echo ""
