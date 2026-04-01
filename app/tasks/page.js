"use client";
export const dynamic = 'force-dynamic';
import { useTasks, useAutoRefresh } from "../lib/convex";
import TaskTable from "../components/TaskTable";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import { useState } from "react";

export default function TasksPage() {
  useAutoRefresh();
  const [agentFilter, setAgentFilter] = useState("");

  const tasks = useTasks(agentFilter ? { agentName: agentFilter } : {});

  if (!tasks) return <Loading />;

  // 获取所有Agent名称用于筛选
  const agentNames = [...new Set(tasks.map(t => t.agentName))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">定时任务</h1>
        <div className="flex items-center space-x-2">
          {agentNames.length > 0 && (
            <select 
              className="border rounded px-3 py-1 text-sm"
              value={agentFilter}
              onChange={e => setAgentFilter(e.target.value)}
            >
              <option value="">全部Agent</option>
              {agentNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          )}
          <span className="text-sm text-gray-500">共 {tasks.length} 个任务</span>
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState message="暂无任务数据" />
      ) : (
        <TaskTable tasks={tasks} />
      )}
    </div>
  );
}
