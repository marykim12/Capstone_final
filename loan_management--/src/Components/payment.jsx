import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const Payment = () => {
  const { loan_id } = useParams();
  const [loan, setLoan] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load Stripe key
  const stripePromise = loadStripe("pk_test_51QP1ZqF8O7lYujcLBGCm9uth790bcBC6Z2TfUtLrhl2qx1b8S6L6fnpQoaNwpx5qdBGxsjCxM8Rhyp9i3PnH0hbL001ikr2zLy");

  // Fetch loan details when the component mounts
  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://127.0.0.1:8000
      /api/loans/${loan_id}/`)
      .then((response) => {
        setLoan(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch loan details.");
        setIsLoading(false);
      });
  }, [loan_id]);

  // Handle the payment submission
  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Request to create a checkout session
      const { data } = await axios.post(`http://127.0.0.1:8000/api/loans/${loan_id}/create-checkout-session/`);

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        setError("Payment failed. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Error creating payment session.");
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
          <button onClick={handlePayment}>Pay Now</button>
        </div>
      ) : (
        <div>No loan found.</div>
      )}
    </div>
  );
};

const StripePaymentWrapper = () => {
  return (
    <Elements stripe={loadStripe("pk_test_51QP1ZqF8O7lYujcLBGCm9uth790bcBC6Z2TfUtLrhl2qx1b8S6L6fnpQoaNwpx5qdBGxsjCxM8Rhyp9i3PnH0hbL001ikr2zLy")}>
      <Payment />
    </Elements>
  );
};

export default StripePaymentWrapper;
