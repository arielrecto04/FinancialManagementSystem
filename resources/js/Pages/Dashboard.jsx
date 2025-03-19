import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

// Add these component definitions before your Dashboard component
const ExpenseSummaryCard = ({ title, amount, icon }) => {
    return (
        <div className="p-6 bg-white border border-gray-200/70 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start justify-between">
                <div className="p-3 bg-blue-100 rounded-lg ring-1 ring-blue-100/50">
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

const HighExpenseItem = ({ type, category, amount, date }) => {
    const categoryIcons = {
        'HR Expense': (
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        'Operating Expense': (
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        ),
        'Supply Request': (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
        'Reimbursement': (
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        'Liquidation': (
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                    {categoryIcons[type]}
                    </div>
                    <div>
                    <p className="text-sm font-medium text-gray-900">{type}</p>
                    <p className="text-xs text-gray-500">{category}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(amount)}</p>
                <p className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

const UserStatsCard = ({ totalUsers, adminUsers, regularUsers, superadminUsers }) => {
    const stats = [
        { label: 'Total Users', value: totalUsers, color: 'blue', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        )},
        { label: 'Admins', value: adminUsers, color: 'purple', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        )},
        { label: 'Regular Users', value: regularUsers, color: 'indigo', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        )},
        { label: 'Super Admins', value: superadminUsers, color: 'violet', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        )}
    ];

    return (
        <div className="p-6 bg-white border border-gray-200/70 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg ring-1 ring-blue-100/50">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">User Statistics</h3>
                </div>
                <Link
                    href={route('users.index')}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                    View More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center justify-between hover:border-gray-200 transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 bg-${stat.color}-100 rounded-lg ring-1 ring-${stat.color}-100/50`}>
                                {stat.icon}
                </div>
                            <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                </div>
                        <span className={`text-lg font-semibold text-${stat.color}-600`}>
                            {stat.value}
                        </span>
                </div>
                ))}
            </div>
        </div>
    );
};

const RequestStatsCard = ({ statistics }) => {
    const stats = [
        { label: 'Total Requests', value: statistics?.totalRequests || 0, color: 'blue', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        )},
        { label: 'Pending', value: statistics?.pendingRequests || 0, color: 'yellow', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )},
        { label: 'Approved', value: statistics?.approvedRequests || 0, color: 'green', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )},
        { label: 'Rejected', value: statistics?.rejectedRequests || 0, color: 'red', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )}
    ];

    return (
        <div className="p-6 bg-white border border-gray-200/70 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg ring-1 ring-blue-100/50">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Request Statistics</h3>
                </div>
                <Link
                    href={route('reports.index')}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                    View More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center justify-between hover:border-gray-200 transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 bg-${stat.color}-100 rounded-lg ring-1 ring-${stat.color}-100/50`}>
                                {stat.icon}
                    </div>
                            <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                </div>
                        <span className={`text-lg font-semibold text-${stat.color}-600`}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ExpenseBreakdownCard = ({ expenses }) => {
    return (
        <div className="p-6 bg-white border border-gray-200/70 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start justify-between">
                <div className="p-3 bg-yellow-100 rounded-lg ring-1 ring-yellow-100/50">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                </div>
            </div>
            <h3 className="mt-4 mb-4 text-sm font-medium text-gray-600">Expense Breakdown</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                    <span className="text-sm text-gray-500">HR Expenses</span>
                    <span className="text-lg font-semibold">₱{expenses?.hr?.toLocaleString() ?? 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                    <span className="text-sm text-gray-500">Operating Expenses</span>
                    <span className="text-lg font-semibold">₱{expenses?.operating?.toLocaleString() ?? 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                    <span className="text-sm text-gray-500">Supply Requests</span>
                    <span className="text-lg font-semibold">₱{expenses?.supply?.toLocaleString() ?? 0}</span>
                </div>
            </div>
        </div>
    );
};

// New Background Component
const WavyBackground = () => (
    <div className="absolute inset-0 overflow-hidden -z-10">
        {/* Orange Wave */}
        <div className="absolute top-0 -left-4 w-[120%] h-[500px] opacity-10">
            <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                <path 
                    d="M 0 200 C 300 100 400 400 1000 300 L 1000 0 L 0 0 Z" 
                    fill="#fb923c"
                >
                    <animate 
                        attributeName="d" 
                        dur="10s" 
                        repeatCount="indefinite"
                        values="M 0 200 C 300 100 400 400 1000 300 L 1000 0 L 0 0 Z;
                                M 0 300 C 400 200 500 400 1000 200 L 1000 0 L 0 0 Z;
                                M 0 200 C 300 100 400 400 1000 300 L 1000 0 L 0 0 Z"
                    />
                </path>
                        </svg>
                    </div>
        {/* Grey Wave */}
        <div className="absolute top-40 -left-4 w-[120%] h-[500px] opacity-5">
            <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                <path 
                    d="M 0 250 C 400 150 500 450 1000 350 L 1000 0 L 0 0 Z" 
                    fill="#4b5563"
                >
                    <animate 
                        attributeName="d" 
                        dur="15s" 
                        repeatCount="indefinite"
                        values="M 0 250 C 400 150 500 450 1000 350 L 1000 0 L 0 0 Z;
                                M 0 350 C 500 250 600 450 1000 250 L 1000 0 L 0 0 Z;
                                M 0 250 C 400 150 500 450 1000 350 L 1000 0 L 0 0 Z"
                    />
                </path>
            </svg>
        </div>
        </div>
    );

export default function Dashboard({ 
    auth, 
    userStats = {}, 
    requestStats = {},
    monthlyExpenses = [],
    highestExpenses = [],
    statistics
}) {
    const { user } = auth;
    
    // Debug props
    console.log('Dashboard Props:', {
        auth,
        userStats,
        requestStats,
    });

    // Debug the statistics
    console.log('Dashboard Statistics:', statistics);

    // Configure the bar chart
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
                borderRadius: 4,
                columnWidth: '70%',
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left'
        },
        fill: {
            opacity: 1
        },
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
        theme: {
            mode: 'light'
        }
    };

    const barChartSeries = [
        {
            name: 'HR Expenses',
            data: monthlyExpenses.map(month => month.hr)
        },
        {
            name: 'Operating Expenses',
            data: monthlyExpenses.map(month => month.operating)
        },
        {
            name: 'Supply Requests',
            data: monthlyExpenses.map(month => month.supply)
        },
        {
            name: 'Reimbursements',
            data: monthlyExpenses.map(month => month.reimbursement)
        },
        {
            name: 'Liquidations',
            data: monthlyExpenses.map(month => month.liquidation)
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
           
        >
            <Head title="Dashboard" />

            {/* Add the WavyBackground component */}
            <WavyBackground />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {(user.role === 'admin' || user.role === 'superadmin') ? (
                        // Admin view
                        <>
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-2">
                                {/* User Stats Card */}
                                <div className="lg:col-span-1">
                                    <UserStatsCard
                                        totalUsers={userStats.total_users}
                                        adminUsers={userStats.admin_users}
                                        regularUsers={userStats.regular_users}
                                        superadminUsers={userStats.superadmin_users}
                                    />
                                </div>
                                
                                {/* Request Stats Card */}
                                <div className="lg:col-span-1">
                                    <RequestStatsCard statistics={stats} />
                                </div>
                            </div>

                            {/* Charts and Logs Section */}
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                                {/* Bar Chart */}
                                <div className="col-span-2 p-6 bg-white border border-gray-200/70 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-indigo-100 rounded-lg ring-1 ring-indigo-100/50">
                                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800">Monthly Expenses</h3>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-[400px] bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                                    <ReactApexChart
                                        options={barChartOptions}
                                        series={barChartSeries}
                                        type="bar"
                                            height="100%"
                                    />
                                    </div>
                                </div>

                                {/* Highest Expense Log */}
                                <div className="p-6 bg-white border border-gray-200/70 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-rose-100 rounded-lg ring-1 ring-rose-100/50">
                                                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800">Highest Expenses</h3>
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
                                        <div className="space-y-3">
                                            {highestExpenses.map((expense, index) => (
                                                <div
                                                    key={`${expense.type}-${expense.id}`}
                                                    className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`p-2 ${
                                                                expense.type === 'HR Expense' ? 'bg-purple-100 ring-purple-100/50' :
                                                                expense.type === 'Operating Expense' ? 'bg-blue-100 ring-blue-100/50' :
                                                                expense.type === 'Supply Request' ? 'bg-green-100 ring-green-100/50' :
                                                                'bg-yellow-100 ring-yellow-100/50'
                                                            } rounded-lg ring-1`}>
                                                                {categoryIcons[expense.category] || (
                                                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-800">{expense.type}</p>
                                                                <p className="text-sm text-gray-500">{expense.category}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-gray-800">₱{expense.amount.toLocaleString()}</p>
                                                            <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                                            ))}
                                        </div>
                                    </div>
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
