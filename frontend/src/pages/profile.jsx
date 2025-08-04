import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileAvatar from '../components/ProfileAvatar';
import ProfileStats from '../components/ProfileStats';
import { handleError, handleSuccess } from '../utils';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            
            // First try to get user from localStorage
            const localUser = localStorage.getItem('user');
            if (localUser) {
                const userData = JSON.parse(localUser);
                setUser(userData);
            }

            // Then fetch fresh data from backend
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/users/profile`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    setUser(result.data);
                    // Update localStorage with fresh data
                    localStorage.setItem('user', JSON.stringify(result.data));
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            handleError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const getUserInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getGenderDisplay = (gender) => {
        const genderMap = {
            'M': 'Male',
            'F': 'Female',
            'O': 'Other',
            'N': 'Not specified'
        };
        return genderMap[gender] || 'Not specified';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Profile not found</h2>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 pt-20 pb-8">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Profile Header */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        {/* Avatar Section */}
                        <div className="relative">
                            <ProfileAvatar 
                                src={user.avatar}
                                alt={user.fullName}
                                size="lg"
                                fallback={getUserInitials(user.fullName)}
                                editable={false}
                            />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{user.fullName}</h1>
                                <p className="text-xl text-gray-300 mb-2">@{user.username}</p>
                                <p className="text-gray-400">{user.email}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                <button
                                    onClick={() => navigate('/edit-profile')}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Personal Information */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Personal Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                <p className="text-white">{user.email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                                <p className="text-white">{getGenderDisplay(user.gender)}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                                <p className="text-white">{user.location || 'Not specified'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Website</label>
                                <p className="text-white">
                                    {user.website ? (
                                        <a 
                                            href={user.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-blue-400 hover:text-blue-300 underline"
                                        >
                                            {user.website}
                                        </a>
                                    ) : (
                                        'Not specified'
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Statistics</h2>
                        <ProfileStats userId={user._id} />
                    </div>
                </div>

                {/* Account Information */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Account Type</label>
                            <p className="text-white capitalize">{user.accType?.toLowerCase()}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Member Since</label>
                            <p className="text-white">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
