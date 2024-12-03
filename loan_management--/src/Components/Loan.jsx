import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Loan = ({ loan_id }) => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('Authentication token not found');
        const response = await axios.get('http://127.0.0.1:8000/api/loans/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Loans fetched:', response.data);
        setLoans(response.data); // Assuming response.data is an array of loans
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to get loans');
        console.error(err); // For debugging purposes
      }
    };
    fetchLoans();
  }, []);


  const calculatePaymentDate = (date_issued) => {
    const date = new Date(date_issued); // Convert the loan taken date to a Date object
    date.setDate(date.getDate() + 21); // Add 21 days
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
    return `${day}-${month}-${year}`;
  };
  const handlePayment = (loan_id) =>{
    console.log("Navigating to Payment for Loan ID:" + loan_id);

    navigate(`/Payment/${loan_id}`);
  };

  return (
    <div
      className="relative flex items-center justify-center h-screen bg-cover bg-center w-full"
      style={{ backgroundImage: 'url(/src/assets/loan_homepage.jpg)' }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="z-10 container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded p-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">Your Loans</h1>

          {loans.length > 0 ? (
            <ul className="space-y-6">
              {loans.map((loan) => (
                <li
                  key={loan.loan_id}
                  className="bg-gray-50 shadow-md rounded-lg p-6 border border-gray-200"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Loan ID: <span className="text-blue-600">{loan.loan_id}</span>
                  </h2>
                  <p className="text-gray-700">
                    <strong>Amount:</strong> Ksh {loan.amount}
                  </p>
                  <p className="text-gray-700">
                    <strong>Date Issued:</strong>{' '}
                    {loan.date_issued ? formatDate(loan.date_issued) : 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <strong>Status:</strong>{' '}
                    <span
                      className={`${
                        loan.status_loan === 'approved'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      } font-medium`}
                    >
                      {loan.status_loan}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    <strong>Interest Rate:</strong> {loan.interest_rate}%
                  </p>
                  <p className="text-gray-700">
                    <strong>Payment Due:</strong>{' '}
                    {loan.date_issued ? calculatePaymentDate(loan.date_issued) : 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <strong>Total Repayment:</strong> Ksh {loan.total_repayment}
                  </p>
                  <button
                    onClick={() => handlePayment(loan.loan_id)}
                    className="mt-4 px-6 py-2 bg-rose-400 text-white rounded hover:bg-rose-500 shadow-md transition-all"
                  >
                    Pay Now
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center">No loans found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loan;