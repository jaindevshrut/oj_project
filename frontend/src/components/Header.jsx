import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess, handleError } from '../utils';

export default function Header({ isAuthenticated, setIsAuthenticated }) {
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogin = () => {
        navigate('/auth');
    };

    const handleLogout = async () => {
        if (isLoggingOut) return; // Prevent multiple logout requests
        
        setIsLoggingOut(true);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/users/logout`, {
                method: 'POST',
                credentials: 'include', // Important for sending httpOnly cookies
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                // Clear local storage
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                
                // Update authentication state
                setIsAuthenticated(false);
                
                handleSuccess("Logout successful!");
                
                setTimeout(() => {
                    navigate('/auth');
                }, 1500);
            } else {
                const result = await response.json();
                handleError(result.message || "Logout failed");
            }
        } catch (error) {
            console.error("Error during logout:", error);
            handleError("Logout failed. Please try again.");
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleButtonClick = () => {
        if (isAuthenticated) {
            handleLogout();
        } else {
            handleLogin();
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-10">
            <nav className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center bg-black/30 backdrop-blur-lg border border-white/10 rounded-full px-6 py-2">
                    <h1 className="text-xl font-bold text-white cursor-pointer" onClick={() => navigate('/')}>
                        OnlineJudge
                    </h1>
                    <div className="flex items-center space-x-4">
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Problems</a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Submissions</a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Leaderboard</a>
                        <button 
                            className={`text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg border border-transparent hover:border-white/20 ${
                                isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={handleButtonClick}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? 'Logging out...' : (isAuthenticated ? 'Logout' : 'Login')}
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}