import React, {useEffect} from 'react';
import QzzRouter from './routes'
import { useLocation, useNavigate } from 'react-router'


const App = () => {
  const locationInfo = useLocation();
  const navigate = useNavigate()
  const token = sessionStorage.getItem('QCP_B_TOKEN')

  useEffect(() => {
    if (!token && locationInfo.pathname !== '/402' && !locationInfo.pathname.includes('/pdf') && !locationInfo.pathname.includes('/share')) {
      navigate(`/login`, { replace: true })
    }
  }, [locationInfo.pathname])

  return (
    <QzzRouter />
  )
}

export default App
