## 二、完整项目目录结构（含文件层级，OpenClaw 自动遵循）



```
/openclaw-monitor/

├── package.json                  # 项目依赖配置

├── vercel.json                   # Vercel 部署配置

├── .gitignore                    # Git 忽略文件

├── README.md                     # 项目说明文档

├── DEPLOY\_GUIDE.md               # 部署说明文档（自动生成）

├── config.example.js             # 配置文件示例（自动生成）

├── /app                          # Next.js 前端核心目录（App Router）

│   ├── layout.js                 # 全局布局（包含导航栏）

│   ├── page.js                   # 首页总看板

│   ├── /agents/

│   │   └── page.js               # Agent 列表页

│   ├── /tasks/

│   │   └── page.js               # 定时任务页

│   ├── /logs/

│   │   └── page.js               # 执行日志页

│   ├── /mysql/

│   │   └── page.js               # MySQL 数据展示页

│   ├── /components/              # 公共 UI 组件

│   │   ├── AgentCard.jsx         # Agent 状态卡片组件

│   │   ├── TaskTable.jsx         # 任务列表表格组件

│   │   ├── LogList.jsx           # 执行日志列表组件

│   │   ├── MysqlTable.jsx        # MySQL 数据表格组件

│   │   ├── Layout.jsx            # 页面布局组件（导航栏+内容区）

│   │   ├── Loading.jsx           # 加载状态组件

│   │   └── EmptyState.jsx        # 空数据提示组件

│   └── /lib/

│       ├── convex.js             # Convex 客户端初始化+查询函数封装

│       └── utils.js              # 工具函数（日期格式化、状态转换等）

├── /convex                       # Convex 中转层目录

│   ├── convex.json               # Convex 项目配置

│   ├── schema.js                 # 数据模型定义（4 张核心表）

│   ├── /actions/

│   │   └── reportData.js         # 数据上报接口（带密钥验证）

│   └── /queries/

│       ├── getAgents.js          # Agent 数据查询接口

│       ├── getTasks.js           # 任务数据查询接口

│       ├── getLogs.js            # 日志数据查询接口

│       └── getMysqlData.js       # MySQL 快照数据查询接口

└── /local-script                 # 本地采集上报脚本目录

&#x20;   ├── start.js                  # 脚本入口（整合采集+上报+开机自启）

&#x20;   ├── config.js                 # 配置文件（可自定义上报频率、Agent 路径等）

&#x20;   ├── agentMonitor.js           # Agent 数据采集模块

&#x20;   ├── mysqlFetcher.js           # MySQL 数据采集模块

&#x20;   ├── convexUploader.js         # Convex 数据上报模块

&#x20;   ├── /logs/                    # 本地日志存储目录

&#x20;   │   └── upload.log            # 上报日志文件（自动生成）

&#x20;   ├── /scripts/                 # 开机自启脚本目录

&#x20;   │   ├── openclaw-monitor-start.bat  # Windows 开机自启脚本

&#x20;   │   └── openclaw-monitor-start.sh   # Mac 开机自启脚本

&#x20;   └── local-script.zip          # 本地脚本压缩包（自动打包）
```



***
