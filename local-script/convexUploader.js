const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// 读取Convex URL
let convexUrl = '';
try {
  const convexConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../convex/convex.json'), 'utf8'));
  const envLocal = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
  const urlMatch = envLocal.match(/NEXT_PUBLIC_CONVEX_URL=(.+)/);
  if (urlMatch) {
    convexUrl = urlMatch[1].trim();
  }
} catch (e) {
  console.error('读取Convex配置失败:', e.message);
}

const LOG_FILE = path.join(__dirname, 'logs/upload.log');

// 确保日志目录存在
if (!fs.existsSync(path.dirname(LOG_FILE))) {
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
}

// 写入日志
function writeLog(message, type = 'info') {
  const logLine = `[${new Date().toISOString()}] [${type}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logLine);
  console.log(logLine.trim());
}

// 上报数据到Convex
async function uploadToConvex(agentData, mysqlData, retries = 3) {
  if (!convexUrl) {
    writeLog('Convex URL未配置，跳过上报', 'error');
    return false;
  }

  const url = `${convexUrl}/api/actions/reportData`;
  const data = {
    agents: agentData.agents || [],
    tasks: agentData.tasks || [],
    taskLogs: agentData.taskLogs || [],
    mysqlSnapshots: mysqlData || []
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'X-Upload-Secret': config.uploadSecret,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (response.data.success) {
      writeLog(`上报成功: agents=${data.agents.length}, tasks=${data.tasks.length}, logs=${data.taskLogs.length}, mysql=${data.mysqlSnapshots.length}`);
      return true;
    } else {
      throw new Error(response.data.message || '上报失败');
    }
  } catch (e) {
    const errorMsg = e.response?.data || e.message;
    writeLog(`上报失败 (剩余重试${retries}次): ${errorMsg}`, 'error');
    
    if (retries > 0) {
      // 等待30秒重试
      await new Promise(resolve => setTimeout(resolve, 30000));
      return uploadToConvex(agentData, mysqlData, retries - 1);
    }
    
    return false;
  }
}

module.exports = { uploadToConvex };
