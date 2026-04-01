import { query } from "../_generated/server";
import { v } from "convex/values";

export default query({
  args: {
    agentName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("tasks");
    
    if (args.agentName) {
      query = query.filter((q) => q.eq(q.field("agentName"), args.agentName));
    }
    
    return await query.collect();
  },
});
