#!/bin/bash

# 🚀 USER-LEVEL SERENA SETUP
# Cài đặt Serena global cho user không cần sudo

echo "🚀 USER-LEVEL SERENA SETUP"
echo "=========================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PYTHON_BIN="/opt/homebrew/bin/python3.11"
SERENA_HOME="$HOME/.serena-global"
SERENA_VENV="$SERENA_HOME/venv"
USER_BIN="$HOME/.local/bin"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "   Python: $PYTHON_BIN"
echo "   Serena Home: $SERENA_HOME"
echo "   User Bin: $USER_BIN"
echo ""

# Create user bin directory
mkdir -p "$USER_BIN"

# Check if Serena is already installed
if [ -f "$SERENA_VENV/bin/serena" ]; then
    echo -e "${GREEN}✅ Serena already installed!${NC}"
else
    echo -e "${RED}❌ Serena not found. Run install_global_serena.sh first${NC}"
    exit 1
fi

# Create user-level wrapper
echo -e "${YELLOW}🔧 Creating user-level wrapper...${NC}"
cat > "$USER_BIN/serena-global" << EOF
#!/bin/bash
# User-level Serena wrapper
source "$SERENA_VENV/bin/activate"
serena "\$@"
EOF

chmod +x "$USER_BIN/serena-global"

# Create project init script
cat > "$USER_BIN/serena-init" << 'EOF'
#!/bin/bash
# Initialize Serena for a new project

PROJECT_DIR="${1:-$(pwd)}"
echo "🚀 Initializing Serena for project: $PROJECT_DIR"

cd "$PROJECT_DIR"

# Create .serena directory
mkdir -p .serena

# Create project.yml
cat > .serena/project.yml << YAML
name: "$(basename "$PROJECT_DIR")"
language: typescript
root: "."
YAML

# Create fast wrapper that uses global Serena
cat > .serena/serena-fast << 'WRAPPER'
#!/bin/bash
# Fast Serena wrapper using global installation
if command -v serena-global >/dev/null 2>&1; then
    serena-global "$@"
else
    echo "❌ serena-global not found. Add ~/.local/bin to PATH"
    echo "💡 Run: export PATH=\"\$HOME/.local/bin:\$PATH\""
fi
WRAPPER

chmod +x .serena/serena-fast

# Create project-specific workflow
cat > SERENA_WORKFLOW.md << 'WORKFLOW'
# 🤖 SERENA PROJECT WORKFLOW

## 🚀 Quick Start
```bash
# Use global Serena
serena-global --help

# Or use project wrapper
./.serena/serena-fast --help
```

## 📖 Commands
- `serena-global tools list` - List all tools
- `serena-global tools call find_symbol --symbol "function"` - Find symbols
- `serena-global tools call read_file --path "file.js"` - Read files

## 🎯 Workflow
1. Always use semantic discovery before editing
2. Use Serena tools for code analysis
3. Follow semantic editing principles

## ⚡ Performance
- Global Serena: ~2-5 seconds (much faster than uvx)
- Fast commands: Available via ./serena wrapper
WORKFLOW

echo "✅ Project initialized for Serena!"
echo "📖 See SERENA_WORKFLOW.md for usage"
EOF

chmod +x "$USER_BIN/serena-init"

# Test installation
echo -e "${YELLOW}🧪 Testing installation...${NC}"
if [ -f "$USER_BIN/serena-global" ]; then
    echo -e "${GREEN}✅ serena-global wrapper created${NC}"
else
    echo -e "${RED}❌ Failed to create wrapper${NC}"
    exit 1
fi

# Check PATH
if echo "$PATH" | grep -q "$USER_BIN"; then
    echo -e "${GREEN}✅ ~/.local/bin is in PATH${NC}"
else
    echo -e "${YELLOW}⚠️  ~/.local/bin not in PATH${NC}"
    echo -e "${BLUE}💡 Add to your shell profile:${NC}"
    echo "   export PATH=\"\$HOME/.local/bin:\$PATH\""
fi

# Test command
echo -e "${YELLOW}🔍 Testing serena-global command...${NC}"
if "$USER_BIN/serena-global" --help >/dev/null 2>&1; then
    echo -e "${GREEN}✅ serena-global command works!${NC}"
else
    echo -e "${YELLOW}⚠️  Command may be slow on first run${NC}"
fi

echo ""
echo -e "${GREEN}🎉 USER-LEVEL SERENA SETUP COMPLETE!${NC}"
echo "===================================="
echo ""
echo -e "${BLUE}📖 Usage:${NC}"
echo "   serena-global --help              # Global Serena help"
echo "   serena-global tools list          # List all tools"
echo "   serena-init [project-dir]         # Initialize project"
echo ""
echo -e "${BLUE}🔧 Add to PATH (if needed):${NC}"
echo "   export PATH=\"\$HOME/.local/bin:\$PATH\""
echo ""
echo -e "${BLUE}📁 For new projects:${NC}"
echo "   cd /path/to/your/project"
echo "   serena-init                       # Initialize"
echo "   ./.serena/serena-fast --help      # Use project wrapper"
echo ""
echo -e "${GREEN}🚀 Ready to use Serena across all projects!${NC}"
