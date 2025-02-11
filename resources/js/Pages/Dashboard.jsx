import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

// Add these component definitions before your Dashboard component
const ExpenseSummaryCard = ({ title, amount }) => {
    return (
        <div className="p-6 bg-white shadow-sm sm:rounded-lg">
            <h3 className="mb-2 text-sm font-medium text-gray-600">{title}</h3>
            <div className="flex items-center">
                <span className="text-2xl font-semibold">₱{amount}</span>
                <button className="ml-auto text-sm text-gray-500 hover:text-gray-700">
                    Update now
                </button>
            </div>
        </div>
    );
};

const HighExpenseItem = ({ category, amount, date }) => {
    return (
        <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-medium">{category}</h4>
                    <p className="text-sm text-gray-500">{date}</p>
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

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Expense Summary Cards */}
                    <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
                        <ExpenseSummaryCard title="Daily Expenses" amount="0.00" />
                        <ExpenseSummaryCard title="Weekly Expenses" amount="0.00" />
                        <ExpenseSummaryCard title="Monthly Expenses" amount="0.00" />
                        <ExpenseSummaryCard title="Annual Expenses" amount="0.00" />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        {/* Bar Chart */}
                        <div className="col-span-2 p-6 bg-white shadow-sm sm:rounded-lg">
                            <h3 className="mb-4 text-lg font-semibold">Monthly Expenses</h3>
                            <ReactApexChart
                                options={barChartOptions}
                                series={barChartSeries}
                                type="bar"
                                height={350}
                            />
                        </div>

                        {/* Highest Expense Log */}
                        <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                            <h3 className="mb-4 text-lg font-semibold">Highest Expense Log</h3>
                            <div className="space-y-4">
                                {/* Add your highest expense items here */}
                                <HighExpenseItem
                                    category="Utilities"
                                    amount="15,000.00"
                                    date="2024-03-15"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recent Logs */}
                    <div className="mt-4 bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-semibold">Recent Logs</h3>
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
