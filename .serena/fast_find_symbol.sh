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
