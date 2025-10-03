import React, { useState, useEffect } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    TableCellsIcon,
    Squares2X2Icon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import Modal from "@/Components/Modal";
import Swal from "sweetalert2";
// import { toast } from 'react-hot-toast';

export default function BudgetTypeIndex({ budgetTypes, expenseModels }) {
    const [budgetTypesData, setBudgetTypesData] = useState(budgetTypes.data);
    const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [selectedBudgetType, setSelectedBudgetType] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, reset } = useForm({
        budget_type_id: "",
        name: "",
        expense_model: "",
        is_expense: true,
    });

    useEffect(() => {
        if (showExpenseForm) {
            setData((prev) => ({
                ...prev,
                budget_type_id: selectedBudgetType?.id || "",
            }));
        }
    }, [showExpenseForm, selectedBudgetType]);

    const handleViewExpenses = (budgetType) => {
        setSelectedBudgetType(budgetType);
        setShowExpenseModal(true);
    };

    const handleEdit = (budgetType) => {
        router.visit(route("budget-types.edit", budgetType.id));
    };

    const handleDelete = async (budgetType) => {
        if (
            window.confirm(
                `Are you sure you want to delete "${budgetType.name}"?`
            )
        ) {
            try {
                setIsDeleting(true);
                await router.delete(
                    route("budget-types.destroy", budgetType.id),
                    {
                        onSuccess: () => {
                            // toast.success('Budget type deleted successfully');
                        },
                        onError: () => {
                            // toast.error('Failed to delete budget type');
                        },
                        onFinish: () => {
                            setIsDeleting(false);
                        },
                    }
                );
            } catch (error) {
                console.error("Error deleting budget type:", error);
                // toast.error('An error occurred while deleting the budget type');
                setIsDeleting(false);
            }
        }
    };

    const closeModal = () => {
        setShowExpenseModal(false);
        setSelectedBudgetType(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Never";
        return new Date(dateString).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            active: "bg-green-100 text-green-800",
            inactive: "bg-gray-100 text-gray-800",
            draft: "bg-yellow-100 text-yellow-800",
            archived: "bg-red-100 text-red-800",
        };

        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || "bg-gray-100 text-gray-800"
                    }`}
            >
                {status?.charAt(0).toUpperCase() + status?.slice(1) || "N/A"}
            </span>
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // post(route("budget-types.expenses.store"), {
        //     onSuccess: () => {
        //         reset();
        //         setShowExpenseForm(false);
        //     },
        // });
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();


        try {


            const response = await axios.post(route("budget-type-expenses.store"), data);


            reset();
            setShowExpenseForm(false);


            setBudgetTypesData(budgetTypesData.map((budgetType) => {
                if (budgetType.id === response.data.budgetTypeExpense.budget_type_id) {
                    return {
                        ...budgetType,
                        budget_type_expenses: [...budgetType.budget_type_expenses, response.data.budgetTypeExpense],
                    };
                }
                return budgetType;
            }));


            setSelectedBudgetType({
                ...selectedBudgetType,
                budget_type_expenses: [...selectedBudgetType.budget_type_expenses, response.data.budgetTypeExpense],
            });


            Swal.fire({
                icon: "success",
                title: "Success!",
                text: response.data.message,
            });

        } catch (error) {

            console.log(error);

            Swal.fire({
                icon: "error",
                title: "Error!",
                text: error.response?.data?.message,
            });
        }

    };

    return (
        <AuthenticatedLayout>
            <Head title="Budget Types" />

            <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col justify-between mb-6 space-y-4 md:flex-row md:items-center md:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Budget Types
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your organization's budget categories and
                            their configurations
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="inline-flex overflow-hidden bg-white rounded-md border border-gray-200 shadow-sm">
                            <button
                                onClick={() => setViewMode("table")}
                                className={`px-3 py-2 text-sm font-medium ${viewMode === "table"
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                title="Table view"
                            >
                                <TableCellsIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("card")}
                                className={`px-3 py-2 text-sm font-medium ${viewMode === "card"
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                title="Card view"
                            >
                                <Squares2X2Icon className="w-5 h-5" />
                            </button>
                        </div>
                        <Link
                            href={route("budget-types.create")}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <PlusIcon className="mr-2 -ml-1 w-5 h-5" />
                            New Budget Type
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="overflow-hidden px-4 py-5 bg-white rounded-lg shadow sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Budget Types
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {budgetTypes.meta?.total || 0}
                        </dd>
                        <div className="mt-1 text-sm text-green-600">
                            <span className="font-medium">+2.5%</span> from last
                            month
                        </div>
                    </div>
                    <div className="overflow-hidden px-4 py-5 bg-white rounded-lg shadow sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            Active Budgets
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {
                                budgetTypes.data.filter(
                                    (bt) => bt.status === "active"
                                ).length
                            }
                        </dd>
                        <div className="mt-1 text-sm text-green-600">
                            <span className="font-medium">+5.2%</span> from last
                            month
                        </div>
                    </div>
                    <div className="overflow-hidden px-4 py-5 bg-white rounded-lg shadow sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Expenses
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            ₱
                            {budgetTypes.data
                                .reduce(
                                    (sum, bt) =>
                                        sum +
                                        (bt.budget_type_expenses?.length || 0),
                                    0
                                )
                                .toLocaleString()}
                        </dd>
                        <div className="mt-1 text-sm text-red-600">
                            <span className="font-medium">-1.8%</span> from last
                            month
                        </div>
                    </div>
                    <div className="overflow-hidden px-4 py-5 bg-white rounded-lg shadow sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            Last Updated
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {budgetTypesData.length > 0
                                ? formatDate(
                                    budgetTypesData[0].updated_at
                                ).split(",")[0]
                                : "N/A"}
                        </dd>
                        <div className="mt-1 text-sm text-gray-500">
                            {budgetTypes.data.length > 0
                                ? formatDate(budgetTypes.data[0].updated_at)
                                    .split(",")
                                    .slice(1)
                                    .join(",")
                                    .trim()
                                : ""}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-8">
                    {viewMode === "table" ? (
                        // Table View
                        <div className="overflow-hidden overflow-x-auto bg-white shadow sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Budget Types Overview
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Detailed view of all budget types and their
                                    current status
                                </p>
                            </div>
                            <div className="border-t border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                            >
                                                Expenses
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                            >
                                                Last Updated
                                            </th>
                                            <th
                                                scope="col"
                                                className="relative px-6 py-3"
                                            >
                                                <span className="sr-only">
                                                    Actions
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {budgetTypesData.length > 0 ? (
                                            budgetTypesData.map(
                                                (budgetType) => (
                                                    <tr
                                                        key={budgetType.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 w-10 h-10">
                                                                    <div className="flex justify-center items-center w-10 h-10 text-blue-600 bg-blue-100 rounded-full">
                                                                        {budgetType.name
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {
                                                                            budgetType.name
                                                                        }
                                                                    </div>
                                                                    {/* <div className="text-sm text-gray-500">
                                                                        {budgetType.code ||
                                                                            "No code"}
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {getStatusBadge(
                                                                budgetType.status ||
                                                                "inactive"
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {budgetType
                                                                    .budget_type_expenses
                                                                    ?.length ||
                                                                    0}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {budgetType.budget_type_expenses?.filter(
                                                                    (e) =>
                                                                        e.is_expense
                                                                ).length ||
                                                                    0}{" "}
                                                                expenses
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <ClockIcon className="mr-1 w-4 h-4 text-gray-400" />
                                                                {formatDate(
                                                                    budgetType.updated_at
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                            <div className="flex justify-end items-center space-x-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleViewExpenses(
                                                                            budgetType
                                                                        )
                                                                    }
                                                                    className="p-1 text-blue-600 rounded-full hover:bg-blue-50"
                                                                    title="View Expenses"
                                                                >
                                                                    <EyeIcon className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            budgetType
                                                                        )
                                                                    }
                                                                    className="p-1 text-yellow-600 rounded-full hover:bg-yellow-50"
                                                                    title="Edit"
                                                                >
                                                                    <PencilIcon className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            budgetType
                                                                        )
                                                                    }
                                                                    className="p-1 text-red-600 rounded-full hover:bg-red-50"
                                                                    disabled={
                                                                        isDeleting
                                                                    }
                                                                    title="Delete"
                                                                >
                                                                    <TrashIcon className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-4 text-sm text-center text-gray-500"
                                                >
                                                    No budget types found.
                                                    Create one to get started.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            {budgetTypes.meta?.last_page > 1 && (
                                <div className="flex justify-between items-center px-6 py-3 bg-gray-50">
                                    <div className="flex flex-1 justify-between">
                                        <Link
                                            href={
                                                budgetTypes.links?.prev || "#"
                                            }
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 ${!budgetTypes.links?.prev
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                                }`}
                                            disabled={!budgetTypes.links?.prev}
                                        >
                                            Previous
                                        </Link>
                                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Showing{" "}
                                                    <span className="font-medium">
                                                        {budgetTypes.meta
                                                            ?.from || 0}
                                                    </span>{" "}
                                                    to{" "}
                                                    <span className="font-medium">
                                                        {budgetTypes.meta?.to ||
                                                            0}
                                                    </span>{" "}
                                                    of{" "}
                                                    <span className="font-medium">
                                                        {budgetTypes.meta
                                                            ?.total || 0}
                                                    </span>{" "}
                                                    results
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href={
                                                budgetTypes.links?.next || "#"
                                            }
                                            className={`relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 ${!budgetTypes.links?.next
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                                }`}
                                            disabled={!budgetTypes.links?.next}
                                        >
                                            Next
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Card View
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {budgetTypesData.length > 0 ? (
                                budgetTypesData.map((budgetType) => (
                                    <div
                                        key={budgetType.id}
                                        className="overflow-hidden bg-white rounded-lg shadow"
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="flex justify-center items-center w-12 h-12 text-blue-600 bg-blue-100 rounded-full">
                                                        {budgetType.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            {budgetType.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {budgetType.code ||
                                                                "No code"}
                                                        </p>
                                                    </div>
                                                </div>
                                                {budgetType.status ===
                                                    "active" ? (
                                                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                                ) : (
                                                    <XCircleIcon className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>

                                            <div className="mt-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-500">
                                                        Expenses
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {budgetType
                                                            .budget_type_expenses
                                                            ?.length || 0}
                                                    </span>
                                                </div>
                                                <div className="mt-1">
                                                    <div className="overflow-hidden w-full h-2 bg-gray-200 rounded-full">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full"
                                                            style={{
                                                                width: `${Math.min(
                                                                    100,
                                                                    (budgetType
                                                                        .budget_type_expenses
                                                                        ?.length ||
                                                                        0) * 10
                                                                )}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                                                <span>Last updated</span>
                                                <span>
                                                    {formatDate(
                                                        budgetType.updated_at
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex mt-4 space-x-3">
                                                <button
                                                    onClick={() =>
                                                        handleViewExpenses(
                                                            budgetType
                                                        )
                                                    }
                                                    className="inline-flex flex-1 justify-center items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    <EyeIcon className="-ml-0.5 mr-2 h-4 w-4" />
                                                    View
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleEdit(budgetType)
                                                    }
                                                    className="inline-flex flex-1 justify-center items-center px-3 py-2 text-sm font-medium text-yellow-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                                >
                                                    <PencilIcon className="-ml-0.5 mr-2 h-4 w-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(budgetType)
                                                    }
                                                    disabled={isDeleting}
                                                    className="inline-flex flex-1 justify-center items-center px-3 py-2 text-sm font-medium text-red-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                >
                                                    <TrashIcon className="-ml-0.5 mr-2 h-4 w-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full">
                                    <div className="p-8 text-center rounded-lg border-2 border-gray-300 border-dashed">
                                        <svg
                                            className="mx-auto w-12 h-12 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                                            No budget types
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Get started by creating a new budget
                                            type.
                                        </p>
                                        <div className="mt-6">
                                            <Link
                                                href={route(
                                                    "budget-types.create"
                                                )}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <PlusIcon className="mr-2 -ml-1 w-5 h-5" />
                                                New Budget Type
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Expense Items Modal */}
            <Modal show={showExpenseModal} onClose={closeModal} maxWidth="4xl" className="h-96">
                <div className="flex flex-col justify-between p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            {selectedBudgetType?.name} - Expense Items
                        </h3>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowExpenseForm(true)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Add Expense Item
                            </button>

                            <button
                                type="button"
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                onClick={closeModal}
                            >
                                <span className="sr-only">Close</span>
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {selectedBudgetType?.budget_type_expenses?.length > 0 ? (
                        <div className="overflow-hidden mt-4 rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            Type
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            Model
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            Created At
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedBudgetType.budget_type_expenses.map(
                                        (expense) => (
                                            <tr
                                                key={expense.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {expense.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${expense.is_expense
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-green-100 text-green-800"
                                                            }`}
                                                    >
                                                        {expense.is_expense
                                                            ? "Expense"
                                                            : "Asset"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    {expense.expense_model ||
                                                        "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    {formatDate(
                                                        expense.created_at
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    <button>
                                                        <PencilIcon className="w-5 h-5 text-gray-400" />
                                                    </button>
                                                    <button>
                                                        <TrashIcon className="w-5 h-5 text-gray-400" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center rounded-lg border-2 border-gray-300 border-dashed">
                            <svg
                                className="mx-auto w-12 h-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                No expense items
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No expense items found for this budget type.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end mt-6 space-x-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Add Expense Item Form Modal */}
            <Modal
                show={showExpenseForm}
                onClose={() => setShowExpenseForm(false)}
            >
                <form onSubmit={handleExpenseSubmit} className="p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Add New Expense Item to {selectedBudgetType?.name}
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="hidden"
                            name="budget_type_id"
                            value={selectedBudgetType?.id}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Expense Model
                            </label>

                            <select
                                value={data.expense_model}
                                onChange={(e) =>
                                    setData("expense_model", e.target.value)
                                }
                                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select a model</option>
                                {expenseModels.map((model) => (
                                    <option
                                        key={model.expense_model}
                                        value={model.expense_model}
                                    >
                                        {model.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_expense}
                                    onChange={(e) =>
                                        setData("is_expense", e.target.checked)
                                    }
                                    className="text-blue-600 rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    Is Expense
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6 space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowExpenseForm(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
