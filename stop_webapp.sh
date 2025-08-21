#!/bin/bash

# 🛑 WEB APPLICATION STOP SCRIPT
# Cloud-Only Storage v4.0.0

echo "🛑 Stopping Web Application..."

# Check if any process is running on port 8081
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo "🔍 Found process running on port 8081"

    # Get process details
    echo "📋 Process details:"
    lsof -i :8081
    echo ""

    # Kill the process
    echo "💀 Killing process..."
    kill $(lsof -t -i:8081)

    # Wait a moment and check again
    sleep 2

    if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Process still running, force killing..."
        kill -9 $(lsof -t -i:8081)
    else
        echo "✅ Web application stopped successfully"
    fi
else
    echo "ℹ️  No process found running on port 8081"
    echo "✅ Web application is already stopped"
fi

echo ""
echo "📊 Current status:"
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 8081 is still in use"
else
    echo "✅ Port 8081 is free"
fi
