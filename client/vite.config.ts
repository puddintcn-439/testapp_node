import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// When building on Vercel (or CI) we want the client standalone project to
// output into `dist` inside the `client` folder so Vercel can pick it up.
// Locally we keep the previous behavior of outputting into `../public`
// so the Express server can serve the built assets.
const isVercel = !!process.env.VERCEL || !!process.env.CI;

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: isVercel ? 'dist' : '../public',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
