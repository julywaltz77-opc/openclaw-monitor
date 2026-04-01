import { formatDistanceToNow, format } from "date-fns";
import zhCN from "date-fns/locale/zh-CN";

// 格式化相对时间
export function formatRelativeTime(timestamp) {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: zhCN });
}

// 格式化绝对时间
export function formatDateTime(timestamp) {
  return format(new Date(timestamp), "yyyy-MM-dd HH:mm:ss");
}

// 状态转换为中文
export function statusToText(status) {
  const map = {
    online: "在线",
    offline: "离线",
    success: "成功",
    failed: "失败",
    running: "运行中",
    pending: "等待中",
  };
  return map[status] || status;
}

// 获取状态对应的颜色类
export function getStatusColor(status) {
  const map = {
    online: "text-green-600",
    offline: "text-red-600",
    success: "text-green-600",
    failed: "text-red-600",
    running: "text-blue-600",
    pending: "text-yellow-600",
  };
  return map[status] || "text-gray-600";
}
