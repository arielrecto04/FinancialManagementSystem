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
            {/* Form Type Toggle with Icons */}
            <div className="mb-6">
                <div className="flex space-x-4">
                    <button
                        className={`flex items-center px-6 py-3 rounded-lg transition-all ${
                            formType === 'supply' 
                                ? 'bg-blue-500 text-white shadow-lg' 
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => setFormType('supply')}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Supply Request
                    </button>
                    <button
                        className={`flex items-center px-6 py-3 rounded-lg transition-all ${
                            formType === 'reimbursement' 
                                ? 'bg-blue-500 text-white shadow-lg' 
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => setFormType('reimbursement')}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Reimbursement
                    </button>
                </div>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={supplyForm.email}
                                        onChange={(e) => setSupplyForm({...supplyForm, email: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={supplyForm.name}
                                        onChange={(e) => setSupplyForm({...supplyForm, name: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Branch
                                    </label>
                                    <select
                                        value={supplyForm.branch}
                                        onChange={(e) => setSupplyForm({...supplyForm, branch: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Branch</option>
                                        <option value="Parañaque">Parañaque</option>
                                        <option value="Laguna">Laguna</option>
                                        <option value="Pampanga">Pampanga</option>
                                        <option value="Cebu">Cebu</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={supplyForm.amount}
                                        onChange={(e) => setSupplyForm({...supplyForm, amount: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter amount"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        Items
                                    </label>
                                    <textarea
                                        value={supplyForm.items}
                                        onChange={(e) => setSupplyForm({...supplyForm, items: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                        placeholder="List the items needed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Description
                                    </label>
                                    <textarea
                                        value={supplyForm.description}
                                        onChange={(e) => setSupplyForm({...supplyForm, description: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                        placeholder="Provide additional details"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Submit Supply Request
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Branch
                                    </label>
                                    <select
                                        value={reimbursementForm.branch}
                                        onChange={(e) => setReimbursementForm({...reimbursementForm, branch: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Branch</option>
                                        <option value="Parañaque">Parañaque</option>
                                        <option value="Laguna">Laguna</option>
                                        <option value="Pampanga">Pampanga</option>
                                        <option value="Cebu">Cebu</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Total Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={reimbursementForm.totalAmount}
                                        onChange={(e) => setReimbursementForm({...reimbursementForm, totalAmount: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        Receipt
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => setReimbursementForm({...reimbursementForm, receipt: e.target.files[0]})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
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