import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, useLocation, useSearchParams } from 'react-router-dom'
import App from './app'
import './assets/global.less'

console.log(location.href,'location.href')
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
