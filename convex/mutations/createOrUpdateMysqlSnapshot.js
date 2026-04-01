import { mutation } from "../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    tableName: v.string(),
    data: v.any(),
    updatedAt: v.string(),
  },
  handler: async (ctx, args) => {
    // 按tableName查找是否已存在该表快照
    const existing = await ctx.db
      .query("mysqlSnapshots")
      .withIndex("by_tableName", q => q.eq("tableName", args.tableName))
      .first();

    if (existing) {
      // 更新现有数据，覆盖旧快照
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      // 新增数据
      return await ctx.db.insert("mysqlSnapshots", args);
    }
  },
});
