import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Vite configuration.
 *
 * - `@vitejs/plugin-react-swc` — fast refresh via SWC (React 19 compatible).
 * - `@tailwindcss/vite` — Tailwind v4's first-party Vite plugin (CSS-first
 *   config, no postcss.config.js required — see src/styles/globals.css).
 * - `vite-tsconfig-paths` — reads the `paths` map from tsconfig so the `@/*`
 *   alias used in tsconfig.app.json is honored by both Vite and Vitest
 *   without duplicating the alias list here.
 *
 * Env vars: only variables prefixed `VITE_` are exposed to client code
 * (see src/config/env.ts for the typed, validated accessor).
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: Number(env.VITE_DEV_SERVER_PORT) || 5173,
      strictPort: false,
      open: false,
    },
    preview: {
      port: Number(env.VITE_DEV_SERVER_PORT) || 4173,
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      target: 'es2022',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('@react-three') || id.includes('/three/')) return 'three-vendor';
            if (id.includes('/ogl/')) return 'webgl-vendor';
            if (id.includes('framer-motion')) return 'motion-vendor';
            if (id.includes('@tanstack/react-query')) return 'query-vendor';
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) return 'react-vendor';
            return undefined;
          },
        },
      },
    },
  };
});
