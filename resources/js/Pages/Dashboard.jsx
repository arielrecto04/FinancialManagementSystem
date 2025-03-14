import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

// Add these component definitions before your Dashboard component
const ExpenseSummaryCard = ({ title, amount, icon }) => {
    return (
        <div className="p-6 bg-white shadow-sm sm:rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="p-3 bg-blue-100 rounded-lg">
                    {icon}
                </div>
                <button className="text-sm text-blue-500 hover:text-blue-700 flex items-center">
                    <span className="mr-1">Update</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>
            <h3 className="mt-4 mb-2 text-sm font-medium text-gray-600">{title}</h3>
            <div className="flex items-center">
                <span className="text-2xl font-semibold">₱{amount}</span>
                <span className="ml-2 text-sm text-green-500 flex items-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    +2.5%
                </span>
            </div>
        </div>
    );
};

const HighExpenseItem = ({ category, amount, date, icon }) => {
    return (
        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="p-2 mr-3 bg-gray-100 rounded-lg">
                        {icon}
                    </div>
                    <div>
                        <h4 className="font-medium">{category}</h4>
                        <p className="text-sm text-gray-500">{date}</p>
                    </div>
                </div>
                <span className="text-lg font-semibold">₱{amount}</span>
            </div>
        </div>
    );
};

const UserStatsCard = ({ totalUsers, adminUsers, regularUsers }) => {
    return (
        <div className="p-6 bg-white shadow-sm sm:rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="ml-3 text-sm font-medium text-gray-600">User Statistics</h3>
                </div>
                <Link href={route('users.index')} className="text-sm text-purple-500 hover:text-purple-700">
                    View All
                </Link>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Users</span>
                    <span className="text-sm font-semibold">{totalUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Admin Users</span>
                    <span className="text-sm font-semibold">{adminUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Regular Users</span>
                    <span className="text-sm font-semibold">{regularUsers}</span>
                </div>
            </div>
        </div>
    );
};

// Add these new card components
const RequestStatsCard = ({ statistics }) => {
    console.log('RequestStatsCard statistics:', statistics);
    
    const statusColors = {
        pending: 'text-yellow-600',
        approved: 'text-green-600',
        rejected: 'text-red-600'
    };

    // Ensure we have default values
    const stats = statistics || {
        totalRequests: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        rejectedRequests: 0
    };

    return (
        <div className="p-6 bg-white shadow-sm sm:rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="ml-3 text-sm font-medium text-gray-600">Request Statistics</h3>
                </div>
                <Link href={route('reports.index')} className="text-sm text-blue-500 hover:text-blue-700">
                    View All
                </Link>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Requests</span>
                    <div className="flex items-center">
                        <span className="text-sm font-semibold">{stats.totalRequests}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Pending</span>
                    <span className={`text-sm font-semibold ${statusColors.pending}`}>
                        {stats.pendingRequests}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Approved</span>
                    <span className={`text-sm font-semibold ${statusColors.approved}`}>
                        {stats.approvedRequests}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Rejected</span>
                    <span className={`text-sm font-semibold ${statusColors.rejected}`}>
                        {stats.rejectedRequests}
                    </span>
                </div>
            </div>
        </div>
    );
};

const BudgetOverviewCard = ({ budget }) => {
    const usagePercentage = budget?.total_budget > 0 
        ? ((budget?.used_budget / budget?.total_budget) * 100).toFixed(1) 
        : 0;

    return (
        <div className="p-6 bg-white shadow-sm sm:rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="ml-3 text-sm font-medium text-gray-600">Budget Overview</h3>
                </div>
                <Link href="#" className="text-sm text-blue-500 hover:text-blue-700">
                    View All
                </Link>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Budget</span>
                    <span className="text-sm font-semibold">₱{budget?.total_budget?.toLocaleString() ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Used Budget</span>
                    <span className="text-sm font-semibold">₱{budget?.used_budget?.toLocaleString() ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Remaining</span>
                    <span className="text-sm font-semibold">₱{budget?.remaining_budget?.toLocaleString() ?? 0}</span>
                </div>
            </div>
        </div>
    );
};

const ExpenseBreakdownCard = ({ expenses }) => {
    return (
        <div className="p-6 bg-white shadow-sm sm:rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="p-3 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                </div>
            </div>
            <h3 className="mt-4 mb-2 text-sm font-medium text-gray-600">Expense Breakdown</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">HR Expenses</span>
                    <span className="text-lg font-semibold">₱{expenses?.hr?.toLocaleString() ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Operating Expenses</span>
                    <span className="text-lg font-semibold">₱{expenses?.operating?.toLocaleString() ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Supply Requests</span>
                    <span className="text-lg font-semibold">₱{expenses?.supply?.toLocaleString() ?? 0}</span>
                </div>
            </div>
        </div>
    );
};

// Add this new component
const ExpenseOverviewCard = ({ summaryData }) => {
    return (
        <div className="p-6 bg-white shadow-sm sm:rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="ml-3 text-sm font-medium text-gray-600">Expense Overview</h3>
                </div>
                <Link href="#" className="text-sm text-blue-500 hover:text-blue-700">
                    View Details
                </Link>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Daily Expenses</span>
                    <div className="flex items-center">
                        <span className="text-sm font-semibold mr-2">₱{summaryData?.daily?.total ?? "0.00"}</span>
                        <span className="text-xs text-green-500">+2.5%</span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Weekly Expenses</span>
                    <div className="flex items-center">
                        <span className="text-sm font-semibold mr-2">₱{summaryData?.weekly?.total ?? "0.00"}</span>
                        <span className="text-xs text-green-500">+3.2%</span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Monthly Expenses</span>
                    <div className="flex items-center">
                        <span className="text-sm font-semibold mr-2">₱{summaryData?.monthly?.total ?? "0.00"}</span>
                        <span className="text-xs text-green-500">+4.8%</span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Annual Expenses</span>
                    <div className="flex items-center">
                        <span className="text-sm font-semibold mr-2">₱{summaryData?.annual?.total ?? "0.00"}</span>
                        <span className="text-xs text-green-500">+10.5%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard({ 
    auth, 
    userStats = {}, // Add default value
    summaryData = {},
    requestStats = {},
    budgetOverview = {},
    monthlyData = {},
    highestExpenses = [],
    recentLogs = [],
    statistics
}) {
    const { user } = auth;
    
    // Debug props
    console.log('Dashboard Props:', {
        auth,
        userStats,
        summaryData,
        requestStats,
        budgetOverview
    });

    // Debug the statistics
    console.log('Dashboard Statistics:', statistics);

    // Sample data for the bar chart
    const barChartOptions = {
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        },
        legend: {
            position: 'top'
        },
        fill: {
            opacity: 1
        }
    };

    const barChartSeries = [
        {
            name: 'Utilities',
            data: [44, 55, 41, 67, 22, 43, 21]
        },
        {
            name: 'Services',
            data: [13, 23, 20, 8, 13, 27, 33]
        },
        {
            name: 'Others',
            data: [11, 17, 15, 15, 21, 14, 15]
        }
    ];

    const summaryCardIcons = {
        daily: (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        weekly: (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        monthly: (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        annual: (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    };

    const categoryIcons = {
        Utilities: (
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        // Add more category icons as needed
    };

    // Add default value for statistics
    const stats = statistics || {
        totalRequests: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        rejectedRequests: 0
    };

    console.log('Dashboard props:', { auth, statistics: stats });

    return (
        <AuthenticatedLayout
            user={user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {(user.role === 'admin' || user.role === 'superadmin') ? (
                        // Admin view
                        <>
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-4">
                                {/* Expense Overview Card */}
                                <div className="lg:col-span-1">
                                    <ExpenseOverviewCard summaryData={summaryData} />
                                </div>
                                
                                {/* User Stats Card */}
                                <div className="lg:col-span-1">
                                    <UserStatsCard
                                        totalUsers={userStats?.total_users ?? 0}
                                        adminUsers={userStats?.admin_users ?? 0}
                                        regularUsers={userStats?.regular_users ?? 0}
                                    />
                                </div>
                                
                                {/* Budget Overview Card */}
                                <div className="lg:col-span-1">
                                    <BudgetOverviewCard budget={budgetOverview} />
                                </div>
                                
                                {/* Request Stats Card */}
                                <div className="lg:col-span-1">
                                    <RequestStatsCard statistics={stats} />
                                </div>
                            </div>

                            {/* Charts and Logs Section */}
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                                {/* Bar Chart */}
                                <div className="col-span-2 p-6 bg-white shadow-sm sm:rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold">Monthly Expenses</h3>
                                        <div className="flex space-x-2">
                                            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <ReactApexChart
                                        options={barChartOptions}
                                        series={barChartSeries}
                                        type="bar"
                                        height={350}
                                    />
                                </div>

                                {/* Highest Expense Log */}
                                <div className="p-6 bg-white shadow-sm sm:rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold">Highest Expense Log</h3>
                                        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <HighExpenseItem
                                            category="Utilities"
                                            amount="15,000.00"
                                            date="2024-03-15"
                                            icon={categoryIcons.Utilities}
                                        />
                                        {/* Add more high expense items */}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Logs */}
                            <div className="mt-4 bg-white shadow-sm sm:rounded-lg hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold">Recent Logs</h3>
                                        <div className="flex space-x-2">
                                            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                                </svg>
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left bg-gray-50">
                                                <th className="p-3">Date</th>
                                                <th className="p-3">Description</th>
                                                <th className="p-3">Category</th>
                                                <th className="p-3">Amount</th>
                                                <th className="p-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Add your recent log items here */}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        // User view
                        <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">User Dashboard</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                                    <h4 className="font-medium mb-2">Supply Request</h4>
                                    <p className="text-sm text-gray-600">Manage your supply requests here</p>
                                </div>
                                <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                                    <h4 className="font-medium mb-2">Reimbursement</h4>
                                    <p className="text-sm text-gray-600">Submit and track reimbursement requests</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// You'll need to import these icons from your preferred icon library
function BellIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    );
}

function CogIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}
