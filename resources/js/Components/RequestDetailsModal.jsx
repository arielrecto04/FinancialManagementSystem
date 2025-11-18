import React from "react";
import { formatDate } from "@/utils";
import { formatCurrency } from "@/utils/currency";
import Modal from "@/Components/Modal";

export default function RequestDetailsModal({
    isOpen,
    onClose,
    request,
    onEditItems,
    auth,
    children,
    otherActionButtons,
}) {
    if (!isOpen || !request) return null;

    const isSupplyRequest =
        request.type === "Supply" ||
        request.type === "Supply Request" ||
        request.type?.toLowerCase().includes("supply");
    const canEditItems = auth?.user?.role === "superadmin";


    console.log(request, 'request')

    return (
        <div className="overflow-y-auto fixed inset-0 z-50">
            <div className="flex justify-center items-center p-4 min-h-screen">
                <div className="fixed inset-0 bg-black opacity-30"></div>
                <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl">
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Request Details
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Close</span>
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Request Information */}
                            <div className="col-span-2 p-4 mb-4 bg-gray-50 rounded-lg">
                                <h4 className="mb-2 font-medium text-gray-900">
                                    Request Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Request Number
                                        </p>
                                        <p className="font-medium">
                                            {request.request_number}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Type
                                        </p>
                                        <p className="font-medium">
                                            {request.type}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Status
                                        </p>
                                        <p className="font-medium capitalize">
                                            {request.status}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Date Created
                                        </p>
                                        <p className="font-medium">
                                            {request.created_at}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* User Information */}
                            <div className="col-span-2 p-4 mb-4 bg-gray-50 rounded-lg">
                                <h4 className="mb-2 font-medium text-gray-900">
                                    Requestor Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Name
                                        </p>
                                        <p className="font-medium">
                                            {request.user_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Department
                                        </p>
                                        <p className="font-medium">
                                            {request.department}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 py-2 mt-2 w-full">
                                <p className="text-sm text-gray-600">
                                    Location
                                </p>
                                <p className="font-medium">
                                    {request.location}
                                </p>
                            </div>

                            {/* Request Details */}
                            <div className="col-span-2">
                                <h4 className="mb-2 font-medium text-gray-900">
                                    Details
                                </h4>
                                {isSupplyRequest && (
                                    <>
                                        <div className="mt-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    Items
                                                </h3>
                                                {auth?.user?.role !==
                                                    ("superadmin" ||
                                                        "admin") && (
                                                    <button
                                                        onClick={onEditItems}
                                                        className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                                                    >
                                                        <svg
                                                            className="mr-2 w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                        Edit Items
                                                    </button>
                                                )}
                                            </div>
                                            <div className="mt-4 space-y-4">
                                                {request.items_json &&
                                                Array.isArray(
                                                    request.items_json
                                                ) ? (
                                                    request.items_json.map(
                                                        (item, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                                                            >
                                                                <div className="flex-1">
                                                                    <p className="font-medium">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-gray-600">
                                                                        Quantity:{" "}
                                                                        {
                                                                            item.quantity
                                                                        }{" "}
                                                                        ×{" "}
                                                                        {
                                                                            item.price
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-medium">
                                                                        {item.quantity *
                                                                            item.price}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <p className="italic text-gray-500">
                                                        No items found
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col mt-4 mb-6">
                                                <h1 className="text-lg font-medium text-gray-900">
                                                    Attachments
                                                </h1>

                                                <div className="flex-1 gap-2 mt-2">
                                                    {request.attachments.map(
                                                        (attachment, index) => (
                                                            <div
                                                                className="flex space-x-2"
                                                                key={index}
                                                            >
                                                                <button
                                                                    onClick={() =>
                                                                        window.open(
                                                                            `${attachment.file_path}`,
                                                                            "_blank"
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="mr-2 w-5 h-5"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                                        <path d="M10 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm-1 8a1 1 0 100 2h2a1 1 0 100-2h-2z" />
                                                                    </svg>
                                                                    View Receipt
                                                                </button>
                                                                <a
                                                                    href={`${attachment.file_path}`}
                                                                    download
                                                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="mr-2 w-5 h-5"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                    Download
                                                                </a>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-end mt-6">
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600">
                                                        Total Amount
                                                    </p>
                                                    <p className="text-xl font-semibold">
                                                        {request.total_amount}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {request.type === "Reimbursement" && (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Expense Type
                                            </p>
                                            <p className="font-medium">
                                                {request.expense_type}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Expense Date
                                            </p>
                                            {console.log(request, "request")}
                                            <p className="font-medium">
                                                {request.expense_date}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-500">
                                                Expense Items
                                            </p>
                                            {request.expense_items ? (
                                                <>
                                                    <div className="flex flex-col gap-2">
                                                        <table>
                                                            <thead>
                                                                <tr className="p-2 bg-gray-200 rounded-lg">
                                                                    <th className="p-2 text-start">
                                                                        Description
                                                                    </th>
                                                                    <th className="p-2 text-start">
                                                                        Quantity
                                                                    </th>
                                                                    <th className="p-2 text-start">
                                                                        Amount
                                                                    </th>
                                                                    <th className="p-2 text-start">
                                                                        Total
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {JSON.parse(
                                                                    request.expense_items
                                                                ).map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <td className="p-2">
                                                                                {
                                                                                    item.description
                                                                                }
                                                                            </td>
                                                                            <td className="p-2">
                                                                                {
                                                                                    item.quantity
                                                                                }

                                                                                x
                                                                            </td>
                                                                            <td className="p-2">
                                                                                ₱
                                                                                {
                                                                                    item.amount
                                                                                }
                                                                            </td>

                                                                            <td className="p-2">
                                                                                ₱
                                                                                {
                                                                                    item.total
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-medium">
                                                        No expense items found
                                                    </p>
                                                </>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Description
                                            </p>
                                            <p className="font-medium">
                                                {request.description}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Amount
                                            </p>
                                            <p className="font-medium">
                                                ₱
                                                {parseFloat(
                                                    request.amount
                                                ).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </p>
                                        </div>
                                        {request.receipt_path && (
                                            <div>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    Receipt
                                                </p>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            window.open(
                                                                `/storage/${request.receipt_path}`,
                                                                "_blank"
                                                            )
                                                        }
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mr-2 w-5 h-5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                            <path d="M10 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm-1 8a1 1 0 100 2h2a1 1 0 100-2h-2z" />
                                                        </svg>
                                                        View Receipt
                                                    </button>
                                                    <a
                                                        href={`/storage/${request.receipt_path}`}
                                                        download
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mr-2 w-5 h-5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Download
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex-1 gap-2 mt-2">
                                            {request.attachments.map(
                                                (attachment, index) => (
                                                    <div
                                                        className="flex space-x-2"
                                                        key={index}
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                window.open(
                                                                    `${attachment.file_path}`,
                                                                    "_blank"
                                                                )
                                                            }
                                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="mr-2 w-5 h-5"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                                <path d="M10 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm-1 8a1 1 0 100 2h2a1 1 0 100-2h-2z" />
                                                            </svg>
                                                            View Receipt
                                                        </button>
                                                        <a
                                                            href={`${attachment.file_path}`}
                                                            download
                                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="mr-2 w-5 h-5"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            Download
                                                        </a>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {request.type === "Liquidation" && (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Expense Type
                                            </p>
                                            <p className="font-medium">
                                                {request.expense_type}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Particulars
                                            </p>
                                            <p className="font-medium">
                                                {request.particulars}
                                            </p>
                                        </div>
                                        <div className="overflow-hidden rounded-lg border">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                                            Category
                                                        </th>
                                                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                                            Description
                                                        </th>
                                                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                                            Amount
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {request.items &&
                                                        request.items.map(
                                                            (item, index) => (
                                                                <tr key={index}>
                                                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                                        {
                                                                            item.category
                                                                        }
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                                        {
                                                                            item.description
                                                                        }
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                                        ₱
                                                                        {parseFloat(
                                                                            item.amount
                                                                        ).toLocaleString(
                                                                            undefined,
                                                                            {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2,
                                                                            }
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Cash Advance Amount
                                                </p>
                                                <p className="font-medium">
                                                    ₱
                                                    {parseFloat(
                                                        request.cash_advance_amount
                                                    ).toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Total Amount
                                                </p>
                                                <p className="font-medium">
                                                    ₱
                                                    {parseFloat(
                                                        request.total_amount
                                                    ).toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Amount to Refund
                                                </p>
                                                <p className="font-medium">
                                                    ₱
                                                    {parseFloat(
                                                        request.amount_to_refund
                                                    ).toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Amount to Reimburse
                                                </p>
                                                <p className="font-medium">
                                                    ₱
                                                    {parseFloat(
                                                        request.amount_to_reimburse
                                                    ).toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        {request.receipt_path && (
                                            <div>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    Receipt
                                                </p>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            window.open(
                                                                `${request.receipt_path}`,
                                                                "_blank"
                                                            )
                                                        }
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mr-2 w-5 h-5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                            <path d="M10 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm-1 8a1 1 0 100 2h2a1 1 0 100-2h-2z" />
                                                        </svg>
                                                        View Receipt
                                                    </button>
                                                    <a
                                                        href={`${request.receipt_path}`}
                                                        download
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mr-2 w-5 h-5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Download
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex-1 gap-2 mt-2">
                                            <p className="mb-2 text-sm text-gray-500">
                                                Receipt ({" "}
                                                {request.attachments.length} )
                                            </p>
                                            {request.attachments.map(
                                                (attachment, index) => (
                                                    <div
                                                        className="flex space-x-2"
                                                        key={index}
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                window.open(
                                                                    `${attachment.file_path}`,
                                                                    "_blank"
                                                                )
                                                            }
                                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="mr-2 w-5 h-5"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                                <path d="M10 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm-1 8a1 1 0 100 2h2a1 1 0 100-2h-2z" />
                                                            </svg>
                                                            View Receipt
                                                        </button>
                                                        <a
                                                            href={`${attachment.file_path}`}
                                                            download
                                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="mr-2 w-5 h-5"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            Download
                                                        </a>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {request.type === "HR Expense" && (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Expenses Category
                                            </p>
                                            <p className="font-medium">
                                                {request.expenses_category}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Description of Expenses
                                            </p>
                                            <p className="font-medium">
                                                {request.description}
                                            </p>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-sm text-gray-500">
                                                    Breakdown of Expense
                                                </p>
                                                {auth?.user?.role !==
                                                    ("superadmin" ||
                                                        "admin") && (
                                                    <button
                                                        onClick={onEditItems}
                                                        className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                                                    >
                                                        <svg
                                                            className="mr-2 w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                        Edit Breakdown
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="font-medium whitespace-pre-line">
                                                    {request.breakdown_of_expense ||
                                                        request.breakdown}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Total Amount Requested
                                            </p>
                                            <p className="text-lg font-medium">
                                                {formatCurrency(
                                                    request.total_amount
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Expected Payment Date
                                            </p>
                                            <p className="font-medium">
                                                {new Date(
                                                    request.expected_payment_date
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {request.receipt_path && (
                                            <div>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    Receipt
                                                </p>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            window.open(
                                                                `${request.receipt_path}`,
                                                                "_blank"
                                                            )
                                                        }
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mr-2 w-5 h-5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                            <path d="M10 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm-1 8a1 1 0 100 2h2a1 1 0 100-2h-2z" />
                                                        </svg>
                                                        View Receipt
                                                    </button>
                                                    <a
                                                        href={`${request.receipt_path}`}
                                                        download
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mr-2 w-5 h-5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Download
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex-1 gap-2 mt-2">
                                            {request.attachments.map(
                                                (attachment, index) => (
                                                    <div
                                                        className="flex space-x-2"
                                                        key={index}
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                window.open(
                                                                    `${attachment.file_path}`,
                                                                    "_blank"
                                                                )
                                                            }
                                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="mr-2 w-5 h-5"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                                <path d="M10 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm-1 8a1 1 0 100 2h2a1 1 0 100-2h-2z" />
                                                            </svg>
                                                            View Receipt
                                                        </button>
                                                        <a
                                                            href={`${attachment.file_path}`}
                                                            download
                                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="mr-2 w-5 h-5"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            Download
                                                        </a>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {request.type === "Operating Expense" && (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Expense Type
                                            </p>
                                            <p className="font-medium">
                                                {request.expense_type}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Description
                                            </p>
                                            <p className="font-medium">
                                                {request.description}
                                            </p>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-sm text-gray-500">
                                                    Breakdown of Expenses
                                                </p>

                                                {auth?.user?.role !==
                                                    ("superadmin" ||
                                                        "admin") && (
                                                    <button
                                                        onClick={() =>
                                                            onEditItems(request)
                                                        }
                                                        className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                                                    >
                                                        <svg
                                                            className="mr-2 w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                        Edit Breakdown
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="font-medium whitespace-pre-line">
                                                    {request.breakdown_of_expense ||
                                                        request.breakdown}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Total Amount
                                            </p>
                                            <p className="text-lg font-medium">
                                                {formatCurrency(
                                                    request.total_amount
                                                )}
                                            </p>
                                        </div>
                                        {request.expected_payment_date && (
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Expected Payment Date
                                                </p>
                                                <p className="font-medium">
                                                    {new Date(
                                                        request.expected_payment_date
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                        {request.receipt_path && (
                                            <div>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    Receipt
                                                </p>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            window.open(
                                                                `${request.receipt_path}`,
                                                                "_blank"
                                                            )
                                                        }
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mr-2 w-5 h-5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                            <path d="M10 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm-1 8a1 1 0 100 2h2a1 1 0 100-2h-2z" />
                                                        </svg>
                                                        View Receipt
                                                    </button>
                                                    <a
                                                        href={`${request.receipt_path}`}
                                                        download
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mr-2 w-5 h-5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Download
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex-1 gap-2 mt-2">
                                            {request.attachments.map(
                                                (attachment, index) => (
                                                    <div
                                                        className="flex space-x-2"
                                                        key={index}
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                window.open(
                                                                    `${attachment.file_path}`,
                                                                    "_blank"
                                                                )
                                                            }
                                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="mr-2 w-5 h-5"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                                <path d="M10 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm-1 8a1 1 0 100 2h2a1 1 0 100-2h-2z" />
                                                            </svg>
                                                            View Receipt
                                                        </button>
                                                        <a
                                                            href={`${attachment.file_path}`}
                                                            download
                                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="mr-2 w-5 h-5"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            Download
                                                        </a>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {request.type === "Petty Cash" && (
                                    <div className="flex-1 gap-2 mt-2">
                                        {request.attachments.map(
                                            (attachment, index) => (
                                                <div
                                                    className="flex space-x-2"
                                                    key={index}
                                                >
                                                    <button
                                                        onClick={() =>
                                                            window.open(
                                                                `${attachment.file_path}`,
                                                                "_blank"
                                                            )
                                                        }
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mr-2 w-5 h-5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                            <path d="M10 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm-1 8a1 1 0 100 2h2a1 1 0 100-2h-2z" />
                                                        </svg>
                                                        View Receipt
                                                    </button>
                                                    <a
                                                        href={`${attachment.file_path}`}
                                                        download
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mr-2 w-5 h-5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Download
                                                    </a>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Remarks Section */}
                            {request.remarks && (
                                <div className="col-span-2">
                                    <h4 className="mb-2 font-medium text-gray-900">
                                        Remarks
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {request.remarks}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="py-4 border-t border-gray-200 max-h-[400px] overflow-y-auto">
                        {children}
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t">
                        <div className="flex gap-2 justify-end">
                            {otherActionButtons && otherActionButtons(request)}
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
