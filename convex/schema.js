import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  agents: defineTable({
    id: v.string(),
    name: v.string(),
    status: v.union(v.literal("online"), v.literal("offline")),
    lastHeartbeat: v.string(),
    createdAt: v.string()
  }),

  tasks: defineTable({
    id: v.string(),
    agentName: v.string(),
    taskName: v.string(),
    cron: v.string(),
    status: v.union(v.literal("running"), v.literal("stopped")),
    lastRunTime: v.string()
  }).index("by_agent_task", ["agentName", "taskName"]),

  taskLogs: defineTable({
    id: v.string(),
    agentName: v.string(),
    taskName: v.string(),
    status: v.union(v.literal("success"), v.literal("failed")),
    message: v.string(),
    timestamp: v.string()
  }).index("by_timestamp", ["timestamp"]),

  mysqlSnapshots: defineTable({
    id: v.string(),
    tableName: v.string(),
    data: v.any(),
    updatedAt: v.string()
  }).index("by_tableName", ["tableName"]),
});
