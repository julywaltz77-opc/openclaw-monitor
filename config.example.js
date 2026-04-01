// 配置文件示例，复制为 config.js 并修改参数
module.exports = {
  // Convex 配置
  convexUrl: "https://outstanding-wren-279.convex.cloud",
  uploadSecret: "671689d22a4b432c41543e3e3c87a6dd",
  
  // 上报配置
  uploadInterval: 5 * 60 * 1000, // 上报间隔，单位毫秒（默认5分钟）
  
  // Agent 配置
  agentPaths: [], // 添加你的 Agent 路径，如：["/Users/xxx/openclaw-agent-1", "/Users/xxx/openclaw-agent-2"]
  
  // MySQL 配置
  mysqlConfig: {
    host: "localhost",
    user: "root",
    password: "",
    database: "",
    tables: [] // 添加要展示的表名，如：["law_knowledge", "law_synonym"]
  }
}
