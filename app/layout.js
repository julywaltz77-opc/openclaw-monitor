import { ConvexClientProvider } from "./lib/convex";
import "./globals.css";
import DashboardLayout from "./components/DashboardLayout";

export const metadata = {
  title: "OpenClaw Monitor",
  description: "OpenClaw 运行状态监控系统",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <ConvexClientProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
