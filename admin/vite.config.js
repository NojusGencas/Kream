import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  preview: {
    port: 5173,
    host: true,
    strictPort: false,
    watch: {
      usePolling: true,
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    origin: "http://localhost:5173",
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    // proxy: {
    //   '/api': {
    //     // when running inside Docker, target the api service by name
    //     target: 'http://api:3000',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },

  // base: '/admin',

  build: {
    manifest: true, // For integration with Nginx
  },
});
