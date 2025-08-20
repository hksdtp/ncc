#!/bin/bash

# 🤖 SERENA ACTIVATION SCRIPT
# This script activates Serena for the current web application project

echo "🚀 Activating Serena for Web Application Project..."

# Set PATH to include uv
export PATH="$HOME/.local/bin:$PATH"

# Get current directory
PROJECT_PATH=$(pwd)
echo "📁 Project Path: $PROJECT_PATH"

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "❌ uv not found. Installing..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
fi

# Check if Serena is available
echo "🔍 Checking Serena availability..."
uvx --from git+https://github.com/oraios/serena serena --version

# Start Serena MCP Server for IDE integration
echo "🔧 Starting Serena MCP Server..."
echo "Use this command in your MCP client:"
echo ""
echo "uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project \"$PROJECT_PATH\""
echo ""

# Test basic Serena tools
echo "🧪 Testing Serena tools..."
echo "Available tools:"
uvx --from git+https://github.com/oraios/serena serena tools list | head -10

echo ""
echo "✅ Serena is ready!"
echo "📋 Next steps:"
echo "1. Activate project: 'Activate the project $PROJECT_PATH'"
echo "2. Use semantic tools for all code operations"
echo "3. Follow the mandatory workflow in SERENA_WORKFLOW.md"
echo ""
echo "🎯 Remember: ALWAYS use Serena tools for ALL programming tasks!"
