import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function LoanApplication() {
    const [loanLimit, setLoanLimit] = useState(null);
    const [amount, setAmount] = useState('');
    const [purpose, setPurpose] = useState('');
    const [status, setStatus] = useState('');
    const [isEmployed, setIsEmployed] = useState(false);
    const [income, setIncome] = useState(null);
    const [interest_rate, setInterest_rate] = useState(0); 
    const [customerDetails, setCustomerDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate =useNavigate();

    useEffect(() => {
        // Fetch loan limit and customer details
        const fetchCustomerDetails = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/customers/profile/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`, 
                    },
                });
                console.log(response.data);
                
                setLoanLimit(response.data.loanLimit);
                setIsEmployed(response.data.isEmployed);
                setIncome(response.data.income);
                setCustomerDetails(response.data)
            } catch (err) {
                setError('Error fetching customer details. Please try again.');
            }
        };

        fetchCustomerDetails();
    }, []);

   
    useEffect(() => {
        if (amount && parseFloat(amount) > 0) {
            setInterest_rate((parseFloat(amount) * 15) / 100); 
        } else {
            setInterest_rate(0);
        }
    }, [amount]);

    const handleApplyLoan = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        setError(null);
    
        // Input validation
        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid loan amount.');
            setLoading(false);
            return;
        }
    
        if (!purpose.trim()) {
            setError("Please provide a purpose for the loan.");
            setLoading(false);
            return;
        }
    
        if (parseFloat(amount) > parseFloat(loanLimit)) {
            setStatus('Loan declined. Requested amount exceeds your loan limit.');
            setLoading(false);
            return;
        }
    
        if (!customerDetails) {
            setError('Customer details not found. Please try again later.');
            setLoading(false);
            return;
        }

        const currentDate = new Date().toLocaleDateString('en-CA'); // Get current date in ISO format
    
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/loans/',
                {
                    amount: parseFloat(amount),  // Ensure this is numeric
                    purpose,
                    interest_rate: 15,           // Fixed interest rate
                    customer_id: customerDetails.customer_id,     // Add customer_id
                    date_issued: currentDate,    // Add current date as date_issued
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );
            console.log("API Response:", response.data);
            setStatus(`Loan approved! Your loan of ksh${response.data.amount} has been processed.`);
            navigate(`/loan/${response.data.loan_id}`);
    
        } catch (err) {
            console.error(err);
            if (err.response) {
                console.error("Error response data:", err.response.data);
                setError(err.response.data.error || 'An unexpected error occurred. Please try again.');
            } else {
                setError('An error occurred. Please check your network connection.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    
    return (
        <div
          className="relative flex items-center justify-center h-screen bg-cover bg-center w-full"
          style={{ backgroundImage: 'url(/src/assets/loan_homepage.jpg)' }}
        >
          
          <div className="absolute inset-0 bg-black opacity-50"></div>
      
          
          <div className="z-10 container mx-auto p-2">
            <form
              onSubmit={handleApplyLoan}
              className="space-y-4 bg-white/70 backdrop-blur-md shadow-lg rounded-lg p-6 w-full max-w-md mx-auto"
            >
             
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Loan Application
              </h2>
      
              {/* Error and Status Messages */}
              {error && <p className="text-red-500">{error}</p>}
              {status && <p className="text-green-500">{status}</p>}
      
              {/* Loan Limit Section */}
              <div className="mb-6">
                <p className="font-semibold text-gray-700">Loan Limit:</p>
                <p className="text-gray-800">
                  {loanLimit !== null ? `Ksh ${loanLimit}` : 'Loading...'}
                </p>
              </div>
      
              {/* Loan Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Loan Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-rose-400 focus:border-rose-400"
                  placeholder="Enter amount"
                />
              </div>
      
              {/* Loan Purpose Input */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Purpose
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-rose-400 focus:border-rose-400"
                  placeholder="Enter purpose of the loan"
                />
              </div>
      
              {/* Interest Display */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Interest (15%)
                </label>
                <p className="text-gray-700 bg-gray-100 rounded p-2">{interest_rate.toFixed(2)}</p>
              </div>
      
              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full p-2 text-white rounded ${
                  loading ? 'bg-gray-400' : 'bg-rose-500 hover:bg-rose-600'
                }`}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Apply for Loan'}
              </button>
            </form>
          </div>
        </div>

      );
    }
 export default LoanApplication
