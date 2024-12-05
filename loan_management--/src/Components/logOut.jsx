import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call logout endpoint if necessary
      await fetch('https://capstone-final-backend-7dup.onrender.comapi/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: localStorage.getItem('refresh_token') }),
      });
    } catch (error) {
      console.error('Failed to log out:', error);
    }

    // Clear tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Optional: Call a parent-provided function to reset app state
    if (onLogout) {
      onLogout();
    }

    // Redirect to login page
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
      Log Out
    </button>
  );
};

export default Logout;
