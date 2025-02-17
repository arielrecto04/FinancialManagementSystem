import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import RequestTable from '@/Components/RequestTable';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import RequestDetailsModal from '@/Components/RequestDetailsModal';

export default function Reports({ requests, statistics, filters }) {
    const [dateRange, setDateRange] = useState({
        startDate: filters.startDate ? new Date(filters.startDate) : new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: filters.endDate ? new Date(filters.endDate) : new Date()
    });
    const [selectedRequestType, setSelectedRequestType] = useState(filters.requestType || 'all');
    const [isFiltersVisible, setIsFiltersVisible] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        router.get(route('reports.index'), {
            startDate: dateRange.startDate ? dateRange.startDate.toISOString().split('T')[0] : null,
            endDate: dateRange.endDate ? dateRange.endDate.toISOString().split('T')[0] : null,
            requestType: selectedRequestType,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    useEffect(() => {
        handleFilterChange();
    }, [dateRange, selectedRequestType]);

    return (
        <AuthenticatedLayout>
            <Head title="Reports" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="grid gap-4 mb-6 md:grid-cols-3">
                        <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Requests</p>
                                    <h3 className="text-2xl font-semibold">1,234</h3>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-sm text-green-600 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    12% increase
                                </span>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pending Requests</p>
                                    <h3 className="text-2xl font-semibold">45</h3>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-sm text-yellow-600">Requires attention</span>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Completed Requests</p>
                                    <h3 className="text-2xl font-semibold">892</h3>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-sm text-green-600 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    8% increase
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
                                    <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Export Excel
                                    </button>
                                    <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
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
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date Range
                                            </label>
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                placeholderText="Select date range"
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
                                                <option value="all">All Requests</option>
                                                <option value="supply">Supply Requests</option>
                                                <option value="reimbursement">Reimbursement Requests</option>
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

            {/* Modal */}
            <RequestDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                request={selectedRequest}
            />
        </AuthenticatedLayout>
    );
}
