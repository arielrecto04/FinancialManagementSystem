import AccountingBaseLayout from "@/Layouts/AccountingBaseLayout";
import { Link } from "@inertiajs/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CreateJournal() {
    return (
        <AccountingBaseLayout>
            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-2 p-2 min-h-screen bg-gray-50">
                        <div className="flex justify-between items-center px-5 py-2 bg-white rounded-lg shadow-sm">
                            <div className="flex gap-2 items-center">
                                <Link
                                    href={route("accounting.journal.index")}
                                    className="flex justify-center items-center p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                                >
                                    <ArrowLeftIcon className="w-5 h-5" />
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Create Journal
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AccountingBaseLayout>
    );
}
