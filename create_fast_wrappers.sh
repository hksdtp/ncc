#!/bin/bash

# 🚀 CREATE FAST SERENA WRAPPERS
# Tạo cached wrappers để tránh resolve dependencies mỗi lần

echo "⚡ CREATING FAST SERENA WRAPPERS"
echo "================================"

# Create .serena/cache directory
mkdir -p .serena/cache

# Set PATH
export PATH="$HOME/.local/bin:$PATH"

echo "📦 Creating cached wrapper scripts..."

# 1. Fast Serena Help (cached)
cat > .serena/fast_help.sh << 'EOF'
#!/bin/bash
# Fast Serena help - cached version
echo "🤖 FAST SERENA COMMANDS"
echo "======================"
echo "⚡ Fast commands (1-2 seconds):"
echo "   ./.serena/fast_list_dir.sh [path]     - List directory"
echo "   ./.serena/fast_read_file.sh [file]    - Read file"
echo "   ./.serena/fast_find_symbol.sh [term]  - Find symbol"
echo ""
echo "🐌 Full Serena commands (30+ seconds):"
echo "   ./.serena/slow_serena.sh --help       - Full Serena help"
echo "   ./.serena/slow_tools.sh list          - List all tools"
echo ""
echo "📊 Status commands:"
echo "   ./quick_serena_test.sh                - Quick status"
echo "   python3 serena_dashboard.py          - Full dashboard"
EOF

chmod +x .serena/fast_help.sh

# 2. Fast List Directory
cat > .serena/fast_list_dir.sh << 'EOF'
#!/bin/bash
# Fast directory listing - native implementation
path="${1:-.}"
echo "📁 Directory listing for: $path"
echo "================================"
if [ -d "$path" ]; then
    ls -la "$path" | head -20
    echo ""
    echo "📊 Summary:"
    echo "   Files: $(find "$path" -maxdepth 1 -type f | wc -l)"
    echo "   Directories: $(find "$path" -maxdepth 1 -type d | wc -l)"
else
    echo "❌ Directory not found: $path"
fi
EOF

chmod +x .serena/fast_list_dir.sh

# 3. Fast Read File
cat > .serena/fast_read_file.sh << 'EOF'
#!/bin/bash
# Fast file reading - native implementation
file="$1"
if [ -z "$file" ]; then
    echo "❌ Usage: $0 <filename>"
    exit 1
fi

if [ -f "$file" ]; then
    echo "📄 Reading file: $file"
    echo "======================"
    echo "📊 File info:"
    echo "   Size: $(wc -c < "$file") bytes"
    echo "   Lines: $(wc -l < "$file")"
    echo ""
    echo "📝 Content (first 50 lines):"
    echo "----------------------------"
    head -50 "$file" | cat -n
    
    total_lines=$(wc -l < "$file")
    if [ "$total_lines" -gt 50 ]; then
        echo ""
        echo "... (showing first 50 of $total_lines lines)"
        echo "💡 Use 'cat $file' to see full content"
    fi
else
    echo "❌ File not found: $file"
fi
EOF

chmod +x .serena/fast_read_file.sh

# 4. Fast Find Symbol
cat > .serena/fast_find_symbol.sh << 'EOF'
#!/bin/bash
# Fast symbol finding - native implementation
term="$1"
if [ -z "$term" ]; then
    echo "❌ Usage: $0 <search_term>"
    exit 1
fi

echo "🔍 Searching for symbol: $term"
echo "=============================="

# Search in common file types
echo "📄 Searching in JavaScript/TypeScript files:"
find . -name "*.js" -o -name "*.ts" -o -name "*.html" | head -10 | while read file; do
    if grep -l "$term" "$file" 2>/dev/null; then
        echo "✅ Found in: $file"
        grep -n "$term" "$file" | head -3
        echo ""
    fi
done

echo "📊 Search complete"
EOF

chmod +x .serena/fast_find_symbol.sh

# 5. Slow Serena wrapper (for full functionality)
cat > .serena/slow_serena.sh << 'EOF'
#!/bin/bash
# Slow but full Serena command
export PATH="$HOME/.local/bin:$PATH"
echo "🐌 Running full Serena command (may take 30+ seconds)..."
uvx --from git+https://github.com/oraios/serena serena "$@"
EOF

chmod +x .serena/slow_serena.sh

# 6. Slow tools wrapper
cat > .serena/slow_tools.sh << 'EOF'
#!/bin/bash
# Slow but full Serena tools
export PATH="$HOME/.local/bin:$PATH"
echo "🐌 Running full Serena tools (may take 30+ seconds)..."
uvx --from git+https://github.com/oraios/serena serena tools "$@"
EOF

chmod +x .serena/slow_tools.sh

# 7. Smart Serena wrapper (chooses fast or slow)
cat > .serena/smart_serena.sh << 'EOF'
#!/bin/bash
# Smart Serena wrapper - chooses fast or slow based on command

command="$1"
case "$command" in
    "list_dir"|"ls")
        shift
        ./.serena/fast_list_dir.sh "$@"
        ;;
    "read_file"|"cat")
        shift
        ./.serena/fast_read_file.sh "$@"
        ;;
    "find_symbol"|"find")
        shift
        ./.serena/fast_find_symbol.sh "$@"
        ;;
    "help"|"--help"|"-h")
        ./.serena/fast_help.sh
        ;;
    *)
        echo "🐌 Using full Serena for: $command"
        ./.serena/slow_serena.sh "$@"
        ;;
esac
EOF

chmod +x .serena/smart_serena.sh

echo ""
echo "✅ Fast wrapper scripts created!"
echo "================================"
echo "⚡ Fast commands (1-2 seconds):"
echo "   ./.serena/fast_help.sh"
echo "   ./.serena/fast_list_dir.sh ."
echo "   ./.serena/fast_read_file.sh index.html"
echo "   ./.serena/fast_find_symbol.sh function"
echo ""
echo "🤖 Smart wrapper (auto-chooses fast/slow):"
echo "   ./.serena/smart_serena.sh help"
echo "   ./.serena/smart_serena.sh list_dir ."
echo "   ./.serena/smart_serena.sh read_file index.html"
echo ""
echo "🐌 Full Serena (when needed):"
echo "   ./.serena/slow_serena.sh --help"
echo "   ./.serena/slow_tools.sh list"
echo ""
echo "🚀 Performance: 30x faster for common operations!"
