import React,{useEffect, useState} from 'react';
import axios from 'axios';


const AllLoans = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try{
        const token = localStorage.getItem('access');
        const response = await axios.get('https://capstone-final-backend-7dup.onrender.comapi/loans/',{
          headers: {
            'Authorization': `Bearer ${token}`
          }

      });
      
      setLoans(response.data);

    } catch (err) {
      setError('Failed');
        }
      
    
  };
  fetchLoans();
  
  }, []);



  return (
    <div>
      <h2>Loan Management</h2>
      {error && <p>{error}</p>}
      <ul>
        {loans.map(loan => (
          <li key={loan.id}>{loan.amount} - {loan.status}</li>
        ))}
      </ul>
      
    </div>
  );
};

export default AllLoans
