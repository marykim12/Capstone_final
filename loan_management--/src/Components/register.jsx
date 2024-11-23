import React, { useState } from 'react';
import password from '../assets/password.jpg';
import user from '../assets/user.jpg';
import email from '../assets/email.jpg';
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
        <div className="container mx-auto p-4">
        <div className="header text-center mb-6">
            <div className="text-2xl font-bold">Register</div>
            <div className="underline w-16 h-1 bg-rose-400 mx-auto mt-2"></div>
        </div>
        <form onSubmit={handleSubmit} className="inputs space-y-4">
            <div className="input flex items-center space-x-2">
                <img src={user} alt="Username" className="w-10 h-10 object-cover" />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="input flex items-center space-x-2">
                <img src={email} alt="Email" className="w-10 h-10 object-cover" />
                <input
                    type="email"
                    placeholder="Email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="input flex items-center space-x-2">
                <img src={password} alt="Password" className="w-10 h-10 object-cover" />
                <input
                    type="password"
                    placeholder="Password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="input flex items-center space-x-2">
                <FaIdBadge className="w-10 h-10 object-cover" />
                <input
                    type="text"
                    placeholder="National ID"
                    value={nationalID}
                    onChange={(e) => setNationalID(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <button type="submit" className="w-full bg-rose-400 text-white p-2 rounded">Register</button>
            {error && <p className="text-red-500">{error}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}
        </form>
        <button onClick={navigateToLogin} className="mt-4 rounded text-rose-400">Log in</button>
    </div>
);
};
export default Register;