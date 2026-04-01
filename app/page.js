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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">在线 Agent</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{onlineAgents}/{agents.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">成功任务</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{successTasks}/{tasks.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">最新日志</h3>
          <p className="text-lg font-medium mt-2">
            {latestLog ? latestLog.message.substring(0, 20) + "..." : "无数据"}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">MySQL 数据更新</h3>
          <p className="text-lg font-medium mt-2">
            {latestMysqlUpdate ? formatDistanceToNow(new Date(latestMysqlUpdate), { addSuffix: true, locale: zhCN }) : "无数据"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Agent 状态</h2>
        {agents.length === 0 ? (
          <EmptyState message="暂无 Agent 数据" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map(agent => (
              <AgentCard key={agent._id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
