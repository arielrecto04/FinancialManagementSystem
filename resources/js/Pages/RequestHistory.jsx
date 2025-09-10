import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Pagination = ({ links }) => (
    <div className="mt-6 flex justify-center space-x-1">
        {links.map((link, index) => (
            <Link
                key={index}
                href={link.url}
                className={`px-4 py-2 border rounded-md text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
            />
        ))}
    </div>
);

const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'approved': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};



export default function RequestHistory({ auth, requests, filters = {} }) {
    // State for managing the search and filter inputs
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    // This effect watches for changes in the search or status state.
    useEffect(() => {
        const debounce = setTimeout(() => {
            router.get(route('requests.history'), {
                search: search,
                status: status,
            }, {
                preserveState: true,
                replace: true,
            });
        }, 300); // Debounce to avoid excessive requests while typing

        return () => clearTimeout(debounce);
    }, [search, status]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Request History" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200 space-y-6">
                            
                            {/* --- Page Header --- */}
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800">Request History</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    A complete log of all your submitted requests. Total of {requests.total} record(s) found.
                                </p>
                            </div>

                            {/* --- Search and Filter Controls --- */}
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by ID or type..."
                                    className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            {/* --- Requests Table --- */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {requests.data.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-16 text-gray-500">
                                                    No requests found for your selected filters.
                                                </td>
                                            </tr>
                                        ) : (
                                            requests.data.map((request) => (
                                                <tr key={`${request.type}-${request.id}`} className="hover:bg-gray-50 transition-colors duration-150">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{request.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.created_at).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(request.status)}`}>
                                                            {request.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>



                            {/* --- Pagination --- */}
                            {requests.data.length > 0 && <Pagination links={requests.links} />}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

