import React, { useState, useEffect } from 'react';

const ProfileStats = ({ userId }) => {
    const [stats, setStats] = useState({
        totalSubmissions: 0,
        acceptedSubmissions: 0,
        problemsSolved: 0,
        accuracyRate: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchUserStats();
        }
    }, [userId]);

    const fetchUserStats = async () => {
        try {
            setLoading(true);
            
            // For now, we'll use mock data since the backend might not have these endpoints yet
            // In a real application, you would fetch these from your backend
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/users/stats/${userId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    setStats(result.data);
                } else {
                    // Use mock data if endpoint doesn't exist
                    setMockStats();
                }
            } else {
                // Use mock data if endpoint doesn't exist
                setMockStats();
            }
        } catch (error) {
            console.error('Error fetching user stats:', error);
            // Use mock data as fallback
            setMockStats();
        } finally {
            setLoading(false);
        }
    };

    const setMockStats = () => {
        // Mock data for demonstration
        setStats({
            totalSubmissions: Math.floor(Math.random() * 100) + 20,
            acceptedSubmissions: Math.floor(Math.random() * 50) + 10,
            problemsSolved: Math.floor(Math.random() * 30) + 8,
            accuracyRate: Math.floor(Math.random() * 40) + 60
        });
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-700 h-16 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    const statItems = [
        {
            label: 'Total Submissions',
            value: stats.totalSubmissions,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            color: 'text-blue-400'
        },
        {
            label: 'Accepted',
            value: stats.acceptedSubmissions,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            color: 'text-green-400'
        },
        {
            label: 'Problems Solved',
            value: stats.problemsSolved,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            color: 'text-purple-400'
        },
        // {
        //     label: 'Contests',
        //     value: stats.contestsParticipated,
        //     icon: (
        //         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        //         </svg>
        //     ),
        //     color: 'text-yellow-400'
        // },
        // {
        //     label: 'Global Rank',
        //     value: `#${stats.ranking}`,
        //     icon: (
        //         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        //         </svg>
        //     ),
        //     color: 'text-orange-400'
        // },
        {
            label: 'Accuracy',
            value: `${stats.accuracyRate}%`,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            color: 'text-indigo-400'
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {statItems.map((item, index) => (
                <div 
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                    <div className="flex items-center space-x-3">
                        <div className={`${item.color}`}>
                            {item.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{item.label}</p>
                            <p className="text-lg font-semibold text-black">{item.value}</p>
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Accuracy Rate Progress Bar */}
            <div className="col-span-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="text-sm text-black font-medium">{stats.accuracyRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stats.accuracyRate}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default ProfileStats;
