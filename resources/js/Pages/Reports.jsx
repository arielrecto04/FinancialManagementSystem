import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function Reports({ reports }) {
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [startDate, endDate] = dateRange;
    const [reportType, setReportType] = useState('expense');

    return (
        <AuthenticatedLayout>
            <Head title="Reports" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Report Controls */}
                    <div className="mb-6 bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            {/* Report Type Selection */}
                            <div className="w-full sm:w-auto">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Report Type
                                </label>
                                <select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="w-full sm:w-auto px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="expense">Expense Report</option>
                                    <option value="summary">Summary Report</option>
                                    <option value="category">Category Report</option>
                                    <option value="comparison">Comparison Report</option>
                                </select>
                            </div>

                            {/* Date Range Selection */}
                            <div className="w-full sm:w-auto">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date Range
                                </label>
                                <DatePicker
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update) => setDateRange(update)}
                                    className="w-full sm:w-auto px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    dateFormat="MMM d, yyyy"
                                />
                            </div>

                            {/* Generate Report Button */}
                            <button
                                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Generate Report
                            </button>
                        </div>
                    </div>

                    {/* Reports List */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Generated Reports</h3>
                        
                        {reports.length === 0 ? (
                            <p className="text-gray-500">No reports generated yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {reports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div>
                                            <h4 className="font-semibold">{report.name}</h4>
                                            <p className="text-sm text-gray-500">
                                                Generated on {report.generated_at}
                                            </p>
                                        </div>
                                        <button
                                            className="px-4 py-2 text-blue-500 hover:text-blue-600"
                                            onClick={() => downloadReport(report.id)}
                                        >
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
