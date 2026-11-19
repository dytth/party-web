@echo off
set "PATH=C:\laragon\bin\nodejs\node-v22;C:\laragon\bin\git\cmd;%PATH%"
cd /d "%~dp0"
echo Khoi dong Party Web dev server (Port 3001)...
call pnpm dev --port 3001
