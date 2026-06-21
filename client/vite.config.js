import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// When deploying to GitHub Pages the app lives at:
//   https://<owner>.github.io/<repo-name>/
// so Vite must set base to the repo name for asset URLs to resolve.
// In local dev (VITE_BASE_PATH unset) we use '/' so hot-reload works normally.
const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  plugins: [react()],
  base,
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  server: {
    port: 5173,
  },
  build: {
    // Improve chunk visibility for debugging
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          charts: ['recharts'],
        },
      },
    },
  },
});
