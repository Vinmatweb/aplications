import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: resolve(projectRoot, "browser"),
  base: "./",
  publicDir: resolve(projectRoot, "public"),
  resolve: { alias: { "@": projectRoot } },
  plugins: [react()],
  build: {
    outDir: resolve(projectRoot, "web"),
    emptyOutDir: true,
    assetsDir: "assets",
    sourcemap: false,
  },
});
