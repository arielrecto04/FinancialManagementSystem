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

    // Categories are now dynamic based on the data
    const categories = Object.keys(categoryData);

    // Handle date range changes
    const handleDateRangeChange = (type, date) => {
        setDateRange(prev => ({
            ...prev,
            [type]: date
        }));
        
        // Fetch new data based on date range
        router.get(route('statistics.index'), {
            startDate: type === 'startDate' ? date.toISOString().split('T')[0] : dateRange.startDate.toISOString().split('T')[0],
            endDate: type === 'endDate' ? date.toISOString().split('T')[0] : dateRange.endDate.toISOString().split('T')[0]
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
            labels: categories,
            series: chartType === 'pie'
                ? values
                : [
                    {
                        name: 'Expenses',
                        data: values
                    }
                ]
        };
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
                                    onChange={(e) => handleDateRangeChange('startDate', new Date(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">To:</label>
                                <input
                                    type="date"
                                    value={dateRange.endDate.toISOString().split('T')[0]}
                                    onChange={(e) => handleDateRangeChange('endDate', new Date(e.target.value))}
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
                                {formatCurrency(getCurrentStats().totalExpenses)}
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-semibold">Average Expense</h3>
                            <p className="text-2xl font-bold">
                                {formatCurrency(getCurrentStats().averageExpense)}
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-semibold">
                                Highest {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
                            </h3>
                            <p className="text-2xl font-bold">
                                {getHighestPeriod()}
                            </p>
                        </div>
                    </div>

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
