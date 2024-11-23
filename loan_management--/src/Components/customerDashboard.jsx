import React, { useEffect, useState } from "react";
import CustomerProfile from "./CustomerProfile";

function CustomerDashboard() {
    const [customerData, setCustomerData] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/customers/profile/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });
                if (!response.ok) {
                    const errorDetails = await response.json();
                    setError(errorDetails.message || "Failed to load data.");
                } else {
                    const data = await response.json();
                    setCustomerData(data);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            {!isEditing ? (
                <div className="mb-6">
                    <p><strong>Name:</strong> {customerData?.firstName} {customerData?.middleName} {customerData?.lastName}</p>
                    <p><strong>Contact:</strong> {customerData?.contact}</p>
                    <p><strong>Address:</strong> {customerData?.address}</p>
                    <p><strong>Income:</strong> ksh {customerData?.income}</p>
                    <p><strong>Loan Limit:</strong> {customerData?.loanLimit}</p>
                    <p><strong>Guarantor:</strong>{customerData?.guarantor}</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-rose-400 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Edit Profile
                    </button>
                </div>
            ) : (
                <CustomerProfile
                    initialData={customerData}
                    onSave={(updatedData) => {
                        setCustomerData(updatedData); // Update the dashboard data
                        setIsEditing(false); // Close the edit form
                    }}
                    onCancel={() => setIsEditing(false)} // Close the form without saving
                />
            )}
        </div>
    );
}
export default CustomerDashboard;