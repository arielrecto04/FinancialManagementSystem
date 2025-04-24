import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import RequestTable from '@/Components/RequestTable';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import RequestDetailsModal from '@/Components/RequestDetailsModal';
import axios from 'axios';
import React from 'react';
import Modal from '@/Components/Modal';
import Swal from 'sweetalert2';
import { formatCurrency } from '@/utils/currency';

const BudgetSummary = ({ adminBudget }) => {
    if (!adminBudget) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 hover:border-gray-300 transition-all duration-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Total Budget</p>
                        <h3 className="text-2xl font-semibold mt-2">
                            {formatCurrency(adminBudget?.total_budget)}
                        </h3>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg ring-1 ring-blue-100/50">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 hover:border-gray-300 transition-all duration-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Remaining Budget</p>
                        <h3 className="text-2xl font-semibold mt-2">
                            {formatCurrency(adminBudget?.remaining_budget)}
                        </h3>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg ring-1 ring-green-100/50">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 hover:border-gray-300 transition-all duration-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Used Budget</p>
                        <h3 className="text-2xl font-semibold mt-2">
                            {formatCurrency(adminBudget?.used_budget)}
                        </h3>
                    </div>
                    <div className="p-3 bg-red-100 rounded-lg ring-1 ring-red-100/50">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Icons = {
    Document: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    Clock: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    CheckCircle: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    XCircle: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
};

const StatCard = ({ title, value, change, icon, status }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 hover:border-gray-300 transition-all duration-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <div className="flex items-center mt-2">
                        <h3 className="text-2xl font-semibold">{value}</h3>
                        {change && (
                            <span className={`ml-2 text-sm flex items-center ${
                                parseFloat(change) >= 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                                {parseFloat(change) >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last period
                            </span>
                        )}
                    </div>
                </div>
                <div className={`p-3 rounded-lg ring-1 ${
                    status === 'pending' ? 'bg-blue-100 ring-blue-100/50' :
                    status === 'approved' ? 'bg-green-100 ring-green-100/50' :
                    status === 'rejected' ? 'bg-red-100 ring-red-100/50' :
                    'bg-gray-100 ring-gray-100/50'
                }`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

const EditItemsModal = ({ isOpen, onClose, request }) => {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && request) {
            try {
                if (request?.type === 'HR Expense' || request?.type === 'Operating Expense') {
                    const breakdownText = request.breakdown_of_expense || request.breakdown;
                    const breakdownLines = breakdownText?.split('\n').filter(line => line.trim()) || [];
                    
                    const parsedItems = breakdownLines.map(line => {
                        const matches = line.match(/^(.*?):\s*₱(\d+(?:\.\d{2})?)/);
                        if (matches) {
                            return {
                                description: matches[1].trim(),
                                amount: parseFloat(matches[2])
                            };
                        }
                        return null;
                    }).filter(item => item !== null);
                    
                    setItems(parsedItems);
                } else if (request?.items_json) {
                    const parsedItems = Array.isArray(request.items_json) 
                        ? request.items_json 
                        : JSON.parse(request.items_json);
                    setItems(parsedItems);
                } else {
                    setItems([]);
                }
                setError(null);
            } catch (error) {
                console.error('Error parsing items:', error);
                setError('Error loading items');
                setItems([]);
            }
        }
    }, [isOpen, request]);

    const handleUpdateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleAddItem = () => {
        if (request?.type === 'HR Expense' || request?.type === 'Operating Expense') {
            setItems([...items, { description: '', amount: 0 }]);
        } else {
            setItems([...items, { name: '', quantity: '', price: '' }]);
        }
    };

    const calculateTotal = () => {
        if (request?.type === 'HR Expense' || request?.type === 'Operating Expense') {
            return items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        }
        return items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.price || 0)), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (request?.type === 'HR Expense') {
                const breakdownText = items
                    .map(item => `${item.description}: ₱${parseFloat(item.amount).toFixed(2)}`)
                    .join('\n');

                await axios.put(`/hr-expenses/${request.request_number}/items`, {
                    breakdown_of_expense: breakdownText,
                    total_amount_requested: calculateTotal()
                });
            }
            else if (request?.type === 'Operating Expense') {
                const breakdownText = items
                    .map(item => `${item.description}: ₱${parseFloat(item.amount).toFixed(2)}`)
                    .join('\n');

                await axios.put(`/operating-expenses/${request.request_number}/items`, {
                    breakdown_of_expense: breakdownText,
                    total_amount: calculateTotal()
                });
            }
            else {
                await axios.put(`/supply-requests/${request.request_number}/items`, {
                    items: items
                });
            }
            window.location.reload();
        } catch (error) {
            console.error('Error updating items:', error);
            setError(error.response?.data?.message || 'An error occurred while updating items');
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    {request?.type === 'HR Expense' || request?.type === 'Operating Expense' ? 'Edit Breakdown of Expense' : 'Edit Items'}
                </h2>
                
                {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {Array.isArray(items) && items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            {request?.type === 'HR Expense' || request?.type === 'Operating Expense' ? (
                                <>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={item.description || ''}
                                            onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                            placeholder="Description"
                                        />
                                    </div>
                                    <div className="w-32">
                                        <input
                                            type="number"
                                            value={item.amount || ''}
                                            onChange={(e) => handleUpdateItem(index, 'amount', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                            placeholder="Amount"
                                            step="0.01"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={item.name || ''}
                                            onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                            placeholder="Item name"
                                        />
                                    </div>
                                    <div className="w-24">
                                        <input
                                            type="number"
                                            value={item.quantity || ''}
                                            onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                            placeholder="Qty"
                                        />
                                    </div>
                                    <div className="w-32">
                                        <input
                                            type="number"
                                            value={item.price || ''}
                                            onChange={(e) => handleUpdateItem(index, 'price', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                            placeholder="Price"
                                        />
                                    </div>
                                </>
                            )}
                            <button
                                onClick={() => handleRemoveItem(index)}
                                className="p-2 text-red-600 hover:text-red-800"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAddItem}
                    className="mt-4 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                    Add Item
                </button>

                <div className="mt-6 flex justify-between items-center">
                    <div className="text-lg font-semibold">
                        Total: {formatCurrency(calculateTotal())}
                    </div>
                    <div className="space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default function Reports({ auth, requests, statistics, filters, pagination, adminBudget: initialAdminBudget }) {
    const [isDateRangeActive, setIsDateRangeActive] = useState(filters.isDateRangeActive ?? false);
    const [dateRange, setDateRange] = useState({
        startDate: filters.startDate ? new Date(filters.startDate) : new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: filters.endDate ? new Date(filters.endDate) : new Date()
    });
    const [selectedRequestType, setSelectedRequestType] = useState(filters.requestType || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [sortOrder, setSortOrder] = useState(filters.sortOrder || 'newest');
    const [isFiltersVisible, setIsFiltersVisible] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [localRemarks, setLocalRemarks] = useState('');
    const [adminBudget, setAdminBudget] = useState(initialAdminBudget);
    const [localStatistics, setLocalStatistics] = useState(statistics);
    const [currentPage, setCurrentPage] = useState(pagination ? pagination.current_page : 1);
    const [isEditItemsModalOpen, setIsEditItemsModalOpen] = useState(false);

    // Add effect to check for request parameter in URL
    useEffect(() => {
        // Get the 'request' parameter from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const requestNumber = urlParams.get('request');
        
        if (requestNumber && requests && requests.length > 0) {
            // Find the request with matching request_number
            const foundRequest = requests.find(req => req.request_number === requestNumber);
            
            // If found, open the modal for this request
            if (foundRequest) {
                handleRowClick(foundRequest);
                
                // Optionally, clear the URL parameter to prevent reopening on page refresh
                const currentUrl = new URL(window.location);
                currentUrl.searchParams.delete('request');
                window.history.replaceState({}, '', currentUrl);
            }
        }
    }, [requests]); // Dependency array includes requests to ensure it runs after data is loaded

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800'
    };

    const handleRowClick = (request) => {
        // Create a copy of the request to avoid modifying the original
        const requestCopy = { ...request };
        
        console.log('Row clicked - Original request:', request);
        console.log('Row clicked - Request ID:', request.id);
        
        // Parse items_json if it exists and is a string
        if (requestCopy.items_json && typeof requestCopy.items_json === 'string') {
            try {
                requestCopy.items_json = JSON.parse(requestCopy.items_json);
                console.log('Row clicked - Parsed items_json:', requestCopy.items_json);
            } catch (error) {
                console.error('Row clicked - Error parsing items_json:', error);
                // Keep the original string if parsing fails
            }
        }
        
        setSelectedRequest(requestCopy);
        setIsModalOpen(true);
    };

    const handleFilterChange = () => {
        if (!route().current('reports.index')) return;

        router.get(route('reports.index'), {
            startDate: isDateRangeActive ? dateRange.startDate.toISOString().split('T')[0] : null,
            endDate: isDateRangeActive ? dateRange.endDate.toISOString().split('T')[0] : null,
            requestType: selectedRequestType,
            status: selectedStatus,
            isDateRangeActive: isDateRangeActive,
            sortOrder: sortOrder,
            page: 1,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        
        router.get(route('reports.index'), {
            startDate: isDateRangeActive ? dateRange.startDate.toISOString().split('T')[0] : null,
            endDate: isDateRangeActive ? dateRange.endDate.toISOString().split('T')[0] : null,
            requestType: selectedRequestType,
            status: selectedStatus,
            isDateRangeActive: isDateRangeActive,
            sortOrder: sortOrder,
            page: page,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleAction = (request, action) => {
        // Extract the ID from the request object
        let requestId = null;
        let requestType = request.type ? request.type.toLowerCase().replace(/\s+/g, '') : null;
        
        console.log('Request object:', request);
        
        // Try to find the ID based on the request_number format
        if (request.request_number) {
            // For formats like "SR-00000123", "RR-00000456", "LIQ-00000789", etc.
            const parts = request.request_number.split('-');
            if (parts.length === 2) {
                // Remove leading zeros
                requestId = parseInt(parts[1].replace(/^0+/, ''), 10);
                
                // Determine request type from prefix if not already set
                if (!requestType) {
                    const prefix = parts[0];
                    if (prefix === 'SR') requestType = 'supply';
                    else if (prefix === 'RR') requestType = 'reimbursement';
                    else if (prefix === 'LIQ') requestType = 'liquidation';
                    else if (prefix === 'HR') requestType = 'hrexpense';
                    else if (prefix === 'OP') requestType = 'operatingexpense';
                }
            }
        }
        
        // If we still don't have an ID, try other properties
        if (!requestId) {
            if (request.id) {
                requestId = request.id;
            }
        }
        
        console.log('Extracted ID:', requestId, 'Type:', requestType);
        
        if (!requestId || !requestType) {
            console.error('Could not extract ID or type from request:', request);
            alert('Error: Could not identify request ID or type. Please try again.');
            return;
        }
        
        // Store the extracted ID and type in the request object
        const requestWithExtractedData = {
            ...request,
            extracted_id: requestId,
            extracted_type: requestType
        };
        
        setSelectedRequest(requestWithExtractedData);
        setActionType(action);
        setIsActionModalOpen(true);
    };

    const submitAction = () => {
        if (!selectedRequest?.extracted_id) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Request ID not found. Please try again.',
            });
            setIsActionModalOpen(false);
            return;
        }
        
        // Close the action modal first
        setIsActionModalOpen(false);

        // Show confirmation dialog
        Swal.fire({
            title: actionType === 'approved' ? 'Approve Request?' : 'Reject Request?',
            text: actionType === 'approved' 
                ? 'Are you sure you want to approve this request?' 
                : 'Are you sure you want to reject this request?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: actionType === 'approved' ? '#10B981' : '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: actionType === 'approved' ? 'Yes, approve it!' : 'Yes, reject it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // Show loading state
                Swal.fire({
                    title: 'Processing...',
                    html: 'Please wait...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // Submit the action
                router.post(route('reports.update-status', selectedRequest.extracted_id), {
                    status: actionType,
                    type: selectedRequest.extracted_type,
                }, {
                    onSuccess: (page) => {
                        // Check for error flash message
                        if (page.props.flash.error) {
                            Swal.fire({
                                icon: 'error',
                                title: page.props.flash.error.title,
                                text: page.props.flash.error.message,
                                confirmButtonColor: '#EF4444'
                            });
                            return;
                        }

                        // Success handling
                        setLocalStatistics(prev => {
                            const newStats = { ...prev };
                            if (selectedRequest.status === 'pending') {
                                newStats.pendingRequests--;
                            }
                            if (actionType === 'approved') {
                                newStats.approvedRequests++;
                                if (selectedRequest.status === 'rejected') {
                                    newStats.rejectedRequests--;
                                }
                            } else if (actionType === 'rejected') {
                                newStats.rejectedRequests++;
                                if (selectedRequest.status === 'approved') {
                                    newStats.approvedRequests--;
                                }
                            }
                            return newStats;
                        });

                        // Update budget if action is 'approved'
                        if (actionType === 'approved' && adminBudget) {
                            const requestAmount = selectedRequest.type === 'Reimbursement' 
                                ? parseFloat(selectedRequest.amount || 0) 
                                : parseFloat(selectedRequest.total_amount || 0);

                            setAdminBudget(prev => ({
                                ...prev,
                                remaining_budget: parseFloat(prev.remaining_budget) - requestAmount,
                                used_budget: parseFloat(prev.used_budget) + requestAmount
                            }));
                        }

                        // Show success message
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: actionType === 'approved' 
                                ? 'Request has been approved.' 
                                : 'Request has been rejected.',
                            confirmButtonColor: '#10B981'
                        });

                        router.reload({ only: ['requests'] });
                    },
                    onError: (errors) => {
                        console.error('Error updating status:', errors);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to update request status. Please try again.',
                            confirmButtonColor: '#EF4444'
                        });
                    }
                });
            }
        });
    };

    const handleSortOrderChange = (newSortOrder) => {
        setSortOrder(newSortOrder);
        setTimeout(() => {
            router.get(route('reports.index'), {
                startDate: isDateRangeActive ? dateRange.startDate.toISOString().split('T')[0] : null,
                endDate: isDateRangeActive ? dateRange.endDate.toISOString().split('T')[0] : null,
                requestType: selectedRequestType,
                status: selectedStatus,
                isDateRangeActive: isDateRangeActive,
                sortOrder: newSortOrder,
                page: 1,
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 0);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleFilterChange();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [dateRange, selectedRequestType, selectedStatus, isDateRangeActive, sortOrder]);

    const ActionModal = () => {
        return (
            <Modal show={isActionModalOpen} onClose={() => setIsActionModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-center text-green-600 mb-6">
                        {actionType === 'approved' ? 'Approve Request' : 'Reject Request'}
                    </h2>

                    <div className="space-y-4">
                {/* Request Details */}
                        <div className="space-y-3">
                            <div className="text-center text-gray-600 mb-4">
                                Request Number: {selectedRequest?.request_number || 'N/A'}
                        </div>

                            <div className="grid grid-cols-2 gap-4">
                        <div>
                                    <p className="text-sm text-gray-600">Requested By</p>
                                    <p className="font-medium">{selectedRequest?.user?.name || 'N/A'}</p>
                        </div>
                                
                        <div>
                                    <p className="text-sm text-gray-600">Department</p>
                                    <p className="font-medium">{selectedRequest?.department || 'N/A'}</p>
                        </div>

                                <div>
                                    <p className="text-sm text-gray-600">Type</p>
                                    <p className="font-medium">{selectedRequest?.type || 'N/A'}</p>
                        </div>

                                <div>
                                    <p className="text-sm text-gray-600">Department</p>
                                    <p className="font-medium">{selectedRequest?.department || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                    <p className="font-medium">
                                            {formatCurrency(selectedRequest?.total_amount || selectedRequest?.amount || 0)}
                                    </p>
                                </div>
                    </div>
                </div>

                            <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
                            <div>
                                <p className="text-sm text-gray-600">Available Budget</p>
                                    <p className="font-medium">
                                        {formatCurrency(adminBudget?.remaining_budget || 0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Request Amount</p>
                                    <p className="font-medium">
                                        {formatCurrency(selectedRequest?.total_amount || selectedRequest?.amount || 0)}
                                </p>
                            </div>
                        </div>
                            </div>
                    </div>

                {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                    <button
                            onClick={() => setIsActionModalOpen(false)}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                            onClick={submitAction}
                            className={`px-4 py-2 text-white rounded-md ${
                            actionType === 'approved' 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {actionType === 'approved' ? 'Approve' : 'Reject'}
                    </button>
                </div>
            </div>
            </Modal>
        );
    };

    // Update the RequestTable component to include action buttons
    const ActionButtons = ({ request }) => (
        <div className="flex space-x-2">
            {request.status === 'pending' && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAction(request, 'approved');
                        }}
                        className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                        Approve
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAction(request, 'rejected');
                        }}
                        className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Reject
                    </button>
                </>
            )}
        </div>
    );

    // Add liquidation to request type options
    const requestTypeOptions = [
        { value: 'all', label: 'All Requests' },
        { value: 'supply', label: 'Supply Requests' },
        { value: 'reimbursement', label: 'Reimbursement Requests' },
        { value: 'liquidation', label: 'Liquidation Requests' },
        { value: 'hrexpense', label: 'HR Expense Requests' },
        { value: 'operatingexpense', label: 'Operating Expense Requests' }
    ];

    // Add status options
    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' }
    ];

    // Add percentage calculation helper
    const calculatePercentage = (current, previous) => {
        if (!previous) return 0;
        return ((current - previous) / previous * 100).toFixed(1);
    };

    // Add these functions to handle exports
    const handleExcelExport = () => {
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = '/reports/export-excel';

        // Add hidden fields for the filters
        const filters = {
            startDate: isDateRangeActive ? dateRange.startDate.toISOString().split('T')[0] : null,
            endDate: isDateRangeActive ? dateRange.endDate.toISOString().split('T')[0] : null,
            requestType: selectedRequestType,
            status: selectedStatus,
            isDateRangeActive: isDateRangeActive,
        };

        Object.keys(filters).forEach(key => {
            if (filters[key] !== null) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = filters[key];
                form.appendChild(input);
            }
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    const handleExportPDF = () => {
        // Create URL with current filters
        const queryParams = new URLSearchParams({
            isDateRangeActive: isDateRangeActive,
            startDate: isDateRangeActive ? dateRange.startDate.toISOString().split('T')[0] : '',
            endDate: isDateRangeActive ? dateRange.endDate.toISOString().split('T')[0] : '',
            requestType: selectedRequestType,
            status: selectedStatus,
            sortOrder: sortOrder
        }).toString();

        // Trigger PDF download with filters
        window.location.href = `${route('reports.export-pdf')}?${queryParams}`;
    };

    // Add this function to handle request updates
    const handleRequestUpdate = (updatedRequest) => {
        // Update the requests list with the updated request
        const updatedRequests = requests.map(req => 
            req.id === updatedRequest.id ? updatedRequest : req
        );
        // You'll need to implement a way to update the parent state here
        // This might require lifting the state up or using a state management solution
    };

    return (
        <AuthenticatedLayout>
            <Head title="Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {auth.user.role === 'admin' && <BudgetSummary adminBudget={adminBudget} />}

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <StatCard
                            title="Total Requests"
                            value={localStatistics.totalRequests}
                            icon={<Icons.Document className={`w-6 h-6 text-gray-600`} />}
                        />
                        <StatCard
                            title="Pending Requests"
                            value={localStatistics.pendingRequests}
                            icon={<Icons.Clock className={`w-6 h-6 text-blue-600`} />}
                            status="pending"
                        />
                        <StatCard
                            title="Approved Requests"
                            value={localStatistics.approvedRequests}
                            icon={<Icons.CheckCircle className={`w-6 h-6 text-green-600`} />}
                            status="approved"
                        />
                        <StatCard
                            title="Rejected Requests"
                            value={localStatistics.rejectedRequests}
                            icon={<Icons.XCircle className={`w-6 h-6 text-red-600`} />}
                            status="rejected"
                        />
                        </div>

                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 hover:border-gray-300 transition-all duration-200">
                        <div className="p-6">
                            {/* Header Actions */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold flex items-center">
                                    <div className="p-3 bg-indigo-100 rounded-lg ring-1 ring-indigo-100/50 mr-3">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    </div>
                                    Reports & Analytics
                                </h2>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                        {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
                                    </button>
                                    <button 
                                        onClick={handleExcelExport}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Export Excel
                                    </button>
                                    <button 
                                        onClick={handleExportPDF}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Export PDF
                                    </button>
                                </div>
                            </div>

                            {/* Filters Section */}
                                    {isFiltersVisible && (
                                <div className="bg-gray-50/50 rounded-lg border border-gray-100 p-6 mb-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Date Range Filter
                                                    </label>
                                                    <button
                                                        onClick={() => setIsDateRangeActive(!isDateRangeActive)}
                                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                            isDateRangeActive ? 'bg-blue-600' : 'bg-gray-200'
                                                        }`}
                                                    >
                                                        <span className="sr-only">Use date range</span>
                                                        <span
                                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                                isDateRangeActive ? 'translate-x-5' : 'translate-x-0'
                                                            }`}
                                                        />
                                                    </button>
                                                </div>
                                                <DatePicker
                                                    selectsRange={true}
                                                    startDate={dateRange.startDate}
                                                    endDate={dateRange.endDate}
                                                    onChange={(update) => {
                                                        setDateRange({
                                                            startDate: update[0],
                                                            endDate: update[1]
                                                        });
                                                    }}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                                                        !isDateRangeActive ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                    placeholderText="Select date range"
                                                    disabled={!isDateRangeActive}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Request Type
                                                </label>
                                                <select
                                                    value={selectedRequestType}
                                                    onChange={(e) => setSelectedRequestType(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                >
                                                    {requestTypeOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Status
                                                </label>
                                                <select
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                >
                                                    {statusOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Sort By Date
                                                </label>
                                                <select
                                                    id="sortOrder"
                                                    value={sortOrder}
                                                    onChange={(e) => handleSortOrderChange(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                >
                                                    <option value="newest">Newest First</option>
                                                    <option value="oldest">Oldest First</option>
                                                </select>
                                            </div>
                                        </div>
                                </div>
                            )}

                            {/* Request Table */}
                            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                                <RequestTable 
                                    requests={requests}
                                    onRowClick={handleRowClick}
                                    actionRenderer={(request) => <ActionButtons request={request} />}
                                />
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.total > 0 && (
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100 mt-4 rounded-lg">
                                <div className="flex justify-between flex-1 sm:hidden">
                                        <button 
                                            onClick={() => pagination.current_page > 1 && handlePageChange(pagination.current_page - 1)}
                                            disabled={pagination.current_page <= 1}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                                pagination.current_page <= 1 
                                                ? 'text-gray-400 cursor-not-allowed' 
                                                : 'text-gray-700 hover:bg-gray-50'
                                            } bg-white border border-gray-300 rounded-md`}
                                        >
                                        Previous
                                    </button>
                                        <button 
                                            onClick={() => pagination.current_page < pagination.total_pages && handlePageChange(pagination.current_page + 1)}
                                            disabled={pagination.current_page >= pagination.total_pages}
                                            className={`relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium ${
                                                pagination.current_page >= pagination.total_pages 
                                                ? 'text-gray-400 cursor-not-allowed' 
                                                : 'text-gray-700 hover:bg-gray-50'
                                            } bg-white border border-gray-300 rounded-md`}
                                        >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{(pagination.current_page - 1) * pagination.per_page + 1}</span> to <span className="font-medium">
                                                    {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                                                </span> of <span className="font-medium">{pagination.total}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                                <button
                                                    onClick={() => pagination.current_page > 1 && handlePageChange(pagination.current_page - 1)}
                                                    disabled={pagination.current_page <= 1}
                                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                                                        pagination.current_page <= 1 
                                                        ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed' 
                                                        : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                <span className="sr-only">Previous</span>
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                            </button>
                                                
                                                {/* Page numbers */}
                                                {[...Array(pagination.total_pages)].map((_, i) => {
                                                    const page = i + 1;
                                                    // Show current page, first page, last page, and pages around current page
                                                    if (
                                                        page === 1 || 
                                                        page === pagination.total_pages || 
                                                        (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                                                    ) {
                                                        return (
                                                            <button
                                                                key={page}
                                                                onClick={() => handlePageChange(page)}
                                                                className={`relative inline-flex items-center px-4 py-2 border ${
                                                                    page === pagination.current_page
                                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                {page}
                                            </button>
                                                        );
                                                    } else if (
                                                        page === pagination.current_page - 2 || 
                                                        page === pagination.current_page + 2
                                                    ) {
                                                        return (
                                                            <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700">
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                })}

                                                <button
                                                    onClick={() => pagination.current_page < pagination.total_pages && handlePageChange(pagination.current_page + 1)}
                                                    disabled={pagination.current_page >= pagination.total_pages}
                                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                                                        pagination.current_page >= pagination.total_pages 
                                                        ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed' 
                                                        : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                <span className="sr-only">Next</span>
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Modal */}
            <ActionModal />

            {/* EditItemsModal */}
            <EditItemsModal
                isOpen={isEditItemsModalOpen}
                onClose={() => setIsEditItemsModalOpen(false)}
                request={selectedRequest}
                onUpdate={handleRequestUpdate}
            />

            {/* Request Details Modal */}
            <RequestDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                request={selectedRequest}
                auth={auth}
                onEditItems={() => {
                    setIsModalOpen(false);
                    setIsEditItemsModalOpen(true);
                }}
            />
        </AuthenticatedLayout>
    );
}