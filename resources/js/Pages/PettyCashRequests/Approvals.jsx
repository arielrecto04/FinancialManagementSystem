import { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { PaperClipIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

export default function Approvals({ auth, requests, filters }) {
    const [processingId, setProcessingId] = useState(null);
    const [currentFilter, setCurrentFilter] = useState(filters.status || 'all');
    const [isFiltersVisible, setIsFiltersVisible] = useState(true);
    const [sortOrder, setSortOrder] = useState(filters.sortOrder || 'newest');
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState('all'); // 'all' or 1-12
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);



    console.log(requests);

    // Create arrays of available years and months for filters
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = [
        { value: 'all', label: 'All Months' },
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

    // Icons
    const icons = {
        filter: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>,
        sort: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>,
        calendar: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
        analytics: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>,
    };

    // Fetch analytics data with year and month filters
    const fetchAnalyticsData = () => {
        setIsLoading(true);
        axios.get(route('petty-cash-requests.analytics'), {
            params: {
                year: selectedYear,
                month: selectedMonth !== 'all' ? selectedMonth : null,
                category: selectedCategory !== 'all' ? selectedCategory : null
            }
        })
            .then(response => {
                setAnalyticsData(response.data);
                if (response.data.categoryStats) {
                    setCategories(['all', ...response.data.categoryStats.map(c => c.category)]);
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching analytics:', error);
                setIsLoading(false);
            });
    };

    // Process analytics data for charts
    const getChartData = () => {
        if (!analyticsData) return null;

        // Status distribution chart
        const statusChartOptions = {
            labels: ['Approved', 'Rejected', 'Pending'],
            colors: ['#10B981', '#EF4444', '#F59E0B'],
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                    }
                }
            },
            legend: {
                position: 'bottom'
            },
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

        const statusSeries = [
            analyticsData.statusCounts.approved || 0,
            analyticsData.statusCounts.rejected || 0,
            analyticsData.statusCounts.pending || 0
        ];

        // Monthly trend chart
        const monthlyTrendOptions = {
            chart: {
                type: 'line',
                toolbar: {
                    show: false
                }
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            xaxis: {
                categories: analyticsData.monthlyTrend.map(item => item.month)
            },
            colors: ['#3B82F6', '#10B981'],
            legend: {
                position: 'top'
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 0.5,
                    opacityFrom: 0.7,
                    opacityTo: 0,
                }
            },
            dataLabels: {
                enabled: false
            }
        };

        const monthlyTrendSeries = [
            {
                name: 'Requests',
                data: analyticsData.monthlyTrend.map(item => item.count)
            },
            {
                name: 'Amount (₱)',
                data: analyticsData.monthlyTrend.map(item => item.amount / 1000) // Convert to thousands
            }
        ];

        // Category wise chart
        const categoryChartOptions = {
            chart: {
                type: 'pie',
                toolbar: {
                    show: false
                }
            },
            labels: analyticsData.categoryStats.map(item => item.category),
            colors: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6', '#14B8A6'],
            legend: {
                position: 'bottom'
            },
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

        const categorySeries = analyticsData.categoryStats.map(item => item.totalAmount);

        // Amount distribution histogram
        const amountRanges = ['0-1k', '1k-5k', '5k-10k', '10k-20k', '20k+'];

        // Calculate amount distribution
        const amountDistribution = [0, 0, 0, 0, 0]; // Corresponds to the ranges above

        analyticsData.requestsData?.forEach(request => {
            const amount = parseFloat(request.amount);
            if (amount < 1000) amountDistribution[0]++;
            else if (amount < 5000) amountDistribution[1]++;
            else if (amount < 10000) amountDistribution[2]++;
            else if (amount < 20000) amountDistribution[3]++;
            else amountDistribution[4]++;
        });

        const amountHistogramOptions = {
            chart: {
                type: 'bar',
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    columnWidth: '70%',
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: amountRanges,
                title: {
                    text: 'Amount Range (PHP)'
                }
            },
            yaxis: {
                title: {
                    text: 'Number of Requests'
                }
            },
            colors: ['#6366F1'],
            title: {
                text: 'Amount Distribution',
                align: 'center',
                style: {
                    fontSize: '14px',
                    fontWeight: 'normal'
                }
            }
        };

        const amountHistogramSeries = [{
            name: 'Requests',
            data: amountDistribution
        }];

        // Processing Time Distribution (Days to Approval)
        const processingRanges = ['Same Day', '1-2 Days', '3-5 Days', '1-2 Weeks', '2+ Weeks'];

        // Sample data - replace with actual calculation if you have the data
        const processingDistribution = analyticsData.processingTimeDistribution || [
            Math.round(analyticsData.statusCounts.approved * 0.3),
            Math.round(analyticsData.statusCounts.approved * 0.4),
            Math.round(analyticsData.statusCounts.approved * 0.2),
            Math.round(analyticsData.statusCounts.approved * 0.07),
            Math.round(analyticsData.statusCounts.approved * 0.03)
        ];

        const processingTimeOptions = {
            chart: {
                type: 'bar',
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    columnWidth: '70%',
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: processingRanges,
                title: {
                    text: 'Processing Time'
                }
            },
            yaxis: {
                title: {
                    text: 'Number of Requests'
                }
            },
            colors: ['#8B5CF6'],
            title: {
                text: 'Processing Time Distribution',
                align: 'center',
                style: {
                    fontSize: '14px',
                    fontWeight: 'normal'
                }
            }
        };

        const processingTimeSeries = [{
            name: 'Requests',
            data: processingDistribution
        }];

        // Weekly comparison (requests this week vs last week)
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        // Sample data - replace with actual calculation if you have the data
        const thisWeekData = analyticsData.weeklyComparison?.thisWeek ||
            Array(7).fill(0).map(() => Math.floor(Math.random() * 5));

        const lastWeekData = analyticsData.weeklyComparison?.lastWeek ||
            Array(7).fill(0).map(() => Math.floor(Math.random() * 5));

        const weeklyComparisonOptions = {
            chart: {
                type: 'bar',
                toolbar: {
                    show: false
                },
                stacked: false
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 2,
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: dayNames,
                title: {
                    text: 'Day of Week'
                }
            },
            yaxis: {
                title: {
                    text: 'Number of Requests'
                }
            },
            colors: ['#3B82F6', '#94A3B8'],
            legend: {
                position: 'top'
            },
            title: {
                text: 'This Week vs Last Week',
                align: 'center',
                style: {
                    fontSize: '14px',
                    fontWeight: 'normal'
                }
            }
        };

        const weeklyComparisonSeries = [
            {
                name: 'This Week',
                data: thisWeekData
            },
            {
                name: 'Last Week',
                data: lastWeekData
            }
        ];

        return {
            statusChart: { options: statusChartOptions, series: statusSeries },
            monthlyTrendChart: { options: monthlyTrendOptions, series: monthlyTrendSeries },
            categoryChart: { options: categoryChartOptions, series: categorySeries },
            amountHistogram: { options: amountHistogramOptions, series: amountHistogramSeries },
            processingTimeChart: { options: processingTimeOptions, series: processingTimeSeries },
            weeklyComparisonChart: { options: weeklyComparisonOptions, series: weeklyComparisonSeries },
        };
    };

    // Toggle analytics visibility
    const toggleAnalytics = () => {
        if (!analyticsData && !showAnalytics) {
            fetchAnalyticsData();
        }
        setShowAnalytics(!showAnalytics);
    };

    const handleFilterChange = (newStatus) => {
        setCurrentFilter(newStatus);
        router.get(
            route('petty-cash-requests.approvals'),
            { status: newStatus, sortOrder },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['requests']
            }
        );
    };

    const handleSortOrderChange = (newOrder) => {
        setSortOrder(newOrder);
        router.get(
            route('petty-cash-requests.approvals'),
            { status: currentFilter, sortOrder: newOrder },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['requests']
            }
        );
    };

    const handleApproval = (id, newStatus) => {
        if (processingId) return;
        setProcessingId(id);

        // Find the request in the requests array
        const requestObj = requests.data.find(req => req.id === id);

        Swal.fire({
            title: `${newStatus === 'approved' ? 'Approve' : 'Reject'} Request?`,
            text: `Are you sure you want to ${newStatus === 'approved' ? 'approve' : 'reject'} this petty cash request?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: newStatus === 'approved' ? '#3085d6' : '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: newStatus === 'approved' ? 'Yes, approve it!' : 'Yes, reject it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('status', newStatus);
                formData.append('remarks', newStatus === 'approved' ? 'Approved by superadmin' : 'Rejected by superadmin');
                formData.append('amount', requestObj.amount);

                axios.post(route('petty-cash-requests.update-status', id), formData)
                    .then(response => {
                        setProcessingId(null);
                        Swal.fire({
                            title: 'Success!',
                            text: `Request has been ${newStatus === 'approved' ? 'approved' : 'rejected'}.`,
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        router.reload({ only: ['requests'] });
                    })
                    .catch(error => {
                        console.error('Error:', error.response?.data);
                        setProcessingId(null);
                        Swal.fire({
                            title: 'Error!',
                            text: error.response?.data?.message || 'An error occurred',
                            icon: 'error'
                        });
                    });
            } else {
                setProcessingId(null);
            }
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 ring-green-600/20';
            case 'rejected':
                return 'bg-red-100 text-red-800 ring-red-600/20';
            default:
                return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
        }
    };

    // Update the handler for filter changes
    const handleYearChange = (value) => {
        setSelectedYear(parseInt(value));
    };

    const handleMonthChange = (value) => {
        setSelectedMonth(value);
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    // Add a refresh function for when filters change
    const refreshAnalytics = () => {
        fetchAnalyticsData();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Petty Cash Approvals" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white rounded-lg shadow-xl">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="flex gap-2 items-center text-lg font-medium">
                                    {icons.filter}
                                    Petty Cash Requests
                                </h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={toggleAnalytics}
                                        className="inline-flex gap-2 items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        {icons.analytics}
                                        {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                                    </button>
                                    <button
                                        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                                        className="inline-flex gap-2 items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        {icons.filter}
                                        {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
                                    </button>
                                </div>
                            </div>

                            {/* Analytics Dashboard */}
                            {showAnalytics && (
                                <div className="mb-6 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="flex gap-2 items-center text-lg font-medium text-gray-900">
                                                {icons.analytics}
                                                Petty Cash Analytics Dashboard
                                            </h3>
                                            <button
                                                onClick={refreshAnalytics}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                                </svg>
                                                Refresh
                                            </button>
                                        </div>

                                        {/* Analytics Filters */}
                                        <div className="p-4 mb-6 bg-white rounded-lg border border-gray-100 shadow">
                                            <h4 className="mb-4 text-sm font-medium text-gray-700">Filter Analytics</h4>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                                {/* Date Range Filters */}
                                                <div>
                                                    <label className="block mb-1 text-xs font-medium text-gray-700">Year</label>
                                                    <select
                                                        value={selectedYear}
                                                        onChange={(e) => handleYearChange(e.target.value)}
                                                        className="px-3 py-2 w-full text-sm rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        {years.map((year, index) => (
                                                            <option key={index} value={year}>
                                                                {year}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block mb-1 text-xs font-medium text-gray-700">Month</label>
                                                    <select
                                                        value={selectedMonth}
                                                        onChange={(e) => handleMonthChange(e.target.value)}
                                                        className="px-3 py-2 w-full text-sm rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        {months.map((month, index) => (
                                                            <option key={index} value={month.value}>
                                                                {month.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Category Filter */}
                                                <div>
                                                    <label className="block mb-1 text-xs font-medium text-gray-700">Category</label>
                                                    <select
                                                        value={selectedCategory}
                                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                                        className="px-3 py-2 w-full text-sm rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        {categories.map((cat, index) => (
                                                            <option key={index} value={cat}>
                                                                {cat === 'all' ? 'All Categories' : cat}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex justify-end mt-4">
                                                <button
                                                    onClick={refreshAnalytics}
                                                    className="inline-flex gap-2 items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                >
                                                    Apply Filters
                                                </button>
                                            </div>
                                        </div>

                                        {isLoading ? (
                                            <div className="py-8 text-center">
                                                <svg className="mx-auto mr-3 -ml-1 w-8 h-8 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <p className="mt-2 text-gray-500">Loading analytics data...</p>
                                            </div>
                                        ) : analyticsData ? (
                                            <div>
                                                {/* Summary Cards */}
                                                <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
                                                    <div className="p-4 bg-white rounded-lg border border-gray-100 shadow">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 p-3 bg-blue-100 rounded-md">
                                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                                                </svg>
                                                            </div>
                                                            <div className="ml-4">
                                                                <h4 className="text-sm font-medium text-gray-500">Total Requests</h4>
                                                                <p className="text-2xl font-semibold text-gray-900">{analyticsData.totalRequests}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-white rounded-lg border border-gray-100 shadow">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 p-3 bg-green-100 rounded-md">
                                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                                </svg>
                                                            </div>
                                                            <div className="ml-4">
                                                                <h4 className="text-sm font-medium text-gray-500">Approved Amount</h4>
                                                                <p className="text-2xl font-semibold text-gray-900">₱{analyticsData.approvedAmount.toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2
                                                                })}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-white rounded-lg border border-gray-100 shadow">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-md">
                                                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                                </svg>
                                                            </div>
                                                            <div className="ml-4">
                                                                <h4 className="text-sm font-medium text-gray-500">Pending Requests</h4>
                                                                <p className="text-2xl font-semibold text-gray-900">{analyticsData.statusCounts.pending || 0}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-white rounded-lg border border-gray-100 shadow">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 p-3 bg-indigo-100 rounded-md">
                                                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                </svg>
                                                            </div>
                                                            <div className="ml-4">
                                                                <h4 className="text-sm font-medium text-gray-500">This Month</h4>
                                                                <p className="text-2xl font-semibold text-gray-900">{analyticsData.currentMonthCount}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Charts */}
                                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                                    {/* Status Distribution */}
                                                    <div className="p-4 bg-white rounded-lg border border-gray-100 shadow">
                                                        <h4 className="mb-4 text-lg font-medium text-gray-700">Status Distribution</h4>
                                                        {getChartData() && (
                                                            <Chart
                                                                options={getChartData().statusChart.options}
                                                                series={getChartData().statusChart.series}
                                                                type="donut"
                                                                height={320}
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Monthly Trend */}
                                                    <div className="p-4 bg-white rounded-lg border border-gray-100 shadow">
                                                        <h4 className="mb-4 text-lg font-medium text-gray-700">Monthly Trends</h4>
                                                        {getChartData() && (
                                                            <Chart
                                                                options={getChartData().monthlyTrendChart.options}
                                                                series={getChartData().monthlyTrendChart.series}
                                                                type="area"
                                                                height={320}
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Category Distribution */}
                                                    <div className="p-4 bg-white rounded-lg border border-gray-100 shadow">
                                                        <h4 className="mb-4 text-lg font-medium text-gray-700">Category Distribution</h4>
                                                        {getChartData() && (
                                                            <Chart
                                                                options={getChartData().categoryChart.options}
                                                                series={getChartData().categoryChart.series}
                                                                type="pie"
                                                                height={320}
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Amount Histogram */}
                                                    <div className="p-4 bg-white rounded-lg border border-gray-100 shadow">
                                                        <h4 className="mb-4 text-lg font-medium text-gray-700">Amount Distribution</h4>
                                                        {getChartData() && (
                                                            <Chart
                                                                options={getChartData().amountHistogram.options}
                                                                series={getChartData().amountHistogram.series}
                                                                type="bar"
                                                                height={320}
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Processing Time Histogram */}
                                                    <div className="p-4 bg-white rounded-lg border border-gray-100 shadow">
                                                        <h4 className="mb-4 text-lg font-medium text-gray-700">Processing Time Distribution</h4>
                                                        {getChartData() && (
                                                            <Chart
                                                                options={getChartData().processingTimeChart.options}
                                                                series={getChartData().processingTimeChart.series}
                                                                type="bar"
                                                                height={320}
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Weekly Comparison Bar Chart */}
                                                    <div className="col-span-1 p-4 bg-white rounded-lg border border-gray-100 shadow lg:col-span-2">
                                                        <h4 className="mb-4 text-lg font-medium text-gray-700">Weekly Comparison</h4>
                                                        {getChartData() && (
                                                            <Chart
                                                                options={getChartData().weeklyComparisonChart.options}
                                                                series={getChartData().weeklyComparisonChart.series}
                                                                type="bar"
                                                                height={350}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center">
                                                <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                                <p className="mt-2 text-sm font-medium text-gray-900">No analytics data available</p>
                                                <p className="mt-1 text-sm text-gray-500">Try refreshing the page or contact support.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Filters Section */}
                            {isFiltersVisible && (
                                <div className="mb-6 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {/* Status Filter */}
                                            <div>
                                                <label className="block flex gap-2 items-center mb-2 text-sm font-medium text-gray-700">
                                                    {icons.filter}
                                                    Status
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleFilterChange(status)}
                                                            className={`px-4 py-2 rounded-md transition-all duration-200 ease-in-out shadow-sm
                                                                ${currentFilter === status
                                                                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-2'
                                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                                }`}
                                                        >
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Sort Order */}
                                            <div>
                                                <label className="block flex gap-2 items-center mb-2 text-sm font-medium text-gray-700">
                                                    {icons.sort}
                                                    Sort By Date Created
                                                </label>
                                                <select
                                                    value={sortOrder}
                                                    onChange={(e) => handleSortOrderChange(e.target.value)}
                                                    className="px-4 py-2 w-full bg-white rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                >
                                                    <option value="newest">Newest First</option>
                                                    <option value="oldest">Oldest First</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Requests Table */}
                            {requests.data.length > 0 ? (
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Request #
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Requestor
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Department
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Date Requested
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Date Needed
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Purpose
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Amount
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Attachments
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {requests.data.map((request) => (
                                                <tr key={request.id} className="transition-colors duration-200 hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                        {request.request_number}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                        {request.user.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                        {request.department}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                        <div className="flex gap-1 items-center">
                                                            {icons.calendar}
                                                            {new Date(request.date_requested).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                        <div className="flex gap-1 items-center">
                                                            {icons.calendar}
                                                            {new Date(request.date_needed).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                        {request.purpose}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                        ₱{parseFloat(request.amount).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ring-1 ${getStatusBadgeClass(request.status)}`}>
                                                            {request.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {
                                                            request.attachments.length > 0 ? (
                                                                <div className="flex gap-1 items-center">
                                                                    {request.attachments.map((attachment) => (

                                                                        <div className="flex gap-2 items-center">
                                                                            <a
                                                                                key={attachment.id}
                                                                                href={attachment.file_path}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-blue-600 hover:underline"
                                                                            >
                                                                                <PaperClipIcon className="w-5 h-5" />
                                                                            </a>


                                                                            <a
                                                                                key={attachment.id}
                                                                                href={attachment.file_path}
                                                                                target="_blank"
                                                                                download
                                                                                className="text-blue-600 hover:underline"
                                                                            >
                                                                                <ArrowDownTrayIcon className="w-5 h-5" />
                                                                            </a>
                                                                        </div>

                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="flex gap-1 items-center">
                                                                    {icons.file}
                                                                    No attachments
                                                                </div>
                                                            )
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                        {request.status === 'pending' && (
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleApproval(request.id, 'approved')}
                                                                    disabled={processingId === request.id}
                                                                    className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-xs font-medium rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                                                                >
                                                                    {processingId === request.id ? 'Processing...' : 'Approve'}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleApproval(request.id, 'rejected')}
                                                                    disabled={processingId === request.id}
                                                                    className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-800 text-xs font-medium rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                                                >
                                                                    {processingId === request.id ? 'Processing...' : 'Reject'}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-12 text-center bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed">
                                    <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
                                    <p className="mt-1 text-sm text-gray-500">No petty cash requests match your current filters.</p>
                                </div>
                            )}

                            <div className="mt-6">
                                <Pagination links={requests.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
