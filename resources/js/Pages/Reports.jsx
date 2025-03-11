import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import RequestTable from '@/Components/RequestTable';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import RequestDetailsModal from '@/Components/RequestDetailsModal';
import axios from 'axios';
import React from 'react';

const BudgetSummary = ({ adminBudget }) => {
    if (!adminBudget) return null;

    const formatCurrency = (amount) => {
        return parseFloat(amount).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Total Budget</p>
                        <h3 className="text-2xl font-semibold">
                            ₱{formatCurrency(adminBudget?.total_budget ?? 0)}
                        </h3>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Remaining Budget</p>
                        <h3 className="text-2xl font-semibold">
                            ₱{formatCurrency(adminBudget?.remaining_budget ?? 0)}
                        </h3>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Used Budget</p>
                        <h3 className="text-2xl font-semibold">
                            ₱{formatCurrency(adminBudget?.used_budget ?? 0)}
                        </h3>
                    </div>
                    <div className="p-3 bg-red-100 rounded-full">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
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

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800'
    };

    const handleRowClick = (request) => {
        // Create a copy of the request to avoid modifying the original
        const requestCopy = { ...request };
        
        console.log('Original request:', request);
        console.log('Original items_json type:', typeof request.items_json);
        console.log('Original items_json value:', request.items_json);
        
        // Parse items_json if it exists and is a string
        if (requestCopy.items_json && typeof requestCopy.items_json === 'string') {
            try {
                requestCopy.items_json = JSON.parse(requestCopy.items_json);
                console.log('Parsed items_json:', requestCopy.items_json);
            } catch (error) {
                console.error('Error parsing items_json:', error);
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
            console.error('Request ID not found in selectedRequest:', selectedRequest);
            alert('Error: Request ID not found. Please try again.');
            setIsActionModalOpen(false);
            return;
        }
        
        console.log('Submitting action:', {
            id: selectedRequest.extracted_id,
            type: selectedRequest.extracted_type,
            status: actionType,
            remarks: remarks
        });
        
        // Use Inertia router instead of axios for form submission
        router.post(route('reports.update-status', selectedRequest.extracted_id), {
            status: actionType,
            type: selectedRequest.extracted_type,
            remarks: remarks
        }, {
            onSuccess: (page) => {
                // Check for error message in the flash data
                if (page.props.flash.error) {
                    alert(page.props.flash.error);
                } else {
                    // Update local statistics
                    setLocalStatistics(prev => ({
                        ...prev,
                        pendingRequests: prev.pendingRequests - 1,
                        completedRequests: prev.completedRequests + 1,
                    }));

                    // Update adminBudget if action is 'approved'
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
                }

                // Close modal
                setIsActionModalOpen(false);
                
                // Refresh the page to get updated data
                router.reload();
            },
            onError: (errors) => {
                console.error('Error updating status:', errors);
                alert('Error updating status. Please try again.');
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

    const ActionModalContent = ({ selectedRequest, actionType, onCancel, onConfirm }) => {
        // Debug logging removed for remarks
        
        const requestAmount = selectedRequest.type === 'Reimbursement' 
            ? parseFloat(selectedRequest.amount) 
            : parseFloat(selectedRequest.total_amount);

        // Add proper number comparison
        const isInsufficientBudget = actionType === 'approved' && 
            adminBudget && 
            parseFloat(adminBudget.remaining_budget) < requestAmount;

        // Debug logging
        console.log('Budget Check:', {
            remainingBudget: adminBudget?.remaining_budget,
            requestAmount,
            isInsufficientBudget
        });

        return (
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                {/* Header */}
                <div className="mb-5">
                    <h3 className={`text-xl font-semibold ${
                        actionType === 'approved' ? 'text-green-700' : 'text-red-700'
                    }`}>
                        {actionType === 'approved' ? 'Approve Request' : 'Reject Request'}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Request Number: <span className="font-medium">{selectedRequest.request_number || 'N/A'}</span>
                    </p>
                </div>

                {/* Request Details */}
                <div className="mb-5 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="col-span-2">
                            <p className="text-gray-600">Requested By</p>
                            <p className="font-medium">{selectedRequest.user_name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Type</p>
                            <p className="font-medium">{selectedRequest.type || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Department</p>
                            <p className="font-medium">{selectedRequest.department || 'N/A'}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-600">
                                {selectedRequest.type === 'Liquidation' ? 'Date' : 'Department'}
                            </p>
                            <p className="font-medium">
                                {selectedRequest.type === 'Liquidation' 
                                    ? selectedRequest.date 
                                    : selectedRequest.department || 'N/A'}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-600">
                                {selectedRequest.type === 'Liquidation' ? 'Total Amount (Cash Advance)' : 'Total Amount'}
                            </p>
                            <p className="font-medium">
                                {requestAmount.toLocaleString()}
                                {selectedRequest.type === 'Liquidation' && 
                                    ` (₱${parseFloat(selectedRequest.cash_advance_amount).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })})`
                                }
                            </p>
                        </div>
                        {selectedRequest.type === 'Liquidation' && (
                            <>
                                <div>
                                    <p className="text-gray-600">Amount to Refund</p>
                                    <p className="font-medium">
                                        ₱{parseFloat(selectedRequest.amount_to_refund).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Amount to Reimburse</p>
                                    <p className="font-medium">
                                        ₱{parseFloat(selectedRequest.amount_to_reimburse).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Remarks Input removed */}

                {/* Add budget information */}
                {actionType === 'approved' && adminBudget && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Available Budget</p>
                                <p className="font-medium text-lg">
                                    ₱{parseFloat(adminBudget.remaining_budget).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Request Amount</p>
                                <p className="font-medium text-lg">
                                    ₱{requestAmount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        {isInsufficientBudget && (
                            <div className="mt-2 p-2 bg-red-50 text-red-700 rounded">
                                Insufficient budget to approve this request
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isInsufficientBudget}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                            actionType === 'approved' 
                                ? isInsufficientBudget 
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700' 
                                : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {actionType === 'approved' ? 'Approve' : 'Reject'}
                    </button>
                </div>
            </div>
        );
    };

    const ActionModal = () => {
        if (!isActionModalOpen || !selectedRequest) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
                    <div 
                        className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsActionModalOpen(false)}
                    />
                    
                    <ActionModalContent 
                        selectedRequest={selectedRequest}
                        actionType={actionType}
                        onCancel={() => {
                            setIsActionModalOpen(false);
                        }}
                        onConfirm={() => {
                            submitAction();
                        }}
                    />
                </div>
            </div>
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

    return (
        <AuthenticatedLayout>
            <Head title="Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {auth.user.role === 'admin' && <BudgetSummary adminBudget={adminBudget} />}

                    {/* Summary Cards */}
                    <div className="grid gap-4 mb-6 md:grid-cols-3">
                        {/* Total Requests Card */}
                        <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Requests</p>
                                    <h3 className="text-2xl font-semibold">
                                        {localStatistics.totalRequests.toLocaleString()}
                                    </h3>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className={`text-sm flex items-center ${
                                    statistics.totalRequestsChange >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    <svg className={`w-4 h-4 mr-1 transform ${
                                        statistics.totalRequestsChange >= 0 ? 'rotate-0' : 'rotate-180'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    {Math.abs(statistics.totalRequestsChange)}% from last period
                                </span>
                            </div>
                        </div>

                        {/* Pending Requests Card */}
                        <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pending Requests</p>
                                    <h3 className="text-2xl font-semibold">
                                        {localStatistics.pendingRequests.toLocaleString()}
                                    </h3>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-sm text-yellow-600">
                                    Requires attention
                                </span>
                            </div>
                        </div>

                        {/* Completed Requests Card */}
                        <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Completed Requests</p>
                                    <h3 className="text-2xl font-semibold">
                                        {(localStatistics.completedRequests - (localStatistics.completedPettyCashRequests || 0)).toLocaleString()}
                                    </h3>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className={`text-sm flex items-center ${
                                    statistics.completedRequestsChange >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    <svg className={`w-4 h-4 mr-1 transform ${
                                        statistics.completedRequestsChange >= 0 ? 'rotate-0' : 'rotate-180'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    {Math.abs(statistics.completedRequestsChange)}% from last period
                                    <span className="ml-2 text-xs text-gray-500">(Excluding Petty Cash)</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header Actions */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    Reports & Analytics
                                </h2>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() =>  setIsFiltersVisible(!isFiltersVisible)}
                                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                        {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
                                    </button>
                                    <button 
                                        onClick={handleExcelExport}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Export Excel
                                    </button>
                                    <button 
                                        onClick={handleExportPDF}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Export PDF
                                    </button>
                                </div>
                            </div>

                            {/* Filters Section */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                                <div className="p-6 bg-white border-b border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                                        <button
                                            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
                                        </button>
                                    </div>
                                    
                                    {isFiltersVisible && (
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
                                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                >
                                                    <option value="newest">Newest First</option>
                                                    <option value="oldest">Oldest First</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Request Table */}
                            <div className="mt-4 overflow-hidden border border-gray-200 rounded-lg">
                                <RequestTable 
                                    requests={requests}
                                    onRowClick={handleRowClick}
                                    actionRenderer={(request) => <ActionButtons request={request} />}
                                />
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.total > 0 && (
                            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
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

            {/* Add Action Modal */}
            <ActionModal />

            {/* Existing Modal */}
            <RequestDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                request={selectedRequest}
            />
        </AuthenticatedLayout>
    );
}
