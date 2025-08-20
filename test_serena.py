#!/usr/bin/env python3
"""
🧪 SERENA FUNCTIONALITY TEST SCRIPT
Tests basic Serena tools to verify installation and functionality
"""

import subprocess
import sys
import os

def run_command(cmd):
    """Run a command and return output"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Command timed out"

def test_serena_installation():
    """Test if Serena is properly installed"""
    print("🔍 Testing Serena installation...")
    
    # Test uv availability
    success, stdout, stderr = run_command("export PATH=\"$HOME/.local/bin:$PATH\" && which uv")
    if not success:
        print("❌ uv not found in PATH")
        return False
    print(f"✅ uv found at: {stdout.strip()}")
    
    # Test Serena availability
    success, stdout, stderr = run_command("export PATH=\"$HOME/.local/bin:$PATH\" && uvx --from git+https://github.com/oraios/serena serena --help")
    if not success:
        print(f"❌ Serena not available: {stderr}")
        return False
    print("✅ Serena is available")
    
    return True

def test_project_configuration():
    """Test project configuration"""
    print("\n📁 Testing project configuration...")
    
    # Check if .serena directory exists
    if not os.path.exists(".serena"):
        print("❌ .serena directory not found")
        return False
    print("✅ .serena directory exists")
    
    # Check if project.yml exists
    if not os.path.exists(".serena/project.yml"):
        print("❌ project.yml not found")
        return False
    print("✅ project.yml exists")
    
    # Check project configuration
    with open(".serena/project.yml", "r") as f:
        content = f.read()
        if "language: typescript" in content:
            print("✅ Project configured for TypeScript")
        else:
            print("⚠️ Project language configuration unclear")
    
    return True

def test_serena_tools():
    """Test basic Serena tools"""
    print("\n🛠️ Testing Serena tools...")
    
    # Test tools list
    success, stdout, stderr = run_command("export PATH=\"$HOME/.local/bin:$PATH\" && uvx --from git+https://github.com/oraios/serena serena tools list")
    if not success:
        print(f"❌ Failed to list tools: {stderr}")
        return False
    
    # Check for essential tools
    essential_tools = [
        "find_symbol",
        "get_symbols_overview", 
        "list_dir",
        "read_file",
        "insert_after_symbol",
        "execute_shell_command"
    ]
    
    for tool in essential_tools:
        if tool in stdout:
            print(f"✅ {tool} available")
        else:
            print(f"❌ {tool} not found")
            return False
    
    return True

def test_project_files():
    """Test if key project files exist"""
    print("\n📄 Testing project files...")
    
    key_files = [
        "index.html",
        "SERENA_WORKFLOW.md",
        "activate_serena.sh"
    ]
    
    for file in key_files:
        if os.path.exists(file):
            print(f"✅ {file} exists")
        else:
            print(f"❌ {file} not found")
            return False
    
    return True

def main():
    """Main test function"""
    print("🚀 SERENA FUNCTIONALITY TEST")
    print("=" * 50)
    
    tests = [
        ("Installation", test_serena_installation),
        ("Project Configuration", test_project_configuration), 
        ("Serena Tools", test_serena_tools),
        ("Project Files", test_project_files)
    ]
    
    all_passed = True
    
    for test_name, test_func in tests:
        try:
            if not test_func():
                all_passed = False
                print(f"\n❌ {test_name} test FAILED")
            else:
                print(f"\n✅ {test_name} test PASSED")
        except Exception as e:
            print(f"\n💥 {test_name} test ERROR: {e}")
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 ALL TESTS PASSED! Serena is ready for use.")
        print("\n📋 Next steps:")
        print("1. Activate project: 'Activate the project $(pwd)'")
        print("2. Follow SERENA_WORKFLOW.md for all coding tasks")
        print("3. Use semantic tools for all operations")
    else:
        print("❌ SOME TESTS FAILED! Check the errors above.")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
