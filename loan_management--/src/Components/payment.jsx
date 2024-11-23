import React, { useState } from 'react';
import axios from 'axios';

const Payment = ({ loan_id }) => {
  const [amount, setAmount] = useState('');  // Track payment amount
  const [error, setError] = useState('');    // For error messages
  const [paymentStatus, setPaymentStatus] = useState('');  // For displaying payment status

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/payments/`,
        {
          loan: loan_id,
          amount: amount,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setPaymentStatus('Payment Successful');
      } else {
        setPaymentStatus('Payment Failed');
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md mt-8">
      <h2 className="text-2xl font-semibold text-center">Make a Payment</h2>
      <form onSubmit={handleSubmit}>
        {/* Loan ID field */}
        <div className="mb-4">
          <label htmlFor="loan_id" className="block text-sm font-medium text-gray-700">Loan ID</label>
          <input
            type="text"
            name="loan_id"
            value={loan_id}  
            disabled   
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Amount field */}
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={amount}  // Bind value to amount state
            onChange={(e) => setAmount(e.target.value)}  // Update state on input change
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="w-full py-2 px-4 bg-rose-400 text-white rounded-md hover:bg-gray-400">
          Submit Payment
        </button>
      </form>

      {/* Displaying status or error */}
      {paymentStatus && <p className="text-center text-rose-400 mt-4">{paymentStatus}</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default Payment;
