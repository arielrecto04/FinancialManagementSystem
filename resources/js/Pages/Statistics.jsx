import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function Statistics({ statistics, categoryData }) {
    const [viewOption, setViewOption] = useState('daily'); // 'daily', 'weekly', 'monthly', 'annual'
    const [chartType, setChartType] = useState('pie'); // 'pie' or 'stack'
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date()
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [key, setKey] = useState(0); // Add this state for forcing refresh
    const [isAllTime, setIsAllTime] = useState(false);

    const categories = [
        'Supply Request',
        'Reimbursement',
        'Liquidation',
        'Petty Cash Request',
        'HR Expenses Request',
        'Operating Expenses Request'
    ];

    // Handle date range changes
    const handleDateRangeChange = (type, date) => {
        if (isAllTime) return; // Don't update dates if all time is selected
        
        setDateRange(prev => ({
            ...prev,
            [type]: date
        }));
        
        // Fetch new data based on date range
        router.get(route('statistics.index'), {
            startDate: type === 'startDate' ? date.toISOString().split('T')[0] : dateRange.startDate.toISOString().split('T')[0],
            endDate: type === 'endDate' ? date.toISOString().split('T')[0] : dateRange.endDate.toISOString().split('T')[0],
            isAllTime: false
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    const getChartData = () => {
        const values = Object.values(categoryData);
        
                return {
            labels: categories, // Use the constant categories array for both chart types
                    series: chartType === 'pie' 
                ? values
                : [{
                                name: 'Expenses',
                    data: values
                }]
        };
    };

    const chartData = getChartData();
    
    // Updated chart options
    const pieChartOptions = {
        chart: {
            type: 'pie',
        },
        labels: categories, // Use the constant categories array
        colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
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
        }],
        dataLabels: {
            style: {
                colors: ['#000000']
            }
        },
        legend: {
            labels: {
                colors: '#000000'
            }
        }
    };

    const stackedChartOptions = {
        chart: {
            type: 'bar',
            stacked: false,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 6,
            },
        },
                dataLabels: {
                        enabled: true,
            formatter: function (val) {
                return formatCurrency(val);
            },
            style: {
                fontSize: '12px',
                colors: ['#000000'],
            }
        },
        xaxis: {
            categories: [
                'Supply Request',
                'Reimbursement',
                'Liquidation',
                'Petty Cash Request',
                'HR Expenses Request',
                'Operating Expenses Request'
            ],
            labels: {
                rotate: -45,
                trim: true,
                maxHeight: 120,
                style: {
                    colors: '#000000',
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Amount (PHP)',
                style: {
                    color: '#000000'
                }
            },
            labels: {
                formatter: function (val) {
                    return formatCurrency(val);
                },
                style: {
                    colors: '#000000'
                }
            }
        },
        colors: ['#2E93fA'],
        tooltip: {
            y: {
                formatter: function (val) {
                    return formatCurrency(val);
                }
            },
            theme: 'light'
        }
    };

    const getCurrentStats = () => {
        return statistics[viewOption] || {
            totalExpenses: 0,
            averageExpense: 0,
            highestDay: 'N/A',
            highestWeek: 'N/A',
            highestMonth: 'N/A',
            highestYear: 'N/A'
        };
    };

    const getHighestPeriod = () => {
        const stats = getCurrentStats();
        switch(viewOption) {
            case 'daily': return stats.highestDay;
            case 'weekly': return stats.highestWeek;
            case 'monthly': return stats.highestMonth;
            case 'annual': return stats.highestYear;
            default: return 'N/A';
        }
    };

    // Update chart type handler
    const handleChartTypeChange = (type) => {
        setChartType(type);
        setKey(prevKey => prevKey + 1); // Force chart refresh
    };

    // Add handler for all time toggle
    const handleAllTimeToggle = () => {
        setIsAllTime(!isAllTime);
        router.get(route('statistics.index'), {
            isAllTime: !isAllTime
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Statistics" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {/* Date Range Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 hover:border-gray-300 transition-all duration-200">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg ring-1 ring-blue-100/50 mr-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            Date Range
                        </h3>

                        {/* All Time Toggle */}
                        <div className="mb-6">
                            <label className="inline-flex items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isAllTime}
                                    onChange={handleAllTimeToggle}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-gray-700">Show All Time</span>
                            </label>
                        </div>

                        {/* Date Range Inputs */}
                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${isAllTime ? 'opacity-50' : ''}`}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                                <input
                                    type="date"
                                    value={dateRange.startDate.toISOString().split('T')[0]}
                                    onChange={(e) => handleDateRangeChange('startDate', new Date(e.target.value))}
                                    disabled={isAllTime}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white hover:border-gray-400 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                <input
                                    type="date"
                                    value={dateRange.endDate.toISOString().split('T')[0]}
                                    onChange={(e) => handleDateRangeChange('endDate', new Date(e.target.value))}
                                    disabled={isAllTime}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white hover:border-gray-400 transition-colors"
                                />
                            </div>
                            </div>
                        </div>

                    {/* View Options */}
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 hover:border-gray-300 transition-all duration-200 mb-6">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            {/* Time Period Options */}
                            <div className="flex flex-wrap gap-2">
                                {['Daily', 'Weekly', 'Monthly', 'Annual'].map((period) => (
                                    <button
                                        key={period}
                                        onClick={() => setViewOption(period.toLowerCase())}
                                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                            viewOption === period.toLowerCase()
                                                ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>
                            
                            {/* Chart Type Options */}
                            <div className="flex gap-2">
                                {[
                                    { type: 'pie', label: 'Pie Chart', icon: '📊' },
                                    { type: 'stack', label: 'Column Chart', icon: '📈' }
                                ].map((chart) => (
                                    <button
                                        key={chart.type}
                                        onClick={() => handleChartTypeChange(chart.type)}
                                        className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                            chartType === chart.type
                                                ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <span>{chart.icon}</span>
                                        {chart.label}
                                    </button>
                                ))}
                            </div>
                            </div>
                        </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 hover:border-gray-300 transition-all duration-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg ring-1 ring-blue-100/50">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    </div>
                                <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(getCurrentStats().totalExpenses)}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 hover:border-gray-300 transition-all duration-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-green-100 rounded-lg ring-1 ring-green-100/50">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-medium text-gray-500">Average Expense</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(getCurrentStats().averageExpense)}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 hover:border-gray-300 transition-all duration-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-indigo-100 rounded-lg ring-1 ring-indigo-100/50">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                Highest {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
                            </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {getHighestPeriod()}
                                    </p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(getCurrentStats().highestAmount)}
                            </p>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 hover:border-gray-300 transition-all duration-200">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-purple-100 rounded-lg ring-1 ring-purple-100/50">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)} Expense Distribution
                            </h3>
                        </div>
                        <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                            {chartType === 'pie' ? (
                                <ReactApexChart
                                    key={key}
                                    options={pieChartOptions}
                                    series={Object.values(categoryData)}
                                    type="pie"
                                    height={400}
                                />
                            ) : (
                                <ReactApexChart
                                    key={key}
                                    options={stackedChartOptions}
                                    series={[{
                                        name: 'Expenses',
                                        data: Object.values(categoryData)
                                    }]}
                                    type="bar"
                                    height={400}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
