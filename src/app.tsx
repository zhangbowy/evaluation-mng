import React, { createContext, useEffect } from 'react'
import QzzRouter from './routes'
import './App.css'
import { useLocation, useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

const App = () => {
  const locationInfo = useLocation();
  const navigate = useNavigate()
  const [search, setSearch] = useSearchParams()
  const token = sessionStorage.getItem('QCP_TOKEN')
  useEffect(() => {
    if (!token) {
      navigate(`/login${locationInfo.search}`, { replace: true })
    } else {
      setSearch(locationInfo.search)
    }
  }, [locationInfo.pathname])
  return (
    <div className="app">
      <QzzRouter />
    </div>
  )
}

export default App
