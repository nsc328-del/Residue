import { defineConfig } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: ".",
  plugins: [
    {
      name: "serve-run-directory",
      configureServer(server) {
        // Return a function to register middleware BEFORE Vite's SPA fallback
        // but AFTER Vite's own static-file serving.
        server.middlewares.use((req, res, next) => {
          const url = req.url ?? "";
          if (!url.startsWith("/run/")) {
            next();
            return;
          }
          const relative = url.slice("/run/".length);
          const filePath = path.resolve(__dirname, "..", "run", relative);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "no-cache");
            fs.createReadStream(filePath).pipe(res);
          } else {
            res.statusCode = 404;
            res.end("Not found");
          }
        });
      },
    },
  ],
});
