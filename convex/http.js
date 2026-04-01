import { httpRouter } from "convex/server";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync } from "fs";

const http = httpRouter();

// 静态文件服务
http.route({
  path: "/{*path}",
  method: "GET",
  handler: async (req, ctx) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const publicDir = join(__dirname, "../public");
    
    let path = new URL(req.url).pathname;
    if (path === "/") path = "/index.html";
    
    const filePath = join(publicDir, path);
    
    if (existsSync(filePath)) {
      const content = readFileSync(filePath);
      const contentType = getContentType(path);
      return new Response(content, {
        headers: { "Content-Type": contentType },
      });
    }
    
    // 单页应用 fallback
    const indexPath = join(publicDir, "index.html");
    if (existsSync(indexPath)) {
      const content = readFileSync(indexPath);
      return new Response(content, {
        headers: { "Content-Type": "text/html" },
      });
    }
    
    return new Response("Not Found", { status: 404 });
  },
});

function getContentType(path) {
  if (path.endsWith(".html")) return "text/html";
  if (path.endsWith(".css")) return "text/css";
  if (path.endsWith(".js")) return "application/javascript";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".gif")) return "image/gif";
  if (path.endsWith(".svg")) return "image/svg+xml";
  if (path.endsWith(".ico")) return "image/x-icon";
  return "application/octet-stream";
}

export default http;
