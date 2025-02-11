import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
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

export default function Dashboard() {
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

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Expense Summary Cards */}
                    <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
                        <ExpenseSummaryCard title="Daily Expenses" amount="0.00" icon={summaryCardIcons.daily} />
                        <ExpenseSummaryCard title="Weekly Expenses" amount="0.00" icon={summaryCardIcons.weekly} />
                        <ExpenseSummaryCard title="Monthly Expenses" amount="0.00" icon={summaryCardIcons.monthly} />
                        <ExpenseSummaryCard title="Annual Expenses" amount="0.00" icon={summaryCardIcons.annual} />
                    </div>

                    {/* Charts Section */}
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
