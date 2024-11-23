import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is an admin
    const isAdmin = localStorage.getItem('is_admin');
    if (isAdmin !== 'true') {
      // Redirect to unauthorized page if not an admin
      window.location.href = '/unauthorized';
      return;
    }

    // Fetch dashboard data for admin
    axios
      .get("http://127.0.0.1:8000/api/admin-dashboard/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching admin data", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <h2>Customers</h2>
        <ul>
          {data.customers.map((customer) => (
            <li key={customer.customer_id}>{customer.firstName} {customer.lastName}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Loans</h2>
        <ul>
          {data.loans.map((loan) => (
            <li key={loan.id}>{loan.amount} - {loan.status_loan}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Payments</h2>
        <ul>
          {data.payments.map((payment) => (
            <li key={payment.id}>Loan ID: {payment.loan.id} - Amount: {payment.amount}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
