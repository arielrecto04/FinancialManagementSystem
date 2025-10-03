import { useState, useEffect } from "react";
import AccountingBaseLayout from "@/Layouts/AuthenticatedLayout.jsx"; // Assuming you have this layout
import Modal from "@/Components/Modal";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";

export default function BudgetIndex({ budgetTypes }) {
    const [budgetTypesData, setBudgetTypesData] = useState(budgetTypes);
    const [activeTab, setActiveTab] = useState(budgetTypesData[0]?.id);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        budget_type_id: activeTab,
        type: "income",
    });
    const [errors, setErrors] = useState({});
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
    // const [showExpenseTypeModal, setShowExpenseTypeModal] = useState(false);
    // const [expenseTypeFormData, setExpenseTypeFormData] = useState({
    //     name: "",
    //     budget_type_id: activeTab,
    //     expense_model: "",
    //     is_expense: true,
    // });

    // console.log(expenseModels);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            budget_type_id: activeTab,
        }));

        // setExpenseTypeFormData((prev) => ({
        //     ...prev,
        //     budget_type_id: activeTab,
        // }));
    }, [activeTab]);

    // useEffect(() => {
    //     setExpenseTypeFormData((prev) => ({
    //         ...prev,
    //         name: expenseModels.find(
    //             (expenseModel) =>
    //                 expenseModel.expense_model ===
    //                 expenseTypeFormData.expense_model
    //         )?.name,
    //     }));
    // }, [expenseTypeFormData.expense_model]);

    const handleModalAction = () => {
        setShowModal(!showModal);
    };

    // const handleExpenseTypeModalAction = () => {
    //     setShowExpenseTypeModal(!showExpenseTypeModal);
    // };

    const handleFormSubmit = async (e) => {
        try {
            e.preventDefault();

            const response = await axios.post(route("budgets.store"), formData);

            setBudgetTypesData((prev) => {
                return prev.map((budgetType) => {
                    if (budgetType.id === activeTab) {
                        return {
                            ...budgetType,
                            budgets: [
                                ...budgetType.budgets,
                                response.data.budget,
                            ],
                        };
                    }
                    return budgetType;
                });
            });

            setShowModal(false);
            setFormData({
                name: "",
                amount: "",
                budget_type_id: activeTab,
                type: "income",
            });
        } catch (error) {
            console.error(error);
            setErrors(error.response.data.errors);
        }
    };

    // const handleExpenseTypeFormSubmit = async (e) => {
    //     try {
    //         e.preventDefault();

    //         const response = await axios.post(
    //             route("budgets.assign-expense-type"),
    //             expenseTypeFormData
    //         );

    //         setBudgetTypesData((prev) => {
    //             return prev.map((budgetType) => {
    //                 if (budgetType.id === expenseTypeFormData.budget_type_id) {
    //                     return {
    //                         ...budgetType,
    //                         budgets: [
    //                             ...budgetType.budgets,
    //                             response.data.budget,
    //                         ],
    //                     };
    //                 }
    //                 return budgetType;
    //             });
    //         });

    //         setShowExpenseTypeModal(false);
    //         setExpenseTypeFormData({
    //             name: "",
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         setErrors(error.response.data.errors);
    //     }
    // };

    const computeTotalBudget = () => {
        const budgetType = budgetTypesData.find(
            (budgetType) => budgetType.id === activeTab
        );

        const totalBudget = budgetType?.budgets.reduce((total, budget) => {
            console.log(budget.amount);
            return total + parseFloat(budget.amount);
        }, 0);

        return totalBudget;
    };

    return (
        <AccountingBaseLayout>
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="p-6 mx-auto max-w-7xl bg-white rounded-lg shadow">
                    {/* Page Header */}

                    <div className="flex gap-2 justify-between items-center">
                        <div className="flex gap-2 mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Budgets
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Manage and review budgets categorized by
                                    type.
                                </p>
                            </div>

                            <div className="flex gap-2 justify-start p-1 w-5 h-5">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSettingsDropdown(
                                            !showSettingsDropdown
                                        );
                                    }}
                                    className="relative p-1 text-gray-500 rounded-full aspect-square"
                                >
                                    <Cog8ToothIcon className="w-5 h-5 aspect-square" />
                                    {showSettingsDropdown && (
                                        <div className="absolute left-0 z-10 mt-2 w-48 bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right">
                                            <div
                                                className="py-1"
                                                role="menu"
                                                aria-orientation="vertical"
                                            >
                                                <Link
                                                    href={route(
                                                        "budget-types.index"
                                                    )}
                                                    className="block px-4 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-100"
                                                    role="menuitem"
                                                >
                                                    Budget Type
                                                </Link>
                                                {/* <button
                                                    onClick={handleExpenseTypeModalAction}
                                                    className="block px-4 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-100"
                                                    role="menuitem"
                                                >
                                                    Expense Type
                                                </button> */}
                                            </div>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                            onClick={handleModalAction}
                        >
                            Add Budget
                        </button>
                    </div>

                    {/* --- 3. Tab Navigation --- */}
                    <div className="border-b border-gray-200">
                        <nav
                            className="flex -mb-px space-x-6"
                            aria-label="Tabs"
                        >
                            {budgetTypesData.map((tab) => (
                                <div key={tab.id} className="flex gap-2">
                                    <button
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${
                                    activeTab === tab.id
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                                    >
                                        {tab.name}
                                    </button>
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* --- 4. Tab Content --- */}
                    <div className="mt-5">
                        {budgetTypesData.map((budgetType) => (
                            // Only render the content for the active tab
                            <div
                                key={budgetType.id}
                                className={
                                    activeTab === budgetType.id
                                        ? "block"
                                        : "hidden"
                                }
                            >
                                <div className="overflow-x-auto bg-white rounded-lg shadow">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                                >
                                                    Account Name
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase"
                                                >
                                                    Amount
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {budgetType?.budgets?.map(
                                                (budget) => (
                                                    <tr key={budget.id}>
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                            {budget?.name}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-right text-gray-700 whitespace-nowrap">
                                                            {new Intl.NumberFormat(
                                                                "en-PH",
                                                                {
                                                                    style: "currency",
                                                                    currency:
                                                                        "PHP",
                                                                }
                                                            ).format(
                                                                budget?.amount
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                        <tfoot className="bg-gray-100">
                                            <tr>
                                                <td className="px-6 py-3 text-sm font-bold text-right text-gray-900">
                                                    Total {budgetType?.name}
                                                </td>
                                                <td
                                                    className={`${
                                                        computeTotalBudget() > 0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    } px-6 py-3 text-sm font-bold text-right text-gray-900`}
                                                >
                                                    {new Intl.NumberFormat(
                                                        "en-PH",
                                                        {
                                                            style: "currency",
                                                            currency: "PHP",
                                                        }
                                                    ).format(
                                                        computeTotalBudget()
                                                    )}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={handleModalAction}>
                <div className="p-6">
                    <h1 className="mb-4 text-2xl font-bold">Add Budget</h1>
                    <form
                        action={route("budgets.store")}
                        method="POST"
                        onSubmit={handleFormSubmit}
                    >
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                        <div className="mb-4">
                            <label
                                htmlFor="amount"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Amount
                            </label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        amount: e.target.value,
                                    })
                                }
                                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {errors.amount && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.amount}
                            </p>
                        )}
                        <div className="mb-4">
                            <label
                                htmlFor="budget_type_id"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Budget Type
                            </label>
                            <select
                                id="budget_type_id"
                                name="budget_type_id"
                                value={formData.budget_type_id}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        budget_type_id: e.target.value,
                                    })
                                }
                                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Select Budget Type</option>
                                {budgetTypesData.map((budgetType) => (
                                    <>
                                        {budgetType.id === activeTab ? (
                                            <option
                                                key={budgetType.id}
                                                selected
                                                value={budgetType.id}
                                            >
                                                {budgetType.name}
                                            </option>
                                        ) : (
                                            <option
                                                key={budgetType.id}
                                                value={budgetType.id}
                                            >
                                                {budgetType.name}
                                            </option>
                                        )}
                                    </>
                                ))}
                            </select>
                        </div>
                        {errors.budget_type_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.budget_type_id}
                            </p>
                        )}
                        <div className="mb-4">
                            <label
                                htmlFor="type"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Type
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        type: e.target.value,
                                    })
                                }
                                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Select Type</option>
                                <option value="asset" selected>
                                    Asset
                                </option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>
                        {errors.type && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.type}
                            </p>
                        )}

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="px-4 py-2 w-full text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Add Budget
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 w-full text-white bg-gray-500 rounded-md hover:bg-gray-600"
                                onClick={handleModalAction}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* <Modal
                show={showExpenseTypeModal}
                onClose={handleExpenseTypeModalAction}
            >
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Add Expense Type
                    </h2>
                    <form
                        className="mt-6"
                        onSubmit={handleExpenseTypeFormSubmit}
                    >
                        <div className="mb-4">
                            <label
                                htmlFor="budget_type_id"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Budget Type
                            </label>
                            <select
                                id="budget_type_id"
                                name="budget_type_id"
                                value={expenseTypeFormData.budget_type_id}
                                onChange={(e) =>
                                    setExpenseTypeFormData({
                                        ...expenseTypeFormData,
                                        budget_type_id: e.target.value,
                                    })
                                }
                                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Select Budget Type</option>
                                {budgetTypesData.map((budgetType) => (
                                    <option
                                        key={budgetType.id}
                                        value={budgetType.id}
                                    >
                                        {budgetType.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Request Type
                            </label>
                            <select
                                id="name"
                                name="name"
                                value={expenseTypeFormData.name}
                                onChange={(e) =>
                                    setExpenseTypeFormData({
                                        ...expenseTypeFormData,
                                        expense_model: e.target.value,
                                    })
                                }
                                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Select Request Type</option>
                                {expenseModels.map((expenseModel) => (
                                    <option
                                        key={expenseModel.expense_model}
                                        value={expenseModel.expense_model}
                                    >
                                        {expenseModel.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Is Expense
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="name"
                                    name="name"
                                    value={expenseTypeFormData.name}
                                    onChange={(e) =>
                                        setExpenseTypeFormData({
                                            ...expenseTypeFormData,
                                            expense_model: e.target.value,
                                        })
                                    }
                                    className="block mt-1 w-4 h-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="px-4 py-2 w-full text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Add Expense Type
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 w-full text-white bg-gray-500 rounded-md hover:bg-gray-600"
                                onClick={handleExpenseTypeModalAction}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </Modal> */}
        </AccountingBaseLayout>
    );
}
