import { useState } from 'react';
import { format } from 'date-fns';

export default function RequestTable() {
    // Sample data - replace with actual API data
    const [requests, setRequests] = useState([
        {
            id: 1,
            type: 'Supply',
            name: 'John Doe',
            email: 'john@example.com',
            branch: 'Laguna',
            amount: 1500,
            status: 'Pending',
            date: '2024-03-20',
            items: 'Office Supplies',
            description: 'Monthly office supplies request'
        },
        {
            id: 2,
            type: 'Reimbursement',
            name: 'Jane Smith',
            email: 'jane@example.com',
            branch: 'Cebu',
            amount: 2500,
            status: 'Approved',
            date: '2024-03-21',
            particular: 'Travel Expenses',
            breakdown: 'Transportation: 1500\nMeals: 1000'
        }
    ]);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    // Add state for selected request details
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    // Handle status update
    const handleStatusUpdate = (requestId, newStatus) => {
        setRequests(requests.map(request =>
            request.id === requestId ? { ...request, status: newStatus } : request
        ));
        // Here you would make an API call to update the status
    };

    // Filter requests based on selected filters
    const filteredRequests = requests.filter(request => {
        const matchesStatus = statusFilter === 'all' || request.status.toLowerCase() === statusFilter;
        const matchesType = typeFilter === 'all' || request.type.toLowerCase() === typeFilter;
        return matchesStatus && matchesType;
    });

    // Function to handle view details
    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowDetails(true);
    };

    return (
        <div className="p-6">
            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Type:</label>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="all">All</option>
                        <option value="supply">Supply</option>
                        <option value="reimbursement">Reimbursement</option>
                    </select>
                </div>
            </div>

            {/* Details Modal */}
            {showDetails && selectedRequest && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Request Details #{selectedRequest.id}
                            </h3>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Request Type</p>
                                    <p className="mt-1">{selectedRequest.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        selectedRequest.status === 'Approved' 
                                            ? 'bg-green-100 text-green-800'
                                            : selectedRequest.status === 'Rejected'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Name</p>
                                    <p className="mt-1">{selectedRequest.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="mt-1">{selectedRequest.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Branch</p>
                                    <p className="mt-1">{selectedRequest.branch}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Amount</p>
                                    <p className="mt-1">₱{selectedRequest.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Date Submitted</p>
                                    <p className="mt-1">{selectedRequest.date}</p>
                                </div>
                            </div>

                            {/* Supply Request specific fields */}
                            {selectedRequest.type === 'Supply' && (
                                <>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Items</p>
                                        <p className="mt-1 whitespace-pre-line">{selectedRequest.items}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Description</p>
                                        <p className="mt-1 whitespace-pre-line">{selectedRequest.description}</p>
                                    </div>
                                </>
                            )}

                            {/* Reimbursement specific fields */}
                            {selectedRequest.type === 'Reimbursement' && (
                                <>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Particular</p>
                                        <p className="mt-1">{selectedRequest.particular}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Breakdown</p>
                                        <p className="mt-1 whitespace-pre-line">{selectedRequest.breakdown}</p>
                                    </div>
                                    {selectedRequest.receipt && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Receipt</p>
                                            <img 
                                                src={selectedRequest.receipt} 
                                                alt="Receipt" 
                                                className="mt-1 max-h-48 object-contain"
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDetails(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Close
                            </button>
                            {selectedRequest.status === 'Pending' && (
                                <>
                                    <button
                                        onClick={() => {
                                            handleStatusUpdate(selectedRequest.id, 'Approved');
                                            setShowDetails(false);
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleStatusUpdate(selectedRequest.id, 'Rejected');
                                            setShowDetails(false);
                                        }}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Request ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Branch
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{request.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        request.type === 'Supply' 
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {request.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>{request.name}</div>
                                    <div className="text-xs text-gray-400">{request.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {request.branch}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ₱{request.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        request.status === 'Approved' 
                                            ? 'bg-green-100 text-green-800'
                                            : request.status === 'Rejected'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {request.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {request.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleViewDetails(request)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        View Details
                                    </button>
                                    {request.status === 'Pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(request.id, 'Approved')}
                                                className="text-green-600 hover:text-green-900 mr-3"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(request.id, 'Rejected')}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary Cards */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="rounded-md bg-blue-500 p-3">
                                    {/* Add icon here if needed */}
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Requests
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {requests.length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="rounded-md bg-yellow-500 p-3">
                                    {/* Add icon here if needed */}
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Pending
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {requests.filter(r => r.status === 'Pending').length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="rounded-md bg-green-500 p-3">
                                    {/* Add icon here if needed */}
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Approved
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {requests.filter(r => r.status === 'Approved').length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="rounded-md bg-red-500 p-3">
                                    {/* Add icon here if needed */}
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Rejected
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {requests.filter(r => r.status === 'Rejected').length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 