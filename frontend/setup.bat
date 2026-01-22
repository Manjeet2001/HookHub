@echo off
echo ================================================
echo    HookHub Frontend - Quick Setup Script
echo ================================================
echo.

echo [1/3] Installing npm dependencies...
echo.
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Please run 'npm install' manually
    pause
    exit /b 1
)

echo.
echo ================================================
echo    Installation Complete!
echo ================================================
echo.
echo Next steps:
echo   1. Start the HookHub backend (see HookHub/README.md)
echo   2. Run 'npm run dev' to start the frontend
echo   3. Open http://localhost:5173 in your browser
echo.
echo For more information, see README.md
echo.
pause
