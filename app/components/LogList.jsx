import { formatDistanceToNow } from "date-fns";
import zhCN from "date-fns/locale/zh-CN";

const getLevelBadge = (level) => {
  const map = {
    info: { bg: "bg-blue-100", text: "text-blue-800", label: "信息" },
    warn: { bg: "bg-yellow-100", text: "text-yellow-800", label: "警告" },
    error: { bg: "bg-red-100", text: "text-red-800", label: "错误" },
    success: { bg: "bg-green-100", text: "text-green-800", label: "成功" },
    failed: { bg: "bg-red-100", text: "text-red-800", label: "失败" },
  };
  return map[level] || map.info;
};

export default function LogList({ logs }) {
  return (
    <div className="space-y-3">
      {logs.map(log => {
        const level = getLevelBadge(log.status);
        return (
          <div key={log._id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${level.bg} ${level.text}`}>
                  {level.label}
                </span>
                <span className="text-sm font-medium">{log.agentName} / {log.taskName}</span>
              </div>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: zhCN })}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{log.message}</p>
          </div>
        );
      })}
    </div>
  );
}
