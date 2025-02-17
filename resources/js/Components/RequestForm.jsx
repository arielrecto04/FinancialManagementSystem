import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import RequestDetailsModal from '@/Components/RequestDetailsModal';

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
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <input
                                        type="text"
                                        value={data.department}
                                        onChange={e => setData('department', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    {errors?.department && <div className="text-red-500 text-sm mt-1">{errors.department}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                                    <textarea
                                        value={data.purpose}
                                        onChange={e => setData('purpose', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    {errors?.purpose && <div className="text-red-500 text-sm mt-1">{errors.purpose}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Needed</label>
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
                                {/* Department Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <input
                                        type="text"
                                        value={reimbursementData.department}
                                        onChange={e => setReimbursementData('department', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    {errors?.department && (
                                        <div className="text-red-500 text-sm mt-1">{errors.department}</div>
                                    )}
                                </div>

                                {/* Expense Date Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expense Date</label>
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

                                {/* Expense Type Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expense Type</label>
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

                                {/* Amount Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
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

                                {/* Description Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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

                                {/* Receipt Upload Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Receipt</label>
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

                                {/* Remarks Field */}
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