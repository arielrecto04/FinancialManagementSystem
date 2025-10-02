import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import RequestTable from '@/Components/RequestTable';
import Modal from '@/Components/Modal';

export default function BudgetTypeIndex({ budgetTypes }) {
    // Hardcoded budget types data

    const [budgetTypesData, setBudgetTypesData] = useState(budgetTypes.data);

    // State for modal
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [selectedBudgetType, setSelectedBudgetType] = useState(null);

    const handleRowClick = (budgetType) => {
        // Handle row click (e.g., navigate to edit page or show details)
        console.log('Selected budget type:', budgetType);
    };

    const handleViewExpenses = (e, budgetType) => {
        e.stopPropagation();
        setSelectedBudgetType(budgetType);
        setShowExpenseModal(true);
    };

    const handleEdit = (e, budgetType) => {
        e.stopPropagation();
        console.log('Edit budget type:', budgetType.id);
        // Add edit logic here
    };

    const handleDelete = (e, budgetType) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${budgetType.name}"?`)) {
            console.log('Delete budget type:', budgetType.id);
            // Add delete logic here
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const closeModal = () => {
        setShowExpenseModal(false);
        setSelectedBudgetType(null);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Budget Types" />

            <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Budget Types</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your budget categories and their configurations
                        </p>
                    </div>
                    <Link
                        href={route('budget-types.create')}
                        className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase bg-blue-600 rounded-md border border-transparent transition duration-150 ease-in-out hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <PlusIcon className="mr-2 w-4 h-4" />
                        New Budget Type
                    </Link>
                </div>



                {/* Budget Type Details Section */}
                <div className="mt-8">
                    {/* <h3 className="mb-4 text-lg font-medium text-gray-900">Budget Type Details</h3> */}
                    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Name
                                    </th>
                                    {/* <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Budgets
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Last Used
                                    </th> */}
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {budgetTypesData.map((budgetType) => (
                                    <tr key={budgetType.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{budgetType.name}</div>
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500">{budgetType.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                budgetType.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {budgetType.status.charAt(0).toUpperCase() + budgetType.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {budgetType.budgets_count}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {formatDate(budgetType.last_used)}
                                        </td> */}
                                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(budgetType)}

                                            >
                                               <EyeIcon className="w-5 h-5 text-gray-400" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Expense Items Modal */}
            <Modal show={showExpenseModal} onClose={closeModal} maxWidth="2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            {selectedBudgetType?.name} - Expense Items
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                            onClick={closeModal}
                        >
                            <span className="sr-only">Close</span>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-4">
                        {selectedBudgetType?.expenses?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Expense Model
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Type
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedBudgetType.expenses.map((expense) => (
                                            <tr key={expense.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                    {expense.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    {expense.expense_model}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        expense.is_expense ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {expense.is_expense ? 'Expense' : 'Asset'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-4 text-center text-gray-500">
                                No expense items found for this budget type.
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
