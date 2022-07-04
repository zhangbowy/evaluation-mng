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
  useEffect(() => {
    if (!token) {
      navigate(`/login${state}`, { replace: true })
    } else {
      console.log(state,1111111111111)
      setSearch(state)
    }
  }, [locationInfo.pathname])
  return (
    <div className="app">
      <QzzRouter />
    </div>
  )
}

export default App
