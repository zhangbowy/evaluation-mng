import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, useLocation, useSearchParams } from 'react-router-dom'
import { LoginSearchItem } from './utils/hook'
import App from './app'
import './assets/global.less'
console.log(location,2222222222222222)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoginSearchItem.Provider value={{ state: location.search }}>
      <HashRouter>
        <App />
      </HashRouter>
    </LoginSearchItem.Provider>
  </React.StrictMode>
)
