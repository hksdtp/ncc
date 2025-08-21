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
