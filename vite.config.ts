/*
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
});
*/

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  base: '/DemoPos/',

  plugins: [
    react(),
    // 👇 PWAの設定を追加
    VitePWA({
      strategies: 'generateSW', // 💡 明示的に生成ストラテジーを指定
      outDir: 'dist',           // 💡 出力先が dist であることをプラグイン側にも叩き込む      registerType: 'autoUpdate',
      injectRegister: 'inline', // 💡 サブディレクトリ（/DemoPos/）対策としてこれを追加！
      filename: 'manifest.json',
      includeAssets: ['favicon.png', 'pwa-192x192.png', 'pwa-512x512.png'], // 💡 実際に存在するファイル名に合わせる
      manifest: {
        name: '売店 POS System',
        short_name: '売店POS',
        description: 'レトロスタイルの売店向けPOSシステム',
        theme_color: '#F3EAD1',
        background_color: '#F3EAD1',
        display: 'standalone',
        orientation: 'landscape',
        // start_url を明示的に指定して、アプリ起動時にトップページを確実に開くようにする
        start_url: '/DemoPos/', 
        icons: [
          {
            src: 'favicon.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            "src": "favicon_64x64.png",
            "sizes": "64x64",
            "type": "image/png"
          },
          {
            "src": "favicon_128x128.png",
            "sizes": "128x128",
            "type": "image/png"
          },
          {
            "src": "favicon_256x256.png",
            "sizes": "256x256",
            "type": "image/png"
          },
          {
            "src": "favicon_192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "favicon_512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
        ],
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
});
