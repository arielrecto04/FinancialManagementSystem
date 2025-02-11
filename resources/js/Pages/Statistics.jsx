import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function Statistics() {
    const [viewOption, setViewOption] = useState('daily'); // 'daily', 'weekly', 'monthly', 'annual'
    const [chartType, setChartType] = useState('pie'); // 'pie' or 'stack'
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date()
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    // Add categories from Expenses component
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

    // Enhanced chart data to include categories
    const getChartData = () => {
        switch(viewOption) {
            case 'daily':
                return {
                    labels: categories,
                    series: chartType === 'pie' 
                        ? [44, 55, 13, 43, 22, 35, 30, 25, 40, 15, 20, 45, 50, 33, 28] // Sample data for each category
                        : [
                            {
                                name: 'Expenses',
                                data: [44, 55, 13, 43, 22, 35, 30, 25, 40, 15, 20, 45, 50, 33, 28]
                            },
                            {
                                name: 'Replenish',
                                data: [13, 23, 20, 8, 13, 27, 15, 22, 18, 12, 25, 30, 35, 20, 15]
                            }
                        ]
                };
            case 'weekly':
                return {
                    labels: categories,
                    series: chartType === 'pie'
                        ? [120, 90, 100, 80, 110, 95, 85, 75, 130, 70, 88, 92, 105, 98, 82]
                        : [
                            {
                                name: 'Expenses',
                                data: [120, 90, 100, 80, 110, 95, 85, 75, 130, 70, 88, 92, 105, 98, 82]
                            },
                            {
                                name: 'Replenish',
                                data: [90, 85, 95, 75, 88, 82, 78, 70, 110, 65, 80, 85, 95, 88, 75]
                            }
                        ]
                };
            case 'monthly':
                return {
                    labels: categories,
                    series: chartType === 'pie'
                        ? [44, 55, 13, 43, 22, 35, 30, 25, 40, 15, 20, 45, 50, 33, 28]
                        : [
                            {
                                name: 'Expenses',
                                data: [44, 55, 13, 43, 22, 35, 30, 25, 40, 15, 20, 45, 50, 33, 28]
                            },
                            {
                                name: 'Replenish',
                                data: [13, 23, 20, 8, 13, 27, 15, 22, 18, 12, 25, 30, 35, 20, 15]
                            }
                        ]
                };
            case 'annual':
                return {
                    labels: categories,
                    series: chartType === 'pie'
                        ? [320000, 380000, 420000, 450000, 480000, 500000, 520000, 550000, 580000, 600000, 620000, 650000, 680000, 700000, 720000]
                        : [
                            {
                                name: 'Expenses',
                                data: [320000, 380000, 420000, 450000, 480000, 500000, 520000, 550000, 580000, 600000, 620000, 650000, 680000, 700000, 720000]
                            },
                            {
                                name: 'Replenish',
                                data: [280000, 350000, 390000, 420000, 450000, 480000, 500000, 520000, 550000, 580000, 600000, 620000, 650000, 680000, 700000]
                            }
                        ]
                };
            default:
                return {
                    labels: [],
                    series: []
                };
        }
    };

    const chartData = getChartData();
    
    // Updated chart options
    const pieChartOptions = {
        chart: {
            type: 'pie',
        },
        labels: categories,
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 300
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const stackedChartOptions = {
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 10,
                dataLabels: {
                    total: {
                        enabled: true,
                        style: {
                            fontSize: '13px',
                            fontWeight: 900
                        }
                    }
                }
            },
        },
        xaxis: {
            categories: categories,
            labels: {
                rotate: -45,
                trim: true,
                maxHeight: 120
            }
        },
        legend: {
            position: 'right',
            offsetY: 40
        },
        fill: {
            opacity: 1
        }
    };

    const getCurrentStats = () => {
        return statistics[viewOption];
    };

    // Add category summary cards
    const CategorySummary = () => (
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
            <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold">Top Categories</h3>
                <div className="mt-2 space-y-2">
                    {categories.slice(0, 3).map((category, index) => (
                        <div key={category} className="flex justify-between">
                            <span>{category}</span>
                            <span className="font-semibold">₱{(50000 - index * 10000).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold">Category Growth</h3>
                <div className="mt-2 space-y-2">
                    {categories.slice(0, 3).map((category, index) => (
                        <div key={category} className="flex justify-between">
                            <span>{category}</span>
                            <span className={`font-semibold ${index === 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {index === 0 ? '+' : '-'}{(15 - index * 5)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold">Category Count</h3>
                <div className="mt-2 space-y-2">
                    {categories.slice(0, 3).map((category, index) => (
                        <div key={category} className="flex justify-between">
                            <span>{category}</span>
                            <span className="font-semibold">{30 - index * 5}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Statistics" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        {/* Date Range Section */}
                        <h3 className="text-lg font-medium mb-4">Select Date Range</h3>

                        {/* Date Range Inputs */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">From:</label>
                                <input
                                    type="date"
                                    value={dateRange.startDate.toISOString().split('T')[0]}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">To:</label>
                                <input
                                    type="date"
                                    value={dateRange.endDate.toISOString().split('T')[0]}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* View Options - Desktop */}
                        <div className="hidden sm:flex justify-between items-center">
                            <div className="flex space-x-2">
                                {['Daily', 'Weekly', 'Monthly', 'Annual'].map((period) => (
                                    <button
                                        key={period}
                                        onClick={() => setViewOption(period.toLowerCase())}
                                        className={`px-4 py-2 rounded-md transition-colors ${
                                            viewOption === period.toLowerCase()
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>
                            <div className="flex space-x-2">
                                {[
                                    { type: 'pie', label: 'Pie Chart' },
                                    { type: 'stack', label: 'Stacked Column' }
                                ].map((chart) => (
                                    <button
                                        key={chart.type}
                                        onClick={() => setChartType(chart.type)}
                                        className={`px-4 py-2 rounded-md transition-colors ${
                                            chartType === chart.type
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {chart.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* View Options - Mobile */}
                        <div className="sm:hidden space-y-4">
                            <div className="relative">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white"
                                >
                                    <span>{viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isMobileMenuOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                        {['Daily', 'Weekly', 'Monthly', 'Annual'].map((period) => (
                                            <button
                                                key={period}
                                                onClick={() => {
                                                    setViewOption(period.toLowerCase());
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-50"
                                            >
                                                {period}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex rounded-md">
                                <button
                                    onClick={() => setChartType('pie')}
                                    className={`flex-1 py-2 ${
                                        chartType === 'pie'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700'
                                    } rounded-l-md`}
                                >
                                    Pie Chart
                                </button>
                                <button
                                    onClick={() => setChartType('stack')}
                                    className={`flex-1 py-2 ${
                                        chartType === 'stack'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700'
                                    } rounded-r-md`}
                                >
                                    Stacked Column
                                </button>
                            </div>
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

                    {/* Category Summary Cards */}
                    <CategorySummary />

                    {/* Chart Section */}
                    <div className="mt-6">
                        <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="mb-4 text-lg font-semibold flex items-center">
                                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)} Expense Distribution
                            </h3>
                            {chartType === 'pie' ? (
                                <ReactApexChart
                                    options={pieChartOptions}
                                    series={chartData.series}
                                    type="pie"
                                    height={350}
                                />
                            ) : (
                                <ReactApexChart
                                    options={stackedChartOptions}
                                    series={chartData.series}
                                    type="bar"
                                    height={350}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
