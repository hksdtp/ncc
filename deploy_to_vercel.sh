#!/bin/bash

# 🚀 VERCEL DEPLOYMENT SCRIPT
# Shanghai Supplier Catalog - Optimized for Vercel

echo "🌐 Preparing Shanghai Supplier Catalog for Vercel deployment..."
echo "📱 Version: Cloud-Only Storage v4.0.0"
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the project root."
    exit 1
fi

# Clean up any previous builds
echo "🧹 Cleaning up previous builds..."
rm -rf .vercel/
rm -rf dist/
rm -rf build/

# Validate HTML structure
echo "🔍 Validating HTML structure..."
if ! grep -q "<!DOCTYPE html>" index.html; then
    echo "❌ Error: Invalid HTML structure in index.html"
    exit 1
fi

# Check Supabase configuration
echo "🔗 Checking Supabase configuration..."
if ! grep -q "hukhojlhmvpjmiyageqg.supabase.co" index.html; then
    echo "⚠️  Warning: Supabase URL not found in index.html"
fi

# Optimize for deployment
echo "⚡ Optimizing for deployment..."

# Remove development-only console logs (optional)
# sed -i.bak 's/console\.log(/\/\/ console.log(/g' index.html

echo "✅ Pre-deployment checks completed!"
echo ""
echo "🚀 Ready to deploy to Vercel!"
echo "📋 Next steps:"
echo "   1. Run: vercel --prod"
echo "   2. Or push to GitHub and let Vercel auto-deploy"
echo "   3. Check deployment at your Vercel dashboard"
echo ""
echo "🌐 Expected features after deployment:"
echo "   ✅ Static HTML serving"
echo "   ✅ Supabase integration"
echo "   ✅ Cloud-only media storage"
echo "   ✅ Cross-device compatibility"
echo "   ✅ Responsive design"
echo ""
echo "🔧 If deployment fails, check:"
echo "   - Vercel dashboard for error logs"
echo "   - Network tab for 405/404 errors"
echo "   - Supabase connection in browser console"
