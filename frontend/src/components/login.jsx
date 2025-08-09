import { useState } from 'react';
import InputField, { MailIcon, LockIcon, UserIcon } from './Inputfield';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {ToastContainer} from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

export default function Login({ onToggleForm }) {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  }

  const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if(!email || !password) {
          return handleError("Please fill all fields");
        }
        try{
          const url = '/api/v1/users/login';
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // This is crucial for cookies
            body: JSON.stringify(loginInfo)
          });
          const result = await response.json();
          console.log('Login response:', result);
          
          if (response.ok && result.success) {
            handleSuccess("Login successful!");
            
            // Use auth context login
            login(result.data.user);
            
            setTimeout(() => {
              navigate('/dashboard'); // Redirect to dashboard after login
            }, 1000);
          } else {
            const errorMessage = result.message || "Login failed";
            handleError(errorMessage);
          }
        }catch(err) {
          return handleError("Network error. Please check your connection and try again.");
        }
      };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-center mb-2 text-black">Welcome Back</h2>
      <p className="text-center text-gray-600 mb-8">Login to access your dashboard</p>
      
      <form onSubmit={handleSubmit}>
        <InputField 
          icon={UserIcon} 
          type="text" 
          name="email" 
          placeholder="Username or Email" 
          onChange={handleChange} 
          autoFocus={true} 
        />
        <InputField 
          icon={LockIcon} 
          type="password" 
          name="password" 
          placeholder="Password" 
          isPassword={true} 
          onChange={handleChange} 
        />
        <div className="text-right mb-6">
          <a href="#" className="text-sm text-gray-600 hover:text-black transition duration-300 border-b border-transparent hover:border-black">
            Forgot Password?
          </a>
        </div>
        <button
          type="submit"
          className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Login
        </button>
      </form>

      <p className="text-center text-gray-600 mt-8">
        Don't have an account?
        <button 
          onClick={onToggleForm} 
          className="font-semibold text-black hover:text-gray-700 ml-2 focus:outline-none border-b border-transparent hover:border-black transition duration-300"
        >
          Sign Up
        </button>
      </p>
      <ToastContainer />
    </div>
  );
};
