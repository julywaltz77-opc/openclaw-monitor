import { query } from "../_generated/server";
import { v } from "convex/values";

export default query({
  args: {
    status: v.optional(v.union(v.literal("online"), v.literal("offline"))),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("agents");
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    return await query.collect();
  },
});
