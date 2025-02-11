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
                                <div className="flex justify-between items-center">
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
                                    
                                    {/* Chart Type Toggle */}
                                    <div className="inline-flex rounded-lg border border-gray-200 p-1">
                                        <button
                                            onClick={() => setChartType('pie')}
                                            className={`px-4 py-2 rounded-lg ${
                                                chartType === 'pie'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            Pie Chart
                                        </button>
                                        <button
                                            onClick={() => setChartType('stack')}
                                            className={`px-4 py-2 rounded-lg ${
                                                chartType === 'stack'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'hover:bg-gray-100'
                                            }`}
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

                            {/* Chart */}
                            <div className="mt-6">
                                <div className="p-6 bg-white rounded-lg shadow">
                                    <h3 className="mb-4 text-lg font-semibold">
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
