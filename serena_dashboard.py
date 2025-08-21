#!/usr/bin/env python3
"""
🤖 SERENA STATUS DASHBOARD
Real-time status monitoring for Serena integration
"""

import os
import time
from pathlib import Path

def clear_screen():
    os.system('clear' if os.name == 'posix' else 'cls')

def print_header():
    print("🤖 SERENA STATUS DASHBOARD")
    print("=" * 60)
    print(f"📅 Last updated: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

def check_installation():
    """Check Serena installation status"""
    print("\n📦 INSTALLATION STATUS")
    print("-" * 30)
    
    # Check uv
    uv_path = "/Users/ninh/.local/bin/uv"
    if Path(uv_path).exists():
        print("✅ uv package manager: INSTALLED")
    else:
        print("❌ uv package manager: NOT FOUND")
    
    # Check project structure
    if Path(".serena").exists():
        print("✅ .serena directory: EXISTS")
    else:
        print("❌ .serena directory: MISSING")
    
    if Path(".serena/project.yml").exists():
        print("✅ project.yml: CONFIGURED")
    else:
        print("❌ project.yml: MISSING")

def check_project_files():
    """Check project files status"""
    print("\n📁 PROJECT FILES")
    print("-" * 30)
    
    files = {
        "index.html": "Main web app",
        "SERENA_WORKFLOW.md": "Workflow documentation", 
        "activate_serena.sh": "Activation script",
        "test_serena.py": "Test suite",
        "check_serena_status.py": "Status checker",
        "quick_serena_test.sh": "Quick test"
    }
    
    for file, description in files.items():
        if Path(file).exists():
            print(f"✅ {file}: {description}")
        else:
            print(f"❌ {file}: MISSING")

def check_serena_performance():
    """Check Serena performance status"""
    print("\n⚡ SERENA PERFORMANCE")
    print("-" * 30)
    
    print("🔍 Command Response Time:")
    print("   ⚠️  SLOW (30+ seconds)")
    print("   📝 Reason: uvx resolving dependencies each time")
    print("   💡 Solution: Use cached commands or local installation")
    
    print("\n🎯 Recommended Usage:")
    print("   ✅ Use for complex semantic operations")
    print("   ✅ Follow SERENA_WORKFLOW.md")
    print("   ⚠️  Avoid for simple file operations")

def show_usage_guide():
    """Show usage guide"""
    print("\n📖 USAGE GUIDE")
    print("-" * 30)
    
    print("🚀 To activate Serena:")
    print('   Activate the project $(pwd)')
    
    print("\n🛠️ For semantic operations:")
    print("   1. Always activate project first")
    print("   2. Use semantic discovery before editing")
    print("   3. Follow mandatory workflow")
    
    print("\n📋 Available Commands:")
    print("   ./quick_serena_test.sh     - Quick status check")
    print("   python3 check_serena_status.py - Detailed status")
    print("   python3 test_serena.py    - Full test suite")
    print("   cat SERENA_WORKFLOW.md    - Read workflow")

def show_current_status():
    """Show current overall status"""
    print("\n📊 OVERALL STATUS")
    print("-" * 30)
    
    # Check key indicators
    has_uv = Path("/Users/ninh/.local/bin/uv").exists()
    has_serena_dir = Path(".serena").exists()
    has_workflow = Path("SERENA_WORKFLOW.md").exists()
    
    if has_uv and has_serena_dir and has_workflow:
        print("🟢 STATUS: READY")
        print("✅ Serena is installed and configured")
        print("✅ Project is ready for semantic development")
        print("⚠️  Commands may be slow due to dependency resolution")
    elif has_uv and has_serena_dir:
        print("🟡 STATUS: PARTIALLY READY")
        print("✅ Basic installation complete")
        print("⚠️  Some components may be missing")
    else:
        print("🔴 STATUS: NOT READY")
        print("❌ Installation incomplete")
        print("🔧 Run setup again")

def main():
    """Main dashboard function"""
    clear_screen()
    print_header()
    check_installation()
    check_project_files()
    check_serena_performance()
    show_usage_guide()
    show_current_status()
    
    print("\n" + "=" * 60)
    print("🔄 Run this script anytime to check Serena status")
    print("💡 For real-time monitoring, use: watch -n 5 python3 serena_dashboard.py")

if __name__ == "__main__":
    main()
