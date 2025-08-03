import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess, handleError } from '../utils';

const UserDropdown = ({ isAuthenticated, setIsAuthenticated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [user, setUser] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Get user data from localStorage
    useEffect(() => {
        if (isAuthenticated) {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        }
    }, [isAuthenticated]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        if (isLoggingOut) return;
        
        setIsLoggingOut(true);
        setIsOpen(false);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/users/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                setIsAuthenticated(false);
                localStorage.removeItem('user'); // Clear user data
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

    const handleLogin = () => {
        navigate('/auth');
    };

    // Get user initials for avatar
    const getUserInitials = (username) => {
        if (!username) return 'U';
        return username.slice(0, 2).toUpperCase();
    };

    if (!isAuthenticated) {
        return (
            <button 
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg border border-transparent hover:border-white/20"
                onClick={handleLogin}
            >
                Login
            </button>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* User Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            >
                {/* Avatar */}
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt="Avatar" 
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        getUserInitials(user?.username)
                    )}
                </div>
                
                {/* Username */}
                <span className="hidden md:block text-sm font-medium">
                    {user?.username || 'User'}
                </span>

                {/* Dropdown Arrow */}
                <svg 
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                                {user?.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt="Avatar" 
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    getUserInitials(user?.username)
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.username || 'User'}
                                </p>
                                <p className="text-sm text-gray-400 truncate">
                                    {user?.email || 'user@example.com'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                navigate('/profile');
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Account
                        </button>

                        <div className="border-t border-gray-700 mt-1 pt-1">
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className={`flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-white transition-colors ${
                                    isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                {isLoggingOut ? 'Logging out...' : 'Log out'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;