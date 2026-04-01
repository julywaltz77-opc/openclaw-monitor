#!/bin/bash

# 脚本路径
SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../start.js"
PLIST_PATH="$HOME/Library/LaunchAgents/com.openclaw.monitor.plist"

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "错误：未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 创建 plist 文件
cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.openclaw.monitor</string>
    <key>ProgramArguments</key>
    <array>
        <string>$(which node)</string>
        <string>$SCRIPT_PATH</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/openclaw-monitor.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/openclaw-monitor.error.log</string>
</dict>
</plist>
EOF

# 加载服务
launchctl load "$PLIST_PATH"

if [ $? -eq 0 ]; then
    echo "OpenClaw Monitor 已成功添加到开机自启"
    echo "日志文件路径：/tmp/openclaw-monitor.log"
else
    echo "添加开机自启失败，请检查权限"
fi
