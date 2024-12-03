import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function Navbar({loan_id}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if the user is logged in (e.g., via a token in localStorage)
    const token = localStorage.getItem('access_token'); // Adjust the key based on your setup
    setIsLoggedIn(!!token); // Set `isLoggedIn` to true if token exists
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Remove the token
    setIsLoggedIn(false); // Update the state
  };

  return (
    <nav className="bg-rose-400 p-1 shadow-md justify-left">
      <div className="container mx-auto flex justify-between items-center space-y-4">
        {/* Brand Name */}
        <Link to="/" className="text-white text-2xl font-bold">
          Mkopo Yangu
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-0.1">
          <Link to="/Aboutus" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            About Us
          </Link>
          <Link to="/LoanForm" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Loan Application
          </Link>
          <Link to="/Loan" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Loan 
          </Link>

          <Link to={`/payment/${loan_id}`} className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Payment
          </Link>
          <Link to="/CustomerProfile" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Profile
          </Link>
          <Link to="/CustomerDashboard" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
                Dashboard
              </Link>
          {isLoggedIn ? (
            <>
              <Link to="/logOut" className="text-white hover:bg-gray-700 px-3 py-2 rounded" onClick={handleLogout}>
                Log Out
              </Link>
              
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
                Login
              </Link>
              <Link to="/register" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu Links */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <Link to="/Aboutus" className="block text-white hover:bg-gray-700 px-3 py-2 rounded">
            About Us
          </Link>
          <Link to="/LoanForm" className="block text-white hover:bg-gray-700 px-3 py-2 rounded">
            Loan Application
          </Link>
          <Link to="/Payment" className="block text-white hover:bg-gray-700 px-3 py-2 rounded">
            Payment
          </Link>
          <Link to="/CustomerProfile" className="block text-white hover:bg-gray-700 px-3 py-2 rounded">
            Profile
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/logOut" className="block text-white hover:bg-gray-700 px-3 py-2 rounded" onClick={handleLogout}>
                Log Out
              </Link>
              <Link to="/CustomerDashboard" className="block text-white hover:bg-gray-700 px-3 py-2 rounded">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-white hover:bg-gray-700 px-3 py-2 rounded">
                Login
              </Link>
              <Link to="/register" className="block text-white hover:bg-gray-700 px-3 py-2 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
