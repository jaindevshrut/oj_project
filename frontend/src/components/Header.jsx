import React from 'react';

// A simple Header component with the glass effect
export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <nav className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center bg-black/30 backdrop-blur-lg border border-white/10 rounded-full px-6 py-2">
                    <h1 className="text-xl font-bold text-white">OnlineJudge</h1>
                    <div className="flex items-center space-x-4">
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Problems</a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Submissions</a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Leaderboard</a>
                    </div>
                </div>
            </nav>
        </header>
    );
}
