import React from 'react';
import { formatDate } from '@/utils';

export default function RequestDetailsModal({ isOpen, onClose, request }) {
    if (!isOpen || !request) return null;

    const isSupplyRequest = request.type === 'Supply';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 w-full text-left sm:mt-0">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Request Details - #{request.request_number}
                                </h3>
                                <div className="mt-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Department</p>
                                            <p className="text-sm text-gray-900">{request.department}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Status</p>
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {request.status}
                                            </span>
                                        </div>
                                    </div>

                                    {isSupplyRequest ? (
                                        // Supply Request Details
                                        <>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Purpose</p>
                                                <p className="text-sm text-gray-900">{request.purpose}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Date Needed</p>
                                                <p className="text-sm text-gray-900">{formatDate(request.date_needed)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Items</p>
                                                <div className="mt-2 max-h-40 overflow-y-auto">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200 bg-white">
                                                            {request.items_json.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900">{item.name}</td>
                                                                    <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900">{item.quantity}</td>
                                                                    <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900">₱{item.price}</td>
                                                                    <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-900">₱{item.quantity * item.price}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        // Reimbursement Request Details
                                        <>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Expense Type</p>
                                                <p className="text-sm text-gray-900">{request.expense_type}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Expense Date</p>
                                                <p className="text-sm text-gray-900">{formatDate(request.expense_date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Description</p>
                                                <p className="text-sm text-gray-900">{request.description}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Receipt</p>
                                                <a 
                                                    href={`/storage/${request.receipt_path}`} 
                                                    target="_blank"
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    View Receipt
                                                </a>
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total Amount</p>
                                        <p className="text-sm text-gray-900">₱{request.total_amount || request.amount}</p>
                                    </div>

                                    {request.remarks && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Remarks</p>
                                            <p className="text-sm text-gray-900">{request.remarks}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 