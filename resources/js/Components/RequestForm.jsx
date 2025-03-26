import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import RequestDetailsModal from '@/Components/RequestDetailsModal';
import FlashMessage from '@/Components/FlashMessage';
import axios from 'axios';
import Swal from 'sweetalert2';

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
    ),
    hrExpenses: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    operatingExpenses: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    expenseType: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

export default function RequestForm({ auth, errors = {}, type }) {
    const [formType, setFormType] = useState(type || 'supply');
    const [items, setItems] = useState([{ name: '', quantity: '', price: '' }]);
    const [processing, setProcessing] = useState(false);
    
    // Supply Request Form State
    const { data, setData, post } = useForm({
        department: '',
        purpose: '',
        date_needed: '',
        items: items,
        total_amount: 0,
        remarks: '',
    });

    // Reimbursement Form State
    const { data: reimbursementData, setData: setReimbursementData, post: postReimbursement } = useForm({
        department: '',
        expense_date: '',
        expense_type: '',
        amount: '',
        description: '',
        receipt: null,
        remarks: '',
    });

    // Petty Cash Form State
    const [pettyCashData, setPettyCashData] = useState({
        date: new Date().toISOString().split('T')[0],
        dateNeeded: new Date().toISOString().split('T')[0],
        purpose: '',
        amount: '',
        category: '',
        description: '',
        department: auth?.user?.department || ''
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
    const [flashMessage, setFlashMessage] = useState('');

    // Add this near the top of your component with other state declarations
    const [liquidationProcessing, setLiquidationProcessing] = useState(false);

    // Update the liquidation form state
    const [liquidationData, setLiquidationData] = useState({
        department: auth?.user?.department || '',
        date: new Date().toISOString().split('T')[0],
        expense_type: '',
        particulars: '',
        items: [{ category: '', description: '', amount: '' }],
        cash_advance_amount: '',
        total_amount: '0.00',
        amount_to_refund: '0.00',
        amount_to_reimburse: '0.00'
    });

    // Add this near the top with other state declarations
    const [reimbursementProcessing, setReimbursementProcessing] = useState(false);

    // Update the handleReimbursementSubmit function
    const handleReimbursementSubmit = (e) => {
        e.preventDefault();
        setReimbursementProcessing(true);

        try {
            const formData = new FormData();
            for (let key in reimbursementData) {
                formData.append(key, reimbursementData[key]);
            }
            formData.append('request_number', `RR-${new Date().getTime()}`);

            router.post(route('request.reimbursement.store'), formData, {
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Your reimbursement request has been submitted successfully.',
                        showConfirmButton: false,
                        timer: 2000,
                        customClass: {
                            popup: 'animated fadeInDown'
                        }
                    });

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
                    setReimbursementProcessing(false);
                },
                onError: (errors) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'There was an error submitting your reimbursement request. Please check all fields and try again.',
                        confirmButtonColor: '#3085d6',
                        customClass: {
                            popup: 'animated fadeInDown'
                        }
                    });
                    console.error('Reimbursement submission errors:', errors);
                    setReimbursementProcessing(false);
                }
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: 'Something went wrong with your reimbursement request. Please try again later.',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'animated fadeInDown'
                }
            });
            console.error('Error submitting reimbursement request:', error);
            setReimbursementProcessing(false);
        }
    };

    // Update your tab rendering logic to include all forms for superadmin
    const tabs = [
        { id: 'supply', label: 'Supply Request', icon: icons.supply },
        { id: 'reimbursement', label: 'Reimbursement', icon: icons.reimbursement },
        { id: 'liquidation', label: 'Liquidation', icon: icons.liquidation },
        ...(auth.user.role === 'admin' || auth.user.role === 'superadmin' ? [
            { id: 'pettycash', label: 'Petty Cash Request', icon: icons.pettyCash },
            { id: 'hrExpenses', label: 'HR Expenses Request', icon: icons.hrExpenses },
            { id: 'operatingExpenses', label: 'Operating Expenses Request', icon: icons.operatingExpenses }
        ] : []),
        ...(auth.user.role === 'hr' ? [
            { id: 'hrExpenses', label: 'HR Expenses Request', icon: icons.hrExpenses }
        ] : [])
    ];

    // Add new item row
    const addItem = () => {
        const newItems = [...items, { name: '', quantity: '', price: '' }];
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

    // Function to show flash message
    const showFlashMessage = (message, type = 'success') => {
        if (window.Flash) {
            window.Flash(message, type);
        } else {
            alert(message);
        }
    };

    // Update the handleSubmit function for supply requests
    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        // Validate items before submission - removed unit from validation
        if (items.some(item => !item.name || !item.quantity || !item.price)) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Form',
                text: 'Please fill in all required item fields',
                confirmButtonColor: '#3085d6'
            });
            setProcessing(false);
            return;
        }

        // Generate request number with SR prefix and timestamp
        const timestamp = new Date().getTime();
        const requestNumber = `SR-${timestamp}`;

        try {
            // Submit the form
            router.post(route('request.supply.store'), {
                ...data,
                request_number: requestNumber,
                items_json: JSON.stringify(items)
            }, {
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Supply request submitted successfully!',
                        showConfirmButton: false,
                        timer: 2000,
                        customClass: {
                            popup: 'animated fadeInDown'
                        }
                    });

                    // Reset form
                    setItems([{ name: '', quantity: '', price: '' }]);
                    setData({
                        department: '',
                        purpose: '',
                        date_needed: '',
                        items: [],
                        total_amount: 0,
                        remarks: '',
                    });
                    setProcessing(false);
                },
                onError: (errors) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'There was an error submitting your request. Please check the form for errors.',
                        confirmButtonColor: '#3085d6',
                        customClass: {
                            popup: 'animated fadeInDown'
                        }
                    });
                    console.error('Supply request errors:', errors);
                    setProcessing(false);
                }
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: 'Something went wrong with your supply request. Please try again later.',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'animated fadeInDown'
                }
            });
            console.error('Error submitting supply request:', error);
            setProcessing(false);
        }
    };

    // Update the handleLiquidationSubmit function
    const handleLiquidationSubmit = (e) => {
        e.preventDefault();
        setLiquidationProcessing(true);

        try {
            router.post(route('request.liquidation.store'), liquidationData, {
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Your liquidation request has been submitted successfully.',
                        showConfirmButton: false,
                        timer: 2000,
                        customClass: {
                            popup: 'animated fadeInDown'
                        }
                    });

                    // Reset form
                    setLiquidationData({
                        department: auth?.user?.department || '',
                        date: new Date().toISOString().split('T')[0],
                        expense_type: '',
                        particulars: '',
                        items: [{ category: '', description: '', amount: '' }],
                        cash_advance_amount: '',
                        total_amount: '0.00',
                        amount_to_refund: '0.00',
                        amount_to_reimburse: '0.00'
                    });
                    setLiquidationProcessing(false);
                },
                onError: (errors) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'There was an error submitting your liquidation request. Please check all fields and try again.',
                        confirmButtonColor: '#3085d6',
                        customClass: {
                            popup: 'animated fadeInDown'
                        }
                    });
                    console.error('Validation errors:', errors);
                    setLiquidationProcessing(false);
                }
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: 'Something went wrong with your liquidation request. Please try again later.',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'animated fadeInDown'
                }
            });
            console.error('Error submitting liquidation request:', error);
            setLiquidationProcessing(false);
        }
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

    // HR Expenses Request form state
    const { data: hrExpensesData, setData: setHrExpensesData, post: postHrExpenses, processing: hrExpensesProcessing } = useForm({
        date_of_request: '',
        expenses_category: '',
        description_of_expenses: '',
        breakdown_of_expense: '',
        total_amount_requested: '',
        expected_payment_date: '',
        additional_comment: '',
    });

    // HR Expenses Request form submission handler
    const handleHrExpensesSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const formData = {
                date_of_request: hrExpensesData.date_of_request,
                expenses_category: hrExpensesData.expenses_category,
                description_of_expenses: hrExpensesData.description_of_expenses,
                breakdown_of_expense: hrExpensesData.breakdown_of_expense,
                total_amount_requested: hrExpensesData.total_amount_requested,
                expected_payment_date: hrExpensesData.expected_payment_date,
                additional_comment: hrExpensesData.additional_comment
            };

            // Use the correct route name from web.php
            router.post(route('request.hrExpenses.store'), formData, {
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Your HR expense request has been submitted successfully.',
                        showConfirmButton: false,
                        timer: 2000,
                        customClass: {
                            popup: 'animated fadeInDown'
                        }
                    });

                    // Reset form
                    setHrExpensesData({
                        date_of_request: new Date().toISOString().split('T')[0],
                        expenses_category: '',
                        description_of_expenses: '',
                        breakdown_of_expense: '',
                        total_amount_requested: '',
                        expected_payment_date: '',
                        additional_comment: ''
                    });
                    setProcessing(false);
                },
                onError: (errors) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'There was an error submitting your HR expense request. Please check all fields and try again.',
                        confirmButtonColor: '#3085d6',
                        customClass: {
                            popup: 'animated fadeInDown'
                        }
                    });
                    console.error('Validation errors:', errors);
                    setProcessing(false);
                }
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: 'Something went wrong with your HR expense request. Please try again later.',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'animated fadeInDown'
                }
            });
            console.error('Error submitting HR expense request:', error);
            setProcessing(false);
        }
    };

    // Add Operating Expenses Request form state
    const { data: operatingExpensesData, setData: setOperatingExpensesData, post: postOperatingExpenses, processing: operatingExpensesProcessing } = useForm({
        date_of_request: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        expense_category: '',
        description: '',
        breakdown_of_expense: '',
        total_amount: '',
        expected_payment_date: '',
        additional_comment: '',
    });

    // Operating Expenses Request form submission handler
    const handleOperatingExpensesSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const formData = {
                date_of_request: operatingExpensesData.date_of_request,
                expense_category: operatingExpensesData.expense_category,
                description: operatingExpensesData.description,
                breakdown_of_expense: operatingExpensesData.breakdown_of_expense,
                total_amount: operatingExpensesData.total_amount,
                expected_payment_date: operatingExpensesData.expected_payment_date,
                additional_comment: operatingExpensesData.additional_comment
            };

            // Use Inertia post with the correct route name
            router.post(route('request.operatingExpenses.store'), formData, {
                onSuccess: () => {
                    // Show success message with Swal
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Your operating expense request has been submitted successfully.',
                        showConfirmButton: false,
                        timer: 2000,
                        customClass: {
                            popup: 'animated fadeInDown'
                        }
                    });

                    // Reset form
                    setOperatingExpensesData({
                        date_of_request: new Date().toISOString().split('T')[0],
                        expense_category: '',
                        description: '',
                        breakdown_of_expense: '',
                        total_amount: '',
                        expected_payment_date: '',
                        additional_comment: ''
                    });
                    setProcessing(false);
                },
                onError: (errors) => {
                    // Show error message with Swal
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'There was an error submitting your operating expense request. Please check all fields and try again.',
                        confirmButtonColor: '#3085d6',
                        customClass: {
                            popup: 'animated fadeInDown'
                        }
                    });
                    console.error('Operating Expenses submission errors:', errors);
                    setProcessing(false);
                }
            });

        } catch (error) {
            // Show error message with Swal for unexpected errors
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: 'Something went wrong with your operating expense request. Please try again later.',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'animated fadeInDown'
                }
            });
            console.error('Error submitting operating expense request:', error);
            setProcessing(false);
        }
    };

    // Petty Cash Submit Handler
    const handlePettyCashSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const formData = {
                date: pettyCashData.date,
                dateNeeded: pettyCashData.dateNeeded,
                purpose: pettyCashData.purpose,
                amount: pettyCashData.amount,
                category: pettyCashData.category,
                description: pettyCashData.description,
                department: pettyCashData.department || auth.user.department
            };

            // Use Inertia post
            router.post(route('petty-cash.store'), formData, {
                onSuccess: () => {
                    // Show success message with Swal
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Your petty cash request has been submitted successfully.',
                        showConfirmButton: false,
                        timer: 2000,
                        customClass: {
                            popup: 'animated fadeInDown'
                        }
                    });

                    // Reset form
                    setPettyCashData({
                        date: new Date().toISOString().split('T')[0],
                        dateNeeded: new Date().toISOString().split('T')[0],
                        purpose: '',
                        amount: '',
                        category: '',
                        description: '',
                        department: auth?.user?.department || ''
                    });
                    setProcessing(false);
                },
                onError: (errors) => {
                    // Show error message with Swal
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'There was an error submitting your request. Please check all fields and try again.',
                        confirmButtonColor: '#3085d6',
                        customClass: {
                            popup: 'animated fadeInDown'
                        }
                    });
                    console.error('Validation errors:', errors);
                    setProcessing(false);
                }
            });

        } catch (error) {
            // Show error message with Swal for unexpected errors
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: 'Something went wrong. Please try again later.',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'animated fadeInDown'
                }
            });
            console.error('Error submitting petty cash request:', error);
            setProcessing(false);
        }
    };

    return (
        <div className="py-12">
            {flashMessage && <FlashMessage message={flashMessage} />}
            
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
                                            <div className="col-span-4">
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
                                    disabled={processing}
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
                                {/* Department Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.department}
                                        Department
                                    </label>
                                    <select
                                        value={liquidationData.department}
                                        onChange={(e) => setLiquidationData(prevData => ({
                                            ...prevData,
                                            department: e.target.value
                                        }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departmentOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Add Expense Type Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.expenseType}
                                        Expense Type
                                    </label>
                                    <select
                                        value={liquidationData.expense_type}
                                        onChange={(e) => setLiquidationData(prevData => ({
                                            ...prevData,
                                            expense_type: e.target.value
                                        }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Expense Type</option>
                                        <option value="Transportation">Transportation</option>
                                        <option value="Meals">Meals</option>
                                        <option value="Office Supplies">Office Supplies</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Training">Training</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.expense_type && (
                                        <p className="mt-1 text-sm text-red-600" role="alert">
                                            {errors.expense_type}
                                        </p>
                                    )}
                                </div>

                                {/* Date Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.date}
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={liquidationData.date || ''}
                                        onChange={(e) => setLiquidationData(prevData => ({
                                            ...prevData,
                                            date: e.target.value
                                        }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.date && (
                                        <p className="mt-1 text-sm text-red-600" role="alert">
                                            {errors.date}
                                        </p>
                                    )}
                                </div>

                                {/* Particulars Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.particulars}
                                        Particulars
                                    </label>
                                    <textarea
                                        value={liquidationData.particulars || ''}
                                        onChange={(e) => setLiquidationData(prevData => ({
                                            ...prevData,
                                            particulars: e.target.value
                                        }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        required
                                    />
                                    {errors.particulars && (
                                        <p className="mt-1 text-sm text-red-600" role="alert">
                                            {errors.particulars}
                                        </p>
                                    )}
                                </div>

                                {/* Cash Advance Amount Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.cashAdvanceAmount}
                                        Cash Advance Amount
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={liquidationData.cash_advance_amount || ''}
                                        onChange={(e) => {
                                            const cashAdvance = parseFloat(e.target.value) || 0;
                                            const totalAmount = parseFloat(liquidationData.total_amount) || 0;
                                            
                                            setLiquidationData(prevData => ({
                                                ...prevData,
                                                cash_advance_amount: cashAdvance,
                                                amount_to_refund: Math.max(0, cashAdvance - totalAmount).toFixed(2),
                                                amount_to_reimburse: Math.max(0, totalAmount - cashAdvance).toFixed(2)
                                            }));
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.cash_advance_amount && (
                                        <p className="mt-1 text-sm text-red-600" role="alert">
                                            {errors.cash_advance_amount}
                                        </p>
                                    )}
                                </div>

                                {/* Items Section */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                            {icons.items}
                                            Items
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => addLiquidationItem()}
                                            className="text-sm text-blue-600 hover:text-blue-700"
                                        >
                                            + Add Item
                                        </button>
                                    </div>
                                    
                                    {liquidationData.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-md">
                                            <div className="col-span-1">
                                                <input
                                                    type="text"
                                                    placeholder="Category"
                                                    value={item.category || ''}
                                                    onChange={(e) => updateLiquidationItem(index, 'category', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    placeholder="Description"
                                                    value={item.description || ''}
                                                    onChange={(e) => updateLiquidationItem(index, 'description', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-1 flex gap-2">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="Amount"
                                                    value={item.amount || ''}
                                                    onChange={(e) => updateLiquidationItem(index, 'amount', e.target.value)}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLiquidationItem(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary Section */}
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                                        <input
                                            type="number"
                                            value={parseFloat(liquidationData.total_amount || 0).toFixed(2)}
                                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Amount to Refund</label>
                                        <input
                                            type="number"
                                            value={parseFloat(liquidationData.amount_to_refund || 0).toFixed(2)}
                                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Amount to Reimburse</label>
                                        <input
                                            type="number"
                                            value={parseFloat(liquidationData.amount_to_reimburse || 0).toFixed(2)}
                                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        disabled={liquidationProcessing}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {liquidationProcessing ? 'Processing...' : 'Submit Liquidation'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Petty Cash Form */}
                    {formType === 'pettycash' && (auth.user.role === 'admin' || auth.user.role === 'superadmin') && (
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <form onSubmit={handlePettyCashSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                            {icons.date}
                                            Date Requested
                                        </label>
                                        <input
                                            type="date"
                                            value={pettyCashData.date}
                                            onChange={(e) => setPettyCashData(prev => ({ ...prev, date: e.target.value }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                            {icons.date}
                                            Date Needed
                                        </label>
                                        <input
                                            type="date"
                                            value={pettyCashData.dateNeeded}
                                            onChange={(e) => setPettyCashData(prev => ({ ...prev, dateNeeded: e.target.value }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.department}
                                        Department
                                    </label>
                                    <select
                                        value={pettyCashData.department}
                                        onChange={(e) => setPettyCashData(prev => ({ ...prev, department: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Executive Assistant">Executive Assistant</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.purpose}
                                        Purpose
                                    </label>
                                    <textarea
                                        value={pettyCashData.purpose}
                                        onChange={(e) => setPettyCashData(prev => ({ ...prev, purpose: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.amount}
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={pettyCashData.amount}
                                        onChange={(e) => setPettyCashData(prev => ({ ...prev, amount: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.category}
                                        Category
                                    </label>
                                    <select
                                        value={pettyCashData.category}
                                        onChange={(e) => setPettyCashData(prev => ({ ...prev, category: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Office Supplies">Office Supplies</option>
                                        <option value="Transportation">Transportation</option>
                                        <option value="Meals">Meals</option>
                                        <option value="Miscellaneous">Miscellaneous</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.description}
                                        Description
                                    </label>
                                    <textarea
                                        value={pettyCashData.description}
                                        onChange={(e) => setPettyCashData(prev => ({ ...prev, description: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
                                    >
                                        {icons.pettyCash}
                                        {processing ? 'Submitting...' : 'Submit Petty Cash Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* HR Expenses Request Form */}
                    {formType === 'hrExpenses' && (
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <form onSubmit={handleHrExpensesSubmit} className="space-y-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.date}
                                        Date of Request
                                    </label>
                                    <input
                                        type="date"
                                        value={hrExpensesData.date_of_request}
                                        onChange={(e) => setHrExpensesData('date_of_request', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                        {errors?.date_of_request && (
                                            <div className="text-red-500 text-sm mt-1">{errors.date_of_request}</div>
                                        )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.hrExpenses}
                                        Expenses Category
                                    </label>
                                    <select
                                        value={hrExpensesData.expenses_category}
                                        onChange={(e) => setHrExpensesData('expenses_category', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Salary">Salary</option>
                                        <option value="Benefits">Benefits</option>
                                        <option value="Recruitment">Recruitment</option>
                                        <option value="Training">Training</option>
                                        <option value="Employee Engagement">Employee Engagement</option>
                                        <option value="Intern Allowance">Intern Allowance</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.hrExpenses}
                                        Description of Expenses
                                    </label>
                                    <textarea
                                        value={hrExpensesData.description_of_expenses}
                                        onChange={(e) => setHrExpensesData('description_of_expenses', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.hrExpenses}
                                        Breakdown of Expense
                                    </label>
                                    <textarea
                                        value={hrExpensesData.breakdown_of_expense}
                                        onChange={(e) => setHrExpensesData('breakdown_of_expense', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        placeholder="Please provide a detailed breakdown of the expense (e.g., item costs, quantities, etc.)"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.amount}
                                        Total Amount Requested
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={hrExpensesData.total_amount_requested}
                                        onChange={(e) => setHrExpensesData('total_amount_requested', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.date}
                                        Expected Payment Date
                                    </label>
                                    <input
                                        type="date"
                                        value={hrExpensesData.expected_payment_date}
                                        onChange={(e) => setHrExpensesData('expected_payment_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.hrExpenses}
                                        Additional Comment (if any)
                                    </label>
                                    <textarea
                                        value={hrExpensesData.additional_comment}
                                        onChange={(e) => setHrExpensesData('additional_comment', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                    />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <button 
                                        type="submit" 
                                        disabled={hrExpensesProcessing}
                                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        Submit HR Expenses Request
                                    </button>
                                    
                                    <button 
                                        type="button" 
                                        onClick={() => console.log('Current form data:', hrExpensesData, 'Errors:', errors)}
                                        className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                    >
                                        Debug Form Data
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Operating Expenses Request Form */}
                    {formType === 'operatingExpenses' && (
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <form onSubmit={handleOperatingExpensesSubmit} className="space-y-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.date}
                                        Date of Request
                                    </label>
                                    <input
                                        type="date"
                                        value={operatingExpensesData.date_of_request}
                                        onChange={(e) => setOperatingExpensesData('date_of_request', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                        {errors?.date_of_request && (
                                            <div className="text-red-500 text-sm mt-1">{errors.date_of_request}</div>
                                        )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.operatingExpenses}
                                        Expense Category
                                    </label>
                                    <select
                                        value={operatingExpensesData.expense_category}
                                        onChange={(e) => setOperatingExpensesData('expense_category', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Office Supplies">Office Supplies</option>
                                        <option value="Software">Software</option>
                                        <option value="Service">Service</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Assets">Assets</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.operatingExpenses}
                                        Description
                                    </label>
                                    <textarea
                                        value={operatingExpensesData.description}
                                        onChange={(e) => setOperatingExpensesData('description', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.operatingExpenses}
                                        Breakdown of Expense
                                    </label>
                                    <textarea
                                        value={operatingExpensesData.breakdown_of_expense}
                                        onChange={(e) => setOperatingExpensesData('breakdown_of_expense', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        placeholder="Please provide a detailed breakdown of the expense (e.g., item costs, quantities, etc.)"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.amount}
                                        Total Amount
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={operatingExpensesData.total_amount}
                                        onChange={(e) => setOperatingExpensesData('total_amount', parseFloat(e.target.value) || '')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter the total amount requested"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.date}
                                        Expected Payment Date
                                    </label>
                                    <input
                                        type="date"
                                        value={operatingExpensesData.expected_payment_date}
                                        onChange={(e) => setOperatingExpensesData('expected_payment_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {icons.operatingExpenses}
                                        Additional Comment (if any)
                                    </label>
                                    <textarea
                                        value={operatingExpensesData.additional_comment}
                                        onChange={(e) => setOperatingExpensesData('additional_comment', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                    />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <button 
                                        type="submit" 
                                        disabled={operatingExpensesProcessing}
                                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        Submit Operating Expenses Request
                                    </button>
                                    
                                    <button 
                                        type="button" 
                                        onClick={() => console.log('Current form data:', operatingExpensesData, 'Errors:', errors)}
                                        className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                    >
                                        Debug Form Data
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
        </div>
    );
}