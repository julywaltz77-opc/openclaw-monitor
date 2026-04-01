import { mutation } from "../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    agentName: v.string(),
    taskName: v.string(),
    cron: v.string(),
    status: v.string(),
    lastRunTime: v.optional(v.string()),
    nextRunTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 按agentName+taskName查找是否已存在该任务
    const existing = await ctx.db
      .query("tasks")
      .withIndex("by_agent_task", q => q.eq("agentName", args.agentName).eq("taskName", args.taskName))
      .first();

    if (existing) {
      // 更新现有数据
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      // 新增数据
      return await ctx.db.insert("tasks", args);
    }
  },
});
