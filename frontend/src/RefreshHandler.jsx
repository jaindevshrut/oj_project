import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
function RefreshHandler({setIsAuthenticated}) {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if(// get access token from cookie
            localStorage.getItem('accessToken')
        ) {
            setIsAuthenticated(true);
            if(location.pathname === '/auth') {
                navigate('/dashboard', { replace: false }); // Redirect to dashboard if already authenticated what does replace false means ?
                // If replace is false, a new entry is added to the history stack
                // If replace is true, the current entry is replaced
            }
        }
}, [location, setIsAuthenticated, navigate]);
  return (
    null
  )
}

export default RefreshHandler