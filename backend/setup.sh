#!/bin/bash

echo "🎮 Art of Rust Backend Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env

    # Generate random secrets
    SESSION_SECRET=$(openssl rand -hex 32)
    JWT_SECRET=$(openssl rand -hex 32)

    # Update .env with generated secrets
    sed -i "s/SESSION_SECRET=.*/SESSION_SECRET=$SESSION_SECRET/" .env
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env

    echo ""
    echo "⚠️  IMPORTANT: You need to add your Steam API Key!"
    echo ""
    echo "1. Get your Steam API Key from: https://steamcommunity.com/dev/apikey"
    echo "2. Open backend/.env and add your Steam API Key to STEAM_API_KEY="
    echo ""
    echo "Generated secrets have been added to .env"
else
    echo "✓ .env file already exists"
fi

# Create data directory
mkdir -p data
echo "✓ Created data directory"

# Build backend
echo ""
echo "🔨 Building backend..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and add your STEAM_API_KEY"
echo "2. Update CALLBACK_URL and FRONTEND_URL if deploying to production"
echo "3. Run 'npm start' to start the backend server"
echo ""
