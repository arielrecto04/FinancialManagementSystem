import React, { useState } from "react";
import AccountingBaseLayout from "@/Layouts/AccountingBaseLayout";
import Dropdown from "@/Components/Dropdown";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Dashboard() {
    //#region States
    const [formType, setFormType] = useState(
        "dashboard" || route("accounting.dashboard")
    );
    const [viewMode, setViewMode] = useState("table");
    //#endregion

    // Hardcoded account data
    const accounts = [
        {
            id: 1,
            name: "Accounts Receivable",
            type: "Asset",
            balance: 25000,
            change: 1200,
        },
        {
            id: 2,
            name: "Accounts Payable",
            type: "Liability",
            balance: 18000,
            change: -800,
        },
        { id: 3, name: "Cash", type: "Asset", balance: 45000, change: 3500 },
        {
            id: 4,
            name: "Inventory",
            type: "Asset",
            balance: 32000,
            change: -1500,
        },
        {
            id: 5,
            name: "Loans Payable",
            type: "Liability",
            balance: 50000,
            change: 0,
        },
        {
            id: 6,
            name: "Retained Earnings",
            type: "Equity",
            balance: 65000,
            change: 5000,
        },
    ];

    // Calculate summary
    const totalAssets = accounts
        .filter((account) => account.type === "Asset")
        .reduce((sum, account) => sum + account.balance, 0);

    const totalLiabilities = accounts
        .filter((account) => account.type === "Liability")
        .reduce((sum, account) => sum + account.balance, 0);

    const totalEquity = accounts
        .filter((account) => account.type === "Equity")
        .reduce((sum, account) => sum + account.balance, 0);

    const getChangeColor = (change) => {
        if (change > 0) return "text-green-600";
        if (change < 0) return "text-red-600";
        return "text-gray-500";
    };

    const getChangeIcon = (change) => {
        if (change > 0) return "↑";
        if (change < 0) return "↓";
        return "→";
    };

    return (
        <AccountingBaseLayout>
            <div className="p-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-6 min-h-screen">
                        <div className="flex justify-between items-center p-2 mb-6 bg-white rounded-lg shadow-sm">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Accounting Dashboard
                            </h1>
                            <div
                                className="inline-flex rounded-md shadow-sm"
                                role="group"
                            >
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                                        viewMode === "table"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    Table View
                                </button>
                                <button
                                    onClick={() => setViewMode("card")}
                                    className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                                        viewMode === "card"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    Card View
                                </button>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                            <div className="p-6 bg-white rounded-lg shadow">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Total Assets
                                </h3>
                                <p className="text-2xl font-semibold text-blue-600">
                                    ${totalAssets.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-6 bg-white rounded-lg shadow">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Total Liabilities
                                </h3>
                                <p className="text-2xl font-semibold text-red-600">
                                    ${totalLiabilities.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-6 bg-white rounded-lg shadow">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Total Equity
                                </h3>
                                <p className="text-2xl font-semibold text-green-600">
                                    ${totalEquity.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Accounts Section */}
                        <div className="p-4 mb-8 bg-white rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-800">
                                    Account Balances
                                </h2>
                            </div>

                            {viewMode === "table" ? (
                                // Table View
                                <div className="overflow-hidden bg-white rounded-lg shadow">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                        Account
                                                    </th>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                        Type
                                                    </th>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                                                        Balance
                                                    </th>
                                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                                                        Change
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {accounts.map((account) => (
                                                    <tr
                                                        key={account.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                            {account.name}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                            {account.type}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap">
                                                            $
                                                            {account.balance.toLocaleString()}
                                                        </td>
                                                        <td
                                                            className={`px-6 py-4 whitespace-nowrap text-sm text-right ${getChangeColor(
                                                                account.change
                                                            )}`}
                                                        >
                                                            {getChangeIcon(
                                                                account.change
                                                            )}{" "}
                                                            {account.change > 0
                                                                ? "+"
                                                                : ""}
                                                            {account.change !==
                                                            0
                                                                ? Math.abs(
                                                                      account.change
                                                                  ).toLocaleString()
                                                                : ""}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                // Card View
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {accounts.map((account) => (
                                        <div
                                            key={account.id}
                                            className="p-4 bg-white rounded-lg shadow transition-shadow hover:shadow-md"
                                        >
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {account.name}
                                                </h3>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {account.type}
                                                </span>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-2xl font-semibold text-gray-900">
                                                    $
                                                    {account.balance.toLocaleString()}
                                                </p>
                                                <div className="flex items-center mt-1">
                                                    <span
                                                        className={`text-sm ${getChangeColor(
                                                            account.change
                                                        )}`}
                                                    >
                                                        {getChangeIcon(
                                                            account.change
                                                        )}
                                                        {account.change > 0
                                                            ? "+"
                                                            : ""}
                                                        {account.change !== 0
                                                            ? `${Math.abs(
                                                                  account.change
                                                              ).toLocaleString()} `
                                                            : "No change"}
                                                    </span>
                                                    <span className="ml-1 text-xs text-gray-500">
                                                        {account.change !== 0
                                                            ? "from last period"
                                                            : ""}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Transactions */}
                        <div className="overflow-hidden bg-white rounded-lg shadow">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-800">
                                    Recent Transactions
                                </h2>
                            </div>
                            <div className="p-4 text-sm text-center text-gray-500">
                                <p>Recent transactions will appear here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AccountingBaseLayout>
    );
}
