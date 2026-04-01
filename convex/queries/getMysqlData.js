import { query } from "../_generated/server";
import { v } from "convex/values";

export default query({
  args: {
    tableName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("mysqlSnapshots");
    
    if (args.tableName) {
      query = query.filter((q) => q.eq(q.field("tableName"), args.tableName));
    }
    
    return await query.collect();
  },
});
