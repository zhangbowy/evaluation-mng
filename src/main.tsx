import React from 'react';
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './app'
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd'
import '@/styles/reset.less'
import '@/styles/global.less'
import '@/assets/iconfont/iconfont.less'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <ConfigProvider locale={zhCN}>
    <HashRouter>
      <App />
    </HashRouter>
  </ConfigProvider>
  // </React.StrictMode>
);

(() => {
  if (!location!.href.includes('qzz-eval')) {
    const script1 = document.createElement('script');
    script1.src = "//qzz-static.forwe.store/public-assets/eruda.js";
    document.documentElement.appendChild(script1);
    script1.onload = function () {
      const script2 = document.createElement('script');
      script2.text = "eruda.init()";
      document.documentElement.appendChild(script2);
    }
  }
})()


