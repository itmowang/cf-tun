import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from 'vite-plugin-electron/simple'
import path from 'path';

export default defineConfig({
  plugins: [vue(),electron({
    main: {
      entry: './main.js',
    },
    preload: {
      input: './preload.js',
    },
    renderer: {},
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // 确保 @ 指向 src 目录
    },
  },
});