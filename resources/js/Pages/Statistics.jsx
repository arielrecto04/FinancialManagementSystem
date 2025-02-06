import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import StackedBarChart from '@/Components/Charts/StackedBarChart';
import PieChart from '@/Components/Charts/PieChart';

export default function Statistics({ expenses }) {
    const [activeTab, setActiveTab] = useState('daily');
    const [chartType, setChartType] = useState('bar');
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [startDate, endDate] = dateRange;
    const [statistics, setStatistics] = useState({
        totalExpenses: 0,
        averageDaily: 0,
        highestExpense: 0,
        lowestExpense: 0,
        topCategories: [],
        monthlyTrend: 0, // Percentage increase/decrease from last month
        yearlyTrend: 0,  // Percentage increase/decrease from last year
    });

    // Calculate statistics based on filtered data
    const calculateStatistics = (filteredData) => {
        // Example calculation (replace with actual data processing)
        const total = filteredData.reduce((sum, expense) => sum + expense.amount, 0);
        const daily = total / (filteredData.length || 1);
        const sorted = [...filteredData].sort((a, b) => b.amount - a.amount);
        const categories = filteredData.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        setStatistics({
            totalExpenses: total,
            averageDaily: daily,
            highestExpense: sorted[0]?.amount || 0,
            lowestExpense: sorted[sorted.length - 1]?.amount || 0,
            topCategories: Object.entries(categories)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5),
            monthlyTrend: calculateTrend('monthly', filteredData),
            yearlyTrend: calculateTrend('yearly', filteredData),
        });
    };

    // Calculate trend percentages
    const calculateTrend = (period, data) => {
        // Implement trend calculation logic
        return 0; // Placeholder
    };

    // Enhanced statistics display
    const StatisticsCards = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Expenses</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ₱{statistics.totalExpenses.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Selected period</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Daily Average</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ₱{statistics.averageDaily.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Per day</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Monthly Trend</h3>
                <div className="flex items-center">
                    <p className={`text-3xl font-bold ${
                        statistics.monthlyTrend >= 0 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-green-600 dark:text-green-400'
                    }`}>
                        {Math.abs(statistics.monthlyTrend)}%
                    </p>
                    <svg className={`w-6 h-6 ml-2 ${
                        statistics.monthlyTrend >= 0 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-green-600 dark:text-green-400'
                    }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d={statistics.monthlyTrend >= 0 
                                ? "M5 15l7-7 7 7" 
                                : "M19 9l-7 7-7-7"
                            } 
                        />
                    </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">vs last month</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Top Category</h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {statistics.topCategories[0]?.[0] || 'N/A'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    ₱{(statistics.topCategories[0]?.[1] || 0).toLocaleString()}
                </p>
            </div>
        </div>
    );

    // Category breakdown
    const CategoryBreakdown = () => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mt-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Category Breakdown
            </h3>
            <div className="space-y-4">
                {statistics.topCategories.map(([category, amount], index) => (
                    <div key={category} className="flex items-center">
                        <div className="w-32 sm:w-40">{category}</div>
                        <div className="flex-1">
                            <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded">
                                <div 
                                    className="absolute h-4 bg-blue-500 dark:bg-blue-600 rounded"
                                    style={{ 
                                        width: `${(amount / statistics.totalExpenses) * 100}%` 
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="w-24 text-right">
                            ₱{amount.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Statistics" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Controls Section */}
                    <div className="mb-6 bg-white shadow-sm sm:rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                            {/* Time Period Tabs */}
                            <div className="flex space-x-4">
                                {Object.keys(chartConfigs).map((period) => (
                                    <button
                                        key={period}
                                        onClick={() => setActiveTab(period)}
                                        className={`px-4 py-2 rounded-md ${
                                            activeTab === period
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {period.charAt(0).toUpperCase() + period.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Chart Type Toggle */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setChartType('bar')}
                                    className={`px-4 py-2 rounded-md ${
                                        chartType === 'bar'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Bar Chart
                                </button>
                                <button
                                    onClick={() => setChartType('pie')}
                                    className={`px-4 py-2 rounded-md ${
                                        chartType === 'pie'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Pie Chart
                                </button>
                            </div>

                            {/* Date Range Picker */}
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600">Date Range:</span>
                                <DatePicker
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update) => setDateRange(update)}
                                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    dateFormat="MMM d, yyyy"
                                    placeholderText="Select date range"
                                />
                                <button 
                                    onClick={() => setDateRange([new Date(), new Date()])}
                                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                    title="Reset date range"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <StatisticsCards />

                    {/* Main Chart */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        {chartType === 'bar' ? (
                            <StackedBarChart
                                title={getChartTitle()}
                                categories={getFormattedDates()}
                                series={getFilteredData()}
                            />
                        ) : (
                            <PieChart
                                title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Expenses Distribution`}
                                series={getPieChartData(getFilteredData())}
                            />
                        )}
                    </div>

                    {/* Category Breakdown */}
                    <CategoryBreakdown />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
