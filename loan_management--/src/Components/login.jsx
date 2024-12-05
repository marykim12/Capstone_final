import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://capstone-final-backend-7dup.onrender.comapi/token/', {
        username: userName,
        password: password,
      });
    
      console.log(response.data); // Debug the response
      const { access, refresh, is_admin } = response.data;
    
      if (typeof is_admin !== 'boolean') {
        throw new Error('Invalid response: Missing or incorrect "is_admin" flag.');
      }
    
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('is_admin', is_admin);
    
      navigate(is_admin ? '/adminDashboard' : '/CustomerDashboard');
      console.log("Admin:", is_admin); 
      console.log("Redirecting to:", is_admin ? '/adminDashboard' : '/CustomerDashboard');

    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
      console.error('Login error:', err);
    }
    
  };

  return (
    <div
  className="relative flex items-center justify-center min-h-screen bg-cover bg-center w-full"
  style={{ backgroundImage: "url(/loan_homepage.jpg)" }}
>
  {/* Background Overlay */}
  <div className="absolute inset-0 bg-black opacity-50"></div>

  {/* Login Form */}
  <div className="z-10 container mx-auto p-4">
    <div className="max-w-md mx-auto bg-white/70 backdrop-blur-md p-8 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Login</h2>
        <div className="h-1 w-24 bg-rose-400 mx-auto mt-2"></div>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        {/* Username Field */}
        <div className="flex items-center border-b border-gray-300 py-2">
          <img src="/assets/user.jpg" alt="User Icon" className="h-6 w-6 mr-3" />
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="appearance-none bg-transparent border-none w-full text-gray-800 py-1 px-2 leading-tight focus:outline-none focus:ring-rose-400"
          />
        </div>

        {/* Password Field */}
        <div className="flex items-center border-b border-gray-300 py-2">
          <img src="/assets/password.jpg" alt="Password Icon" className="h-6 w-6 mr-3" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="appearance-none bg-transparent border-none w-full text-gray-800 py-1 px-2 leading-tight focus:outline-none focus:ring-rose-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-rose-400 text-white font-semibold rounded-lg shadow-md hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          Log in
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </form>
    </div>
  </div>
</div>
  );
}

export default Login;
