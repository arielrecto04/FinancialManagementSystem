import React from 'react';
import { Link } from '@inertiajs/react';

// This is a "presentational" component. It only receives data via props and displays it.
const RecentRequestsPanel = ({ requests = [] }) => {

    const getStatusClass = (status) => {
        // Helper to provide Tailwind CSS classes based on request status.
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 mt-6 bg-white rounded-xl border shadow-sm border-gray-200/70">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Requests</h3>
                <Link href={route('requests.history')} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    View All
                </Link>
            </div>
            <div className="space-y-3">
                {requests.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">You haven't made any requests yet.</p>
                ) : (
                    requests.map((request) => (
                        <div key={request.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 transition-colors hover:border-gray-200">
                            <div>
                                <p className="font-medium text-gray-900">Request #{request.id} - {request.type}</p>
                                <p className="text-xs text-gray-500">
                                    Submitted on: {new Date(request.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(request.status)}`}>
                                {request.status}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentRequestsPanel;
