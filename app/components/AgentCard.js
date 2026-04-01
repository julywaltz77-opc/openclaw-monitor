import { formatDistanceToNow } from "date-fns";
import zhCN from "date-fns/locale/zh-CN";

export default function AgentCard({ agent }) {
  return (
    <div className="dashboard-card h-full">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">{agent.name}</h3>
          <p className="text-sm text-slate-400 mt-1">ID: {agent.id}</p>
        </div>
        <span className={`status-badge ${agent.status === 'online' ? 'status-online' : 'status-offline'}`}>
          {agent.status === 'online' ? '在线' : '离线'}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">最后心跳</span>
          <span className="text-sm text-slate-300">
            {formatDistanceToNow(new Date(agent.lastHeartbeat), { addSuffix: true, locale: zhCN })}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">创建时间</span>
          <span className="text-sm text-slate-300">
            {formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true, locale: zhCN })}
          </span>
        </div>
      </div>
    </div>
  );
}
