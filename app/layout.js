import { ConvexClientProvider } from "./lib/convex";
import Layout from "./components/Layout";

export const metadata = {
  title: "OpenClaw Monitor",
  description: "OpenClaw 运行状态监控系统",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <ConvexClientProvider>
          <Layout>{children}</Layout>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
