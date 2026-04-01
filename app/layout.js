"use client";
import { ConvexClientProvider } from "./lib/convex";
import "./globals.css";
import DashboardLayout from "./components/DashboardLayout";
import { useState, useEffect } from "react";
import Loading from "./components/Loading";

export default function RootLayout({ children }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <html lang="zh-CN">
        <body>
          <div className="min-h-screen flex items-center justify-center">
            <Loading />
          </div>
        </body>
      </html>
    );
  }

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
