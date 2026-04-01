"use node";
import { v } from "convex/values";
import { action } from "../_generated/server";

const agentsSchema = v.object({
  id: v.string(),
  name: v.string(),
  status: v.union(v.literal("online"), v.literal("offline")),
  lastHeartbeat: v.string(),
  createdAt: v.string(),
});

const tasksSchema = v.object({
  id: v.string(),
  agentName: v.string(),
  taskName: v.string(),
  cron: v.string(),
  status: v.union(v.literal("running"), v.literal("stopped")),
  lastRunTime: v.string(),
});

const taskLogsSchema = v.object({
  id: v.string(),
  agentName: v.string(),
  taskName: v.string(),
  status: v.union(v.literal("success"), v.literal("failed")),
  message: v.string(),
  timestamp: v.string(),
});

const mysqlSnapshotsSchema = v.object({
  id: v.string(),
  tableName: v.string(),
  data: v.any(),
  updatedAt: v.string(),
});

export default action({
  args: {
    agents: v.array(agentsSchema),
    tasks: v.array(tasksSchema),
    taskLogs: v.array(taskLogsSchema),
    mysqlSnapshots: v.array(mysqlSnapshotsSchema),
  },
  handler: async (ctx, args) => {
    // 密钥验证
    const uploadSecret = ctx.env.UPLOAD_SECRET;
    const requestSecret = ctx.headers.get("x-upload-secret");
    
    if (!uploadSecret || !requestSecret || uploadSecret !== requestSecret) {
      throw new Error("403: Invalid upload secret");
    }

    // 存储agents数据
    for (const agent of args.agents) {
      await ctx.db
        .insert("agents", agent)
        .onConflictDoUpdate({
          target: ctx.db.agents.fields.id,
          set: {
            status: agent.status,
            lastHeartbeat: agent.lastHeartbeat,
          },
        });
    }

    // 存储tasks数据
    for (const task of args.tasks) {
      await ctx.db
        .insert("tasks", task)
        .onConflictDoUpdate({
          target: [ctx.db.tasks.fields.agentName, ctx.db.tasks.fields.taskName],
          set: {
            status: task.status,
            lastRunTime: task.lastRunTime,
          },
        });
    }

    // 存储taskLogs数据
    if (args.taskLogs.length > 0) {
      await ctx.db.insert("taskLogs", args.taskLogs);
    }

    // 存储mysqlSnapshots数据
    for (const snapshot of args.mysqlSnapshots) {
      await ctx.db
        .insert("mysqlSnapshots", snapshot)
        .onConflictDoUpdate({
          target: ctx.db.mysqlSnapshots.fields.tableName,
          set: {
            data: snapshot.data,
            updatedAt: snapshot.updatedAt,
          },
        });
    }

    return {
      success: true,
      message: "数据上报成功",
      count: {
        agents: args.agents.length,
        tasks: args.tasks.length,
        taskLogs: args.taskLogs.length,
        mysqlSnapshots: args.mysqlSnapshots.length,
      },
    };
  },
});
