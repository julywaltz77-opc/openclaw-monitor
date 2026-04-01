### 模块 3：本地采集上报脚本开发（自动执行，3 个工作日）

#### 开发指令：



```
1\. 在 /local-script/config.js 中定义可配置项：

&#x20;  module.exports = {

&#x20;    uploadSecret: process.env.OPENCLAW\_UPLOAD\_SECRET || "default-secret-need-change",

&#x20;    uploadInterval: 5 \* 60 \* 1000, // 5 分钟

&#x20;    agentPaths: \[], // 用户需手动添加 Agent 路径，如：\["/Users/xxx/openclaw-agent-1", "/Users/xxx/openclaw-agent-2"]

&#x20;    mysqlConfig: {

&#x20;      host: "localhost",

&#x20;      user: "root",

&#x20;      password: "",

&#x20;      database: "",

&#x20;      tables: \[] // 用户需手动添加要展示的表名，如：\["law\_knowledge", "law\_synonym"]

&#x20;    }

&#x20;  };

2\. 开发 /local-script/agentMonitor.js：

&#x20;  \- 导入 fs、path 模块，读取 agentPaths 下的文件

&#x20;  \- 编写 getAgentStatus 函数：读取 status.json → 返回 { id: 路径哈希值, name: 路径最后一级目录名, status: "online"/"offline", lastHeartbeat: 文件中的 lastHeartbeat }

&#x20;  \- 编写 getAgentTasks 函数：读取 tasks.json → 返回 \[{ id: \`\${agentName}-\${taskName}\`, agentName, taskName, cron, status, lastRunTime }]

&#x20;  \- 编写 getAgentLogs 函数：读取 logs/ 目录下的 .log 文件 → 按时间排序，返回 \[{ id: 时间戳+随机数, agentName, taskName, status, message, timestamp }]

&#x20;  \- 导出函数：getAllAgentData() → 返回 { agents: \[], tasks: \[], taskLogs: \[] }

3\. 开发 /local-script/mysqlFetcher.js：

&#x20;  \- 导入 mysql2/promise 模块

&#x20;  \- 编写 fetchMysqlData 函数：

&#x20;    \- 连接本地 MySQL（使用 config.mysqlConfig）

&#x20;    \- 遍历 config.mysqlConfig.tables → 执行 SELECT \* FROM 表名 LIMIT 1000

&#x20;    \- 格式转换：日期类型转字符串（YYYY-MM-DD HH:mm:ss）、大数字转字符串

&#x20;    \- 返回 \[{ id: 表名哈希值, tableName, data: 查询结果数组, updatedAt: 当前时间 }]

4\. 开发 /local-script/convexUploader.js：

&#x20;  \- 导入 axios 模块

&#x20;  \- 编写 uploadToConvex 函数：

&#x20;    \- 接收 agentData 和 mysqlData 参数

&#x20;    \- 构造请求体：{ agents: agentData.agents, tasks: agentData.tasks, taskLogs: agentData.taskLogs, mysqlSnapshots: mysqlData }

&#x20;    \- 携带请求头：{ "X-Upload-Secret": config.uploadSecret }

&#x20;    \- 发送 POST 请求到 Convex 上报接口（从 convex.json 中读取 convexUrl）

&#x20;    \- 失败重试：try/catch 捕获错误，间隔 30s 重试，最多 3 次

&#x20;    \- 日志记录：使用 fs 模块写入 /local-script/logs/upload.log

5\. 开发 /local-script/start.js：

&#x20;  \- 导入上述模块和 node-schedule 模块

&#x20;  \- 编写 startCollection 函数：整合采集+上报流程

&#x20;  \- 定时执行：使用 node-schedule 按 config.uploadInterval 定时调用 startCollection

&#x20;  \- 后台运行：Windows 用 node-windows 模块，Mac 用 pm2 模块（自动安装依赖）

&#x20;  \- 生成开机自启脚本：

&#x20;    \- Windows：生成 openclaw-monitor-start.bat，内容包含设置环境变量、启动 start.js

&#x20;    \- Mac：生成 openclaw-monitor-start.sh，内容包含设置环境变量、启动 start.js

&#x20;    \- 自动提示用户将脚本添加到开机自启（Windows 任务计划程序/Mac LaunchAgents）
```

#### 验收标准（OpenClaw 自动校验）：



* 配置 test 环境（agentPaths 指向测试 Agent 目录，mysqlConfig 配置测试数据库）

* 执行 `node local-script/start.js` 能正常启动，无报错，日志文件生成

* 本地 MySQL 启动后，脚本能成功读取指定表数据并上报到 Convex

* 断网后上报失败，恢复网络后自动重试并成功

* 开机自启脚本生成成功，执行后能自动启动采集脚本，重启电脑后脚本自动运行

