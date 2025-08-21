# 🤖 SERENA MANDATORY WORKFLOW

## 🚀 **FAST SERENA COMMANDS (NEW!)**

### ⚡ Ultra-Fast Commands (0.03 seconds):
```bash
./serena help                    # Show help
./serena list [path]             # List directory
./serena read <file>             # Read file content
./serena find <term>             # Find symbol/text
./serena status                  # Show status
```

### 🤖 Smart Mode (auto-choose fast/slow):
```bash
./serena smart <command>         # Auto-choose best option
```

### 🐌 Full Serena (30+ seconds, when needed):
```bash
./serena full --help             # Full Serena help
./serena full tools list         # List all tools
```

### 📊 Performance Improvement:
- **Fast commands:** ~0.03 seconds (**30x faster!**)
- **Full Serena:** ~30+ seconds
- **Use fast for 90% of operations**

## 🎯 **OVERVIEW**
This document establishes the **MANDATORY** workflow for all programming tasks in this web application project. **ALL code-related tasks MUST use Serena's semantic tools** - no exceptions.

## 🚀 **SERENA INSTALLATION STATUS**
- ✅ **uv package manager**: Installed at `/Users/ninh/.local/bin/uv`
- ✅ **Serena**: Installed via `uvx --from git+https://github.com/oraios/serena`
- ✅ **Project Configuration**: Located at `.serena/project.yml`
- ✅ **Language**: TypeScript (for JavaScript/HTML analysis)
- ✅ **Project Path**: `/Users/ninh/Library/Mobile Documents/com~apple~CloudDocs/web app/moi`

## 📋 **MANDATORY WORKFLOW RULES**

### **🚫 PROHIBITED ACTIONS:**
- ❌ **NO manual file reading** - Use `read_file()` instead
- ❌ **NO grep/search commands** - Use `find_symbol()` instead  
- ❌ **NO manual text editing** - Use `insert_after_symbol()`, `replace_symbol_body()` instead
- ❌ **NO bypassing Serena tools** - Even for simple tasks, use semantic approach
- ❌ **NO direct file operations** - Use Serena's file tools

### **✅ REQUIRED ACTIONS:**
- ✅ **ALWAYS activate project first**: "Activate the project /Users/ninh/Library/Mobile Documents/com~apple~CloudDocs/web app/moi"
- ✅ **ALWAYS use semantic discovery**: `find_symbol()`, `find_referencing_symbols()`
- ✅ **ALWAYS analyze before editing**: `get_symbols_overview()`
- ✅ **ALWAYS use semantic editing**: `insert_after_symbol()`, `replace_symbol_body()`
- ✅ **ALWAYS validate changes**: `execute_shell_command()` for testing
- ✅ **ALWAYS use Serena file operations**: `read_file()`, `create_text_file()`, `list_dir()`

## 🛠️ **STEP-BY-STEP WORKFLOW**

### **Step 1: Project Activation**
```
ALWAYS start with: "Activate the project /Users/ninh/Library/Mobile Documents/com~apple~CloudDocs/web app/moi"
```

### **Step 2: Code Discovery (MANDATORY)**
```
find_symbol("function_name")           # Find specific functions/variables
find_referencing_symbols()            # Find what uses this symbol
get_symbols_overview("filename")       # Understand file structure
```

### **Step 3: Code Analysis (MANDATORY)**
```
read_file("filename")                  # Read specific files only when needed
list_dir("directory")                  # List directory contents
search_for_pattern("pattern")          # Search for specific patterns
```

### **Step 4: Code Editing (MANDATORY)**
```
insert_after_symbol("symbol", "code")     # Add code after function/variable
insert_before_symbol("symbol", "code")    # Add code before function/variable  
replace_symbol_body("symbol", "code")     # Replace entire function body
```

### **Step 5: Validation (MANDATORY)**
```
execute_shell_command("npm test")         # Run tests
execute_shell_command("npm run build")    # Build project
execute_shell_command("git diff")         # Check changes
```

## 🎯 **PROJECT-SPECIFIC CONTEXT**

### **Current Project**: Cloud-Only Storage v4.0.0 Web Application
- **Main File**: `index.html` (contains JavaScript, Supabase integration)
- **Storage System**: Cloud-only via Supabase Storage
- **Key Functions**: `uploadFileToSupabaseStorage()`, `deleteMediaItem()`, `updateCrossDeviceStatus()`
- **Critical Requirement**: Maintain cloud-only storage architecture

### **Key Symbols to Know**:
- `uploadFileToSupabaseStorage` - Main upload function
- `supplierMedia` - Global data structure
- `renderMediaGrid` - UI rendering function
- `updateCrossDeviceStatus` - Status management
- `saveMediaToStorage` - Local storage management

## 📊 **SERENA TOOLS REFERENCE**

### **🔍 Discovery Tools:**
- `find_symbol("name")` - Find functions, variables, classes
- `find_referencing_symbols()` - Find usage of symbols
- `get_symbols_overview("file")` - Get file structure overview

### **📖 Analysis Tools:**
- `read_file("path")` - Read file contents
- `list_dir("path")` - List directory contents  
- `search_for_pattern("pattern")` - Search for text patterns

### **✏️ Editing Tools:**
- `insert_after_symbol("symbol", "code")` - Insert code after symbol
- `insert_before_symbol("symbol", "code")` - Insert code before symbol
- `replace_symbol_body("symbol", "code")` - Replace symbol definition

### **⚡ Execution Tools:**
- `execute_shell_command("command")` - Run shell commands
- `create_text_file("path", "content")` - Create new files

### **🧠 Memory Tools:**
- `write_memory("name", "content")` - Save project memories
- `read_memory("name")` - Read project memories
- `list_memories()` - List all memories

## 🎯 **SUCCESS CRITERIA**

### **✅ Workflow Compliance:**
- All code discovery uses `find_symbol()` instead of manual search
- All code analysis uses `get_symbols_overview()` before editing
- All code editing uses semantic tools (`insert_after_symbol`, etc.)
- All changes validated with `execute_shell_command()`
- Token usage optimized through targeted operations

### **✅ Quality Metrics:**
- Code accuracy improved through semantic understanding
- Faster development through symbol-level operations
- Reduced errors through automated testing
- Better maintainability through structured approach

## 🚨 **ENFORCEMENT**

**This workflow is MANDATORY for ALL programming tasks. Any deviation from these rules is prohibited.**

**Benefits of compliance:**
- 🎯 **90% reduction in token usage**
- ⚡ **10x faster code discovery**
- 🎨 **Higher code accuracy**
- 🔧 **Better maintainability**
- 💰 **Cost optimization**

---

**Remember: Serena transforms AI from "text editor" to "senior developer assistant"! 🚀**
