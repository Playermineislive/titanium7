import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // 1. SET BASE TO RELATIVE (Critical for GitHub Pages /titanium/ path)
  base: "./", 
  
  server: {
    host: "::",
    port: 8080,
    fs: {
      // 2. USE RESOLVED PATHS (Ensures build compatibility)
      allow: [
        path.resolve(__dirname, "./client"), 
        path.resolve(__dirname, "./shared")
      ],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
    // 3. ENSURE ASSETS ARE IN THE RIGHT PLACE
    assetsDir: "assets",
    emptyOutDir: true,
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // This correctly keeps your Express server in Dev mode only
    configureServer(server) {
      const app = createServer();
      server.middlewares.use(app);
    },
  };
}
