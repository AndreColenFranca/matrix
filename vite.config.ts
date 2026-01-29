import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    // Development Server Configuration
    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: false,
      // Enable HMR for hot module replacement
      hmr: true,
    },

    // Production Build Configuration
    build: {
      // Target modern browsers
      target: 'ES2022',
      // Output directory
      outDir: 'dist',
      // Assets directory
      assetsDir: 'assets',
      // Source map in production for debugging
      sourcemap: false,
      // Optimize vendor chunks
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            supabase: ['@supabase/supabase-js'],
            gemini: ['@google/genai'],
          },
        },
      },
    },

    // Plugins
    plugins: [react()],

    // Environment variables
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },

    // Module Resolution
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
