# 部署指南

## 🎉 已自动完成部署部分
- Convex 后端已部署完成：https://outstanding-wren-279.convex.cloud
- 上报密钥已自动生成：671689d22a4b432c41543e3e3c87a6dd
- 前端代码已准备完成，待部署到 Vercel

---

## 1. Convex 后端部署（已完成，无需操作）
Convex 后端已部署完成，包含所有数据模型和接口：
- 生产地址：https://outstanding-wren-279.convex.cloud
- 上报密钥：671689d22a4b432c41543e3e3c87a6dd
- 已配置环境变量：UPLOAD_SECRET = 671689d22a4b432c41543e3e3c87a6dd

## 2. 前端部署到 Vercel
### 步骤1：关联 GitHub 仓库
将项目推送到 GitHub 后，在 Vercel 导入仓库

### 步骤2：配置环境变量
在 Vercel 项目设置中添加环境变量：
- `CONVEX_URL`: 从 Convex 控制台获取的 URL

### 步骤3：部署
点击部署，Vercel 会自动构建并部署前端

## 3. 本地采集脚本配置
### 步骤1：解压脚本
将 `local-script/local-script.zip` 解压到本地任意目录

### 步骤2：配置参数
复制 `config.example.js` 为 `config.js`，修改配置：
```javascript
module.exports = {
  convexUrl: "你的 Convex URL",
  reportSecret: "你设置的上报密钥",
  reportInterval: 60000, // 上报间隔（毫秒，默认1分钟）
  openclawPath: "~/.openclaw", // OpenClaw 工作目录路径
  mysqlConfig: {
    host: "localhost",
    user: "root",
    password: "你的MySQL密码",
    database: "需要监控的数据库名",
    query: "SELECT * FROM your_table LIMIT 100" // 自定义查询语句
  }
}
```

### 步骤3：安装依赖
```bash
cd local-script
npm install
```

### 步骤4：设置开机自启
#### Windows：
双击运行 `scripts/openclaw-monitor-start.bat` 即可添加到任务计划程序
#### Mac：
运行 `sh scripts/openclaw-monitor-start.sh` 即可添加到启动项

### 步骤5：启动脚本
```bash
node start.js
```
