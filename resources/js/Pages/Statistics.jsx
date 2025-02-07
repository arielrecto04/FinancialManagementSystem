import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function Statistics() {
    const [viewOption, setViewOption] = useState('daily'); // 'daily', 'weekly', 'monthly', 'annual'
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
        endDate: new Date()
    });
    const [statistics] = useState({
        daily: {
            totalExpenses: 1200,
            averageExpense: 400,
            highestDay: 'Monday'
        },
        weekly: {
            totalExpenses: 8400,
            averageExpense: 1200,
            highestWeek: 'Week 1'
        },
        monthly: {
            totalExpenses: 334100,
            averageExpense: 47728,
            highestMonth: 'July'
        },
        annual: {
            totalExpenses: 4009200,
            averageExpense: 334100,
            highestYear: '2024'
        }
    });

    // Sample data for charts based on view option
    const getChartData = () => {
        switch(viewOption) {
            case 'daily':
                return {
                    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    series: [44, 55, 13, 43, 22, 35, 30]
                };
            case 'weekly':
                return {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    series: [120, 90, 100, 80]
                };
            case 'monthly':
                return {
                    labels: ['Food', 'Transportation', 'Utilities', 'Entertainment', 'Others'],
                    series: [44, 55, 13, 43, 22]
                };
            case 'annual':
                return {
                    labels: ['2020', '2021', '2022', '2023', '2024'],
                    series: [320000, 380000, 420000, 450000, 480000]
                };
            default:
                return {
                    labels: [],
                    series: []
                };
        }
    };

    const chartData = getChartData();
    const pieChartOptions = {
        chart: {
            type: 'pie',
        },
        labels: chartData.labels,
    };

    const getCurrentStats = () => {
        return statistics[viewOption];
    };

    return (
        <AuthenticatedLayout>
            <Head title="Statistics" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Date Range Picker */}
                            <div className="mb-6">
                                <h3 className="mb-2 text-lg font-semibold">Select Date Range</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span>From:</span>
                                        <DatePicker
                                            selected={dateRange.startDate}
                                            onChange={(date) => setDateRange(prev => ({ ...prev, startDate: date }))}
                                            selectsStart
                                            startDate={dateRange.startDate}
                                            endDate={dateRange.endDate}
                                            className="px-3 py-2 border rounded-lg"
                                            dateFormat="yyyy-MM-dd"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>To:</span>
                                        <DatePicker
                                            selected={dateRange.endDate}
                                            onChange={(date) => setDateRange(prev => ({ ...prev, endDate: date }))}
                                            selectsEnd
                                            startDate={dateRange.startDate}
                                            endDate={dateRange.endDate}
                                            minDate={dateRange.startDate}
                                            className="px-3 py-2 border rounded-lg"
                                            dateFormat="yyyy-MM-dd"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* View Options */}
                            <div className="mb-6">
                                <div className="inline-flex rounded-lg border border-gray-200 p-1">
                                    <button
                                        onClick={() => setViewOption('daily')}
                                        className={`px-4 py-2 rounded-lg ${
                                            viewOption === 'daily'
                                                ? 'bg-blue-500 text-white'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        Daily
                                    </button>
                                    <button
                                        onClick={() => setViewOption('weekly')}
                                        className={`px-4 py-2 rounded-lg ${
                                            viewOption === 'weekly'
                                                ? 'bg-blue-500 text-white'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        Weekly
                                    </button>
                                    <button
                                        onClick={() => setViewOption('monthly')}
                                        className={`px-4 py-2 rounded-lg ${
                                            viewOption === 'monthly'
                                                ? 'bg-blue-500 text-white'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setViewOption('annual')}
                                        className={`px-4 py-2 rounded-lg ${
                                            viewOption === 'annual'
                                                ? 'bg-blue-500 text-white'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        Annual
                                    </button>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
                                <div className="p-4 bg-white rounded-lg shadow">
                                    <h3 className="text-lg font-semibold">Total Expenses</h3>
                                    <p className="text-2xl font-bold">
                                        ₱{getCurrentStats().totalExpenses.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-4 bg-white rounded-lg shadow">
                                    <h3 className="text-lg font-semibold">Average Expense</h3>
                                    <p className="text-2xl font-bold">
                                        ₱{getCurrentStats().averageExpense.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-4 bg-white rounded-lg shadow">
                                    <h3 className="text-lg font-semibold">
                                        Highest {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
                                    </h3>
                                    <p className="text-2xl font-bold">
                                        {getCurrentStats().highestDay || 
                                         getCurrentStats().highestWeek || 
                                         getCurrentStats().highestMonth ||
                                         getCurrentStats().highestYear}
                                    </p>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="mt-6">
                                <div className="p-6 bg-white rounded-lg shadow">
                                    <h3 className="mb-4 text-lg font-semibold">
                                        {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)} Expense Distribution
                                    </h3>
                                    <ReactApexChart
                                        options={pieChartOptions}
                                        series={chartData.series}
                                        type="pie"
                                        height={350}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
