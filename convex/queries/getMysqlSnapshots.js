import { query } from "../_generated/server";
import { v } from "convex/values";

export default query({
  args: { tableName: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    let query = ctx.db.query("mysqlSnapshots").order("desc", q => q.field("updatedAt"));
    if (args.tableName) {
      query = query.filter(q => q.eq(q.field("tableName"), args.tableName));
    }
    if (args.limit) {
      query = query.take(args.limit);
    }
    return await query.collect();
  },
});
