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
)
