import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import RequestTable from '@/Components/RequestTable';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import RequestDetailsModal from '@/Components/RequestDetailsModal';

export default function Reports({ requests, statistics, filters }) {
    const [isDateRangeActive, setIsDateRangeActive] = useState(filters.isDateRangeActive ?? false);
    const [dateRange, setDateRange] = useState({
        startDate: filters.startDate ? new Date(filters.startDate) : new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: filters.endDate ? new Date(filters.endDate) : new Date()
    });
    const [selectedRequestType, setSelectedRequestType] = useState(filters.requestType || 'all');
    const [isFiltersVisible, setIsFiltersVisible] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [localRemarks, setLocalRemarks] = useState('');

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800'
    };

    const handleRowClick = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleFilterChange = () => {
        if (!route().current('reports.index')) return;

        router.get(route('reports.index'), {
            startDate: isDateRangeActive ? dateRange.startDate.toISOString().split('T')[0] : null,
            endDate: isDateRangeActive ? dateRange.endDate.toISOString().split('T')[0] : null,
            requestType: selectedRequestType,
            isDateRangeActive: isDateRangeActive,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleAction = (request, action) => {
        setSelectedRequest(request);
        setActionType(action);
        setLocalRemarks('');
        setIsActionModalOpen(true);
    };

    const submitAction = () => {
        router.post(route('reports.update-status', selectedRequest.id), {
            status: actionType,
            type: selectedRequest.type,
            remarks: remarks
        }, {
            onSuccess: () => {
                setIsActionModalOpen(false);
                setRemarks('');
            },
        });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleFilterChange();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [dateRange, selectedRequestType, isDateRangeActive]);

    const RemarksTextarea = ({ value, onChange }) => {
        return (
            <div className="mb-5">
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                </label>
                <textarea
                    id="remarks"
                    value={value}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="3"
                    placeholder="Enter your remarks here (optional)"
                />
            </div>
        );
    };

    const ActionModalContent = ({ selectedRequest, actionType, localRemarks, setLocalRemarks, onCancel, onConfirm }) => {
        const formatAmount = () => {
            try {
                let amount = 0;
                
                if (selectedRequest.type === 'Supply' && selectedRequest.total_amount) {
                    amount = parseFloat(selectedRequest.total_amount);
                } else if (selectedRequest.type === 'Reimbursement' && selectedRequest.amount) {
                    amount = parseFloat(selectedRequest.amount);
                } else if (selectedRequest.type === 'Liquidation') {
                    amount = parseFloat(selectedRequest.total_amount);
                }

                return isNaN(amount) ? '₱0.00' : `₱${amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
            } catch (error) {
                console.error('Error formatting amount:', error);
                return '₱0.00';
            }
        };

        const handleRemarksChange = (e) => {
            setLocalRemarks(e.target.value);
        };

        return (
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all">
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
                                {formatAmount()}
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

                {/* Remarks Input */}
                <RemarksTextarea 
                    value={localRemarks} 
                    onChange={handleRemarksChange} 
                />

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
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
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                            actionType === 'approved' 
                                ? 'bg-green-600 hover:bg-green-700' 
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
                        localRemarks={localRemarks}
                        setLocalRemarks={setLocalRemarks}
                        onCancel={() => {
                            setIsActionModalOpen(false);
                            setLocalRemarks('');
                        }}
                        onConfirm={() => {
                            setRemarks(localRemarks);
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
        { value: 'liquidation', label: 'Liquidation Requests' }
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

    const handlePDFExport = () => {
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = '/reports/export-pdf';

        // Add hidden fields for the filters
        const filters = {
            startDate: isDateRangeActive ? dateRange.startDate.toISOString().split('T')[0] : null,
            endDate: isDateRangeActive ? dateRange.endDate.toISOString().split('T')[0] : null,
            requestType: selectedRequestType,
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

    return (
        <AuthenticatedLayout>
            <Head title="Reports" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="grid gap-4 mb-6 md:grid-cols-3">
                        {/* Total Requests Card */}
                        <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Requests</p>
                                    <h3 className="text-2xl font-semibold">
                                        {statistics.totalRequests.toLocaleString()}
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
                                        {statistics.pendingRequests.toLocaleString()}
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
                                        {statistics.completedRequests.toLocaleString()}
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V17a2 2 0 01-2 2z" />
                                    </svg>
                                    Request Reports
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
                                        onClick={handlePDFExport}
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
                            {isFiltersVisible && (
                                <div className="p-4 mb-6 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex flex-col space-y-4">
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
                                    </div>
                                </div>
                            )}

                            {/* Request Table */}
                            <div className="mt-4 overflow-hidden border border-gray-200 rounded-lg">
                                <RequestTable 
                                    requests={requests}
                                    onRowClick={handleRowClick}
                                    actionRenderer={(request) => <ActionButtons request={request} />}
                                />
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                                <div className="flex justify-between flex-1 sm:hidden">
                                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                        Previous
                                    </button>
                                    <button className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                                            <span className="font-medium">97</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                            <button className="relative inline-flex items-center px-2 py-2 text-gray-400 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50">
                                                <span className="sr-only">Previous</span>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 border border-gray-300 bg-blue-50">
                                                1
                                            </button>
                                            <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">
                                                2
                                            </button>
                                            <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">
                                                3
                                            </button>
                                            <button className="relative inline-flex items-center px-2 py-2 text-gray-400 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50">
                                                <span className="sr-only">Next</span>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
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
