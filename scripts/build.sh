#!/bin/bash

# Build script for Midora AI Frontend
# This script builds the Next.js application for production

set -e

echo "🚀 Starting build process for Midora AI Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run type check
echo "🔍 Running TypeScript type check..."
npm run type-check

# Run linting
echo "🧹 Running ESLint..."
npm run lint

# Build the application
echo "🏗️ Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output is available in the .next directory"
    
    # Show build info
    echo ""
    echo "📊 Build Information:"
    echo "   - Next.js version: $(grep '"next"' package.json | cut -d'"' -f4)"
    echo "   - React version: $(grep '"react"' package.json | cut -d'"' -f4)"
    echo "   - TypeScript version: $(grep '"typescript"' package.json | cut -d'"' -f4)"
    echo "   - Build time: $(date)"
    
    # Check build size
    if [ -d ".next" ]; then
        BUILD_SIZE=$(du -sh .next | cut -f1)
        echo "   - Build size: $BUILD_SIZE"
    fi
    
    echo ""
    echo "🚀 You can now start the production server with: npm start"
    echo "🐳 Or run with Docker: docker-compose up"
    
else
    echo "❌ Build failed!"
    exit 1
fi
