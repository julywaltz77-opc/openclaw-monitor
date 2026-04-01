"use client";
import { useAgents, useAutoRefresh } from "../lib/convex";
import AgentCard from "../components/AgentCard";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import { useState } from "react";

export default function AgentsPage() {
  useAutoRefresh();
  const [statusFilter, setStatusFilter] = useState("");

  const agents = useAgents(statusFilter ? { status: statusFilter } : {});

  if (!agents) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agent 列表</h1>
        <div className="flex items-center space-x-2">
          <select 
            className="border rounded px-3 py-1 text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">全部状态</option>
            <option value="online">在线</option>
            <option value="offline">离线</option>
          </select>
          <span className="text-sm text-gray-500">共 {agents.length} 个 Agent</span>
        </div>
      </div>

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
  );
}
