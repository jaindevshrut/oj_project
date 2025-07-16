// App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import HomeBento from './components/homeBenton';
import HoverCard from './components/hovercard';
import Login from './components/login';
import Register from './components/register';
export default function App() {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleForm = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <Header />
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-gray-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-600 opacity-20 blur-[100px]"></div>
      </div>
      
      {/* The HoverCard now wraps the conditional rendering of Login/Register */}
      <HoverCard className="w-full max-w-md shadow-2xl shadow-purple-900/20">
        {isLoginView ? (
          <Login onToggleForm={toggleForm} />
        ) : (
          <Register onToggleForm={toggleForm} />
        )}
      </HoverCard>
    </div>
  );
}
