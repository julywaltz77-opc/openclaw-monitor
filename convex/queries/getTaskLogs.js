import { query } from "../_generated/server";
import { v } from "convex/values";

export default query({
  args: { 
    agentName: v.optional(v.string()),
    taskName: v.optional(v.string()),
    status: v.optional(v.string()),
    timeRange: v.optional(v.string()),
    limit: v.optional(v.number()) 
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("taskLogs").order("desc", q => q.field("timestamp"));
    
    if (args.agentName) {
      query = query.filter(q => q.eq(q.field("agentName"), args.agentName));
    }
    if (args.taskName) {
      query = query.filter(q => q.eq(q.field("taskName"), args.taskName));
    }
    if (args.status) {
      query = query.filter(q => q.eq(q.field("status"), args.status));
    }
    if (args.limit) {
      query = query.take(args.limit);
    }
    
    return await query.collect();
  },
});
