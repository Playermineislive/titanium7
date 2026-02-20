import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ESM environments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server build configuration optimized for Render
export default defineConfig({
  build: {
    lib: {
      // Use a resolved absolute path to ensure the builder finds the file
      entry: path.resolve(__dirname, "server/node-build.ts"),
      name: "server",
      fileName: "node-build", // Matches your package.json start script
      formats: ["es"],
    },
    outDir: "dist/server",
    target: "node22",
    ssr: true,
    rollupOptions: {
      // Ensure all node built-ins and production dependencies are external
      external: [
        "fs", "path", "url", "http", "https", "os", "crypto", 
        "stream", "util", "events", "buffer", "querystring", 
        "child_process", "express", "cors", "dotenv", "zod"
      ],
      output: {
        format: "es",
        entryFileNames: "[name].mjs",
      },
    },
    minify: false,
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
