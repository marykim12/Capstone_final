//loan limit for the customer
import React, { useEffect, useState } from 'react'

function loanLimit() {
    const [loanLimit, setLoanLimit] = useState('');

    useEffect(() => {
        const fetchLoanLimit = async () => {
            try{
                const response = await fetch('https://capstone-final-backend-7dup.onrender.comapi/loan-limit/',{
                   headers: {
                    '`Authorization': `Bearer ${localStorage.getItem('access')},`
                   } 
                });
                const data = await response.json();
                setLoanLimit(data.limit_amount);

            }catch (error) {
                console.error('Error fetching loan limit')
            }
        };
        fetchLoanLimit();
    }, []);

  return (
    <div>
      <h1>Loan Limit :{loanLimit}</h1>
    </div>
  );
}

export default loanLimit
