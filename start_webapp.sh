#!/bin/bash

# 🚀 WEB APPLICATION STARTUP SCRIPT
# Cloud-Only Storage v4.0.0 with Serena Integration

echo "🌐 Starting Cloud-Only Storage Web Application..."
echo "📱 Version: 4.0.0-cloud-only"
echo "🤖 Serena Integration: Active"
echo ""

# Check if port 8081 is already in use
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8081 is already in use"
    echo "🔍 Checking what is running on port 8081:"
    lsof -i :8081
    echo ""
    echo "💡 Options:"
    echo "   1. Kill existing process: kill \$(lsof -t -i:8081)"
    echo "   2. Use different port: python3 -m http.server 8082"
    echo "   3. Access existing server: http://localhost:8081"
    exit 1
fi

# Start the web server
echo "🚀 Starting HTTP server on port 8081..."
echo "🌐 Access URL: http://localhost:8081"
echo "📱 Mobile URL: http://[your-ip]:8081"
echo "🔍 Debug URL: http://localhost:8081/debug_supabase.html"
echo ""
echo "⚡ Features:"
echo "   ✅ Cloud-only image storage"
echo "   ✅ Cross-device compatibility" 
echo "   ✅ Supabase integration"
echo "   ✅ Real-time sync"
echo "   🤖 Serena semantic coding"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo "================================================"

# Start Python HTTP server
python3 -m http.server 8081
