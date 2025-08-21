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
