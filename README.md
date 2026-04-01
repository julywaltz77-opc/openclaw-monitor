# OpenClaw Monitor
OpenClaw 运行状态监控系统，实时展示 Agent 运行状态、定时任务执行情况、操作日志以及 MySQL 数据快照。

## 技术栈
- **前端**: Next.js 14 (App Router)
- **中转层**: Convex (数据存储 + API 服务)
- **本地采集**: Node.js 脚本
- **部署平台**: Vercel

## 核心功能
1. 📊 总看板：全局运行状态概览
2. 🤖 Agent 管理：所有 Agent 运行状态、版本、最近活跃时间
3. ⏰ 定时任务：任务执行状态、调度时间、执行结果
4. 📝 执行日志：操作日志记录、错误排查
5. 🗄️ MySQL 数据：自定义查询结果快照展示

## 快速开始
1. 部署 Convex 后端
2. 部署 Next.js 前端到 Vercel
3. 配置本地采集脚本并设置开机自启

详细部署说明请查看 [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)
