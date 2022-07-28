import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, useLocation, useSearchParams } from 'react-router-dom'
import App from './app'
import './assets/global.less'
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd'
// import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <ConfigProvider locale={zhCN}>
    <HashRouter>
      <App />
    </HashRouter>
  </ConfigProvider>
  // </React.StrictMode>
)
