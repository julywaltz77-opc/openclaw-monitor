## 四、全模块自动化开发指令（按顺序执行）

### 模块 1：环境搭建（自动执行，2 个工作日）

#### 开发指令：



```
1\. 创建 Next.js 项目，项目名：openclaw-monitor，使用 App Router 模式

2\. 初始化 Convex 项目：执行 \`npx convex init\`，关联到项目根目录，生成 /convex 目录

3\. 配置 Vercel 关联规则：在 vercel.json 中添加部署配置（框架预设：next.js，输出目录：.next）

4\. 安装核心依赖：convex@latest、next@14、mysql2@latest、node-schedule@latest、axios@latest、react-table@latest（表格组件）

5\. 自动测试数据通路：

&#x20;  \- 在 /convex/schema.js 中创建临时测试表 \`testData\`

&#x20;  \- 编写临时上报接口 \`testReport\` 和查询接口 \`testGet\`

&#x20;  \- 本地模拟数据上报，前端页面（page.js）查询并展示测试数据

&#x20;  \- 测试完成后删除临时表和接口
```

#### 验收标准（OpenClaw 自动校验）：



* 项目目录结构与上述完整目录一致

* 本地启动 `npm run dev` 可访问前端页面（[http://localhost:3000](http://localhost:3000)）

* Convex 控制台显示项目已创建，临时测试表能接收并返回数据

* Vercel 关联成功，推送代码后显示「可部署」状态

