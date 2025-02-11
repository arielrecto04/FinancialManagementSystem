import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import RequestTable from '@/Components/RequestTable';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function Reports({ reports }) {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [reportType, setReportType] = useState('all'); // 'all', 'supply', 'reimbursement'

    const handleGenerateReport = (format) => {
        // Handle report generation based on format (Excel or PDF)
        const reportData = {
            dateRange: {
                start: startDate,
                end: endDate
            },
            type: reportType,
            format: format
        };
        // API call to generate report
    };

    return (
        <AuthenticatedLayout>
            <Head title="Request Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Request Management Table */}
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <RequestTable />
                    </div>

                    {/* Generate Reports Section */}
                    <div className="mt-6 bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Generate Reports</h3>
                        
                        <div className="space-y-4">
                            {/* Report Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date Range
                                    </label>
                                    <DatePicker
                                        selectsRange={true}
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={(update) => setDateRange(update)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        placeholderText="Select date range"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Request Type
                                    </label>
                                    <select
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="all">All Requests</option>
                                        <option value="supply">Supply Requests</option>
                                        <option value="reimbursement">Reimbursement Requests</option>
                                    </select>
                                </div>

                                <div className="flex items-end space-x-4">
                                    <button
                                        onClick={() => handleGenerateReport('excel')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        Export to Excel
                                    </button>
                                    <button
                                        onClick={() => handleGenerateReport('pdf')}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        Export to PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
