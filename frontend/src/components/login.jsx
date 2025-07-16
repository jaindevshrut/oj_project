import React from 'react';
import InputField, { MailIcon, LockIcon } from './Inputfield';

export default function Login({ onToggleForm }) {
  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
      <p className="text-center text-gray-400 mb-8">Login to access your dashboard</p>
      
      <form>
        <InputField icon={<MailIcon />} type="email" placeholder="Email" />
        {/* Added isPassword prop to enable the visibility toggle */}
        <InputField icon={<LockIcon />} type="password" placeholder="Password" isPassword={true} />
        <div className="text-right mb-6">
          <a href="#" className="text-sm text-purple-400 hover:text-purple-300 transition duration-300">
            Forgot Password?
          </a>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105"
        >
          Login
        </button>
      </form>

      <p className="text-center text-gray-400 mt-8">
        Don't have an account?
        <button onClick={onToggleForm} className="font-semibold text-purple-400 hover:text-purple-300 ml-2 focus:outline-none">
          Sign Up
        </button>
      </p>
    </>
  );
};
