"use client";
import { ConvexProvider, ConvexReactClient, useQuery } from "convex/react";
import { useEffect, useState } from "react";

// 硬编码后端地址，避免环境变量问题
const convex = new ConvexReactClient("https://outstanding-wren-279.convex.cloud");

export function ConvexClientProvider({ children }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

// 安全获取api，仅在客户端初始化
const getApi = () => {
  if (typeof window === 'undefined') return null;
  return convex.api;
};

export const api = getApi();

// 封装查询函数，仅在客户端执行
export function useAgents(params = {}) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient || !api?.queries) return undefined;
  return useQuery(api.queries.getAgents, params);
}

export function useTasks(params = {}) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient || !api?.queries) return undefined;
  return useQuery(api.queries.getTasks, params);
}

export function useTaskLogs(params = {}) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient || !api?.queries) return undefined;
  return useQuery(api.queries.getTaskLogs, params);
}

export function useMysqlSnapshots(params = {}) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient || !api?.queries) return undefined;
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

