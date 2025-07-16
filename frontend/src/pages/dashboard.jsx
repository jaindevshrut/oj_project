import React, { use, useEffect, useState } from 'react'
function Dashboard() {
    const [loggedInUser, setLoggedInUser] = useState({});
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setLoggedInUser(JSON.parse(user));
        }
    }, []);
  return (
    <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold text-center">Welcome {loggedInUser.fullName || 'User'}</h1>
    </div>
  )
}

export default Dashboard