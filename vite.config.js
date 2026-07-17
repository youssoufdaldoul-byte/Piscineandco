import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: "dist",
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Sépare les grosses libs pour un meilleur cache mobile
        manualChunks: {
          three: ["three"],
          gsap: ["gsap"],
        },
      },
    },
  },
});
