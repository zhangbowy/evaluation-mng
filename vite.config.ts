import { defineConfig, loadEnv, ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginImp from 'vite-plugin-imp'
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
          // target:'http://gray-eval.sunmeta.top',
          // target:'http://qzz-eval.forwe.store',
          changeOrigin: true,
        }
      }
    },
    resolve: {
      // 配置路径别名
      alias: {
        '@': resolve(__dirname, './src')//设置别名
      },
      extensions: [".js", ".json", ".ts", ".tsx"],
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
            style: (name) => `antd/es/${name}/style`,
          },
        ],
      })
    ],
  }
})
