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

    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    const handleSupplySubmit = (e) => {
        e.preventDefault();
        // Handle supply form submission
    };

    const handleReimbursementSubmit = (e) => {
        e.preventDefault();
        // Handle reimbursement form submission
    };

    // Component for the date range and period selector
    const DateRangeSelector = () => {
        return (
            <div className="w-full">
                {/* Date Range Header */}
                <h3 className="text-lg font-medium mb-4">Select Date Range</h3>
                
                {/* Date Range Inputs - Responsive Layout */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">From:</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value="2025-01-12"
                            />
                            <svg className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">To:</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value="2025-01-12"
                            />
                            <svg className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Period Selector - Desktop View */}
                <div className="hidden sm:flex space-x-2">
                    <PeriodButton icon="clock" label="Daily" />
                    <PeriodButton icon="calendar" label="Weekly" />
                    <PeriodButton icon="chart-bar" label="Monthly" />
                    <PeriodButton icon="chart-pie" label="Annual" active />
                </div>

                {/* Period Selector - Mobile View */}
                <div className="sm:hidden">
                    <button
                        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white"
                    >
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            Select Period
                        </span>
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Mobile Dropdown Menu */}
                    {isFilterMenuOpen && (
                        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                            <div className="py-1">
                                <MobileMenuItem icon="clock" label="Daily" />
                                <MobileMenuItem icon="calendar" label="Weekly" />
                                <MobileMenuItem icon="chart-bar" label="Monthly" />
                                <MobileMenuItem icon="chart-pie" label="Annual" active />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Helper components for buttons
    const PeriodButton = ({ icon, label, active }) => (
        <button
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                active 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
            <PeriodIcon icon={icon} />
            <span className="ml-2">{label}</span>
        </button>
    );

    const MobileMenuItem = ({ icon, label, active }) => (
        <button
            className={`w-full flex items-center px-4 py-2 text-left ${
                active 
                    ? 'bg-blue-50 text-blue-500' 
                    : 'text-gray-700 hover:bg-gray-50'
            }`}
        >
            <PeriodIcon icon={icon} />
            <span className="ml-2">{label}</span>
        </button>
    );

    // Helper component for icons
    const PeriodIcon = ({ icon }) => {
        switch (icon) {
            case 'clock':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'calendar':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'chart-bar':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                );
            case 'chart-pie':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-8">
            {/* Form Type Toggle - More responsive */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
                    <button
                        className={`flex items-center justify-center px-4 py-3 rounded-lg transition-all w-full sm:w-auto ${
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
                        className={`flex items-center justify-center px-4 py-3 rounded-lg transition-all w-full sm:w-auto ${
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

            {/* Main Content Area - Improved grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Form Section - Takes up full width on mobile, 2 columns on large screens */}
                <div className="lg:col-span-2 order-2 lg:order-1">
                    {formType === 'supply' && (
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <form onSubmit={handleSupplySubmit} className="space-y-4">
                                {/* Two column layout for form fields on larger screens */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Full width fields */}
                                <div className="space-y-4">
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            rows={3}
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            rows={3}
                                        />
                                    </div>
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

                    {formType === 'reimbursement' && (
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <form onSubmit={handleReimbursementSubmit} className="space-y-4">
                                {/* Two column layout for form fields on larger screens */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        />
                                    </div>
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
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

                {/* Status Section - Takes up full width on mobile, 1 column on large screens */}
                <div className="lg:col-span-1 order-1 lg:order-2">
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Recent Requests
                        </h3>

                        {/* Responsive status cards */}
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                            {requests.map(request => (
                                <div key={request.id} 
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                                >
                                    <div>
                                        <h4 className="font-medium">Request #{request.id}</h4>
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
                            ))}
                        </div>

                        {/* Quick Stats - Responsive grid */}
                        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4 border-t pt-4">
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

                        {/* Responsive button */}
                        <button 
                            className="mt-6 w-full text-sm bg-gray-50 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            View All Requests
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 