#!/bin/bash
# Slow but full Serena command
export PATH="$HOME/.local/bin:$PATH"
echo "🐌 Running full Serena command (may take 30+ seconds)..."
uvx --from git+https://github.com/oraios/serena serena "$@"
