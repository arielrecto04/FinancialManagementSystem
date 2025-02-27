import React from 'react';
import { formatDate } from '@/utils';

export default function RequestDetailsModal({ isOpen, onClose, request }) {
    if (!isOpen || !request) return null;

    const isSupplyRequest = request.type === 'Supply';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-black opacity-30"></div>
                <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full">
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Request Details
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Request Information */}
                            <div className="col-span-2 bg-gray-50 p-4 rounded-lg mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Request Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Request Number</p>
                                        <p className="font-medium">{request.request_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Type</p>
                                        <p className="font-medium">{request.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <p className="font-medium capitalize">{request.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date Created</p>
                                        <p className="font-medium">{request.created_at_formatted}</p>
                                    </div>
                                </div>
                            </div>

                            {/* User Information */}
                            <div className="col-span-2 bg-gray-50 p-4 rounded-lg mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Requestor Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium">{request.user_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Department</p>
                                        <p className="font-medium">{request.department}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Request Details */}
                            <div className="col-span-2">
                                <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                                {request.type === 'Supply' && (
                                    <>
                                        <p className="text-sm text-gray-500 mb-1">Items</p>
                                        <div className="border rounded-lg overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {request.items_json && request.items_json.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.item}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.unit}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                {request.type === 'Reimbursement' && (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Expense Type</p>
                                            <p className="font-medium">{request.expense_type}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Description</p>
                                            <p className="font-medium">{request.description}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Amount</p>
                                            <p className="font-medium">₱{parseFloat(request.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                        </div>
                                        {request.receipt_path && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-2">Receipt</p>
                                                <button
                                                    onClick={() => window.open(`/storage/${request.receipt_path}`, '_blank')}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                        <path d="M10 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm-1 8a1 1 0 100 2h2a1 1 0 100-2h-2z" />
                                                    </svg>
                                                    View Receipt
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {request.type === 'Liquidation' && (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Particulars</p>
                                            <p className="font-medium">{request.particulars}</p>
                                        </div>
                                        <div className="border rounded-lg overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {request.items && request.items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Cash Advance Amount</p>
                                                <p className="font-medium">₱{parseFloat(request.cash_advance_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Total Amount</p>
                                                <p className="font-medium">₱{parseFloat(request.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Amount to Refund</p>
                                                <p className="font-medium">₱{parseFloat(request.amount_to_refund).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Amount to Reimburse</p>
                                                <p className="font-medium">₱{parseFloat(request.amount_to_reimburse).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Remarks Section */}
                            {request.remarks && (
                                <div className="col-span-2">
                                    <h4 className="font-medium text-gray-900 mb-2">Remarks</h4>
                                    <p className="text-sm text-gray-600">{request.remarks}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-4 border-t bg-gray-50">
                        <div className="flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 