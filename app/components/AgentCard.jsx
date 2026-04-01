import { formatDistanceToNow } from "date-fns";
import zhCN from "date-fns/locale/zh-CN";

export default function AgentCard({ agent }) {
  const isOnline = agent.status === "online";

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{agent.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {isOnline ? "在线" : "离线"}
        </span>
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <p>ID：{agent.id}</p>
        <p>版本：{agent.version || "未知"}</p>
        <p>模型：{agent.model || "未知"}</p>
        <p>最近心跳：{formatDistanceToNow(new Date(agent.lastHeartbeat), { addSuffix: true, locale: zhCN })}</p>
      </div>
    </div>
  );
}
