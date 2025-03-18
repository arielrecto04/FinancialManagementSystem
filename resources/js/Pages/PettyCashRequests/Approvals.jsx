import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function Approvals({ auth, requests, filters }) {
    const [processingId, setProcessingId] = useState(null);
    const [currentFilter, setCurrentFilter] = useState(filters.status || 'all');
    const [isFiltersVisible, setIsFiltersVisible] = useState(true);
    const [sortOrder, setSortOrder] = useState(filters.sortOrder || 'newest');

    // Icons
    const icons = {
        filter: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>,
        sort: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>,
        calendar: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
    };
    
    const handleFilterChange = (newStatus) => {
        setCurrentFilter(newStatus);
        router.get(
            route('petty-cash-requests.approvals'),
            { status: newStatus, sortOrder },
            { 
                preserveState: true,
                preserveScroll: true,
                only: ['requests']
            }
        );
    };

    const handleSortOrderChange = (newOrder) => {
        setSortOrder(newOrder);
        router.get(
            route('petty-cash-requests.approvals'),
            { status: currentFilter, sortOrder: newOrder },
            { 
                preserveState: true,
                preserveScroll: true,
                only: ['requests']
            }
        );
    };

    const handleApproval = (id, newStatus) => {
        if (processingId) return;
        setProcessingId(id);
        
        Swal.fire({
            title: `${newStatus === 'approved' ? 'Approve' : 'Reject'} Request?`,
            text: `Are you sure you want to ${newStatus === 'approved' ? 'approve' : 'reject'} this petty cash request?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: newStatus === 'approved' ? '#3085d6' : '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: newStatus === 'approved' ? 'Yes, approve it!' : 'Yes, reject it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('status', newStatus);
                formData.append('remarks', newStatus === 'approved' ? 'Approved by superadmin' : 'Rejected by superadmin');

                axios.post(route('petty-cash-requests.update-status', id), formData)
                    .then(response => {
                        setProcessingId(null);
                        Swal.fire({
                            title: 'Success!',
                            text: `Request has been ${newStatus === 'approved' ? 'approved' : 'rejected'}.`,
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        router.reload({ only: ['requests'] });
                    })
                    .catch(error => {
                        console.error('Error:', error.response?.data);
                        setProcessingId(null);
                        Swal.fire({
                            title: 'Error!',
                            text: error.response?.data?.message || 'An error occurred',
                            icon: 'error'
                        });
                    });
            } else {
                setProcessingId(null);
            }
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 ring-green-600/20';
            case 'rejected':
                return 'bg-red-100 text-red-800 ring-red-600/20';
            default:
                return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
          
        >
            <Head title="Petty Cash Approvals" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium flex items-center gap-2">
                                    {icons.filter}
                                    Petty Cash Requests
                                </h3>
                                <button
                                    onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    {icons.filter}
                                    {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
                                </button>
                            </div>
                            
                            {/* Filters Section */}
                            {isFiltersVisible && (
                                <div className="bg-gray-50 rounded-lg shadow-inner mb-6 border border-gray-200">
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Status Filter */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                    {icons.filter}
                                                    Status
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleFilterChange(status)}
                                                            className={`px-4 py-2 rounded-md transition-all duration-200 ease-in-out shadow-sm
                                                                ${currentFilter === status 
                                                                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-2' 
                                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                                }`}
                                                        >
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Sort Order */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                    {icons.sort}
                                                    Sort By Date Created
                                                </label>
                                                <select
                                                    value={sortOrder}
                                                    onChange={(e) => handleSortOrderChange(e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                                                >
                                                    <option value="newest">Newest First</option>
                                                    <option value="oldest">Oldest First</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Requests Table */}
                            {requests.data.length > 0 ? (
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Request #
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Requestor
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Department
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date Requested
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date Needed
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Purpose
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {requests.data.map((request) => (
                                                <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {request.request_number}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {request.user.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {request.department}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            {icons.calendar}
                                                            {new Date(request.date_requested).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            {icons.calendar}
                                                        {new Date(request.date_needed).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {request.purpose}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        ₱{parseFloat(request.amount).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ring-1 ${getStatusBadgeClass(request.status)}`}>
                                                            {request.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        {request.status === 'pending' && (
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleApproval(request.id, 'approved')}
                                                                    disabled={processingId === request.id}
                                                                    className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-xs font-medium rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                                                                >
                                                                    {processingId === request.id ? 'Processing...' : 'Approve'}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleApproval(request.id, 'rejected')}
                                                                    disabled={processingId === request.id}
                                                                    className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-800 text-xs font-medium rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                                                >
                                                                    {processingId === request.id ? 'Processing...' : 'Reject'}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
                                    <p className="mt-1 text-sm text-gray-500">No petty cash requests match your current filters.</p>
                                </div>
                            )}
                            
                            <div className="mt-6">
                                <Pagination links={requests.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 