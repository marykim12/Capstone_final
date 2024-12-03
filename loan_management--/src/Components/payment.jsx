import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const { loan_id } = useParams();
  const [loan, setLoan] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Fetch loan details when the component mounts
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://127.0.0.1:8000/api/loans/${loan_id}/`)
      .then((response) => {
        setLoan(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch loan details.');
        setIsLoading(false);
      });
  }, [loan_id]);

  // Handle payment submission
  const handlePayment = async () => {
    if (!phoneNumber) {
      setError('Please enter your phone number.');
      return;
    }

    try {
      setIsLoading(true);

      // Send payment request to the backend
      const response = await axios.post(
        `http://127.0.0.1:8000/api/loans/${loan_id}/mpesa-payment/`,
        {
          phone_number: phoneNumber,
          amount: loan.amount,
        }
      );

      const { message } = response.data;

      setIsLoading(false);
      alert(message); // Notify user about the payment status
    } catch (err) {
      setError('Payment initiation failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="payment-container">
      <h2>Loan Payment</h2>
      {loan ? (
        <div>
          <h3>Loan ID: {loan.loan_id}</h3>
          <p>Amount Due: ${loan.amount}</p>
          <input
            type="tel"
            placeholder="Enter Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button onClick={handlePayment}>Pay Now</button>
        </div>
      ) : (
        <div>No loan found.</div>
      )}
    </div>
  );
};

export default Payment;
