import React from 'react';
import InputField, { UserIcon, MailIcon, LockIcon } from './Inputfield';

export default function Register({ onToggleForm }) {
  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
      <p className="text-center text-gray-400 mb-8">Sign up to get started</p>
      
      <form>
        <InputField icon={<UserIcon />} type="text" placeholder="Full Name" />
        <InputField icon={<UserIcon />} type="text" placeholder="Username" />
        <InputField icon={<MailIcon />} type="email" placeholder="Email" />
        {/* Added isPassword prop to enable the visibility toggle */}
        <InputField icon={<LockIcon />} type="password" placeholder="Password" isPassword={true} />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 mt-4"
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-gray-400 mt-8">
        Already have an account?
        <button onClick={onToggleForm} className="font-semibold text-purple-400 hover:text-purple-300 ml-2 focus:outline-none">
          Login
        </button>
      </p>
    </>
  );
};
