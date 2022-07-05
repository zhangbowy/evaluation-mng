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
    console.log(location, 'location1111111111111111')
    if (location.search) {
      if (!token) {
        navigate(`/login${state}`, { replace: true })
      } else {
        setSearch(state)
      }
    }
  }, [locationInfo.pathname])
  console.log('location.href22222222222222222', location.href)

  return (
    <div className="app">
      <LoginSearchItem.Provider value={{ state: location.search }}>
        <QzzRouter />
      </LoginSearchItem.Provider>
    </div>
  )
}

export default App
