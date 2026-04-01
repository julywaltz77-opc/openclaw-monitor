const schedule = require('node-schedule');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { getAllAgentData } = require('./agentMonitor');
const { fetchMysqlData } = require('./mysqlFetcher');
const { uploadToConvex } = require('./convexUploader');
const config = require('./config');

// 确保scripts目录存在
const SCRIPTS_DIR = path.join(__dirname, 'scripts');
if (!fs.existsSync(SCRIPTS_DIR)) {
  fs.mkdirSync(SCRIPTS_DIR, { recursive: true });
}

// 生成Windows开机自启脚本
function generateWindowsScript() {
  const scriptPath = path.join(SCRIPTS_DIR, 'openclaw-monitor-start.bat');
  const scriptContent = `@echo off
cd /d "%~dp0.."
node start.js
pause
`;
  fs.writeFileSync(scriptPath, scriptContent);
  console.log(`Windows开机自启脚本已生成: ${scriptPath}`);
  console.log('请将此脚本添加到Windows任务计划程序，设置为开机启动');
}

// 生成Mac开机自启脚本
function generateMacScript() {
  const scriptPath = path.join(SCRIPTS_DIR, 'openclaw-monitor-start.sh');
  const plistPath = path.join(SCRIPTS_DIR, 'com.openclaw.monitor.plist');
  
  const scriptContent = `#!/bin/bash
cd "$(dirname "$0")/.."
node start.js
`;
  fs.writeFileSync(scriptPath, scriptContent);
  fs.chmodSync(scriptPath, 0o755);
  
  const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.openclaw.monitor</string>
    <key>ProgramArguments</key>
    <array>
        <string>${scriptPath}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/openclaw-monitor.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/openclaw-monitor-error.log</string>
</dict>
</plist>
`;
  fs.writeFileSync(plistPath, plistContent);
  
  console.log(`Mac开机自启脚本已生成: ${scriptPath}`);
  console.log(`Plist配置文件已生成: ${plistPath}`);
  console.log('执行以下命令设置开机启动:');
  console.log(`sudo cp ${plistPath} /Library/LaunchAgents/`);
  console.log(`sudo launchctl load /Library/LaunchAgents/com.openclaw.monitor.plist`);
}

// 生成开机自启脚本
function generateStartupScripts() {
  if (process.platform === 'win32') {
    generateWindowsScript();
  } else if (process.platform === 'darwin') {
    generateMacScript();
  } else {
    console.log('Linux系统请自行配置systemd服务');
  }
}

// 单次采集上报任务
async function startCollection() {
  console.log('\n=== 开始采集数据 ===');
  try {
    const agentData = getAllAgentData();
    console.log(`采集到Agent数据: ${agentData.agents.length}个Agent, ${agentData.tasks.length}个任务, ${agentData.taskLogs.length}条日志`);
    
    const mysqlData = await fetchMysqlData();
    console.log(`采集到MySQL数据: ${mysqlData.length}张表`);
    
    await uploadToConvex(agentData, mysqlData);
  } catch (e) {
    console.error('采集上报失败:', e.message);
  }
  console.log('=== 采集结束 ===\n');
}

// 主函数
async function main() {
  console.log('OpenClaw Monitor 采集脚本启动');
  console.log(`上报间隔: ${config.uploadInterval / 1000 / 60}分钟`);
  
  // 生成开机自启脚本
  generateStartupScripts();
  
  // 立即执行一次
  await startCollection();
  
  // 设置定时任务
  const intervalMs = config.uploadInterval;
  setInterval(startCollection, intervalMs);
  
  console.log(`定时任务已启动，下次执行时间: ${new Date(Date.now() + intervalMs).toLocaleString()}`);
}

main().catch(e => {
  console.error('脚本启动失败:', e);
  process.exit(1);
});
