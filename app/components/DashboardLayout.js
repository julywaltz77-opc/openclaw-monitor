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
      {/* 侧边导航栏 */}
      <div className="w-64 bg-slate-900/80 backdrop-blur-lg border-r border-slate-700/30 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold gradient-text">OpenClaw Monitor</h1>
          <p className="text-slate-400 text-sm mt-2">运行状态监控系统</p>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`nav-link flex items-center gap-3 ${pathname === item.path ? 'active' : ''}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-700/30">
          <div className="text-sm text-slate-400">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>系统正常运行中</span>
            </div>
            <div className="text-xs opacity-70">v1.0.0</div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
}
