## 三、详细数据流说明（分阶段 + 文件关联，OpenClaw 自动实现）

### 1. 本地数据采集阶段（对应文件：/local-script/agentMonitor.js + mysqlFetcher.js）

#### 数据流步骤：



1. **Agent 数据采集**：

* 脚本读取 `config.js` 中 `agentPaths` 配置的多个 Agent 路径

* 遍历每个路径下的 `status.json` 文件 → 解析 `status`（online/offline）、`lastHeartbeat`（最后活跃时间）

* 读取每个路径下的 `tasks.json` 文件 → 解析 `taskName`（任务名称）、`cron`（定时规则）、`status`（任务状态）

* 读取每个路径下 `logs/` 目录的 `.log` 文件 → 按时间排序，提取 `timestamp`（时间）、`message`（日志内容）、`status`（执行结果）

1. **MySQL 数据采集**：

* 脚本读取 `config.js` 中 `mysqlConfig` 配置（host、user、password、database、tables）

* 使用 `mysql2` 建立本地 MySQL 连接，执行 `SELECT * FROM 表名 LIMIT 1000`（仅查询，无写操作）

* 对查询结果进行格式转换：日期类型转字符串、大数字转字符串（避免 JSON 序列化精度丢失）

* 按表名分组，生成 `{ tableName: "表名", data: [查询结果], updatedAt: "当前时间" }` 格式数据

### 2. 本地数据处理与上报阶段（对应文件：/local-script/convexUploader.js）

#### 数据流步骤：



1. 接收 `agentMonitor.js` 输出的 Agent 状态、任务、日志数据

2. 接收 `mysqlFetcher.js` 输出的 MySQL 表数据快照

3. 数据格式化：过滤空值、统一日期格式（YYYY-MM-DD HH:mm:ss）、按 Convex 表结构整理字段

4. 密钥验证：从 `config.js` 读取 `uploadSecret`，作为请求头 `X-Upload-Secret` 携带

5. 上报请求：通过 axios 以 POST 方式发送数据到 Convex 上报接口（`https://-url>/api/actions/reportData`）

6. 失败重试：若上报失败（网络错误、接口返回非 200），间隔 30s 重试，最多重试 3 次

7. 日志记录：上报成功 / 失败信息写入 `/local-script/logs/upload.log`

### 3. Convex 中转处理阶段（对应文件：/convex/actions/reportData.js + schema.js）

#### 数据流步骤：



1. 接口接收：Convex 的 `reportData` 接口接收本地上报的 JSON 数据（包含 agents、tasks、taskLogs、mysqlSnapshots 四个数组）

2. 密钥校验：从 Convex 环境变量 `UPLOAD_SECRET` 读取密钥，与请求头 `X-Upload-Secret` 比对，不一致则返回 403

3. 数据校验：过滤空字段、验证字段类型（如 status 必须是 "online"/"offline"/"success"/"failed"）

4. 数据存储：

* agents 数据：按 `id` 主键更新（存在则更新状态和最后心跳，不存在则新增）

* tasks 数据：按 `agentName + taskName` 唯一组合更新（避免重复）

* taskLogs 数据：直接新增（日志不重复）

* mysqlSnapshots 数据：按 `tableName` 更新（覆盖旧快照，保留最新数据）

1. 响应返回：存储完成后返回 `{ success: true, message: "数据上报成功", count: 各类型数据条数 }`

### 4. 前端查询与展示阶段（对应文件：/app/lib/convex.js + 各页面组件）

#### 数据流步骤：



1. 前端初始化：页面加载时，`/app/lib/convex.js` 初始化 Convex 客户端（使用 `NEXT_PUBLIC_CONVEX_URL` 环境变量）

2. 数据查询：

* 总看板（page.js）：调用 `fetchAgents()`、`fetchTasks()`、`fetchLogs()`、`fetchMysqlData()` 获取所有核心数据

* Agent 列表页（agents/page.js）：调用 `fetchAgents({ status: 筛选条件 })`

* 任务页（tasks/page.js）：调用 `fetchTasks({ agentName: 筛选条件 })`

* 日志页（logs/page.js）：调用 `fetchLogs({ timeRange: 筛选条件, status: 筛选条件 })`

* MySQL 数据页（mysql/page.js）：调用 `fetchMysqlData({ tableName: 选中表名 })`

1. 数据渲染：

* 调用组件渲染数据（如 AgentCard 渲染 Agent 状态、TaskTable 渲染任务列表）

* 加载状态：数据查询中显示 `Loading.jsx`

* 空数据：无结果时显示 `EmptyState.jsx`

1. 自动刷新：页面通过 `setInterval` 每 5 分钟重新调用查询函数，更新数据

### 5. 关键数据流关联表（OpenClaw 自动映射）



| 数据类型       | 本地采集文件          | 上报字段                                           | Convex 表名      | 前端查询函数           | 前端展示组件         |
| ---------- | --------------- | ---------------------------------------------- | -------------- | ---------------- | -------------- |
| Agent 状态   | agentMonitor.js | id、name、status、lastHeartbeat                   | agents         | fetchAgents()    | AgentCard.jsx  |
| 定时任务       | agentMonitor.js | id、agentName、taskName、cron、status、lastRunTime  | tasks          | fetchTasks()     | TaskTable.jsx  |
| 执行日志       | agentMonitor.js | id、agentName、taskName、status、message、timestamp | taskLogs       | fetchLogs()      | LogList.jsx    |
| MySQL 数据快照 | mysqlFetcher.js | id、tableName、data、updatedAt                    | mysqlSnapshots | fetchMysqlData() | MysqlTable.jsx |



***