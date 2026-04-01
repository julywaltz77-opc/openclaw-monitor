"use client";
export const dynamic = 'force-dynamic';
import { useAgents, useTasks, useTaskLogs, useMysqlSnapshots, useAutoRefresh } from "./lib/convex";
import AgentCard from "./components/AgentCard";
import Loading from "./components/Loading";
import EmptyState from "./components/EmptyState";
import { formatDistanceToNow } from "date-fns";
import zhCN from "date-fns/locale/zh-CN";

export default function Dashboard() {
  // 开启自动刷新，每5分钟刷新一次
  useAutoRefresh();

  const agents = useAgents();
  const tasks = useTasks();
  const logs = useTaskLogs({ limit: 5 });
  const mysqlSnapshots = useMysqlSnapshots({ limit: 10 });

  if (!agents || !tasks || !logs || !mysqlSnapshots) return <Loading />;

  const onlineAgents = agents.filter(a => a.status === "online").length;
  const successTasks = tasks.filter(t => t.status === "success").length;
  const latestLog = logs[0];
  const latestMysqlUpdate = mysqlSnapshots[0]?.updatedAt;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">仪表盘概览</h1>
        {latestLog && (
          <div className="text-sm text-slate-400">
            最后更新：{formatDistanceToNow(new Date(latestLog.timestamp), { addSuffix: true, locale: zhCN })}
          </div>
        )}
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-400">在线 Agent</h3>
              <p className="stat-number mt-2">{onlineAgents}</p>
              <p className="text-sm text-slate-400 mt-1">总共 {agents.length} 个</p>
            </div>
            <div className="text-4xl">🤖</div>
          </div>
          <div className="mt-4 w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              style={{ width: `${agents.length > 0 ? (onlineAgents / agents.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-400">运行中任务</h3>
              <p className="stat-number mt-2">{tasks.filter(t => t.status === "running").length}</p>
              <p className="text-sm text-slate-400 mt-1">总共 {tasks.length} 个</p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
          <div className="mt-4 w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
              style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.status === "running").length / tasks.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-400">今日日志</h3>
              <p className="stat-number mt-2">{logs.length}</p>
              <p className="text-sm text-slate-400 mt-1">
                {logs.filter(l => l.status === "failed").length} 条失败
              </p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
          <div className="mt-4 w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${logs.length > 0 ? ((logs.length - logs.filter(l => l.status === "failed").length) / logs.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-400">MySQL 表</h3>
              <p className="stat-number mt-2">{mysqlSnapshots.length}</p>
              <p className="text-sm text-slate-400 mt-1">
                {latestMysqlUpdate ? formatDistanceToNow(new Date(latestMysqlUpdate), { addSuffix: true, locale: zhCN }) : "无更新"}
              </p>
            </div>
            <div className="text-4xl">🗄️</div>
          </div>
          <div className="mt-4 w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Agent 状态卡片 */}
      <div className="dashboard-card">
        <h2 className="text-xl font-bold mb-6 text-white">Agent 运行状态</h2>
        {agents.length === 0 ? (
          <EmptyState message="暂无 Agent 数据" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <AgentCard key={agent._id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
