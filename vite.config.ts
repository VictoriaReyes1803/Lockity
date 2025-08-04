import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
        type: 'module', 
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      srcDir: 'src',
      filename: 'firebase-messaging-sw.js',  
    }),
  ],
   optimizeDeps: {
    exclude: ["react/jsx-runtime"], // ⛔ evita que Vite lo intente preprocesar
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/], // asegúrate que los módulos comunes se puedan usar
    },
    rollupOptions: {
      external: ["react/jsx-runtime"], // ⛔ evita transformar esto
    },
  },
});
