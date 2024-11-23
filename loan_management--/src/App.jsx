import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Components/dashboard';
import Login from './Components/login';
import Register from './Components/register';
import Home from './Components/home';
import LoanApplication from './Components/LoanApplication';
import Loan from './Components/Loan';
import AboutUs from './Components/aboutUs';
import Navbar from './Components/navbar';
import Payment from './Components/payment';
import AllLoans from './Components/AllLoans';
import CustomerProfile from './Components/CustomerProfile';
import Logout from './Components/logOut';
import CustomerDashboard from './Components/customerDashboard';
import ProtectedRoute from './Components/protected';
import AdminDashboard from './Components/adminDashboard';

function App({ profileData }) {
  const isAdmin = localStorage.getItem('is_admin') === 'true'; // Get admin status from localStorage
  const accessToken = localStorage.getItem('access_token');

  // ProtectedRoute Component
  const ProtectedRoute = ({ children, isAllowed }) => {
    if (!accessToken || (isAllowed !== undefined && !isAllowed)) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Navbar />
      <div className="container mx-auto">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/LoanForm" element={<LoanApplication />} />
          <Route path="/Aboutus" element={<AboutUs />} />
          <Route path="/AllLoans" element={<AllLoans />} />
         
          <Route path="/payment" element={<Payment />} />

          {/* Customer Profile Route */}
          <Route
            path="/CustomerProfile"
            element={<CustomerProfile profileData={profileData} />}
          />
          <Route
            path="/customers/profile/:customerId"
            element={<CustomerProfile />}
          />

          {/* Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute isAllowed={isAdmin}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/logOut"
            element={<Logout />}
          />
          
          <Route
            path="/CustomerDashboard"
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
