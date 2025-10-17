import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  server: {
    port: 3001,
    open: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    cssCodeSplit: true,
  },
});
