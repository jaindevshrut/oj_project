import { useState } from 'react';
import InputField, { UserIcon, MailIcon, LockIcon } from './Inputfield';
import {ToastContainer} from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
export default function Register({ onToggleForm }) {
    const [registerInfo, setRegisterInfo] = useState({
      fullName: '',
      username: '',
      email: '',
      password: ''
    });
    const handleChange = async (e) => {
      const { name, value } = e.target;
      // console.log(`Input changed: ${name} = ${value}`);
      setRegisterInfo({ ...registerInfo, [name]: value });
    }
    const handleSubmit = async (e) => {
      e.preventDefault();
      const { fullName, username, email, password } = registerInfo;
      if(!fullName || !username || !email || !password) {
        return handleError("Please fill all fields");
      }
      try{
        const url = `${import.meta.env.VITE_BACKEND_BASE_URL}/users/register`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerInfo)
        });
        const result = await response.json();
        if (response.ok) {
          handleSuccess("Registration successful!");
          setTimeout(() =>{
            onToggleForm();
          },2000)
        } else {
          throw new Error(result.message || "Registration failed");

        }
      }catch(err) {
        return handleError("Registration failed. Try again. : " + err.message);
      }
    };
  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
      <p className="text-center text-gray-400 mb-8">Sign up to get started</p>
      
      <form onSubmit={handleSubmit}>
        <InputField icon={<UserIcon />} type="text" name="fullName" placeholder="Full Name" onChange={handleChange} autoFocus={true} />
        <InputField icon={<UserIcon />} type="text" name="username" placeholder="Username" onChange={handleChange} />
        <InputField icon={<MailIcon />} type="email" name="email" placeholder="Email" onChange={handleChange} />
        {/* Added isPassword prop to enable the visibility toggle */}
        <InputField icon={<LockIcon />} type="password" name="password" placeholder="Password" isPassword={true} onChange={handleChange} />
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
      <ToastContainer />
    </>
  );
};
