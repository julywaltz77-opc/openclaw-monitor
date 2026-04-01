import { query } from "../_generated/server";
import { v } from "convex/values";
import { parseISO, subDays, isAfter } from "date-fns";

export default query({
  args: {
    timeRange: v.optional(v.union(v.literal("today"), v.literal("yesterday"), v.literal("7d"))),
    status: v.optional(v.union(v.literal("success"), v.literal("failed"))),
    agentName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("taskLogs").order("desc");
    
    // 时间范围过滤
    if (args.timeRange) {
      const now = new Date();
      let startTime;
      
      switch (args.timeRange) {
        case "today":
          startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "yesterday":
          startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          query = query.filter((q) => q.lt(q.field("timestamp"), endOfYesterday.toISOString()));
          break;
        case "7d":
          startTime = subDays(now, 7);
          break;
        default:
          startTime = subDays(now, 7);
      }
      
      query = query.filter((q) => q.gte(q.field("timestamp"), startTime.toISOString()));
    }
    
    // 状态过滤
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    // Agent名称过滤
    if (args.agentName) {
      query = query.filter((q) => q.eq(q.field("agentName"), args.agentName));
    }
    
    return await query.take(1000).collect();
  },
});
