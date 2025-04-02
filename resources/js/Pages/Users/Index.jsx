import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FiEdit2, FiTrash2, FiPlus, FiDollarSign, FiUsers, FiSave, FiRefreshCw, FiGrid, FiList } from 'react-icons/fi';
import Pagination from '@/Components/Pagination';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SearchInput from '@/Components/SearchInput';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ auth, users, budgets, flash }) {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const budgetForm = useForm({
        total_budget: '',
        replenishment_amount: '',
    });

    const resetForm = useForm();

    const filteredUsers = users.data.filter(user => {
        const matchesSearch = !searchTerm || 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTab = activeTab === 'all' || 
            (activeTab === 'admins' && (user.role === 'admin' || user.role === 'superadmin'));

        return matchesSearch && matchesTab;
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleDelete = (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            destroy(route('users.destroy', userId));
        }
    };

    const openBudgetModal = (user) => {
        const budget = getUserBudget(user.id);
        setSelectedUser(user);
        budgetForm.setData('total_budget', budget?.total_budget?.toString() || '');
        budgetForm.setData('replenishment_amount', budget?.replenishment_amount?.toString() || '');
        setShowBudgetModal(true);
    };

    const closeBudgetModal = () => {
        setShowBudgetModal(false);
        setSelectedUser(null);
        budgetForm.reset();
    };

    const handleSaveBudget = (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        setProcessing(true);
        const budget = getUserBudget(selectedUser.id);

        // Prepare the data to send
        const formData = {
            total_budget: budgetForm.data.total_budget || '0',
            replenishment_amount: budgetForm.data.replenishment_amount || '0'
        };

        if (budget) {
            // If there's a replenishment amount, send it as a separate field
            if (formData.replenishment_amount !== '0') {
                router.patch(route('admin-budgets.update', budget.id), {
                    total_budget: budget.total_budget,
                    replenishment_amount: formData.replenishment_amount
                }, {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        closeBudgetModal();
                        router.visit(route('users.index'), {
                            preserveScroll: true,
                            preserveState: true,
                            only: ['budgets']
                        });
                        setProcessing(false);
                    },
                    onError: () => setProcessing(false),
                    onFinish: () => {
                        setProcessing(false);
                        closeBudgetModal();
                    },
                });
            } else {
                // Regular budget update
                router.patch(route('admin-budgets.update', budget.id), {
                    total_budget: formData.total_budget
                }, {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        closeBudgetModal();
                        router.visit(route('users.index'), {
                            preserveScroll: true,
                            preserveState: true,
                            only: ['budgets']
                        });
                        setProcessing(false);
                    },
                    onError: () => setProcessing(false),
                    onFinish: () => {
                        setProcessing(false);
                        closeBudgetModal();
                    },
                });
            }
        } else {
            // Creating new budget
            router.post(route('admin-budgets.store'), {
                user_id: selectedUser.id,
                total_budget: formData.total_budget
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    closeBudgetModal();
                    router.visit(route('users.index'), {
                        preserveScroll: true,
                        preserveState: true,
                        only: ['budgets']
                    });
                    setProcessing(false);
                },
                onError: () => setProcessing(false),
                onFinish: () => {
                    setProcessing(false);
                    closeBudgetModal();
                },
            });
        }
    };

    const handleResetBudget = (userId, budget) => {
        if (!budget) return;
        setSelectedBudget(budget);
        setShowResetModal(true);
    };

    const closeResetModal = () => {
        setShowResetModal(false);
        setSelectedBudget(null);
        resetForm.reset();
    };

    const confirmReset = () => {
        if (!selectedBudget) return;
        
        setProcessing(true);
        
        // Make the PATCH request with total_budget set to 0
        router.patch(route('admin-budgets.update', selectedBudget.id), 
            { total_budget: '0' },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setProcessing(false);
                    closeResetModal();
                    router.visit(route('users.index'), {
                        preserveScroll: true,
                        preserveState: true,
                        only: ['budgets']
                    });
                },
                onError: (errors) => {
                    setProcessing(false);
                    console.error('Reset error:', errors);
                },
                onFinish: () => {
                    setProcessing(false);
                    closeResetModal();
                }
            }
        );
    };

    const getUserBudget = (userId) => {
        return budgets?.data?.find(budget => budget.user_id === userId);
    };

    const TabButton = ({ label, value }) => (
        <button
            onClick={() => setActiveTab(value)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === value
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
        >
            {label}
        </button>
    );

    const ViewToggle = () => (
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
                onClick={() => setViewMode('table')}
                className={`flex items-center px-3 py-1.5 rounded ${
                    viewMode === 'table' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                <FiList className="w-4 h-4 mr-1" />
                Table
            </button>
            <button
                onClick={() => setViewMode('card')}
                className={`flex items-center px-3 py-1.5 rounded ${
                    viewMode === 'card' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                <FiGrid className="w-4 h-4 mr-1" />
                Cards
            </button>
        </div>
    );

    const CardView = () => {
        const adminsAndSuperadmins = paginatedUsers.filter(user => 
            user.role === 'admin' || user.role === 'superadmin'
        );

        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminsAndSuperadmins.map((user) => {
                        const budget = getUserBudget(user.id);
                        return (
                            <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs rounded-full ${
                                            user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-500">Total Budget</span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg font-semibold text-blue-600">
                                                    ₱{budget ? parseFloat(budget.total_budget).toLocaleString() : '0'}
                                                </span>
                                                {auth.user.role === 'superadmin' && (
                                                    <button
                                                        onClick={() => openBudgetModal(user)}
                                                        className="p-1 text-blue-600 hover:text-blue-800"
                                                    >
                                                        <FiEdit2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-500">Used Budget</span>
                                            <span className="text-lg font-semibold text-orange-600">
                                                ₱{budget ? parseFloat(budget.used_budget).toLocaleString() : '0'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-500">Remaining Budget</span>
                                            <span className={`text-lg font-semibold ${
                                                budget && parseFloat(budget.remaining_budget) > 0 
                                                    ? 'text-green-600' 
                                                    : 'text-red-600'
                                            }`}>
                                                ₱{budget ? parseFloat(budget.remaining_budget).toLocaleString() : '0'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <Link
                                            href={route('users.edit', user.id)}
                                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-900"
                                        >
                                            <FiEdit2 className="w-4 h-4 mr-1" />
                                            Edit
                                        </Link>
                                        {auth.user.role === 'superadmin' && budget && (
                                            <button
                                                onClick={() => handleResetBudget(user.id, budget)}
                                                className="inline-flex items-center text-sm text-orange-600 hover:text-orange-900"
                                            >
                                                <FiRefreshCw className="w-4 h-4 mr-1" />
                                                Reset Budget
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {totalPages > 1 && (
                    <div className="mt-6">
                        <div className="flex justify-center">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`mx-1 px-4 py-2 rounded ${
                                        currentPage === i + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
          
        >
            <Head title="User Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-4">
                                    <h2 className="text-2xl font-semibold text-gray-900">Users</h2>
                                    <div className="flex items-center space-x-2">
                                        <TabButton label="All Users" value="all" />
                                        <TabButton label="Admins & Superadmins" value="admins" />
                                    </div>
                                    <SearchInput
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search users..."
                                    />
                                    {activeTab === 'admins' && <ViewToggle />}
                                </div>
                                    <Link
                                        href={route('users.create')}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                    >
                                        <FiPlus className="mr-2" />
                                        Add User
                                    </Link>
                            </div>

                            {activeTab === 'admins' && viewMode === 'card' ? (
                                <CardView />
                            ) : (
                                <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                                    {activeTab === 'admins' && (
                                                        <>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Budget</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used Budget</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Budget</th>
                                                        </>
                                                    )}
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                                {paginatedUsers.map((user) => {
                                                    const budget = getUserBudget(user.id);
                                                    const canSetBudget = user.role === 'admin' || user.role === 'superadmin';
                                                    return (
                                                        <tr key={user.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                                    user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                                                    user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                                                                    user.role === 'hr' ? 'bg-green-100 text-green-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                    {user.role}
                                                                </span>
                                                            </td>
                                                            {activeTab === 'admins' && (
                                                                <>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        {canSetBudget ? (
                                                                            <div className="flex items-center space-x-2">
                                                                                <span className={`px-2 py-1 text-sm rounded-md bg-blue-50 text-blue-700`}>
                                                                                    {budget ? `₱${parseFloat(budget.total_budget).toLocaleString()}` : '₱0'}
                                                                                </span>
                                                                                {auth.user.role === 'superadmin' && (
                                                                                    <button
                                                                                        onClick={() => openBudgetModal(user)}
                                                                                        className="p-1 text-blue-600 hover:text-blue-800"
                                                                                    >
                                                                                        <FiEdit2 className="w-4 h-4" />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-gray-400 text-sm">Not applicable</span>
                                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        {canSetBudget && (
                                                                            <span className={`px-2 py-1 text-sm rounded-md ${
                                                                                budget ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-500'
                                                                            }`}>
                                                                                {budget ? `₱${parseFloat(budget.used_budget).toLocaleString()}` : '₱0'}
                                                                            </span>
                                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        {canSetBudget && (
                                                                            <span className={`px-2 py-1 text-sm rounded-md ${
                                                                                budget ? (parseFloat(budget.remaining_budget) > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700') : 'bg-gray-50 text-gray-500'
                                                                            }`}>
                                                                                {budget ? `₱${parseFloat(budget.remaining_budget).toLocaleString()}` : '₱0'}
                                                        </span>
                                                                        )}
                                                    </td>
                                                                </>
                                                            )}
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                            <Link
                                                                href={route('users.edit', user.id)}
                                                                    className="inline-flex items-center text-blue-600 hover:text-blue-900"
                                                            >
                                                                    <FiEdit2 className="w-4 h-4 mr-1" />
                                                                    Edit
                                                            </Link>
                                                                <button
                                                                    onClick={() => handleDelete(user.id)}
                                                                    className="inline-flex items-center text-red-600 hover:text-red-900"
                                                                >
                                                                    <FiTrash2 className="w-4 h-4 mr-1" />
                                                                    Delete
                                                                </button>
                                                                {activeTab === 'admins' && canSetBudget && budget && auth.user.role === 'superadmin' && (
                                                                    <button
                                                                        onClick={() => handleResetBudget(user.id, budget)}
                                                                        className="inline-flex items-center text-orange-600 hover:text-orange-900"
                                                                        title="Reset Budget to 0"
                                                                    >
                                                                        <FiRefreshCw className="w-4 h-4 mr-1" />
                                                                        Reset Budget
                                                                </button>
                                                            )}
                                                    </td>
                                                </tr>
                                                    );
                                                })}
                                    </tbody>
                                </table>
                            </div>
                                    {totalPages > 1 && (
                                <div className="mt-6">
                                            <div className="flex justify-center">
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <button
                                                        key={i + 1}
                                                        onClick={() => handlePageChange(i + 1)}
                                                        className={`mx-1 px-4 py-2 rounded ${
                                                            currentPage === i + 1
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                            </div>
                                </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showBudgetModal} onClose={closeBudgetModal}>
                <form onSubmit={handleSaveBudget} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Update Budget for {selectedUser?.name}
                    </h2>

                    <div className="mt-6">
                        <InputLabel htmlFor="total_budget" value="Set Total Budget" />
                        <TextInput
                            id="total_budget"
                            type="number"
                            step="0.01"
                            min="0"
                            className="mt-1 block w-full"
                            value={budgetForm.data.total_budget}
                            onChange={e => budgetForm.setData('total_budget', e.target.value)}
                            placeholder="Leave empty to only replenish"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Leave empty to only replenish the existing budget
                        </p>
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="replenishment_amount" value="Replenishment Amount" />
                        <TextInput
                            id="replenishment_amount"
                            type="number"
                            step="0.01"
                            min="0"
                            className="mt-1 block w-full"
                            value={budgetForm.data.replenishment_amount}
                            onChange={e => budgetForm.setData('replenishment_amount', e.target.value)}
                            placeholder="Enter amount to add to current budget"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Enter the amount you want to add to the current budget
                        </p>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <SecondaryButton onClick={closeBudgetModal}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={processing || (!budgetForm.data.total_budget && !budgetForm.data.replenishment_amount)}>
                            {processing ? 'Saving...' : 'Save Budget'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Reset Budget Modal */}
            <Modal show={showResetModal} onClose={closeResetModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Reset Budget Confirmation
                    </h2>

                    <p className="mt-3 text-sm text-gray-600">
                        Are you sure you want to reset this budget? This will:
                    </p>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                        <li>Set the total budget to ₱0</li>
                        <li>Reset the used budget to ₱0</li>
                        <li>Set the remaining budget to ₱0</li>
                    </ul>
                    <p className="mt-2 text-sm text-red-600 font-medium">
                        This action cannot be undone.
                    </p>

                    <div className="mt-6 flex justify-end gap-4">
                        <SecondaryButton onClick={closeResetModal} disabled={processing}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton
                            onClick={confirmReset}
                            disabled={processing}
                        >
                            {processing ? 'Resetting...' : 'Reset Budget'}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
} 