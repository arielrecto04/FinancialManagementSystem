import AccountingBaseLayout from "@/Layouts/AccountingBaseLayout";

export default function Report() {
    return (
        <AccountingBaseLayout>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-6 min-h-screen bg-gray-50">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Report
                        </h1>
                    </div>
                </div>
            </div>
        </AccountingBaseLayout>
    );
}
