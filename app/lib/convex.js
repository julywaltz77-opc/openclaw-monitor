"use client";
import { ConvexProvider, ConvexReactClient, useQuery, useConvex } from "convex/react";
import { useEffect, useState } from "react";

// 硬编码后端地址，避免环境变量问题
const convex = new ConvexReactClient("https://outstanding-wren-279.convex.cloud");

export function ConvexClientProvider({ children }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

// 封装查询函数，支持自动刷新
export function useAgents(params = {}) {
  const convex = useConvex();
  return useQuery(convex.queries.getAgents, params);
}

export function useTasks(params = {}) {
  const convex = useConvex();
  return useQuery(convex.queries.getTasks, params);
}

export function useTaskLogs(params = {}) {
  const convex = useConvex();
  return useQuery(convex.queries.getTaskLogs, params);
}

export function useMysqlSnapshots(params = {}) {
  const convex = useConvex();
  return useQuery(convex.queries.getMysqlSnapshots, params);
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

