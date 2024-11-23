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
    const [interest, setInterest] = useState(0); // New state for interest
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
            } catch (err) {
                setError('Error fetching customer details. Please try again.');
            }
        };

        fetchCustomerDetails();
    }, []);

    // Update interest dynamically when the amount changes
    useEffect(() => {
        if (amount && parseFloat(amount) > 0) {
            setInterest((parseFloat(amount) * 15) / 100); // Calculate 15% interest
        } else {
            setInterest(0);
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
            return;
        }
        
    
        // Backend validation (employment and loan limit)
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            setError("Please enter a valid loan amount.");
            return;
        }
        
    
        if (parseFloat(amount) > parseFloat(loanLimit)) {
            setStatus('Loan declined. Requested amount exceeds your loan limit.');
            setLoading(false);
            return;
        }
    
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/loans/',
                {
                    amount: parseFloat(amount),  // Ensure this is numeric
                    purpose,
                    interest_rate: 15,           // Fixed interest rate
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );
    
            setStatus(`Loan approved! Your loan of $${response.data.amount} has been processed.`);
            navigate(`/loan/${loanId}`);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="container mx-auto p-2">
            <h2 className="text-2xl font-bold mb-4">Loan Application</h2>

            {error && <p className="text-red-500">{error}</p>}
            {status && <p className="text-green-500">{status}</p>}

            <div className="mb-6">
                <p className="font-semibold">Loan Limit:</p>
                <p>{loanLimit !== null ? `$${loanLimit}` : 'Loading...'}</p>
            </div>

            <form onSubmit={handleApplyLoan} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Loan Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter amount"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Purpose</label>
                    <input
                        type="text"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter purpose of the loan"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Interest (15%)</label>
                    <p className="text-gray-700">{interest.toFixed(2)}</p> {/* Display calculated interest */}
                </div>

                <button
                    type="submit"
                    className={`w-full p-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-rose-400'}`}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Apply for Loan'}
                </button>
            </form>
        </div>
    );
}

export default LoanApplication;
