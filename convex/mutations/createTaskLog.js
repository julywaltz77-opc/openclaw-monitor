import { mutation } from "../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    agentName: v.string(),
    taskName: v.string(),
    status: v.string(),
    message: v.string(),
    timestamp: v.string(),
  },
  handler: async (ctx, args) => {
    // 直接新增日志，无需去重
    return await ctx.db.insert("taskLogs", args);
  },
});
