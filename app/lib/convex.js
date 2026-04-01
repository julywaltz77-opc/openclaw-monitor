"use client";
import { ConvexProvider, ConvexReactClient, useQuery } from "convex/react";
import { useEffect, useState } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export function ConvexClientProvider({ children }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

export const api = convex.api;

// 封装查询函数，支持自动刷新
export function useAgents(params = {}) {
  return useQuery(api.queries.getAgents, params);
}

export function useTasks(params = {}) {
  return useQuery(api.queries.getTasks, params);
}

export function useTaskLogs(params = {}) {
  return useQuery(api.queries.getTaskLogs, params);
}

export function useMysqlSnapshots(params = {}) {
  return useQuery(api.queries.getMysqlSnapshots, params);
}

// 自动刷新Hook，默认5分钟刷新一次
export function useAutoRefresh(interval = 300000) {
  const [_, setRefresh] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setRefresh(prev => prev + 1);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);
}

