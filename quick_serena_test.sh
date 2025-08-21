#!/bin/bash

# 🤖 QUICK SERENA TEST
# Fast test to check if Serena tools are working

echo "🤖 QUICK SERENA TEST"
echo "===================="

# Set PATH
export PATH="$HOME/.local/bin:$PATH"

echo "📦 Testing uv..."
if command -v uv >/dev/null 2>&1; then
    echo "✅ uv is available"
else
    echo "❌ uv not found"
    exit 1
fi

echo ""
echo "📁 Checking project structure..."
if [ -d ".serena" ]; then
    echo "✅ .serena directory exists"
else
    echo "❌ .serena directory not found"
fi

if [ -f ".serena/project.yml" ]; then
    echo "✅ project.yml exists"
else
    echo "❌ project.yml not found"
fi

echo ""
echo "🚀 Testing Serena basic command (timeout 20s)..."
timeout 20s uvx --from git+https://github.com/oraios/serena serena --help >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Serena responds successfully"
    SERENA_WORKING=true
else
    echo "⚠️  Serena command timed out or failed"
    SERENA_WORKING=false
fi

echo ""
echo "📊 QUICK STATUS:"
if [ "$SERENA_WORKING" = true ]; then
    echo "✅ Serena is WORKING"
    echo "🎯 Ready for semantic development"
    echo ""
    echo "💡 Usage examples:"
    echo "   Activate the project \$(pwd)"
    echo "   Follow SERENA_WORKFLOW.md for all tasks"
else
    echo "⚠️  Serena may be slow or having issues"
    echo "🔧 Try: python3 test_serena.py for detailed test"
    echo "📖 Check: SERENA_WORKFLOW.md for troubleshooting"
fi

echo ""
echo "🔍 For detailed status: python3 check_serena_status.py"
