module.exports = {
  convexUrl: "https://outstanding-wren-279.convex.cloud",
  uploadSecret: process.env.OPENCLAW_UPLOAD_SECRET || "671689d22a4b432c41543e3e3c87a6dd",
  uploadInterval: 5 * 60 * 1000, // 5分钟上报一次
  agentPaths: [], // 用户需手动添加Agent路径，例如：["/Users/xxx/openclaw-agent-1", "/Users/xxx/openclaw-agent-2"]
  mysqlConfig: {
    host: "localhost",
    user: "root",
    password: "",
    database: "",
    tables: [] // 用户需手动添加要同步的表名，例如：["持仓日志", "推荐股票", "日报"]
  }
};
