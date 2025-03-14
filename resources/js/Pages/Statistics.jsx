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
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Date Range
                        </h3>

                        {/* All Time Toggle */}
                        <div className="mb-6">
                            <label className="inline-flex items-center bg-gray-50 px-4 py-2 rounded-md border hover:bg-gray-100 transition-colors cursor-pointer">
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                <input
                                    type="date"
                                    value={dateRange.endDate.toISOString().split('T')[0]}
                                    onChange={(e) => handleDateRangeChange('endDate', new Date(e.target.value))}
                                    disabled={isAllTime}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                />
                            </div>
                            </div>
                        </div>

                    {/* View Options */}
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            {/* Time Period Options */}
                            <div className="flex flex-wrap gap-2">
                                {['Daily', 'Weekly', 'Monthly', 'Annual'].map((period) => (
                                    <button
                                        key={period}
                                        onClick={() => setViewOption(period.toLowerCase())}
                                        className={`px-4 py-2 rounded-md transition-colors ${
                                            viewOption === period.toLowerCase()
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                                        className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                                            chartType === chart.type
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Expenses</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(getCurrentStats().totalExpenses)}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Average Expense</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(getCurrentStats().averageExpense)}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                Highest {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {getHighestPeriod()}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                {formatCurrency(getCurrentStats().highestAmount)}
                            </p>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)} Expense Distribution
                            </h3>
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
        </AuthenticatedLayout>
    );
}
