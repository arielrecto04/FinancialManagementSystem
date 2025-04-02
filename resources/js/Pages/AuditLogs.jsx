import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';

export default function AuditLogs({ auth, logs = { data: [], meta: { last_page: 1 } } }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [activeTab, setActiveTab] = useState('requests');

    // Filter logs based on search term and type
    const filteredLogs = (logs?.data || []).filter(log => {
        const matchesSearch = !searchTerm || 
            (log.user_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (log.action?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (log.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        // Check if it's a budget activity by looking at both type and action fields
        const isBudgetActivity = log.type?.startsWith('budget_') || 
                                (log.action?.toLowerCase() || '').includes('budget');

        if (activeTab === 'requests') {
            // Show all non-budget activities in requests tab
            if (isBudgetActivity) return false;
            if (filterType === 'all') return matchesSearch;
            return matchesSearch && log.type === filterType;
        } else if (activeTab === 'financial') {
            // Only show budget activities in financial tab
            if (!isBudgetActivity) return false;
            if (filterType === 'all') return matchesSearch;
            return matchesSearch && log.type === filterType;
        }
        return false;
    });

    const handlePageChange = (page) => {
        router.get(route('audit-logs.index'), {
            page: page,
            search: searchTerm,
            filter: filterType,
            tab: activeTab
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        router.get(route('audit-logs.index'), {
            search: e.target.value,
            filter: filterType,
            tab: activeTab
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (newFilter) => {
        setFilterType(newFilter);
        router.get(route('audit-logs.index'), {
            search: searchTerm,
            filter: newFilter,
            tab: activeTab
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        setFilterType('all');
        router.get(route('audit-logs.index'), {
            search: searchTerm,
            filter: 'all',
            tab: newTab
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount) => {
        if (!amount) return '';
        return `₱${parseFloat(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const TabButton = ({ label, value, onClick }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === value
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
        >
            {label}
        </button>
    );

    const getFilterOptions = () => {
        if (activeTab === 'requests') {
            return (
                <>
                    <option value="all">All Activities</option>
                    <option value="create">Created Requests</option>
                    <option value="approve">Approved Requests</option>
                    <option value="reject">Rejected Requests</option>
                    <option value="update">Updated Requests</option>
                    <option value="delete">Deleted Requests</option>
                </>
            );
        } else if (activeTab === 'financial') {
            return (
                <>
                    <option value="all">All Budget Activities</option>
                    <option value="budget_reset">Budget Reset</option>
                    <option value="budget_replenish">Budget Replenishment</option>
                    <option value="budget_update">Budget Update</option>
                    <option value="budget_delete">Budget Deletion</option>
                </>
            );
        }
        return null;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Audit Logs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">Audit Logs</h2>
                                <div className="flex items-center space-x-4">
                                    <div className="flex space-x-2">
                                        <TabButton label="Request Logs" value="requests" onClick={() => handleTabChange('requests')} />
                                        <TabButton label="Financial Logs" value="financial" onClick={() => handleTabChange('financial')} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search logs..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm text-sm"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Timestamp
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            {activeTab === 'financial' && (
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                            )}
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                IP Address
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(log.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {log.user_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {log.user_role}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        log.type?.includes('create') ? 'bg-green-100 text-green-800' :
                                                        log.type?.includes('update') ? 'bg-blue-100 text-blue-800' :
                                                        log.type?.includes('delete') ? 'bg-red-100 text-red-800' :
                                                        log.type?.includes('budget') ? 'bg-purple-100 text-purple-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {log.description}
                                                </td>
                                                {activeTab === 'financial' && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatAmount(log.amount)}
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {log.ip_address}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {logs?.meta?.last_page > 1 && (
                                <div className="mt-4">
                                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
                                        <div className="flex justify-between flex-1 sm:hidden">
                                            <button
                                                onClick={() => logs.meta.current_page > 1 && handlePageChange(logs.meta.current_page - 1)}
                                                disabled={logs.meta.current_page <= 1}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                                    logs.meta.current_page <= 1
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                } bg-white border border-gray-300 rounded-md`}
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => logs.meta.current_page < logs.meta.last_page && handlePageChange(logs.meta.current_page + 1)}
                                                disabled={logs.meta.current_page >= logs.meta.last_page}
                                                className={`relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium ${
                                                    logs.meta.current_page >= logs.meta.last_page
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                } bg-white border border-gray-300 rounded-md`}
                                            >
                                                Next
                                            </button>
                                        </div>
                                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Showing <span className="font-medium">{logs.meta.from}</span> to{' '}
                                                    <span className="font-medium">{logs.meta.to}</span> of{' '}
                                                    <span className="font-medium">{logs.meta.total}</span> results
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                    {/* Previous Page */}
                                                    <button
                                                        onClick={() => logs.meta.current_page > 1 && handlePageChange(logs.meta.current_page - 1)}
                                                        disabled={logs.meta.current_page <= 1}
                                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                                                            logs.meta.current_page <= 1
                                                                ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
                                                                : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <span className="sr-only">Previous</span>
                                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>

                                                    {/* Page Numbers */}
                                                    {logs.meta.links.map((link, index) => {
                                                        // Skip the Previous/Next links as we handle them separately
                                                        if (link.url === null || link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                                                            return null;
                                                        }
                                                        return (
                                                            <button
                                                                key={index}
                                                                onClick={() => handlePageChange(parseInt(link.label))}
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                    link.active
                                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                {link.label}
                                                            </button>
                                                        );
                                                    })}

                                                    {/* Next Page */}
                                                    <button
                                                        onClick={() => logs.meta.current_page < logs.meta.last_page && handlePageChange(logs.meta.current_page + 1)}
                                                        disabled={logs.meta.current_page >= logs.meta.last_page}
                                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                                                            logs.meta.current_page >= logs.meta.last_page
                                                                ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
                                                                : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <span className="sr-only">Next</span>
                                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 