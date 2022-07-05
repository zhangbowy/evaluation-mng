import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, useLocation, useSearchParams } from 'react-router-dom'
import App from './app'
import './assets/global.less'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
