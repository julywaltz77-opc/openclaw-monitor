import { mutation } from "../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    id: v.string(),
    name: v.string(),
    status: v.string(),
    lastHeartbeat: v.string(),
    version: v.optional(v.string()),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 查找是否已存在该Agent
    const existing = await ctx.db
      .query("agents")
      .withIndex("by_id", q => q.eq("id", args.id))
      .first();

    if (existing) {
      // 更新现有数据
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      // 新增数据
      return await ctx.db.insert("agents", args);
    }
  },
});
