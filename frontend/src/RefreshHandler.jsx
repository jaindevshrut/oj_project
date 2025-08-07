import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function RefreshHandler({setIsAuthenticated}) {
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/users/me`, {
                    method: 'GET',
                    credentials: 'include', // Important for sending httpOnly cookies
                });
                      
                const result = await response.json();
                console.log('RefreshHandler - Response status:', response.status);
                console.log('RefreshHandler - Result:', result);
                
                if (response.ok && result.success && result.data) {
                    setIsAuthenticated(true);
                    localStorage.setItem('user', JSON.stringify(result.data));
                    // Only redirect to dashboard if user is on auth page
                    if (location.pathname === '/auth') {
                        navigate('/dashboard', { replace: true });
                    }
                    // Don't redirect if user is already on /dashboard or /code
                } else {
                    setIsAuthenticated(false);
                    localStorage.removeItem('user');
                    
                    // Redirect to auth if trying to access protected routes without token
                    if (location.pathname === '/dashboard') {
                        navigate('/auth', { replace: true });
                    }
                }
            } catch (error) {
                console.error("Error in RefreshHandler:", error);
                setIsAuthenticated(false);
                localStorage.removeItem('user');
            }
        };
        
        checkAuthentication();
    }, [location, setIsAuthenticated, navigate]);
    
    return null;
}

export default RefreshHandler