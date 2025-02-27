import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import RequestDetailsModal from '@/Components/RequestDetailsModal';
import axios from 'axios';

// Add this constant at the top of your file, outside the component
const departmentOptions = [
    { value: 'Development', label: 'Development' },
    { value: 'AppTech', label: 'AppTech' },
    { value: 'Human Resource', label: 'Human Resource' },
    { value: 'Marketing', label: 'Marketing' }
];

// Add these icons at the top of your component
const icons = {
    supply: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
    reimbursement: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    liquidation: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    pettyCash: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    // Field icons
    department: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    date: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    purpose: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
    ),
    amount: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    items: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
    )
};

export default function RequestForm({ auth, errors = {} }) {
    const [formType, setFormType] = useState('supply');
    const [items, setItems] = useState([{ name: '', quantity: '', unit: '', price: '' }]);
    
    // Supply Request Form State - Matching database fields
    const { data, setData, post, processing } = useForm({
        department: '',
        purpose: '',
        date_needed: '',
        items: items,
        total_amount: 0,
        remarks: '',
    });

    // Reimbursement Form State
    const { data: reimbursementData, setData: setReimbursementData, post: postReimbursement, processing: reimbursementProcessing } = useForm({
        department: '',
        expense_date: '',
        expense_type: '',
        amount: '',
        description: '',
        receipt: null,
        remarks: '',
    });

    // Sample request status data
    const [requests] = useState([
        { id: 28, status: 'Approved', date: '2024-03-20', type: 'Supply Request' },
        { id: 29, status: 'Pending', date: '2024-03-21', type: 'Reimbursement' },
        { id: 30, status: 'Rejected', date: '2024-03-22', type: 'Supply Request' }
    ]);

    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Update the liquidation form state
    const { data: liquidationData, setData: setLiquidationData, post: postLiquidation, processing: liquidationProcessing, reset: resetLiquidation } = useForm({
        date: new Date().toISOString().split('T')[0],
        particulars: '',
        items: [{ category: '', description: '', amount: '' }],
        total_amount: 0,
        cash_advance_amount: '',
        amount_to_refund: 0,
        amount_to_reimburse: 0,
    });

    // Update the petty cash state
    const [pettyCashData, setPettyCashData] = useState({
        date: '',
        dateNeeded: '',
        purpose: '',
        amount: '',
        items: [{ category: '', description: '', amount: '' }]  // Updated structure
    });

    // Update your tab rendering logic to include petty cash for admins
    const tabs = [
        { id: 'supply', label: 'Supply Request', icon: icons.supply },
        { id: 'reimbursement', label: 'Reimbursement', icon: icons.reimbursement },
        { id: 'liquidation', label: 'Liquidation', icon: icons.liquidation },
        ...(auth.user.role === 'admin' ? [
            { id: 'pettycash', label: 'Petty Cash Request', icon: icons.pettyCash }
        ] : [])
    ];

    // Add new item row
    const addItem = () => {
        const newItems = [...items, { name: '', quantity: '', unit: '', price: '' }];
        setItems(newItems);
        updateFormData(newItems);
    };

    // Remove item row
    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        updateFormData(newItems);
    };

    // Update item and calculate total
    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
        updateFormData(newItems);
    };

    // Update form data with new items and total
    const updateFormData = (newItems) => {
        const total = newItems.reduce((sum, item) => {
            return sum + (Number(item.quantity) * Number(item.price) || 0);
        }, 0);
        
        setData(data => ({
            ...data,
            items: newItems,
            total_amount: total
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate items before submission
        if (items.some(item => !item.name || !item.quantity || !item.unit || !item.price)) {
            alert('Please fill in all item fields');
            return;
        }

        // Submit the form
        post(route('request.supply.store'), {
            onSuccess: () => {
                // Reset form
                setItems([{ name: '', quantity: '', unit: '', price: '' }]);
                setData({
                    department: '',
                    purpose: '',
                    date_needed: '',
                    items: [],
                    total_amount: 0,
                    remarks: '',
                });
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    const handleReimbursementSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        for (let key in reimbursementData) {
            formData.append(key, reimbursementData[key]);
        }

        postReimbursement(route('request.reimbursement.store'), {
            onSuccess: () => {
                // Reset form
                setReimbursementData({
                    department: '',
                    expense_date: '',
                    expense_type: '',
                    amount: '',
                    description: '',
                    receipt: null,
                    remarks: '',
                });
            },
        });
    };

    // Update the handleLiquidationSubmit function
    const handleLiquidationSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting liquidation:', liquidationData);

        // Use axios directly to debug the request
        axios.post('/request/liquidation', liquidationData)
            .then(response => {
                console.log('Success:', response);
                resetLiquidation();
            })
            .catch(error => {
                console.error('Error:', error.response);
            });

        // Or use the Inertia form
        /*
        postLiquidation('/request/liquidation', {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Success!');
                resetLiquidation();
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
            }
        });
        */
    };

    // Add/Remove Liquidation Items
    const addLiquidationItem = () => {
        setLiquidationData(data => ({
            ...data,
            items: [...data.items, { category: '', description: '', amount: '' }]
        }));
    };

    const removeLiquidationItem = (index) => {
        setLiquidationData(data => ({
            ...data,
            items: data.items.filter((_, i) => i !== index)
        }));
    };

    // Update Liquidation Item
    const updateLiquidationItem = (index, field, value) => {
        const newItems = [...liquidationData.items];
        newItems[index][field] = value;
        
        // Calculate total amount
        const total = newItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const cashAdvance = Number(liquidationData.cash_advance_amount) || 0;
        
        setLiquidationData(data => ({
            ...data,
            items: newItems,
            total_amount: total,
            amount_to_refund: cashAdvance > total ? cashAdvance - total : 0,
            amount_to_reimburse: total > cashAdvance ? total - cashAdvance : 0
        }));
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
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`flex items-center justify-center px-4 py-3 rounded-lg transition-all w-full sm:w-auto ${
                                formType === tab.id 
                                    ? 'bg-blue-500 text-white shadow-lg' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                            onClick={() => setFormType(tab.id)}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {tab.icon}
                            </svg>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area - Improved grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Form Section - Takes up full width on mobile, 2 columns on large screens */}
                <div className="lg:col-span-2 order-2 lg:order-1">
                    {formType === 'supply' && (
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.department}
                                        Department
                                    </label>
                                    <select
                                        value={data.department}
                                        onChange={(e) => setData('department', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departmentOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors?.department && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.department}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.purpose}
                                        Purpose
                                    </label>
                                    <textarea
                                        value={data.purpose}
                                        onChange={e => setData('purpose', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    {errors?.purpose && <div className="text-red-500 text-sm mt-1">{errors.purpose}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.date}
                                        Date Needed
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date_needed}
                                        onChange={e => setData('date_needed', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    {errors?.date_needed && <div className="text-red-500 text-sm mt-1">{errors.date_needed}</div>}
                                </div>

                                {/* Items Section */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Items</label>
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            + Add Item
                                        </button>
                                    </div>
                                    
                                    {items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                                            <div className="col-span-4">
                                                <input
                                                    type="text"
                                                    placeholder="Item name"
                                                    value={item.name}
                                                    onChange={e => updateItem(index, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="number"
                                                    placeholder="Qty"
                                                    value={item.quantity}
                                                    onChange={e => updateItem(index, 'quantity', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    placeholder="Unit"
                                                    value={item.unit}
                                                    onChange={e => updateItem(index, 'unit', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="number"
                                                    placeholder="Price"
                                                    value={item.price}
                                                    onChange={e => updateItem(index, 'price', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                {items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {errors?.items && (
                                        <div className="text-red-500 text-sm mt-1">{errors.items}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                    <textarea
                                        value={data.remarks}
                                        onChange={e => setData('remarks', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Submit Supply Request
                                </button>
                            </form>
                        </div>
                    )}

                    {formType === 'reimbursement' && (
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <form onSubmit={handleReimbursementSubmit} className="space-y-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.department}
                                        Department
                                    </label>
                                    <select
                                        value={reimbursementData.department}
                                        onChange={(e) => setReimbursementData({
                                            ...reimbursementData,
                                            department: e.target.value
                                        })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departmentOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.department && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.department}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.date}
                                        Expense Date
                                    </label>
                                    <input
                                        type="date"
                                        value={reimbursementData.expense_date}
                                        onChange={e => setReimbursementData('expense_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    {errors?.expense_date && (
                                        <div className="text-red-500 text-sm mt-1">{errors.expense_date}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.expenseType}
                                        Expense Type
                                    </label>
                                    <select
                                        value={reimbursementData.expense_type}
                                        onChange={e => setReimbursementData('expense_type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    >
                                        <option value="">Select Expense Type</option>
                                        <option value="Transportation">Transportation</option>
                                        <option value="Meals">Meals</option>
                                        <option value="Office Supplies">Office Supplies</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors?.expense_type && (
                                        <div className="text-red-500 text-sm mt-1">{errors.expense_type}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.amount}
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={reimbursementData.amount}
                                        onChange={e => setReimbursementData('amount', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    {errors?.amount && (
                                        <div className="text-red-500 text-sm mt-1">{errors.amount}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.description}
                                        Description
                                    </label>
                                    <textarea
                                        value={reimbursementData.description}
                                        onChange={e => setReimbursementData('description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    {errors?.description && (
                                        <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.receipt}
                                        Receipt
                                    </label>
                                    <input
                                        type="file"
                                        onChange={e => setReimbursementData('receipt', e.target.files[0])}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        required
                                    />
                                    {errors?.receipt && (
                                        <div className="text-red-500 text-sm mt-1">{errors.receipt}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                    <textarea
                                        value={reimbursementData.remarks}
                                        onChange={e => setReimbursementData('remarks', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={reimbursementProcessing}
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Submit Reimbursement Request
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Liquidation Form */}
                    {formType === 'liquidation' && (
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <form onSubmit={handleLiquidationSubmit} className="space-y-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.department}
                                        Department
                                    </label>
                                    <select
                                        value={liquidationData.department}
                                        onChange={(e) => setLiquidationData({
                                            ...liquidationData,
                                            department: e.target.value
                                        })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departmentOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.department && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.department}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.date}
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={liquidationData.date}
                                        onChange={(e) => setLiquidationData({
                                            ...liquidationData,
                                            date: e.target.value
                                        })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.date && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.date}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.particulars}
                                        Particulars
                                    </label>
                                    <textarea
                                        value={liquidationData.particulars}
                                        onChange={(e) => setLiquidationData({
                                            ...liquidationData,
                                            particulars: e.target.value
                                        })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        required
                                    />
                                    {errors.particulars && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.particulars}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.cashAdvanceAmount}
                                        Cash Advance Amount
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={liquidationData.cash_advance_amount}
                                        onChange={(e) => {
                                            const cashAdvance = parseFloat(e.target.value) || 0;
                                            const totalAmount = liquidationData.total_amount;
                                            setLiquidationData({
                                                ...liquidationData,
                                                cash_advance_amount: cashAdvance,
                                                amount_to_refund: Math.max(0, cashAdvance - totalAmount),
                                                amount_to_reimburse: Math.max(0, totalAmount - cashAdvance)
                                            });
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.cash_advance_amount && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.cash_advance_amount}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.items}
                                        Items
                                    </label>
                                    {liquidationData.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-md">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Category"
                                                    value={item.category}
                                                    onChange={(e) => updateLiquidationItem(index, 'category', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Description"
                                                    value={item.description}
                                                    onChange={(e) => updateLiquidationItem(index, 'description', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="Amount"
                                                    value={item.amount}
                                                    onChange={(e) => updateLiquidationItem(index, 'amount', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addLiquidationItem}
                                        className="mt-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        + Add Item
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                                        <input
                                            type="number"
                                            value={liquidationData.total_amount}
                                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Amount to Refund</label>
                                        <input
                                            type="number"
                                            value={liquidationData.amount_to_refund}
                                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Amount to Reimburse</label>
                                        <input
                                            type="number"
                                            value={liquidationData.amount_to_reimburse}
                                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        disabled={liquidationProcessing}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        {liquidationProcessing ? 'Processing...' : 'Submit Liquidation'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Petty Cash Form */}
                    {formType === 'pettycash' && auth.user.role === 'admin' && (
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <form onSubmit={handlePettyCashSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                            {icons.date}
                                            Date Requested
                                        </label>
                                        <input
                                            type="date"
                                            value={pettyCashData.date}
                                            onChange={(e) => setPettyCashData({
                                                ...pettyCashData,
                                                date: e.target.value
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                            {icons.date}
                                            Date Needed
                                        </label>
                                        <input
                                            type="date"
                                            value={pettyCashData.dateNeeded}
                                            onChange={(e) => setPettyCashData({
                                                ...pettyCashData,
                                                dateNeeded: e.target.value
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.purpose}
                                        Purpose
                                    </label>
                                    <textarea
                                        value={pettyCashData.purpose}
                                        onChange={(e) => setPettyCashData({
                                            ...pettyCashData,
                                            purpose: e.target.value
                                        })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.amount}
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={pettyCashData.amount}
                                        onChange={(e) => setPettyCashData({
                                            ...pettyCashData,
                                            amount: e.target.value
                                        })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Items Section */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.items}
                                        Items
                                    </label>
                                    {pettyCashData.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-4 mb-2">
                                            <div className="col-span-3">
                                                <input
                                                    type="text"
                                                    placeholder="Category"
                                                    value={item.category}
                                                    onChange={(e) => handlePettyCashItemChange(index, 'category', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-6">
                                                <input
                                                    type="text"
                                                    placeholder="Description"
                                                    value={item.description}
                                                    onChange={(e) => handlePettyCashItemChange(index, 'description', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="Amount"
                                                    value={item.amount}
                                                    onChange={(e) => handlePettyCashItemChange(index, 'amount', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-1 flex items-center">
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePettyCashItem(index)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddPettyCashItem}
                                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Add Item
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {icons.amount}
                                        Total Amount
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={pettyCashData.amount}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                                        readOnly
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Status Section - Takes up full width on mobile, 1 column on large screens */}
                <div className="lg:col-span-1 order-1 lg:order-2">
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                        <h3 className="text-lg font-medium mb-4">Recent Requests</h3>
                        <div className="space-y-3">
                            {requests.map(request => (
                                <div 
                                    key={request.id} 
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                                    onClick={() => {
                                        setSelectedRequest(request);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <div>
                                        <p className="font-medium">Request #{request.id}</p>
                                        <p className="text-sm text-gray-500">{request.type}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {request.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <RequestDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                request={selectedRequest}
            />
        </div>
    );
}

// Update the handlers for the new structure
const handlePettyCashItemChange = (index, field, value) => {
    const newItems = [...pettyCashData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate new total
    const total = newItems.reduce((sum, item) => 
        sum + (parseFloat(item.amount) || 0), 0
    );

    setPettyCashData(prev => ({
        ...prev,
        items: newItems,
        amount: total.toFixed(2)
    }));
};

const handleAddPettyCashItem = () => {
    setPettyCashData(prev => ({
        ...prev,
        items: [...prev.items, { category: '', description: '', amount: '' }]
    }));
};

const handleRemovePettyCashItem = (index) => {
    setPettyCashData(prev => {
        const newItems = prev.items.filter((_, i) => i !== index);
        const total = newItems.reduce((sum, item) => 
            sum + (parseFloat(item.amount) || 0), 0
        );
        return {
            ...prev,
            items: newItems,
            amount: total.toFixed(2)
        };
    });
};

const handlePettyCashSubmit = (e) => {
    e.preventDefault();
    router.post(route('petty-cash.store'), pettyCashData);
}; 