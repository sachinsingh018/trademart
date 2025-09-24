#!/bin/bash

echo "🧹 Cleaning Next.js development environment..."

# Kill any running Next.js processes
echo "📴 Stopping Next.js processes..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Remove build artifacts
echo "🗑️  Removing build artifacts..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

echo "✅ Clean complete! Starting development server..."
npm run dev
