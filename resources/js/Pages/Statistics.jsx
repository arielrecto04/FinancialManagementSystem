import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function Statistics({ statistics, categoryData, detailedStats, currentViewOption }) {
    const [viewOption, setViewOption] = useState(currentViewOption || 'daily'); // 'daily', 'weekly', 'monthly', 'annual'
    const [chartType, setChartType] = useState('pie'); // 'pie' or 'stack'
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'hr', 'operating', 'liquidation'
    
    // Add console logging to debug data structure
    useEffect(() => {
        console.log('Detailed Stats:', detailedStats);
        console.log('Active Tab:', activeTab);
        if (detailedStats && detailedStats[activeTab]) {
            console.log('Current Tab Data:', detailedStats[activeTab]);
        }
    }, [detailedStats, activeTab]);
    
    // Initialize date range from props if available
    const [dateRange, setDateRange] = useState(() => {
        if (detailedStats && detailedStats.view_period) {
            return {
                startDate: new Date(detailedStats.view_period.start_date),
                endDate: new Date(detailedStats.view_period.end_date)
            };
        }
        return {
            startDate: new Date(), 
            endDate: new Date()
        };
    });
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [key, setKey] = useState(0); // Add this state for forcing refresh
    const [isAllTime, setIsAllTime] = useState(() => {
        // Initialize from props if available
        if (detailedStats && detailedStats.view_period) {
            return !!detailedStats.view_period.isAllTime;
        }
        return false;
    });

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
        
        // Format dates for API
        const formattedStartDate = dateRange.startDate instanceof Date 
            ? dateRange.startDate.toISOString().split('T')[0] 
            : dateRange.startDate;
        const formattedEndDate = dateRange.endDate instanceof Date 
            ? dateRange.endDate.toISOString().split('T')[0] 
            : dateRange.endDate;
        
        // Fetch new data based on date range
        router.get(route('statistics.index'), {
            startDate: type === 'startDate' ? date.toISOString().split('T')[0] : formattedStartDate,
            endDate: type === 'endDate' ? date.toISOString().split('T')[0] : formattedEndDate,
            viewOption: viewOption,
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
        },
        title: {
            text: `Average ${viewOption.charAt(0).toUpperCase() + viewOption.slice(1)} Expenses by Category`,
            align: 'center'
        },
        tooltip: {
            y: {
                formatter: function(value) {
                    return `Average per ${viewOption}: ${formatCurrency(value)}`;
                }
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
                text: `Average Amount per ${viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}`,
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
                formatter: function(value) {
                    return `Average per ${viewOption}: ${formatCurrency(value)}`;
                }
            },
            theme: 'light'
        },
        title: {
            text: `Average ${viewOption.charAt(0).toUpperCase() + viewOption.slice(1)} Expenses by Category`,
            align: 'center'
        }
    };

    const getCurrentStats = () => {
        return statistics.overview || {
            totalExpenses: 0,
            averageExpense: 0,
            highestAmount: 0,
            highestPeriod: 'N/A',
            totalRequests: 0
        };
    };

    const getHighestPeriod = () => {
        const stats = getCurrentStats();
        if (!stats.highestPeriod) return 'N/A';
        
        switch(viewOption) {
            case 'daily': return new Date(stats.highestPeriod).toLocaleDateString();
            case 'weekly': return `Week ${stats.highestPeriod}`;
            case 'monthly': return new Date(stats.highestPeriod + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            case 'annual': return stats.highestPeriod;
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
        
        // When toggling all time, need to pass correct params
        router.get(route('statistics.index'), {
            isAllTime: !isAllTime,
            viewOption: viewOption,
            startDate: dateRange.startDate instanceof Date ? dateRange.startDate.toISOString().split('T')[0] : dateRange.startDate,
            endDate: dateRange.endDate instanceof Date ? dateRange.endDate.toISOString().split('T')[0] : dateRange.endDate
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Add these new chart options after your existing chart options
    const monthlyTrendOptions = {
        chart: {
            type: 'line',
            stacked: false,
        },
        stroke: {
            width: 3,
            curve: 'smooth'
        },
        markers: {
            size: 4
        },
        xaxis: {
            categories: Object.keys(detailedStats.monthly_trends).map(date => {
                return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            })
        },
        yaxis: {
            title: {
                text: 'Amount (PHP)'
            },
            labels: {
                formatter: (val) => formatCurrency(val)
            }
        },
        title: {
            text: `Average ${viewOption.charAt(0).toUpperCase() + viewOption.slice(1)} Expense Trends`,
            align: 'center'
        },
        tooltip: {
            y: {
                formatter: function(value) {
                    return `Average per ${viewOption}: ${formatCurrency(value)}`;
                }
            }
        }
    };

    // Helper function to process category data
    const processCategoryData = (categoryGroup) => {
        if (!categoryGroup || !categoryGroup.categories) return [];
        
        return Object.entries(categoryGroup.categories).map(([category, periodData]) => {
            const total = periodData.reduce((sum, period) => sum + parseFloat(period.total), 0);
            const count = periodData.length; // Number of periods
            const average = total / count;

            return {
                category_name: category,
                total: total,
                count: count,
                average: average,
                period_average: average / count // Average per selected period
            };
        });
    };

    // Update the viewOption handler
    const handleViewOptionChange = (period) => {
        setViewOption(period.toLowerCase());
        // Send the new viewOption to backend
        router.get(route('statistics.index'), {
            startDate: dateRange.startDate instanceof Date ? dateRange.startDate.toISOString().split('T')[0] : dateRange.startDate,
            endDate: dateRange.endDate instanceof Date ? dateRange.endDate.toISOString().split('T')[0] : dateRange.endDate,
            viewOption: period.toLowerCase(),
            isAllTime: isAllTime
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
                    {/* Main Tabs */}
                    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 'overview', label: 'Overview', icon: '📊' },
                                { id: 'hr', label: 'HR Expenses', icon: '👥' },
                                { id: 'operating', label: 'Operating Expenses', icon: '💼' },
                                { id: 'liquidation', label: 'Liquidations', icon: '💰' },
                                { id: 'supply', label: 'Supply Requests', icon: '📦' },
                                { id: 'reimbursement', label: 'Reimbursements', icon: '💸' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                        activeTab === tab.id
                                            ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

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
                                    value={dateRange.startDate instanceof Date ? dateRange.startDate.toISOString().split('T')[0] : dateRange.startDate}
                                    onChange={(e) => handleDateRangeChange('startDate', new Date(e.target.value))}
                                    disabled={isAllTime}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white hover:border-gray-400 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                <input
                                    type="date"
                                    value={dateRange.endDate instanceof Date ? dateRange.endDate.toISOString().split('T')[0] : dateRange.endDate}
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
                                        onClick={() => handleViewOptionChange(period)}
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

                    {/* Content based on active tab */}
                    {activeTab === 'overview' ? (
                        <>
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
                                Average {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)} Expense Distribution
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
                        </>
                    ) : (
                        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 hover:border-gray-300 transition-all duration-200">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                {activeTab === 'hr' ? 'HR Expenses Breakdown' :
                                 activeTab === 'operating' ? 'Operating Expenses Breakdown' :
                                 activeTab === 'liquidation' ? 'Liquidations Breakdown' :
                                 activeTab === 'supply' ? 'Supply Requests Breakdown' :
                                 'Reimbursements Breakdown'}
                            </h3>
                            
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Total Requests</div>
                                    <div className="text-xl font-semibold">
                                        {detailedStats[activeTab]?.total_requests || 0}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Unique Requestors</div>
                                    <div className="text-xl font-semibold">
                                        {detailedStats[activeTab]?.unique_requestors || 0}
                                                    </div>
                                                    </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Total Amount</div>
                                    <div className="text-xl font-semibold">
                                        {formatCurrency(detailedStats[activeTab]?.total_amount || 0)}
                                                    </div>
                                                </div>
                                            </div>

                            {/* Category Distribution Chart */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Pie Chart */}
                                <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                                    <ReactApexChart
                                        options={{
                                            chart: {
                                                type: 'pie',
                                            },
                                            labels: Object.keys(detailedStats[activeTab]?.categories || {}),
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
                                            },
                                            title: {
                                                text: `${activeTab === 'hr' ? 'HR' : 
                                                      activeTab === 'operating' ? 'Operating' : 
                                                      activeTab === 'liquidation' ? 'Liquidation' :
                                                      'Supply'} Expenses Distribution`,
                                                align: 'center'
                                            },
                                            tooltip: {
                                                y: {
                                                    formatter: function(value) {
                                                        return formatCurrency(value);
                                                    }
                                                }
                                            }
                                        }}
                                        series={Object.values(detailedStats[activeTab]?.categories || {}).map(cat => 
                                            cat.reduce((sum, item) => sum + parseFloat(item.total || 0), 0)
                                        )}
                                        type="pie"
                                        height={400}
                                    />
                                        </div>

                                {/* Bar Chart */}
                                <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                                    <ReactApexChart
                                        options={{
                                            chart: {
                                                type: 'bar',
                                                stacked: false,
                                                toolbar: {
                                                    show: true
                                                }
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
                                                categories: Object.keys(detailedStats[activeTab]?.categories || {}),
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
                                            title: {
                                                text: `${activeTab === 'hr' ? 'HR' : 
                                                      activeTab === 'operating' ? 'Operating' : 
                                                      activeTab === 'liquidation' ? 'Liquidation' :
                                                      'Supply'} Expenses by Category`,
                                                align: 'center'
                                            },
                                            tooltip: {
                                                y: {
                                                    formatter: function(value) {
                                                        return formatCurrency(value);
                                                    }
                                                }
                                            }
                                        }}
                                        series={[
                                            {
                                                name: 'Total Amount',
                                                data: Object.values(detailedStats[activeTab]?.categories || {}).map(cat => 
                                                    cat.reduce((sum, item) => sum + parseFloat(item.total || 0), 0)
                                                )
                                            },
                                            {
                                                name: 'Average Amount',
                                                data: Object.values(detailedStats[activeTab]?.categories || {}).map(cat => 
                                                    cat.reduce((sum, item) => sum + parseFloat(item.average || 0), 0) / (cat.length || 1)
                                                )
                                            }
                                        ]}
                                        type="bar"
                                        height={400}
                                    />
                                        </div>
                                    </div>

                            {/* Additional Charts for Specific Breakdowns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Highest/Lowest Amount Chart */}
                                <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                                    <ReactApexChart
                                        options={{
                                            chart: {
                                                type: 'bar',
                                                stacked: false,
                                                toolbar: {
                                                    show: true
                                                }
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
                                                categories: Object.keys(detailedStats[activeTab]?.categories || {}),
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
                                            title: {
                                                text: 'Highest/Lowest Amounts by Category',
                                                align: 'center'
                                            },
                                            tooltip: {
                                                y: {
                                                    formatter: function(value) {
                                                        return formatCurrency(value);
                                                    }
                                                }
                                            }
                                        }}
                                        series={[
                                            {
                                                name: 'Highest Amount',
                                                data: Object.values(detailedStats[activeTab]?.categories || {}).map(cat => 
                                                    Math.max(...cat.map(item => parseFloat(item.highest_amount || 0)))
                                                )
                                            },
                                            {
                                                name: 'Lowest Amount',
                                                data: Object.values(detailedStats[activeTab]?.categories || {}).map(cat => 
                                                    Math.min(...cat.map(item => parseFloat(item.lowest_amount || 0)))
                                                )
                                            }
                                        ]}
                                        type="bar"
                                        height={300}
                                    />
                                </div>

                                {/* Request Count Chart */}
                                <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                                    <ReactApexChart
                                        options={{
                                            chart: {
                                                type: 'bar',
                                                stacked: false,
                                                toolbar: {
                                                    show: true
                                                }
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
                                                style: {
                                                    fontSize: '12px',
                                                    colors: ['#000000'],
                                                }
                                            },
                                            xaxis: {
                                                categories: Object.keys(detailedStats[activeTab]?.categories || {}),
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
                                                    text: 'Number of Requests',
                                                    style: {
                                                        color: '#000000'
                                                    }
                                                },
                                                labels: {
                                                    style: {
                                                        colors: '#000000'
                                                    }
                                                }
                                            },
                                            title: {
                                                text: 'Request Count by Category',
                                                align: 'center'
                                            }
                                        }}
                                        series={[
                                            {
                                                name: 'Total Requests',
                                                data: Object.values(detailedStats[activeTab]?.categories || {}).map(cat => 
                                                    cat.reduce((sum, item) => sum + parseInt(item.count || 0), 0)
                                                )
                                            },
                                            {
                                                name: 'Unique Requestors',
                                                data: Object.values(detailedStats[activeTab]?.categories || {}).map(cat => 
                                                    cat.reduce((sum, item) => sum + parseInt(item.unique_requestors || 0), 0)
                                                )
                                            }
                                        ]}
                                        type="bar"
                                        height={300}
                                    />
                                </div>
                            </div>

                            {/* Special Chart for Liquidations */}
                            {activeTab === 'liquidation' && (
                                <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100 mb-6">
                                    <ReactApexChart
                                        options={{
                                            chart: {
                                                type: 'bar',
                                                stacked: false,
                                                toolbar: {
                                                    show: true
                                                }
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
                                                categories: Object.keys(detailedStats[activeTab]?.categories || {}),
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
                                            title: {
                                                text: 'Liquidation Breakdown by Category',
                                                align: 'center'
                                            },
                                            tooltip: {
                                                y: {
                                                    formatter: function(value) {
                                                        return formatCurrency(value);
                                                    }
                                                }
                                            }
                                        }}
                                        series={[
                                            {
                                                name: 'Cash Advance',
                                                data: Object.values(detailedStats[activeTab]?.categories || {}).map(cat => 
                                                    cat.reduce((sum, item) => sum + parseFloat(item.total_cash_advance || 0), 0)
                                                )
                                            },
                                            {
                                                name: 'Refund',
                                                data: Object.values(detailedStats[activeTab]?.categories || {}).map(cat => 
                                                    cat.reduce((sum, item) => sum + parseFloat(item.total_refund || 0), 0)
                                                )
                                            },
                                            {
                                                name: 'Reimburse',
                                                data: Object.values(detailedStats[activeTab]?.categories || {}).map(cat => 
                                                    cat.reduce((sum, item) => sum + parseFloat(item.total_reimburse || 0), 0)
                                                )
                                            }
                                        ]}
                                        type="bar"
                                        height={400}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Monthly Trends Chart - Show in all tabs */}
                    <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-xl shadow-sm mt-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Average {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)} Expense Trends
                            </h3>
                            <ReactApexChart
                                options={monthlyTrendOptions}
                                series={[
                                    {
                                        name: 'HR Expenses',
                                        data: Object.values(detailedStats.monthly_trends).map(m => m.hr)
                                    },
                                    {
                                        name: 'Operating Expenses',
                                        data: Object.values(detailedStats.monthly_trends).map(m => m.operating)
                                    },
                                    {
                                        name: 'Liquidations',
                                        data: Object.values(detailedStats.monthly_trends).map(m => m.liquidations)
                                    },
                                    {
                                        name: 'Reimbursements',
                                        data: Object.values(detailedStats.monthly_trends).map(m => m.reimbursements)
                                    }
                                ]}
                                type="line"
                                height={400}
                            />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
