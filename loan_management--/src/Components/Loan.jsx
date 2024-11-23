import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Loan = ({loanId}) => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://127.0.0.1:8000/api/loans/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setLoans(response.data); // Assuming the response is an array of loans
      } catch (err) {
        setError('Failed to get loan');
      }
    };
    fetchLoans();
  }, [loanId]);

  // Helper function to calculate the payment date (21 days after loan was taken)
  const calculatePaymentDate = (dateTaken) => {
    const takenDate = new Date(dateTaken); // Convert the loan taken date to a Date object
    takenDate.setDate(takenDate.getDate() + 21); // Add 21 days
    return takenDate.toLocaleDateString(); // Return the date in a readable format (MM/DD/YYYY)
  };

  return (
    <div>
      <h1>This is your current loan</h1>
      {error && <p>{error}</p>}

      <ul>
        {loans.map((loan) => (
          <li key={loan.id}>
            Amount: {loan.amount},
             Status: {loan.status.toUpperCase()}, 
             Interest Rate: {loan.intrest_rate}%, 
            Payment Due: {loan.date_taken ? calculatePaymentDate(loan.date_taken) : 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Loan;
