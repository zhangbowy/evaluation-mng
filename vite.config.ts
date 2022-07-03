import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginImp from 'vite-plugin-imp'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'http://gray-eval.sunmeta.top/evaluation-web/static/',
  server: {
    cors: true,
    proxy: {
      '/api': {
        target: 'http://daily-eval.sunmeta.top',
        // target:'http://gray-eval.sunmeta.top',
        // target:'http://qzz-eval.forwe.store',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    // 配置路径别名
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#4377FE',//设置antd主题色
        },
      },
    }
  },
  plugins: [
    react(),
    vitePluginImp({
      libList: [
        {
          libName: "antd",
          style: (name) => `antd/es/${name}/style`,
        },
      ],
    })
  ],
})
