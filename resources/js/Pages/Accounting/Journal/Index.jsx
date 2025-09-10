import AccountingBaseLayout from "@/Layouts/AccountingBaseLayout";
import { useState } from "react";
import {Link} from "@inertiajs/react";
export default function Journal() {
    const [Journal, setJournal] = useState({
        name: "",
        account_id: "",
        suspense_account_id: "",
        code: "",
        type: "",
        is_active: false,
        currency: "",
    });

    const journals = [
        {
            id: 1,
            name: "Journal 1",
            account_id: 1,
            suspense_account_id: 1,
            code: "J1",
            type: "Debit",
            is_active: true,
            currency: "PHP",
        },
        {
            id: 2,
            name: "Journal 2",
            account_id: 2,
            suspense_account_id: 2,
            code: "J2",
            type: "Credit",
            is_active: true,
            currency: "PHP",
        },
    ];



    return (
        <AccountingBaseLayout>
            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-2 p-2 min-h-screen bg-gray-50">
                        <div className="flex justify-between items-center px-5 py-2 bg-white rounded-lg shadow-sm">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Journal
                            </h1>
                            <Link href={route("accounting.journal.create")} className="flex gap-2 items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4.5v15m7.5-7.5h-15"
                                    />
                                </svg>
                               <span>Add Journal</span>
                            </Link>
                        </div>


                        <div className="overflow-x-auto p-5 bg-white rounded-lg shadow-sm">
                            <table className="min-w-full divide-y-2 divide-gray-200">
                                <thead className="ltr:text-left rtl:text-right">
                                    <tr className="*:font-medium *:text-gray-900">
                                        <th className="px-3 py-2 whitespace-nowrap">
                                            Name
                                        </th>
                                        <th className="px-3 py-2 whitespace-nowrap">
                                            DoB
                                        </th>
                                        <th className="px-3 py-2 whitespace-nowrap">
                                            Role
                                        </th>
                                        <th className="px-3 py-2 whitespace-nowrap">
                                            Salary
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 *:even:bg-gray-50">
                                    <tr className="*:text-gray-900 *:first:font-medium">
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            Nandor the Relentless
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            04/06/1262
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            Vampire Warrior
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            $0
                                        </td>
                                    </tr>

                                    <tr className="*:text-gray-900 *:first:font-medium">
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            Laszlo Cravensworth
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            19/10/1678
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            Vampire Gentleman
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            $0
                                        </td>
                                    </tr>

                                    <tr className="*:text-gray-900 *:first:font-medium">
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            Nadja
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            15/03/1593
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            Vampire Seductress
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            $0
                                        </td>
                                    </tr>

                                    <tr className="*:text-gray-900 *:first:font-medium">
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            Colin Robinson
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            01/09/1971
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            Energy Vampire
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            $53,000
                                        </td>
                                    </tr>

                                    <tr className="*:text-gray-900 *:first:font-medium">
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            Guillermo de la Cruz
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            18/11/1991
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            Familiar/Vampire Hunter
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            $0
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AccountingBaseLayout>
    );
}
