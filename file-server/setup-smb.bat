@echo off
REM SMB Storage Setup Script for Windows
REM Cấu hình kết nối SMB storage cho file server

echo 🔧 Setting up SMB Storage Connection for Windows...

REM Configuration
set SMB_HOST=222.252.23.248
set SMB_SHARE=script
set DRIVE_LETTER=Z:

REM Prompt for credentials
set /p SMB_USERNAME="Enter Username: "
set /p SMB_PASSWORD="Enter Password: "

echo.
echo 📁 Mapping network drive %DRIVE_LETTER% to \\%SMB_HOST%\%SMB_SHARE%

REM Map network drive
net use %DRIVE_LETTER% \\%SMB_HOST%\%SMB_SHARE% /user:%SMB_USERNAME% %SMB_PASSWORD% /persistent:yes

REM Check if mapping was successful
if %errorlevel% equ 0 (
    echo ✅ Network drive mapped successfully
    
    REM Test write access
    echo Test write access > "%DRIVE_LETTER%\test-write.txt" 2>nul
    if exist "%DRIVE_LETTER%\test-write.txt" (
        echo ✅ Write access confirmed
        del "%DRIVE_LETTER%\test-write.txt"
    ) else (
        echo ⚠️ Write access failed - check permissions
    )
    
    REM Show drive info
    echo 📊 Drive information:
    dir %DRIVE_LETTER%
    
) else (
    echo ❌ Failed to map network drive
    echo 🔍 Troubleshooting tips:
    echo   1. Check network connectivity: ping %SMB_HOST%
    echo   2. Verify credentials
    echo   3. Check firewall settings
    echo   4. Ensure SMB service is running on %SMB_HOST%
    echo   5. Try running as Administrator
)

REM Create environment file for Node.js
echo 📝 Creating environment file: .env
(
echo # SMB Storage Configuration
echo SMB_USERNAME=%SMB_USERNAME%
echo SMB_PASSWORD=%SMB_PASSWORD%
echo SMB_MOUNT=%DRIVE_LETTER%\
echo PORT=8080
) > .env

echo.
echo 🎉 Setup complete!
echo 📋 Next steps:
echo   1. cd file-server
echo   2. npm install
echo   3. npm start
echo   4. Test: curl http://localhost:8080/ping

pause
