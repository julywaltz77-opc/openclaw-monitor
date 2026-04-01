# OpenClaw 自动开发任务：OpenClaw Agent 监控平台

## 核心指令：按此计划书全自动完成开发 + 部署

### 任务标识：OPENCLAW\_MONITOR\_2024

### 开发模式：全自动化（无需人工干预）

### 输出物：可直接访问的 Vercel 网页 + 本地运行脚本 + Convex 数据库



***

## 一、前置约定（OpenClaw 自动读取）



1. **技术栈强制要求**：

* 前端：Next.js 14（App Router）

* 中转层：Convex（含数据存储 + API）

* 本地脚本：Node.js（兼容 Windows/Mac）

* 部署平台：Vercel（自动关联 GitHub）

1. **安全约束**：

* 本地无端口暴露，仅通过 HTTPS 主动上报数据

* 前端仅提供只读展示，无任何写操作接口

* 本地 MySQL 仅执行 SELECT 查询，不修改数据

1. **自动化触发规则**：

* 完成一个模块后自动进入下一个模块

* 部署阶段自动关联用户 GitHub 仓库（需 OpenClaw 授权临时访问）

* 本地脚本自动生成开机自启配置（Windows 任务计划程序 / Mac 启动项）



***