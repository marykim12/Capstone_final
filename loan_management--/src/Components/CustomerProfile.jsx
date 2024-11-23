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
        <div className="max-w-lg mx-auto mt-20 bg-white p-8 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label>First Name:</label>
                    <input
                        type="text" 
                        name="firstName" 
                        value={formData.firstName || ""}
                        onChange={handleChange} 
                        className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-gray-700">Last Name:</label>
                    <input
                        type="text" 
                        name='lastName' 
                        value={formData.lastName || ''} 
                        onChange={handleChange}
                        required 
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-gray-700">Middle Name:</label>
                    <input
                        type="text" 
                        name='middleName' 
                        value={formData.middleName || ''} 
                        onChange={handleChange}
                        required 
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-gray-700">Contact:</label>
                    <input
                        type="text" 
                        name='contact' 
                        value={formData.contact || ''} 
                        onChange={handleChange}
                        required 
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-gray-700">Address:</label>
                    <textarea
                        value={formData.address || ''} 
                        name='address' onChange={handleChange}
                        required 
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                </div>
                <div className="flex items-center">
                    <label className="block text-gray-700 mr-2">Employed:</label>
                    <input
                        type="checkbox" 
                        name='isEmployed' 
                        checked={formData.isEmployed}
                        onChange={handleChange} 
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                </div>
                <div>
                    <label className="block text-gray-700">Income:</label>
                    <input
                        type="number" 
                        name='income' 
                        value={formData.income || ''} 
                        onChange={handleChange}
                        min="0" 
                        step="0.01" 
                        required 
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-gray-700">Loan Limit:</label>
                    <input
                        type="text" 
                        name='loanLimit' 
                        value={formData.loanLimit || ''}
                        readOnly 
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100" />
                </div>
                <div>
                    <label className="block text-gray-700">Guarantor:</label>
                    <input
                        type="text" 
                        name='guarantor' 
                        value={formData.guarantor || ''} 
                        onChange={handleChange}
                        required 
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                </div>
                <button type="submit" className="bg-rose-400 text-white p-2 rounded">
                    Save Profile
                </button>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
            {Object.values(errors).map((error, index) => (
                <p key={index} className="mt-4 text-red-600">{error}</p>
            ))}
            <button onClick={onCancel} className="mt-4 bg-gray-500 text-white p-2 rounded">Cancel</button>
        </div>
    );
}
export default CustomerProfile;