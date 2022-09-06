import { defineConfig, loadEnv, ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginImp from 'vite-plugin-imp'
import legacyPlugin from '@vitejs/plugin-legacy';
import { resolve } from 'path';

//daily-qzz-static.forwe.store/evaluation-mng/static/     日常
//qzz-static.forwe.store/evaluation-mng/static/    线上、预发
// https://vitejs.dev/config/

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, __dirname);
  return {
    base: env.VITE_BASE_URL || '/',
    server: {
      cors: true,
      proxy: {
        '/api': {
          target: 'http://daily-eval.sunmeta.top',
          // target: 'http://gray-eval.sunmeta.top',
          // target: 'http://qzz-eval.forwe.store',
          changeOrigin: true,
        },
        // '/api/spf-cc': {
        //   target: 'http://10.255.21.42:8083',
        //   changeOrigin: true,
        // }
      },
    },
    build: {
      target: ['es2015'],
      // minify: "terser",
      // terserOptions: {
      //   compress: {
      //     drop_console: true,
      //     drop_debugger: true
      //   }
      // }
    },
    resolve: {
      // 配置路径别名
      alias: {
        '@': resolve(__dirname, './src')//设置别名
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            '@primary-color': '#2B85FF',//设置antd主题色
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
            style: (name) => `antd/es/${name}/style/index.js`,
          },
        ],
      }),
      legacyPlugin({
        // 兼容的目标
        targets: ['chrome 52']
      }),
    ],
  }
})
