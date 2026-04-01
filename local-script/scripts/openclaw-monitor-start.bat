@echo off
setlocal

:: 设置脚本路径
set SCRIPT_PATH=%~dp0start.js
set NODE_PATH=node.exe

:: 检查 Node.js 是否安装
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

:: 添加到任务计划程序，开机自启
schtasks /create /tn "OpenClaw Monitor" /tr "\"%NODE_PATH%\" \"%SCRIPT_PATH%\"" /sc onstart /rl highest /f

if %errorlevel% equ 0 (
    echo OpenClaw Monitor 已成功添加到开机自启
) else (
    echo 添加开机自启失败，请以管理员身份运行此脚本
)

pause
