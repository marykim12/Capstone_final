import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaIdBadge } from "react-icons/fa";

function Register() {
    const [username, setUsername] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [nationalID, setNationalID] = useState('')
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/register/', {
                username,
                email: emailInput,
                password: passwordInput,
                national_id: nationalID,
            });
            setSuccessMessage('Registration successful! You can now log in.');
            setError(null); // Clear any previous error
        } catch (err) {
            setError('Error registering user. Please try again.');
            setSuccessMessage(''); // Clear any previous success message
        }
    };
    const navigateToLogin = () => {
        setTimeout(() => navigate('/login'), 2000);
    };
    return (
        
            <div
              className="relative flex items-center justify-center min-h-screen bg-cover bg-center w-full"
              style={{ backgroundImage: "url(/src/assets/loan_homepage.jpg)" }}
            >
              {/* Background Overlay */}
              <div className="absolute inset-0 bg-black opacity-50"></div>
          
              {/* Registration Form */}
              <div className="z-10 container mx-auto p-4">
                <div className="max-w-md mx-auto bg-white/70 backdrop-blur-md p-8 rounded-lg shadow-lg">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Register</h2>
                    <div className="h-1 w-16 bg-rose-400 mx-auto mt-2"></div>
                  </div>
          
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Field */}
                    <div className="flex items-center border-b border-gray-300 py-2">
                      <img src="/user.jpg" alt="Username" className="h-6 w-6 mr-3" />
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="appearance-none bg-transparent border-none w-full text-gray-800 py-1 px-2 leading-tight focus:outline-none focus:ring-rose-400"
                      />
                    </div>
          
                    {/* Email Field */}
                    <div className="flex items-center border-b border-gray-300 py-2">
                      <img src="/email.jpg" alt="Email" className="h-6 w-6 mr-3" />
                      <input
                        type="email"
                        placeholder="Email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        required
                        className="appearance-none bg-transparent border-none w-full text-gray-800 py-1 px-2 leading-tight focus:outline-none focus:ring-rose-400"
                      />
                    </div>
          
                    {/* Password Field */}
                    <div className="flex items-center border-b border-gray-300 py-2">
                      <img src="/password.jpg" alt="Password" className="h-6 w-6 mr-3" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        required
                        className="appearance-none bg-transparent border-none w-full text-gray-800 py-1 px-2 leading-tight focus:outline-none focus:ring-rose-400"
                      />
                    </div>
          
                    {/* National ID Field */}
                    <div className="flex items-center border-b border-gray-300 py-2">
                      <FaIdBadge className="h-6 w-6 text-gray-600 mr-3" />
                      <input
                        type="text"
                        placeholder="National ID"
                        value={nationalID}
                        onChange={(e) => setNationalID(e.target.value)}
                        required
                        className="appearance-none bg-transparent border-none w-full text-gray-800 py-1 px-2 leading-tight focus:outline-none focus:ring-rose-400"
                      />
                    </div>
          
                    {/* Register Button */}
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-rose-400 text-white font-semibold rounded-lg shadow-md hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    >
                      Register
                    </button>
          
                    {/* Error and Success Messages */}
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    {successMessage && (
                      <p className="text-green-500 text-center mt-4">{successMessage}</p>
                    )}
                  </form>
          
                  {/* Navigate to Login */}
                  <button
                    onClick={navigateToLogin}
                    className="mt-4 w-full text-rose-400 font-semibold text-center py-2 rounded-lg hover:underline"
                  >
                    Already have an account? Log in
                  </button>
                </div>
              </div>
            </div>
          );
          
};
export default Register;