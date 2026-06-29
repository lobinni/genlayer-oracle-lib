#!/bin/bash

# GenLayer Reputation Oracle - Setup Script
# This script helps you set up the project and push to GitHub

echo "🛡️ GenLayer Reputation Oracle - Setup"
echo "======================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Git and Node.js are installed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

echo ""
echo "======================================"
echo "📤 Ready to push to GitHub!"
echo ""
echo "Run these commands:"
echo ""
echo "  git init"
echo "  git add ."
echo "  git commit -m 'Initial commit: GenLayer Reputation Oracle'"
echo "  git remote add origin https://github.com/YOUR_USERNAME/genlayer-reputation-oracle.git"
echo "  git branch -M main"
echo "  git push -u origin main"
echo ""
echo "======================================"
