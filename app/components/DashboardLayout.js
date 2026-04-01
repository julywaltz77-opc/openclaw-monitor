"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { path: "/", name: "概览", icon: "📊" },
    { path: "/agents", name: "Agent 管理", icon: "🤖" },
    { path: "/tasks", name: "任务监控", icon: "⚡" },
    { path: "/logs", name: "运行日志", icon: "📝" },
    { path: "/mysql", name: "MySQL 快照", icon: "🗄️" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* 侧边导航栏 - 优化宽度和内边距 */}
      <div className="w-72 bg-slate-900/90 backdrop-blur-xl border-r border-slate-700/40 p-8 flex flex-col shadow-2xl">
        <div className="mb-10">
          <h1 className="text-2xl font-bold gradient-text">OpenClaw Monitor</h1>
          <p className="text-slate-400 text-sm mt-3">运行状态监控系统</p>
        </div>

        <nav className="space-y-3 flex-1">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`nav-link flex items-center gap-4 px-4 py-3 ${pathname === item.path ? 'active' : ''}`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-8 border-t border-slate-700/40">
          <div className="text-sm text-slate-400">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
              <span className="font-medium">系统正常运行中</span>
            </div>
            <div className="text-xs opacity-70">v1.0.0</div>
          </div>
        </div>
      </div>

      {/* 主内容区域 - 使用优化后的类 */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
