### 模块 2：Convex 中转层开发（自动执行，2 个工作日）

#### 开发指令：



```
1\. 在 /convex/schema.js 中定义 4 张核心表：

&#x20;  \- agents：{&#x20;

&#x20;      id: v.string(),&#x20;

&#x20;      name: v.string(),&#x20;

&#x20;      status: v.union(v.literal("online"), v.literal("offline")),&#x20;

&#x20;      lastHeartbeat: v.string(),&#x20;

&#x20;      createdAt: v.string()&#x20;

&#x20;    }

&#x20;  \- tasks：{&#x20;

&#x20;      id: v.string(),&#x20;

&#x20;      agentName: v.string(),&#x20;

&#x20;      taskName: v.string(),&#x20;

&#x20;      cron: v.string(),&#x20;

&#x20;      status: v.union(v.literal("running"), v.literal("stopped")),&#x20;

&#x20;      lastRunTime: v.string()&#x20;

&#x20;    }

&#x20;  \- taskLogs：{&#x20;

&#x20;      id: v.string(),&#x20;

&#x20;      agentName: v.string(),&#x20;

&#x20;      taskName: v.string(),&#x20;

&#x20;      status: v.union(v.literal("success"), v.literal("failed")),&#x20;

&#x20;      message: v.string(),&#x20;

&#x20;      timestamp: v.string()&#x20;

&#x20;    }

&#x20;  \- mysqlSnapshots：{&#x20;

&#x20;      id: v.string(),&#x20;

&#x20;      tableName: v.string(),&#x20;

&#x20;      data: v.object(),&#x20;

&#x20;      updatedAt: v.string()&#x20;

&#x20;    }

2\. 在 /convex/actions/reportData.js 开发上报接口：

&#x20;  \- 接收参数：{ agents: v.array(agentsSchema), tasks: v.array(tasksSchema), taskLogs: v.array(taskLogsSchema), mysqlSnapshots: v.array(mysqlSnapshotsSchema) }

&#x20;  \- 密钥验证：从 ctx.env.UPLOAD\_SECRET 获取密钥，与 ctx.headers\["x-upload-secret"] 比对，不一致则 throw new Error("403")

&#x20;  \- 数据处理：

&#x20;    \- agents：使用 db.insert(agents).onConflictDoUpdate({ target: agents.id, set: { status: data.status, lastHeartbeat: data.lastHeartbeat } })

&#x20;    \- tasks：使用 db.insert(tasks).onConflictDoUpdate({ target: \[tasks.agentName, tasks.taskName], set: { status: data.status, lastRunTime: data.lastRunTime } })

&#x20;    \- taskLogs：直接 db.insert(taskLogs).many(data.taskLogs)

&#x20;    \- mysqlSnapshots：使用 db.insert(mysqlSnapshots).onConflictDoUpdate({ target: mysqlSnapshots.tableName, set: { data: data.data, updatedAt: data.updatedAt } })

3\. 在 /convex/queries/ 开发 4 个查询接口：

&#x20;  \- getAgents.js：接收 status 可选参数，返回 db.query("agents").filter(q => status ? q.eq(q.field("status"), status) : q.true()).collect()

&#x20;  \- getTasks.js：接收 agentName 可选参数，返回 db.query("tasks").filter(q => agentName ? q.eq(q.field("agentName"), agentName) : q.true()).collect()

&#x20;  \- getLogs.js：接收 timeRange 可选参数（默认 "7d"），计算时间范围后过滤 timestamp，返回排序后的日志

&#x20;  \- getMysqlData.js：接收 tableName 可选参数，返回 db.query("mysqlSnapshots").filter(q => tableName ? q.eq(q.field("tableName"), tableName) : q.true()).collect()

4\. 配置 Convex 权限规则：在 convex.json 中添加权限配置，仅允许 actions.reportData 携带有效密钥执行，queries 允许公开访问
```

#### 验收标准（OpenClaw 自动校验）：



* Convex 控制台显示 4 张表已创建，字段类型与定义一致

* 使用 Convex CLI 测试上报接口：`npx convex run actions/reportData '{"agents": [{"id": "test-1", "name": "test-agent", "status": "online", "lastHeartbeat": "2024-01-01 12:00:00", "createdAt": "2024-01-01 12:00:00"}]}' --header "X-Upload-Secret: test-secret"` 执行成功

* 测试查询接口：`npx convex run queries/getAgents` 能返回上报的 test-agent 数据

* 无密钥上报测试：`npx convex run actions/reportData '{"agents": [{"id": "test-2", "name": "test-agent2", "status": "online", "lastHeartbeat": "2024-01-01 12:00:00", "createdAt": "2024-01-01 12:00:00"}]}'` 返回 403 错误
