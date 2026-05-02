@echo off
setlocal enabledelayedexpansion
title ElectionGuide AI - Jumpstart
echo ===================================================
echo    ElectionGuide AI: Interactive Election Guide
echo ===================================================
echo.

:: Ensure we are in the root directory
cd /d "%~dp0"

echo [1/4] Cleaning up port 3005 and Node processes...
taskkill /F /IM node.exe >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3005') do (
    echo Terminating existing process on port 3005 with PID %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/4] Verifying dependencies...
if not exist "server\node_modules" (
    echo node_modules missing in server. Installing...
    pushd server
    call npm install
    if !errorlevel! neq 0 (
        echo FATAL: npm install failed in server.
        pause
        exit /b 1
    )
    popd
)
if not exist "client\node_modules" (
    echo node_modules missing in client. Installing...
    pushd client
    call npm install
    if !errorlevel! neq 0 (
        echo FATAL: npm install failed in client.
        pause
        exit /b 1
    )
    popd
)

echo [3/4] Building Frontend...
pushd client
call npm run build
if !errorlevel! neq 0 (
    echo WARNING: Frontend build failed. Server might not show the UI.
    pause
)
popd

echo [4/4] Launching Backend Server...
echo.
echo ---------------------------------------------------
echo  APP RUNNING AT: http://localhost:3005
echo  (Close this window to stop the server)
echo ---------------------------------------------------
echo.

pushd server
node index.js
if !errorlevel! neq 0 (
    echo FATAL: Server crashed or failed to start.
    pause
)
popd

pause
