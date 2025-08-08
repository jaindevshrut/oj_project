import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RouteLoader from '../components/RouteLoader';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const checkAuthentication = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/v1/users/me', {
                method: 'GET',
                credentials: 'include',
            });
                  
            const result = await response.json();
            
            if (response.ok && result.success && result.data) {
                setIsAuthenticated(true);
                setUser(result.data);
                localStorage.setItem('user', JSON.stringify(result.data));
                
                // Only redirect to dashboard if user is on auth page
                if (location.pathname === '/auth') {
                    navigate('/dashboard', { replace: true });
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('user');
                
                // Redirect to auth if trying to access protected routes
                const protectedRoutes = ['/dashboard', '/profile', '/edit-profile', '/problems', '/problem', '/create-problem', '/edit-problem', '/my-problems', '/submissions'];
                const isProtectedRoute = protectedRoutes.some(route => 
                    location.pathname.startsWith(route)
                );
                
                if (isProtectedRoute) {
                    navigate('/auth', { replace: true });
                }
            }
        } catch (error) {
            console.error("Error checking authentication:", error);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('user');
        } finally {
            // Add minimum loading time for smooth transition
            setTimeout(() => {
                setIsLoading(false);
            }, 800);
        }
    };

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        navigate('/auth', { replace: true });
    };

    useEffect(() => {
        checkAuthentication();
    }, [location.pathname]);

    // Show loading screen during authentication check
    if (isLoading) {
        return <RouteLoader message="Verifying authentication..." />;
    }

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
        setIsLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
