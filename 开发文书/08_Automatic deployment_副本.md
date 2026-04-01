### 模块 5：自动化部署（自动执行，2 个工作日）

#### 开发指令：



```
1\. Vercel 前端部署：

&#x20;  \- 自动创建 GitHub 仓库：仓库名 openclaw-monitor，设置为公开（用户可手动改为私有）

&#x20;  \- 初始化 Git 仓库，添加所有文件，提交并推送至 GitHub

&#x20;  \- 自动关联 Vercel 项目：使用用户 GitHub 授权（临时访问），选择 openclaw-monitor 仓库

&#x20;  \- 配置 Vercel 环境变量：NEXT\_PUBLIC\_CONVEX\_URL（从 Convex 项目控制台获取）

&#x20;  \- 触发自动部署，获取部署后的在线域名（如：openclaw-monitor.vercel.app）

2\. Convex 生产环境部署：

&#x20;  \- 执行 \`npx convex deploy\`，将本地 Convex 代码部署到生产环境

&#x20;  \- 生成随机 UPLOAD\_SECRET（32 位字符串），配置到 Convex 生产环境变量

&#x20;  \- 将 UPLOAD\_SECRET 写入 /local-script/config.example.js，提示用户替换默认密钥

3\. 本地脚本部署：

&#x20;  \- 生成 DEPLOY\_GUIDE.md：

&#x20;    \- 包含项目介绍、技术栈、部署步骤（前端+本地脚本）

&#x20;    \- 本地脚本启动命令：node local-script/start.js

&#x20;    \- 开机自启配置步骤（Windows：任务计划程序添加 bat 脚本；Mac：sudo cp sh 脚本到 /Library/LaunchAgents/ 并加载）

&#x20;    \- 配置文件修改说明：如何添加 Agent 路径、MySQL 连接信息、替换上报密钥

&#x20;  \- 自动打包本地脚本：使用 archiver 模块将 /local-script 目录打包为 local-script.zip

4\. 最终测试：

&#x20;  \- 启动本地采集脚本，验证数据能成功上报到 Convex 生产环境

&#x20;  \- 访问 Vercel 在线域名，验证所有页面能正常展示数据

&#x20;  \- 安全测试：

&#x20;    \- 执行 netstat -an（Windows）/ lsof -i（Mac），验证无新增本地端口监听

&#x20;    \- 模拟发送修改请求到 Convex 上报接口（无密钥/错误密钥），返回 403

&#x20;    \- 前端页面无任何修改/删除按钮，仅展示数据
```

#### 验收标准（OpenClaw 自动校验）：



* GitHub 仓库创建成功，所有代码推送完成，分支为 main

* Vercel 部署成功，在线域名能正常访问所有页面，数据展示正确

* Convex 生产环境能接收并存储本地上报数据，查询接口响应正常

* 本地脚本能正常启动并上报数据，日志无报错

* DEPLOY\_GUIDE.md 完整，包含所有必要步骤和配置说明

* 本地脚本压缩包生成成功，解压后能直接运行

* 安全测试通过：无端口暴露、前端无修改权限、上报接口密钥验证有效



***

## 五、OpenClaw 自动开发输出物清单（必须交付）



1. 源代码 GitHub 仓库链接（含所有代码，分支 main）

2. Vercel 在线监控网页域名（可直接访问，如：openclaw-monitor.vercel.app）

3. Convex 项目控制台链接（可查看数据、环境变量）

4. 本地脚本压缩包（local-script.zip，含所有本地采集上报脚本）

5. 部署说明文档（DEPLOY\_GUIDE.md，step-by-step 操作指南）

6. 配置文件示例（config.example.js，含完整配置项说明）

7. 开机自启脚本（Windows.bat/ Mac.sh，已打包进 local-script.zip）

8. 测试报告（TEST\_REPORT.md，自动生成，包含所有模块验收结果）



***
