import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function AccountingBaseLayout({ children }) {
    const [formType, setFormType] = useState("");

    useEffect(() => {
        setFormType(route().current());
    }, [route().current()]);



    const icons = {
        dashboard: (
            <svg
                className="mr-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
            </svg>
        ),
        journal: (
            <svg
                className="mr-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7l-4-4H7L3 7zm0 0h18"
                />
            </svg>
        ),
        trialBalance: (
            <svg
                className="mr-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l-3-1m-3 1l-6 18M21 6l-3 1m0 0l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0 0l-6 18"
                />
            </svg>
        ),
        chartOfAccounts: (
            <svg
                className="mr-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
            </svg>
        ),
        journalEntry: (
            <svg
                className="mr-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l2 5L19 12M4 19h14a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
            </svg>
        ),
    };


    const tabs = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: icons.dashboard,
            route: "/accounting/dashboard",
            name: "accounting.dashboard",
            children: []
        },
        {
            id: "journal",
            label: "Journal",
            icon: icons.journal,
            route: "/accounting/journal",
            name: "accounting.journal.index",
            children: [
                {
                    id: "create",
                    label: "Create Journal",
                    route: "/accounting/journal/create",
                    name: "accounting.journal.create",
                },
            ],
        },
        {
            id: "chartOfAccounts",
            label: "Chart of Accounts",
            icon: icons.chartOfAccounts,
            route: "/accounting/chart-of-accounts",
            name: "accounting.chart-of-accounts.index",
            children: []
        },
        {
            id: "journalEntry",
            label: "Journal Entry",
            icon: icons.journalEntry,
            route: "/accounting/journal-entry",
            name: "accounting.journal-entry.index",
            children: []
        },
    ];

    return (
        <AuthenticatedLayout>
            <div className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="min-h-screen">
                        <div className="flex gap-2 justify-center items-center">
                            <div className="p-2 mb-6 bg-white rounded-lg shadow-sm">
                                <div className="flex flex-col gap-3 sm:flex-row sm:space-x-4">
                                    {tabs.map((tab) => (
                                        <Link
                                            key={tab.id}
                                            className={`flex items-center justify-center px-4 py-3 rounded-lg transition-all w-full sm:w-auto ${
                                                formType === tab.name || tab.children.find((child) => child.name === formType)
                                                    ? "bg-blue-500 text-white shadow-lg"
                                                    : "bg-gray-100 hover:bg-gray-200"
                                            }`}
                                            href={tab.route}
                                            onClick={() =>
                                                setFormType(tab.name)
                                            }
                                        >
                                            <svg
                                                className="mr-2 w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                {tab.icon}
                                            </svg>
                                            {tab.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
