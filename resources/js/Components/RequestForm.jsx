import { useState } from 'react';
import { Head } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function RequestForm() {
    const [formType, setFormType] = useState('supply'); // 'supply' or 'reimbursement'
    
    // Supply Request Form State
    const [supplyForm, setSupplyForm] = useState({
        email: '',
        name: '',
        branch: '',
        requestType: '',
        amount: '',
        items: '',
        description: ''
    });

    // Reimbursement Form State
    const [reimbursementForm, setReimbursementForm] = useState({
        email: '',
        name: '',
        branch: '',
        date: new Date(),
        timeFrom: '',
        timeTo: '',
        particular: '',
        breakdown: '',
        totalAmount: '',
        receipt: null
    });

    // Sample request status data
    const [requests] = useState([
        { id: 28, status: 'Approved', date: '2024-03-20', type: 'Supply Request' },
        { id: 29, status: 'Pending', date: '2024-03-21', type: 'Reimbursement' },
        { id: 30, status: 'Rejected', date: '2024-03-22', type: 'Supply Request' }
    ]);

    const handleSupplySubmit = (e) => {
        e.preventDefault();
        // Handle supply form submission
    };

    const handleReimbursementSubmit = (e) => {
        e.preventDefault();
        // Handle reimbursement form submission
    };

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Form Type Toggle */}
            <div className="mb-6 flex space-x-4">
                <button
                    className={`px-6 py-2 rounded-full ${
                        formType === 'supply' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100'
                    }`}
                    onClick={() => setFormType('supply')}
                >
                    Supply Request
                </button>
                <button
                    className={`px-6 py-2 rounded-full ${
                        formType === 'reimbursement' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100'
                    }`}
                    onClick={() => setFormType('reimbursement')}
                >
                    Reimbursement
                </button>
            </div>

            {/* Main Content Area - Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Section - Takes up 2 columns on large screens */}
                <div className="lg:col-span-2">
                    {/* Supply Request Form */}
                    {formType === 'supply' && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <form onSubmit={handleSupplySubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={supplyForm.email}
                                        onChange={(e) => setSupplyForm({...supplyForm, email: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={supplyForm.name}
                                        onChange={(e) => setSupplyForm({...supplyForm, name: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Branch
                                    </label>
                                    <select
                                        value={supplyForm.branch}
                                        onChange={(e) => setSupplyForm({...supplyForm, branch: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Branch</option>
                                        <option value="Laguna">Laguna</option>
                                        <option value="Pampanga">Pampanga</option>
                                        <option value="Cebu">Cebu</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Request Type
                                    </label>
                                    <input
                                        type="text"
                                        value={supplyForm.requestType}
                                        onChange={(e) => setSupplyForm({...supplyForm, requestType: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={supplyForm.amount}
                                        onChange={(e) => setSupplyForm({...supplyForm, amount: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Items
                                    </label>
                                    <textarea
                                        value={supplyForm.items}
                                        onChange={(e) => setSupplyForm({...supplyForm, items: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={supplyForm.description}
                                        onChange={(e) => setSupplyForm({...supplyForm, description: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Reimbursement Form */}
                    {formType === 'reimbursement' && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <form onSubmit={handleReimbursementSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={reimbursementForm.email}
                                        onChange={(e) => setReimbursementForm({...reimbursementForm, email: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={reimbursementForm.name}
                                        onChange={(e) => setReimbursementForm({...reimbursementForm, name: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Branch
                                    </label>
                                    <select
                                        value={reimbursementForm.branch}
                                        onChange={(e) => setReimbursementForm({...reimbursementForm, branch: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Branch</option>
                                        <option value="Laguna">Laguna</option>
                                        <option value="Pampanga">Pampanga</option>
                                        <option value="Cebu">Cebu</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                    </label>
                                    <DatePicker
                                        selected={reimbursementForm.date}
                                        onChange={(date) => setReimbursementForm({...reimbursementForm, date})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        dateFormat="MMMM d, yyyy"
                                    />
                                </div>

                                <div className="flex space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Time From
                                        </label>
                                        <input
                                            type="time"
                                            value={reimbursementForm.timeFrom}
                                            onChange={(e) => setReimbursementForm({...reimbursementForm, timeFrom: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Time To
                                        </label>
                                        <input
                                            type="time"
                                            value={reimbursementForm.timeTo}
                                            onChange={(e) => setReimbursementForm({...reimbursementForm, timeTo: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Particular
                                    </label>
                                    <input
                                        type="text"
                                        value={reimbursementForm.particular}
                                        onChange={(e) => setReimbursementForm({...reimbursementForm, particular: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Breakdown
                                    </label>
                                    <textarea
                                        value={reimbursementForm.breakdown}
                                        onChange={(e) => setReimbursementForm({...reimbursementForm, breakdown: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Amount to be Reimbursed
                                    </label>
                                    <input
                                        type="number"
                                        value={reimbursementForm.totalAmount}
                                        onChange={(e) => setReimbursementForm({...reimbursementForm, totalAmount: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Receipt
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => setReimbursementForm({...reimbursementForm, receipt: e.target.files[0]})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        accept="image/*"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Submit Reimbursement
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Request Status Panel - Takes up 1 column on large screens */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Request Status</h2>
                    
                    {/* Status Cards */}
                    <div className="space-y-4">
                        {requests.map((request) => (
                            <div 
                                key={request.id}
                                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-medium">Request #{request.id}</h3>
                                        <p className="text-sm text-gray-500">{request.type}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        request.status === 'Approved' 
                                            ? 'bg-green-100 text-green-800'
                                            : request.status === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {request.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Submitted: {request.date}</span>
                                    <button 
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={() => {/* Handle view details */}}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-4">
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Pending</p>
                            <p className="text-lg font-semibold text-yellow-600">
                                {requests.filter(r => r.status === 'Pending').length}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Approved</p>
                            <p className="text-lg font-semibold text-green-600">
                                {requests.filter(r => r.status === 'Approved').length}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Rejected</p>
                            <p className="text-lg font-semibold text-red-600">
                                {requests.filter(r => r.status === 'Rejected').length}
                            </p>
                        </div>
                    </div>

                    {/* View All Button */}
                    <button 
                        className="mt-6 w-full bg-gray-50 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={() => {/* Handle view all */}}
                    >
                        View All Requests
                    </button>
                </div>
            </div>
        </div>
    );
} 