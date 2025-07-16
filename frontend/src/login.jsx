import React from 'react';
import './index.css';
const Login = () => {
  return (
    <div className="glow min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] flex items-center justify-center">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-white text-3xl font-semibold text-center mb-6">Sign In</h2>
        
        <form className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-white/5 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-white/5 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-medium transition-all duration-300"
          >
            Login
          </button>
        </form>
        
        <p className="text-gray-400 text-sm mt-6 text-center">
          Don’t have an account? <span className="text-cyan-400 hover:underline cursor-pointer">Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
