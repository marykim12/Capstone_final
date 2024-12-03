import React, { useEffect, useState } from 'react';
import axios from 'axios';


function CustomerProfile({ initialData, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        contact: "",
        address: "",
        firstName: "",
        lastName: "",
        middleName: "",
        isEmployed: false,
        income: "",
        guarantor: "",
        loanLimit: ""
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .patch("http://127.0.0.1:8000/api/customers/profile/", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })
            .then((response) => {
                setMessage("Profile updated successfully!");
                onSave(response.data);
            })
            .catch((error) => {
                setErrors(error.response?.data || {});
            });
    };
    return (
      <div
      className="relative flex items-center justify-center h-screen bg-cover bg-center w-full h-full"
      style={{ backgroundImage: 'url(/src/assets/loan_homepage.jpg)' }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Profile Form */}
      <div className="z-10 container mx-auto p-2">
        <div className="max-w-lg mx-auto bg-white/70 backdrop-blur-md p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Update Profile
            </h2>
            {message && <p className="text-green-500">{message}</p>}
            {Object.values(errors).map((error, index) => (
              <p key={index} className="text-red-500">{error}</p>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-rose-400 focus:border-rose-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-rose-400 focus:border-rose-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-rose-400 focus:border-rose-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Contact
              </label>
              <input
                type="text"
                name="contact"
                value={formData.contact || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-rose-400 focus:border-rose-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-rose-400 focus:border-rose-400"
              />
            </div>

            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-800 mr-2">
                Employed
              </label>
              <input
                type="checkbox"
                name="isEmployed"
                checked={formData.isEmployed}
                onChange={handleChange}
                className="h-4 w-4 text-rose-500 border-gray-300 rounded focus:ring-rose-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Income
              </label>
              <input
                type="number"
                name="income"
                value={formData.income || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-rose-400 focus:border-rose-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Loan Limit
              </label>
              <input
                type="text"
                name="loanLimit"
                value={formData.loanLimit || ""}
                readOnly
                className="w-full p-2 border border-gray-300 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Guarantor
              </label>
              <input
                type="text"
                name="guarantor"
                value={formData.guarantor || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-rose-400 focus:border-rose-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-500 text-white p-2 rounded hover:bg-rose-600"
            >
              Save Profile
            </button>
            <button
              onClick={onCancel}
              className="mt-4 w-full bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;