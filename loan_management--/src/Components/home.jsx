import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Mkopo Yangu</h1>
        <p className="text-lg text-center mb-6">We are the answer to your financial needs. Available 24 hours a day.</p>
        <img src="/assets/loan_homepage.jpg" alt="Home page" className="w-full max-w-md mb-6 rounded shadow-md" />

        <div className="mt-4 flex space-x-4">
            <Link to="/register">
                <button className="bg-rose-400 text-white px-4 py-2 rounded">Register</button>
            </Link>
            <Link to="/login">
                <button className="bg-rose-400 text-white px-4 py-2 rounded">Log in</button>
            </Link>
        </div>
    </div>
  );
}

export default Home;
