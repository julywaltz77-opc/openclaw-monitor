const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const config = require('./config');

// 生成路径的哈希值作为ID
function generatePathHash(filePath) {
  return crypto.createHash('md5').update(filePath).digest('hex');
}

// 读取Agent状态
function getAgentStatus(agentPath) {
  try {
    const statusPath = path.join(agentPath, 'status.json');
    if (!fs.existsSync(statusPath)) {
      return null;
    }
    const statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
    const agentName = path.basename(agentPath);
    return {
      id: generatePathHash(agentPath),
      name: agentName,
      status: statusData.status === 'online' ? 'online' : 'offline',
      lastHeartbeat: statusData.lastHeartbeat || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
  } catch (e) {
    console.error(`读取Agent状态失败: ${agentPath}`, e.message);
    return null;
  }
}

// 读取Agent任务
function getAgentTasks(agentPath) {
  try {
    const tasksPath = path.join(agentPath, 'tasks.json');
    if (!fs.existsSync(tasksPath)) {
      return [];
    }
    const tasksData = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
    const agentName = path.basename(agentPath);
    return tasksData.map(task => ({
      id: `${agentName}-${task.taskName.replace(/\s+/g, '-')}`,
      agentName,
      taskName: task.taskName,
      cron: task.cron || '',
      status: task.status === 'running' ? 'running' : 'stopped',
      lastRunTime: task.lastRunTime || new Date().toISOString()
    }));
  } catch (e) {
    console.error(`读取Agent任务失败: ${agentPath}`, e.message);
    return [];
  }
}

// 读取Agent日志
function getAgentLogs(agentPath) {
  try {
    const logsDir = path.join(agentPath, 'logs');
    if (!fs.existsSync(logsDir)) {
      return [];
    }
    const logFiles = fs.readdirSync(logsDir)
      .filter(file => file.endsWith('.log'))
      .sort((a, b) => b.localeCompare(a)); // 按文件名倒序，最新的在前
    
    const agentName = path.basename(agentPath);
    const logs = [];
    
    // 最多读取最近100条日志
    for (const file of logFiles.slice(0, 5)) {
      const filePath = path.join(logsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim()).reverse(); // 倒序取最新的
      
      for (const line of lines.slice(0, 20)) {
        try {
          const log = JSON.parse(line);
          logs.push({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            agentName,
            taskName: log.taskName || 'unknown',
            status: log.status === 'success' ? 'success' : 'failed',
            message: log.message || line,
            timestamp: log.timestamp || new Date().toISOString()
          });
        } catch {
          // 非JSON格式日志直接作为文本
          logs.push({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            agentName,
            taskName: 'unknown',
            status: 'info',
            message: line,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
    
    return logs.slice(0, 100);
  } catch (e) {
    console.error(`读取Agent日志失败: ${agentPath}`, e.message);
    return [];
  }
}

// 获取所有Agent的数据
function getAllAgentData() {
  const agents = [];
  const tasks = [];
  const taskLogs = [];
  
  for (const agentPath of config.agentPaths) {
    if (!fs.existsSync(agentPath)) {
      console.warn(`Agent路径不存在: ${agentPath}`);
      continue;
    }
    
    const agentStatus = getAgentStatus(agentPath);
    if (agentStatus) {
      agents.push(agentStatus);
    }
    
    const agentTasks = getAgentTasks(agentPath);
    tasks.push(...agentTasks);
    
    const agentLogs = getAgentLogs(agentPath);
    taskLogs.push(...agentLogs);
  }
  
  return { agents, tasks, taskLogs };
}

module.exports = { getAllAgentData };
