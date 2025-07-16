import { useState } from 'react';
import InputField, { MailIcon, LockIcon } from './Inputfield';
import { useNavigate } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
export default function Login({ onToggleForm }) {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
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
          const url = `${import.meta.env.VITE_BACKEND_BASE_URL}/users/login`;
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // This is crucial for cookies
            body: JSON.stringify(loginInfo)
          });
          const result = await response.json();
          if (response.ok) {
            handleSuccess("Login successful!");

            if (result.data?.user) {
          localStorage.setItem('user', JSON.stringify(result.data.user));
        }
        
        // Optional: Store access token in localStorage as backup
        if (result.data?.accessToken) {
          localStorage.setItem('accessToken', result.data.accessToken);
        }

            setTimeout(() => {
              navigate('/dashboard'); // Redirect to dashboard after login
            }, 2000);
          } else {
            const errorMessage = result.message || "Login failed";
            handleError(errorMessage);
          }
        }catch(err) {
          return handleError("Network error. Please check your connection and try again.");
        }
      };
  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
      <p className="text-center text-gray-400 mb-8">Login to access your dashboard</p>
      
      <form onSubmit={handleSubmit}>
        <InputField icon={<MailIcon />} type="email" name="email" placeholder="Email" onChange={handleChange} autoFocus={true} />
        <InputField icon={<LockIcon />} type="password" name="password" placeholder="Password" isPassword={true} onChange={handleChange} />
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
      <ToastContainer />
    </>
  );
};
