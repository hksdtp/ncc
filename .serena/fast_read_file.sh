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
