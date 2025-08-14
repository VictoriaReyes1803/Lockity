import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
export default defineConfig({

  
  plugins: [
    react(),
    VitePWA({
  
      strategies: 'injectManifest',
      devOptions: {
        enabled: false,
      },
  
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      srcDir: 'src',
      filename: 'sw.ts',
    }),
  ],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
});
