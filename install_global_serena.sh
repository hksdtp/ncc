#!/bin/bash

# 🚀 GLOBAL SERENA INSTALLATION
# Cài đặt Serena global để sử dụng cho nhiều dự án

echo "🚀 GLOBAL SERENA INSTALLATION"
echo "============================="

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
SERENA_BIN="$SERENA_VENV/bin/serena"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "   Python: $PYTHON_BIN"
echo "   Serena Home: $SERENA_HOME"
echo "   Virtual Env: $SERENA_VENV"
echo ""

# Step 1: Check Python 3.11
echo -e "${YELLOW}🔍 Step 1: Checking Python 3.11...${NC}"
if [ ! -f "$PYTHON_BIN" ]; then
    echo -e "${RED}❌ Python 3.11 not found at $PYTHON_BIN${NC}"
    echo -e "${YELLOW}💡 Install with: brew install python@3.11${NC}"
    exit 1
fi

python_version=$($PYTHON_BIN --version)
echo -e "${GREEN}✅ Found: $python_version${NC}"

# Step 2: Create global Serena directory
echo -e "${YELLOW}🔍 Step 2: Creating global Serena directory...${NC}"
mkdir -p "$SERENA_HOME"
echo -e "${GREEN}✅ Created: $SERENA_HOME${NC}"

# Step 3: Create virtual environment
echo -e "${YELLOW}🔍 Step 3: Creating virtual environment...${NC}"
if [ -d "$SERENA_VENV" ]; then
    echo -e "${YELLOW}⚠️  Virtual environment exists, removing...${NC}"
    rm -rf "$SERENA_VENV"
fi

$PYTHON_BIN -m venv "$SERENA_VENV"
echo -e "${GREEN}✅ Virtual environment created${NC}"

# Step 4: Activate and install Serena
echo -e "${YELLOW}🔍 Step 4: Installing Serena...${NC}"
source "$SERENA_VENV/bin/activate"

# Upgrade pip
pip install --upgrade pip

# Install Serena from GitHub
echo -e "${BLUE}📥 Installing Serena from GitHub...${NC}"
pip install git+https://github.com/oraios/serena

# Verify installation
if [ -f "$SERENA_BIN" ]; then
    echo -e "${GREEN}✅ Serena installed successfully${NC}"
    serena_version=$("$SERENA_BIN" --version 2>/dev/null || echo "Version check failed")
    echo -e "${GREEN}📦 Version: $serena_version${NC}"
else
    echo -e "${RED}❌ Serena installation failed${NC}"
    exit 1
fi

# Step 5: Create global wrapper script
echo -e "${YELLOW}🔍 Step 5: Creating global wrapper...${NC}"
cat > "$SERENA_HOME/serena-global" << EOF
#!/bin/bash
# Global Serena wrapper script
source "$SERENA_VENV/bin/activate"
serena "\$@"
EOF

chmod +x "$SERENA_HOME/serena-global"
echo -e "${GREEN}✅ Global wrapper created${NC}"

# Step 6: Create symlink in /usr/local/bin
echo -e "${YELLOW}🔍 Step 6: Creating system-wide access...${NC}"
SYSTEM_BIN="/usr/local/bin/serena-global"

if [ -L "$SYSTEM_BIN" ]; then
    echo -e "${YELLOW}⚠️  Removing existing symlink...${NC}"
    sudo rm "$SYSTEM_BIN"
fi

sudo ln -s "$SERENA_HOME/serena-global" "$SYSTEM_BIN"
echo -e "${GREEN}✅ System-wide access created${NC}"

# Step 7: Create project initialization script
echo -e "${YELLOW}🔍 Step 7: Creating project init script...${NC}"
cat > "$SERENA_HOME/init-project.sh" << 'EOF'
#!/bin/bash
# Initialize Serena for a new project

PROJECT_DIR="${1:-$(pwd)}"
echo "🚀 Initializing Serena for project: $PROJECT_DIR"

cd "$PROJECT_DIR"

# Create .serena directory
mkdir -p .serena

# Create project.yml
cat > .serena/project.yml << 'YAML'
name: "$(basename "$PROJECT_DIR")"
language: typescript
root: "."
YAML

# Create fast wrapper that uses global Serena
cat > .serena/serena-fast << 'WRAPPER'
#!/bin/bash
# Fast Serena wrapper using global installation
serena-global "$@"
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
WORKFLOW

echo "✅ Project initialized for Serena!"
echo "📖 See SERENA_WORKFLOW.md for usage"
EOF

chmod +x "$SERENA_HOME/init-project.sh"

# Create system-wide project init
sudo ln -sf "$SERENA_HOME/init-project.sh" "/usr/local/bin/serena-init"

echo -e "${GREEN}✅ Project init script created${NC}"

# Step 8: Test installation
echo -e "${YELLOW}🔍 Step 8: Testing installation...${NC}"
if command -v serena-global >/dev/null 2>&1; then
    echo -e "${GREEN}✅ serena-global command available${NC}"
    
    # Quick test
    timeout 10s serena-global --help >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Serena responds successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Serena may be slow on first run${NC}"
    fi
else
    echo -e "${RED}❌ serena-global command not found${NC}"
    echo -e "${YELLOW}💡 Try: export PATH=\"/usr/local/bin:\$PATH\"${NC}"
fi

# Step 9: Show usage instructions
echo ""
echo -e "${GREEN}🎉 GLOBAL SERENA INSTALLATION COMPLETE!${NC}"
echo "========================================"
echo ""
echo -e "${BLUE}📖 Usage:${NC}"
echo "   serena-global --help              # Global Serena help"
echo "   serena-global tools list          # List all tools"
echo "   serena-init [project-dir]         # Initialize project for Serena"
echo ""
echo -e "${BLUE}📁 For new projects:${NC}"
echo "   cd /path/to/your/project"
echo "   serena-init                       # Initialize Serena"
echo "   ./.serena/serena-fast --help      # Use project wrapper"
echo ""
echo -e "${BLUE}🔧 Installation details:${NC}"
echo "   Serena Home: $SERENA_HOME"
echo "   Python: $PYTHON_BIN"
echo "   Global Command: serena-global"
echo "   Project Init: serena-init"
echo ""
echo -e "${GREEN}🚀 Ready to use Serena across all projects!${NC}"
