import React, {useEffect} from 'react';
import QzzRouter from './routes'
import './assets/app.less'
import { useLocation, useNavigate } from 'react-router'


const App = () => {
  const locationInfo = useLocation();
  const navigate = useNavigate()
  const token = sessionStorage.getItem('QCP_B_TOKEN')

  useEffect(() => {
    if (!token && locationInfo.pathname !== '/402' && locationInfo.pathname !== '/pdf') {
      navigate(`/login`, { replace: true })
    }
  }, [locationInfo.pathname])

  return (
    <div className="app">
      <QzzRouter />
    </div>
  )
}

export default App
