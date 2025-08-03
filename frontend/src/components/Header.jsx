// filepath: d:\algo\oj_project\frontend\src\components\Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserDropdown from './UserDropdown';

export default function Header({ isAuthenticated, setIsAuthenticated }) {
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 right-0 z-10">
            <nav className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl px-6 py-2">
                    <h1 className="text-xl font-bold text-white cursor-pointer" onClick={() => navigate('/')}>
                        OnlineJudge
                    </h1>
                    <div className="flex items-center space-x-4">
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Problems</a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Submissions</a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Leaderboard</a>
                        {/* Add Code Editor link for authenticated users */}
                        {isAuthenticated && (
                            <button 
                                onClick={() => navigate('/code')}
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                Code Editor
                            </button>
                        )}
                        {/* Replace the logout button with UserDropdown */}
                        <UserDropdown 
                            isAuthenticated={isAuthenticated} 
                            setIsAuthenticated={setIsAuthenticated} 
                        />
                    </div>
                </div>
            </nav>
        </header>
    );
}