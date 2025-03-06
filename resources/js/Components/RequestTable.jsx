import React from 'react';
import { usePage } from '@inertiajs/react';

export default function RequestTable({ requests, onRowClick, actionRenderer }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
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
                {requests.map((request) => (
                    <tr
                        key={`${request.type}-${request.id}-${request.request_number}`}
                        onClick={() => onRowClick(request)}
                        className="hover:bg-gray-50 cursor-pointer"
                    >
                        <td className="px-6 py-4 whitespace-nowrap">
                            {request.request_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {request.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {request.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {request.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            ₱{request.total_amount || request.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(request.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {actionRenderer && actionRenderer(request)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
} 