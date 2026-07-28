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
        // Sépare les grosses libs pour un meilleur cache mobile.
        // NB: "three" retiré du 2026-07-28 — WaterCanvas.jsx/Underwater.jsx
        // (seuls consommateurs de la lib) ne sont importés par aucune route
        // active ; three.js est déjà tree-shaké à 0 octet par Rollup, mais le
        // chunk manuel forçait quand même un fichier + une requête HTTP vides.
        manualChunks: {
          gsap: ["gsap"],
        },
      },
    },
  },
});
