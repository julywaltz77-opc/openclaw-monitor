### 模块 4：前端页面开发（自动执行，4 个工作日）

#### 开发指令：



```
1\. 开发公共组件（/app/components/）：

&#x20;  \- AgentCard.jsx：

&#x20;    \- 接收 props：{ name, status, lastHeartbeat }

&#x20;    \- 状态样式：online → 绿色边框+在线图标，offline → 红色边框+离线图标

&#x20;    \- 显示名称、状态、最后活跃时间（格式化：YYYY-MM-DD HH:mm:ss）

&#x20;    \- 点击跳转至 Agent 详情页（暂为列表页筛选）

&#x20;  \- TaskTable.jsx：

&#x20;    \- 使用 react-table 实现表格，列：Agent 名称、任务名称、定时规则、状态、最后执行时间

&#x20;    \- 支持筛选：顶部下拉框筛选 Agent 名称、任务状态

&#x20;    \- 状态样式：running → 绿色文字，stopped → 灰色文字

&#x20;  \- LogList.jsx：

&#x20;    \- 列表项：时间、Agent 名称、任务名称、状态、详情

&#x20;    \- 状态样式：success → 绿色对勾图标，failed → 红色叉号图标

&#x20;    \- 支持筛选：时间范围（今日/昨日/近 7 天）、状态、Agent 名称

&#x20;  \- MysqlTable.jsx：

&#x20;    \- 使用 react-table 实现动态表格（列名从数据中提取）

&#x20;    \- 支持分页（每页 20 条）、搜索（模糊匹配所有字段）

&#x20;    \- 显示表名、数据更新时间、数据条数

&#x20;  \- Layout.jsx：

&#x20;    \- 导航栏：包含 Logo、总看板、Agent 列表、定时任务、执行日志、MySQL 数据 5 个菜单

&#x20;    \- 内容区：自适应布局，最大宽度 1920px，居中显示

&#x20;    \- 响应式：导航栏在手机端折叠为汉堡菜单

&#x20;  \- Loading.jsx：居中显示加载动画+文字提示

&#x20;  \- EmptyState.jsx：居中显示空数据图标+文字提示（如：暂无数据，请等待上报）

2\. 开发工具函数（/app/lib/）：

&#x20;  \- convex.js：

&#x20;    \- 导入 createConvexClient，使用 NEXT\_PUBLIC\_CONVEX\_URL 初始化客户端

&#x20;    \- 封装 4 个查询函数：

&#x20;      \- fetchAgents：(status) => client.query("queries/getAgents", { status }).then(res => res)

&#x20;      \- fetchTasks：(agentName) => client.query("queries/getTasks", { agentName }).then(res => res)

&#x20;      \- fetchLogs：(timeRange, status, agentName) => client.query("queries/getLogs", { timeRange, status, agentName }).then(res => res)

&#x20;      \- fetchMysqlData：(tableName) => client.query("queries/getMysqlData", { tableName }).then(res => res)

&#x20;  \- utils.js：

&#x20;    \- formatDate：日期格式化函数（输入时间字符串，输出 YYYY-MM-DD HH:mm:ss）

&#x20;    \- formatCron：cron 表达式格式化函数（输入 cron 字符串，输出中文描述，如："每天 12:00"）

&#x20;    \- getTimeRange：时间范围转换函数（输入 "today"/"yesterday"/"7d"，输出开始时间和结束时间字符串）

3\. 开发页面（/app/）：

&#x20;  \- page.js（总看板）：

&#x20;    \- 顶部统计卡片（4 个）：在线 Agent 数（计算 agents 中 status 为 online 的数量）、总任务数（tasks 数组长度）、今日成功任务数（taskLogs 中今日且 status 为 success 的数量）、今日失败任务数（taskLogs 中今日且 status 为 failed 的数量）

&#x20;    \- 中间区域：最近 10 条执行日志（使用 LogList.jsx，限制条数为 10）

&#x20;    \- 底部区域：MySQL 数据表概览（使用 MysqlTable.jsx，默认显示第一个表数据，支持下拉切换表名）

&#x20;    \- 自动刷新：useEffect 中设置 setInterval，每 5 分钟重新调用所有查询函数

&#x20;    \- 加载状态：查询过程中显示 Loading.jsx，无数据时显示 EmptyState.jsx

&#x20;  \- agents/page.js（Agent 列表）：

&#x20;    \- 顶部筛选器：下拉框（全部/在线/离线）

&#x20;    \- 内容区：AgentCard 网格布局（每行 3 个，响应式调整为 2 个/1 个）

&#x20;    \- 自动刷新：每 5 分钟刷新一次数据

&#x20;    \- 无数据时显示 EmptyState.jsx

&#x20;  \- tasks/page.js（定时任务）：

&#x20;    \- 顶部筛选器：Agent 名称下拉框（从 agents 数据中提取）、任务状态下拉框

&#x20;    \- 内容区：TaskTable.jsx 组件，传入筛选后的 tasks 数据

&#x20;    \- 自动刷新：每 5 分钟刷新一次数据

&#x20;    \- 无数据时显示 EmptyState.jsx

&#x20;  \- logs/page.js（执行日志）：

&#x20;    \- 顶部筛选器：时间范围下拉框、状态下拉框、Agent 名称下拉框

&#x20;    \- 内容区：LogList.jsx 组件，传入筛选后的 logs 数据

&#x20;    \- 自动刷新：每 5 分钟刷新一次数据

&#x20;    \- 无数据时显示 EmptyState.jsx

&#x20;  \- mysql/page.js（MySQL 数据）：

&#x20;    \- 顶部筛选器：表名下拉框（从 mysqlSnapshots 数据中提取 tableName）

&#x20;    \- 内容区：MysqlTable.jsx 组件，传入选中表的 data 数据

&#x20;    \- 支持搜索、分页

&#x20;    \- 自动刷新：每 5 分钟刷新一次数据

&#x20;    \- 无数据时显示 EmptyState.jsx
```

#### 验收标准（OpenClaw 自动校验）：



* 所有页面能正常访问，无控制台报错

* 导航栏能正常切换页面，响应式布局在 1920px/1024px/375px 分辨率下正常显示

* 数据能从 Convex 成功获取并渲染到对应组件

* 筛选功能正常：选择筛选条件后，数据实时更新

* 分页功能正常：MySQL 数据页分页切换无报错

* 自动刷新功能正常：修改 Convex 数据后，5 分钟内页面自动更新

* 加载状态和空数据提示正常显示

