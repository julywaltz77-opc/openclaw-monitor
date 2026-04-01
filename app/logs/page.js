"use client";
export const dynamic = 'force-dynamic';
import { useTaskLogs, useAutoRefresh } from "../lib/convex";
import LogList from "../components/LogList";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import { useState } from "react";

export default function LogsPage() {
  useAutoRefresh();
  const [statusFilter, setStatusFilter] = useState("");

  const logs = useTaskLogs(statusFilter ? { status: statusFilter } : {});

  if (!logs) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">执行日志</h1>
        <div className="flex items-center space-x-2">
          <select 
            className="border rounded px-3 py-1 text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">全部级别</option>
            <option value="info">信息</option>
            <option value="warn">警告</option>
            <option value="error">错误</option>
            <option value="success">成功</option>
            <option value="failed">失败</option>
          </select>
          <span className="text-sm text-gray-500">共 {logs.length} 条日志</span>
        </div>
      </div>

      {logs.length === 0 ? (
        <EmptyState message="暂无日志数据" />
      ) : (
        <LogList logs={logs} />
      )}
    </div>
  );
}
