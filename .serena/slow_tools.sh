#!/bin/bash
# Slow but full Serena tools
export PATH="$HOME/.local/bin:$PATH"
echo "🐌 Running full Serena tools (may take 30+ seconds)..."
uvx --from git+https://github.com/oraios/serena serena tools "$@"
