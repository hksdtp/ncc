#!/usr/bin/env python3
"""
🚀 SERENA FAST MANAGER
Optimized workflow manager for fast Serena operations
"""

import sys
import subprocess
import time
from pathlib import Path

def print_banner():
    print("🚀 SERENA FAST MANAGER")
    print("=" * 50)
    print("⚡ Optimized for speed and efficiency")
    print("🎯 Choose fast or full Serena based on your needs")
    print()

def run_fast_command(command, args):
    """Run fast native commands"""
    script_map = {
        'help': './.serena/fast_help.sh',
        'list': './.serena/fast_list_dir.sh',
        'read': './.serena/fast_read_file.sh', 
        'find': './.serena/fast_find_symbol.sh'
    }
    
    if command in script_map:
        cmd = [script_map[command]] + args
        try:
            result = subprocess.run(cmd, capture_output=True, text=True)
            print(result.stdout)
            if result.stderr:
                print(f"⚠️ Warning: {result.stderr}")
            return result.returncode == 0
        except Exception as e:
            print(f"❌ Error running fast command: {e}")
            return False
    else:
        print(f"❌ Unknown fast command: {command}")
        return False

def run_full_serena(args):
    """Run full Serena command when needed"""
    print("🐌 Running full Serena (may take 30+ seconds)...")
    start_time = time.time()
    
    try:
        cmd = ['./.serena/slow_serena.sh'] + args
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        elapsed = time.time() - start_time
        print(f"⏱️ Completed in {elapsed:.1f} seconds")
        
        print(result.stdout)
        if result.stderr:
            print(f"⚠️ Error: {result.stderr}")
        
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error running full Serena: {e}")
        return False

def show_usage():
    """Show usage guide"""
    print("📖 USAGE GUIDE")
    print("-" * 30)
    print("⚡ Fast commands (1-2 seconds):")
    print("   python3 serena_fast.py help")
    print("   python3 serena_fast.py list [path]")
    print("   python3 serena_fast.py read <file>")
    print("   python3 serena_fast.py find <term>")
    print()
    print("🐌 Full Serena (when needed):")
    print("   python3 serena_fast.py full --help")
    print("   python3 serena_fast.py full tools list")
    print()
    print("🤖 Smart mode (auto-choose):")
    print("   python3 serena_fast.py smart <command>")
    print()
    print("📊 Status:")
    print("   python3 serena_fast.py status")

def show_status():
    """Show current status"""
    print("📊 SERENA STATUS")
    print("-" * 30)
    
    # Check fast scripts
    fast_scripts = [
        '.serena/fast_help.sh',
        '.serena/fast_list_dir.sh', 
        '.serena/fast_read_file.sh',
        '.serena/fast_find_symbol.sh'
    ]
    
    all_fast_ready = True
    for script in fast_scripts:
        if Path(script).exists():
            print(f"✅ {script}")
        else:
            print(f"❌ {script}")
            all_fast_ready = False
    
    print()
    if all_fast_ready:
        print("🟢 Fast commands: READY")
        print("⚡ Performance: ~30x faster for common operations")
    else:
        print("🔴 Fast commands: NOT READY")
        print("🔧 Run: ./create_fast_wrappers.sh")
    
    # Check full Serena
    if Path('.serena/slow_serena.sh').exists():
        print("✅ Full Serena: AVAILABLE (slow but complete)")
    else:
        print("❌ Full Serena: NOT AVAILABLE")

def main():
    """Main function"""
    if len(sys.argv) < 2:
        print_banner()
        show_usage()
        return
    
    command = sys.argv[1].lower()
    args = sys.argv[2:] if len(sys.argv) > 2 else []
    
    if command in ['help', '-h', '--help']:
        print_banner()
        show_usage()
    elif command == 'status':
        show_status()
    elif command in ['list', 'read', 'find']:
        success = run_fast_command(command, args)
        if not success:
            print("💡 Try: python3 serena_fast.py help")
    elif command == 'full':
        run_full_serena(args)
    elif command == 'smart':
        if not args:
            print("❌ Smart mode requires a command")
            print("💡 Usage: python3 serena_fast.py smart <command>")
        else:
            # Smart mode: choose fast or slow based on command
            smart_command = args[0].lower()
            if smart_command in ['list_dir', 'read_file', 'find_symbol']:
                # Use fast version
                fast_cmd = smart_command.replace('_', '')
                if fast_cmd == 'listdir':
                    fast_cmd = 'list'
                elif fast_cmd == 'readfile':
                    fast_cmd = 'read'
                elif fast_cmd == 'findsymbol':
                    fast_cmd = 'find'
                run_fast_command(fast_cmd, args[1:])
            else:
                # Use full Serena
                run_full_serena(args)
    else:
        print(f"❌ Unknown command: {command}")
        print("💡 Use: python3 serena_fast.py help")

if __name__ == "__main__":
    main()
