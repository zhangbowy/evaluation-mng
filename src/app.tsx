import React, { createContext, useEffect, useContext } from 'react'
import QzzRouter from './routes'
import './assets/app.less'
import { useLocation, useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { LoginSearchItem } from './utils/hook'

const App = () => {
  const locationInfo = useLocation();
  const navigate = useNavigate()
  const [search, setSearch] = useSearchParams()
  const { state } = useContext(LoginSearchItem)
  const token = sessionStorage.getItem('QCP_B_TOKEN')
  console.log(state, '页面之前')
  useEffect(() => {
    if (!token) {
      navigate(`/login${state}`, { replace: true })
    } else {
      console.log(state, '进来了的state')
      setSearch(state || '?corpId=ding2811bf88b5d295e7bc961a6cb783455b&appId=1_110140&clientId=suitepqbrfai3pgrncwli')
    }
  }, [locationInfo.pathname])
  return (
    <div className="app">
      <QzzRouter />
    </div>
  )
}

export default App
