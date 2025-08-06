// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const certsDir = path.resolve(__dirname, 'certs');

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3000,
    https: {
      key: fs.readFileSync(path.join(certsDir, 'localhost+2-key.pem')),
      cert: fs.readFileSync(path.join(certsDir, 'localhost+2.pem')),
    },
    proxy: {
      '/api': {
        target: 'https://localhost:8443',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔗 Proxy intercepting:', req.method, req.url);
            console.log('🔗 Original headers:', req.headers);

            // Ensure all headers are preserved
            Object.keys(req.headers).forEach(key => {
              if (req.headers[key]) {
                proxyReq.setHeader(key, req.headers[key]);
              }
            });
          });

          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('🔗 Proxy response:', proxyRes.statusCode, req.url);
          });
        }
      },
    },
  },
});