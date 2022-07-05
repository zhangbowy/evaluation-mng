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
  const searchParams = location.href.split('?')[1]
  useEffect(() => {
    console.log(searchParams, 'location1111111111111111')
    if (!token) {
      navigate(`/login?${searchParams}`, { replace: true })
    } else {
      setSearch(searchParams)
    }
  }, [locationInfo.pathname])

  return (
    <div className="app">
      <LoginSearchItem.Provider value={{ state: searchParams }}>
        <QzzRouter />
      </LoginSearchItem.Provider>
    </div>
  )
}

export default App
