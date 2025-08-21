#!/usr/bin/env python3
"""
🤖 SERENA STATUS CHECKER
Kiểm tra trạng thái hoạt động của Serena và project configuration
"""

import os
import subprocess
import sys
from pathlib import Path

def print_status(message, status="info"):
    """Print colored status messages"""
    colors = {
        "success": "\033[92m✅",
        "error": "\033[91m❌", 
        "warning": "\033[93m⚠️",
        "info": "\033[94mℹ️"
    }
    reset = "\033[0m"
    print(f"{colors.get(status, colors['info'])} {message}{reset}")

def run_command(command, timeout=10):
    """Run command with timeout"""
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=timeout
        )
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Command timed out"
    except Exception as e:
        return False, "", str(e)

def check_serena_status():
    """Comprehensive Serena status check"""
    print("🤖 SERENA STATUS CHECKER")
    print("=" * 50)
    
    # 1. Check uv installation
    print("\n📦 Checking uv installation...")
    success, stdout, stderr = run_command("which uv")
    if success and stdout.strip():
        print_status(f"uv found at: {stdout.strip()}", "success")
    else:
        print_status("uv not found in PATH", "error")
        return False
    
    # 2. Check project directory
    print("\n📁 Checking project structure...")
    current_dir = Path.cwd()
    print_status(f"Current directory: {current_dir}", "info")
    
    # Check for Serena project files
    serena_dir = current_dir / ".serena"
    if serena_dir.exists():
        print_status(".serena directory exists", "success")
        
        project_yml = serena_dir / "project.yml"
        if project_yml.exists():
            print_status("project.yml exists", "success")
            try:
                with open(project_yml, 'r') as f:
                    content = f.read()
                    if "typescript" in content.lower():
                        print_status("Project configured for TypeScript", "success")
                    else:
                        print_status("Project configuration found", "info")
            except Exception as e:
                print_status(f"Error reading project.yml: {e}", "warning")
        else:
            print_status("project.yml not found", "warning")
    else:
        print_status(".serena directory not found", "warning")
    
    # 3. Check Serena availability (quick test)
    print("\n🚀 Testing Serena availability...")
    print_status("Testing basic Serena command (may take a moment)...", "info")
    
    # Quick test with shorter timeout
    success, stdout, stderr = run_command(
        'export PATH="$HOME/.local/bin:$PATH" && uvx --from git+https://github.com/oraios/serena serena --version', 
        timeout=30
    )
    
    if success:
        print_status("Serena command responds successfully", "success")
    else:
        print_status(f"Serena command failed: {stderr}", "warning")
    
    # 4. Check project files
    print("\n📄 Checking project files...")
    important_files = [
        "index.html",
        "SERENA_WORKFLOW.md", 
        "activate_serena.sh",
        "test_serena.py"
    ]
    
    for file in important_files:
        if Path(file).exists():
            print_status(f"{file} exists", "success")
        else:
            print_status(f"{file} missing", "warning")
    
    # 5. Show usage instructions
    print("\n📋 SERENA USAGE INSTRUCTIONS")
    print("=" * 50)
    print("🔧 To activate Serena project:")
    print("   ./activate_serena.sh")
    print("   OR")
    print('   Activate the project $(pwd)')
    print()
    print("🛠️ To use Serena tools:")
    print('   export PATH="$HOME/.local/bin:$PATH"')
    print('   uvx --from git+https://github.com/oraios/serena serena tools list')
    print()
    print("📖 For detailed workflow:")
    print("   cat SERENA_WORKFLOW.md")
    print()
    print("🧪 To test Serena:")
    print("   python3 test_serena.py")
    
    # 6. Current status summary
    print("\n📊 CURRENT STATUS SUMMARY")
    print("=" * 50)
    
    if serena_dir.exists() and Path("SERENA_WORKFLOW.md").exists():
        print_status("Serena is INSTALLED and CONFIGURED", "success")
        print_status("Project is ready for semantic development", "success")
        print_status("Follow SERENA_WORKFLOW.md for all coding tasks", "info")
    else:
        print_status("Serena setup incomplete", "warning")
        print_status("Run setup again or check installation", "warning")
    
    return True

if __name__ == "__main__":
    try:
        check_serena_status()
    except KeyboardInterrupt:
        print_status("\nStatus check interrupted by user", "warning")
    except Exception as e:
        print_status(f"Error during status check: {e}", "error")
        sys.exit(1)
