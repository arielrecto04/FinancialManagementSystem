import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';

export default function Expenses() {
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [sortedExpenses, setSortedExpenses] = useState([]);

    const categories = [
        'Printing',
        'Electricity',
        'Internet',
        'Parking fee',
        'Water',
        'Drinking water',
        'Customer Relations',
        'Employee Incentives',
        'Intern Allowance',
        'Consultation',
        'HR Engagement',
        'Business Dev: Services',
        'Reimbursement',
        'Management/Personal',
        'Others'
    ];

    const paymentMethods = ['CASH', 'GCASH', 'PAYMAYA', 'BANK TRANSFER'];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Expenses Table
                </h2>
            }
        >
            <Head title="Expenses" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Main Expenses Table Section */}
                    <div className="p-6 mb-6 bg-white shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <select
                                className="px-4 py-2 border rounded-md"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                            <div className="space-x-2">
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                                >
                                    + Add
                                </button>
                                <button className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                                    Edit
                                </button>
                                <button className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Expenses Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-3 text-left">Date</th>
                                        <th className="p-3 text-left">Exp/Rep</th>
                                        <th className="p-3 text-left">Description</th>
                                        <th className="p-3 text-left">Req No.</th>
                                        <th className="p-3 text-left">QTY</th>
                                        <th className="p-3 text-left">In Money</th>
                                        <th className="p-3 text-left">Out Money</th>
                                        <th className="p-3 text-left">Running Balance</th>
                                        <th className="p-3 text-left">MOP</th>
                                        <th className="p-3 text-left">Reference</th>
                                        <th className="p-3 text-left">Category</th>
                                        <th className="p-3 text-left">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {/* Add your expense rows here */}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Highest to Lowest Monthly Expenses Section */}
                    <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-semibold">
                            Highest to Lowest Monthly Expense List
                        </h3>
                        <table className="w-full min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3 text-left">Date</th>
                                    <th className="p-3 text-left">Category</th>
                                    <th className="p-3 text-left">Description</th>
                                    <th className="p-3 text-left">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {/* Add your sorted expense rows here */}
                            </tbody>
                        </table>
                    </div>

                    {/* Add Expense Modal */}
                    <Dialog
                        open={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        className="relative z-50"
                    >
                        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-2xl p-6 bg-white rounded-lg">
                                <Dialog.Title className="text-lg font-medium">Add New Expense</Dialog.Title>
                                <form className="mt-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">Date</label>
                                            <input type="date" className="w-full px-3 py-2 border rounded-md" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">Type</label>
                                            <select className="w-full px-3 py-2 border rounded-md">
                                                <option>Expenses</option>
                                                <option>Replenish</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block mb-1 text-sm font-medium">Description</label>
                                            <textarea className="w-full px-3 py-2 border rounded-md" rows="2"></textarea>
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">Request No.</label>
                                            <input type="text" className="w-full px-3 py-2 border rounded-md" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">Quantity</label>
                                            <input type="number" className="w-full px-3 py-2 border rounded-md" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">Amount</label>
                                            <input type="number" className="w-full px-3 py-2 border rounded-md" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">Mode of Payment</label>
                                            <select className="w-full px-3 py-2 border rounded-md">
                                                {paymentMethods.map((method) => (
                                                    <option key={method}>{method}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">Reference No.</label>
                                            <input type="text" className="w-full px-3 py-2 border rounded-md" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">Category</label>
                                            <select className="w-full px-3 py-2 border rounded-md">
                                                {categories.map((category) => (
                                                    <option key={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block mb-1 text-sm font-medium">Receipt</label>
                                            <input type="file" className="w-full px-3 py-2 border rounded-md" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </div>
                    </Dialog>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
