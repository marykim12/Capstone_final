import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("is_admin");
    if (isAdmin !== "true") {
      window.location.href = "/unauthorized";
      return;
    }

    axios
      .get("https://capstone-final-backend-7dup.onrender.comapi/admin/dashboard/", {
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-lg font-medium text-gray-700">Loading...</div>
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-lg font-medium text-gray-700">
          No data available.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Admin Dashboard
        </h1>

        {/* Overdue Loans Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-red-600">
            Overdue Loans
          </h2>
          {data.overdue_loans?.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.overdue_loans.map((loan) => (
                <div
                  key={loan.loan_id}
                  className="p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm"
                >
                  <p className="text-lg font-medium">
                    Loan ID:{" "}
                    <span className="text-red-600">{loan.loan_id}</span>
                  </p>
                  <p>Amount: Ksh {loan.amount.toLocaleString()}</p>
                  <p>Customer: {loan.customer_id}</p>
                  <p>Due Date: {new Date(loan.due_date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No overdue loans.</p>
          )}
        </section>

        {/* Notifications Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-yellow-600">
            Notifications
          </h2>
          {data.notifications?.length > 0 ? (
            <div className="space-y-4">
              {data.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm"
                >
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    Date:{" "}
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No notifications.</p>
          )}
        </section>

        {/* Customers, Loans, and Payments Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Customer Details
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-4 text-gray-600 font-medium border-b">
                    Customer Name
                  </th>
                  <th className="text-left p-4 text-gray-600 font-medium border-b">
                    Loan Details
                  </th>
                  <th className="text-left p-4 text-gray-600 font-medium border-b">
                    Payment Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.customers?.map((customer) => (
                  <tr
                    key={customer.customer_id}
                    className="even:bg-gray-50 odd:bg-white"
                  >
                    <td className="p-4 border-b">
                      {customer.firstName} {customer.lastName}
                    </td>
                    <td className="p-4 border-b">
                      {data.loans
                        ?.filter((loan) => loan.customer_id === customer.customer_id)
                        .map((loan) => (
                          <p key={loan.loan_id}>
                            Loan ID: {loan.loan_id}, Amount: Ksh{" "}
                            {loan.amount.toLocaleString()}
                          </p>
                        ))}
                    </td>
                    <td className="p-4 border-b">
                      {data.payments
                        ?.filter((payment) => payment.customer_id === customer.customer_id)
                        .map((payment) => (
                          <p key={payment.id}>
                            Payment ID: {payment.id}, Amount: Ksh{" "}
                            {payment.amount.toLocaleString()}
                          </p>
                        ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
