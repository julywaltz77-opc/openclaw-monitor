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

## 2. 前端部署到 Vercel（已完成关联）
### 步骤1：推送代码到 GitHub
```bash
cd /Users/julywaltz-opc/.openclaw/projects/openclaw-monitor
git remote add origin https://github.com/[你的GitHub用户名]/openclaw-monitor.git
git push -u origin main
```
推送完成后 Vercel 会自动触发部署。

### 步骤2：配置环境变量
在 Vercel 项目设置中添加环境变量：
- `NEXT_PUBLIC_CONVEX_URL`: https://outstanding-wren-279.convex.cloud

### 步骤3：配置自定义域名（使用 julywaltz77.work）
1. **域名解析配置**：
在你的域名解析商添加如下记录：
- 类型：A
- 主机记录：@（如果用主域名）或 monitor（如果用子域名 monitor.julywaltz77.work）
- 记录值：76.76.21.21
- TTL：10分钟

2. **Vercel 控制台添加域名**：
在 Vercel 项目的「Domains」设置中添加 `julywaltz77.work`（或子域名），Vercel 会自动验证解析并配置 SSL 证书。

### 步骤4：访问部署后的平台
域名验证通过后，即可通过 `https://julywaltz77.work` 访问 OpenClaw 监控平台。

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
