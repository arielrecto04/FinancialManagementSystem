import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// Import any other components you need, like icons or DatePicker

export default function EditRequest({ auth, request, requestType }) {
    
    // Initialize useForm with ALL possible fields that can be edited across all forms
    const { data, setData, put, processing, errors } = useForm({
        // Supply Request Fields
        purpose: request.purpose || '',
        location: request.location || '',
        department: request.department || '',
        date_needed: (request.date_needed || '').split('T')[0],

        // Reimbursement & Liquidation Fields
        expense_type: request.expense_type || '',
        expense_date: (request.expense_date || '').split('T')[0],
        particulars: request.particulars || '',
        date: (request.date || '').split('T')[0], 

    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('requests.update', { type: requestType, id: request.id }));
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Edit Request #${request.request_number}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-2xl font-bold mb-6">
                                Edit {request.type} Request
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">

                                { (requestType === 'supply' || requestType === 'supplyrequest') && (
                                    <>
                                        {/* Fields for Supply Request */}
                                        <div className="mb-4">
                                            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Purpose</label>
                                            <textarea id="purpose" value={data.purpose} onChange={(e) => setData('purpose', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" rows="2" />
                                            {errors.purpose && <div className="text-red-500 text-xs mt-1">{errors.purpose}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                            <select value={data.location} onChange={(e)=> setData("location", e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                            <option value="">
                                                Select Location
                                            </option>
                                            <option value="Parañaque - Atlantica">
                                                Parañaque - Atlantica
                                            </option>
                                            <option value="Parañaque - Velasco">
                                                Parañaque - Velasco
                                            </option>
                                            <option value="Pampanga">
                                                Pampanga
                                            </option>
                                            <option value="Laguna">
                                                Laguna
                                            </option>
                                            <option value="Cagayan de Oro">
                                                Cagayan de Oro
                                            </option>
                                            <option value="Cebu">Cebu</option>
                                            </select>
                                            {errors.location && <div className="text-red-500 text-xs mt-1">{errors.location}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="date_needed" className="block text-sm font-medium text-gray-700">Date Needed</label>
                                            <input id="date_needed" type="date" value={data.date_needed} onChange={(e) => setData('date_needed', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                                            {errors.date_needed && <div className="text-red-500 text-xs mt-1">{errors.date_needed}</div>}
                                        </div>
                                    </>
                                )}

                                { requestType === 'liquidation' && (
                                    <>
                                        {/* Fields for Liquidation Request */}
                                        <div className="mb-4">
                                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                                            <select id="department" value={data.department} onChange={(e)=> setData("department", e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                                <option value="">
                                                    Select Department
                                                </option>
                                            </select>
                                            {errors.department && <div className="text-red-500 text-xs mt-1">{errors.department}</div>}
                                        </div>
        <div className="mb-4">
            <label htmlFor="expense_type" className="block text-sm font-medium text-gray-700">Expense Type</label>
            <select
                id="expense_type"
                value={data.expense_type}
                onChange={(e) => setData('expense_type', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
                <option value="">Select Expense Type</option>
                <option value="Transportation">Transportation</option>
                <option value="Meals">Meals</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Other">Other</option>
            </select>
            {errors.expense_type && <div className="text-red-500 text-xs mt-1">{errors.expense_type}</div>}
        </div>
                                        <div className="mb-4">
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Expense Date</label>
                                            <input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                                            {errors.date && <div className="text-red-500 text-xs mt-1">{errors.date}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="particulars" className="block text-sm font-medium text-gray-700">Particulars</label>
                                            <textarea id="particulars" value={data.particulars} onChange={(e) => setData('particulars', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" rows="2" />
                                            {errors.particulars && <div className="text-red-500 text-xs mt-1">{errors.particulars}</div>}
                                        </div>
                                       
                                    </>
                                )}
                                { requestType === 'reimbursement' && (
                                    <>
                                        {/* Fields for Reimbursement Request */}
                                        <div className="mb-4">
                                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                                            <select id="department" value={data.department} onChange={(e)=> setData("department", e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                            <option value="">
                                                Select Department
                                            </option>
                                            </select>
                                            {errors.department && <div className="text-red-500 text-xs mt-1">{errors.department}</div>}
                                        </div>
        <div className="mb-4">
            <label htmlFor="expense_type" className="block text-sm font-medium text-gray-700">Expense Type</label>
            <select
                id="expense_type"
                value={data.expense_type}
                onChange={(e) => setData('expense_type', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
                <option value="">Select Expense Type</option>
                <option value="Transportation">Transportation</option>
                <option value="Meals">Meals</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Other">Other</option>
            </select>
            {errors.expense_type && <div className="text-red-500 text-xs mt-1">{errors.expense_type}</div>}
        </div>
                                        <div className="mb-4">
                                            <label htmlFor="expense_date" className="block text-sm font-medium text-gray-700">Expense Date</label>
                                            <input id="expense_date" type="date" value={data.expense_date} onChange={(e) => setData('expense_date', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                                            {errors.expense_date && <div className="text-red-500 text-xs mt-1">{errors.expense_date}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" rows="2" />
                                            {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                                        </div>
                                        
                                    </>
                                )}
                                { requestType === 'hrexpense' && (
                                    <>
                                        {/* Fields for Liquidation Request */}
                                        <div className="mb-4">
                                            <label htmlFor="particulars" className="block text-sm font-medium text-gray-700">Particulars</label>
                                            <textarea id="particulars" value={data.particulars} onChange={(e) => setData('particulars', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" rows="3" />
                                            {errors.particulars && <div className="text-red-500 text-xs mt-1">{errors.particulars}</div>}
                                        </div>
                                        {/* ... Add other Liquidation-specific fields here ... */}
                                    </>
                                )}
                                { requestType === 'operatingexpense' && (
                                    <>
                                        {/* Fields for Liquidation Request */}
                                        <div className="mb-4">
                                            <label htmlFor="particulars" className="block text-sm font-medium text-gray-700">Particulars</label>
                                            <textarea id="particulars" value={data.particulars} onChange={(e) => setData('particulars', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" rows="3" />
                                            {errors.particulars && <div className="text-red-500 text-xs mt-1">{errors.particulars}</div>}
                                        </div>
                                        {/* ... Add other Liquidation-specific fields here ... */}
                                    </>
                                )}

                                

                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}