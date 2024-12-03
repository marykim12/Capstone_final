import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from './Components/navbar';
import Login from './Components/login';
import Register from './Components/register';
import Home from './Components/home';
import LoanApplication from './Components/LoanApplication';
import Payment from './Components/payment';
import AboutUs from './Components/aboutUs';
import AllLoans from './Components/AllLoans';
import Loan from './Components/Loan';
import CustomerProfile from './Components/CustomerProfile';
import Logout from './Components/logOut';
import CustomerDashboard from './Components/customerDashboard';
import AdminDashboard from './Components/adminDashboard';

const stripePromise = loadStripe("pk_test_51QP1ZqF8O7lYujcLBGCm9uth790bcBC6Z2TfUtLrhl2qx1b8S6L6fnpQoaNwpx5qdBGxsjCxM8Rhyp9i3PnH0hbL001ikr2zLy");

const ProtectedRoute = ({ children, isAllowed }) => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken || (isAllowed !== undefined && !isAllowed)) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Fetch profile data (example with an API call)
    fetch('/api/user/profile')
      .then(response => response.json())
      .then(data => setProfileData(data))
      .catch(error => console.error('Error fetching profile data:', error));
  }, []);

  const isAdmin = localStorage.getItem('is_admin') === 'true';


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
          <Route path="/Loan" element={<Loan />} />
          <Route
            path="/payment/:loan_id"
            element={
              <Elements stripe={stripePromise} >
                <Payment />
              </Elements>
            }
          />

          {/* Customer Profile Route */}
          <Route
            path="/CustomerProfile"
            element={<CustomerProfile profileData={profileData} />}
          />
          <Route path="/customers/profile/:customerId" element={<CustomerProfile />} />

          {/* Protected Routes */}
          <Route
            path="/adminDashboard"
            element={
              <ProtectedRoute isAllowed={isAdmin}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CustomerDashboard"
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/logOut" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
