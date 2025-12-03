#!/bin/bash

# Setup script for Cardano Mine UI
# This fixes common environment issues

echo "🔧 Setting up Cardano Mine UI..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --no-save style-loader css-loader electron-is-dev 2>/dev/null || true

# Create necessary directories
mkdir -p logs config data/reports

# For CLI-only testing
echo "✅ Setup complete!"
echo ""
echo "To test CLI tools directly (no GUI):"
echo "  node cli/challenge.js --community test-community"
echo "  node cli/verify.js --pubkey a0a1a2a3 --message 'Hello' --signature d0d1d2d3"
echo "  node cli/report.js --type user_registry --format csv"
echo ""
echo "To run with GUI (requires display):"
echo "  npm run dev"
echo ""
echo "To test webpack build:"
echo "  npm run build"
