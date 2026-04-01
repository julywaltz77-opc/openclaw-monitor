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
    <div className="space-y-10">
      {/* 顶部标题栏 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold gradient-text">仪表盘概览</h1>
          <p className="text-slate-400 mt-2">实时监控所有 Agent 运行状态</p>
        </div>
        {latestLog && (
          <div className="text-sm text-slate-400 bg-slate-800/50 px-4 py-2 rounded-full">
            最后更新：{formatDistanceToNow(new Date(latestLog.timestamp), { addSuffix: true, locale: zhCN })}
          </div>
        )}
      </div>

      {/* 统计卡片 - 优化布局比例 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dashboard-card min-h-[160px]">
          <div className="flex items-start justify-between h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">在线 Agent</h3>
                <p className="stat-number mt-3">{onlineAgents}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">总共 {agents.length} 个</p>
                <div className="mt-3 w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${agents.length > 0 ? (onlineAgents / agents.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="text-5xl opacity-80">🤖</div>
          </div>
        </div>

        <div className="dashboard-card min-h-[160px]">
          <div className="flex items-start justify-between h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">运行中任务</h3>
                <p className="stat-number mt-3">{tasks.filter(t => t.status === "running").length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">总共 {tasks.length} 个</p>
                <div className="mt-3 w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.status === "running").length / tasks.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="text-5xl opacity-80">⚡</div>
          </div>
        </div>

        <div className="dashboard-card min-h-[160px]">
          <div className="flex items-start justify-between h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">今日日志</h3>
                <p className="stat-number mt-3">{logs.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">{logs.filter(l => l.status === "failed").length} 条失败</p>
                <div className="mt-3 w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${logs.length > 0 ? ((logs.length - logs.filter(l => l.status === "failed").length) / logs.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="text-5xl opacity-80">📝</div>
          </div>
        </div>

        <div className="dashboard-card min-h-[160px]">
          <div className="flex items-start justify-between h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">MySQL 表</h3>
                <p className="stat-number mt-3">{mysqlSnapshots.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">
                  {latestMysqlUpdate ? formatDistanceToNow(new Date(latestMysqlUpdate), { addSuffix: true, locale: zhCN }) : "无更新"}
                </p>
                <div className="mt-3 w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="text-5xl opacity-80">🗄️</div>
          </div>
        </div>
      </div>

      {/* Agent 状态卡片 - 优化间距 */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Agent 运行状态</h2>
          <span className="text-sm text-slate-400">共 {agents.length} 个 Agent</span>
        </div>
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
