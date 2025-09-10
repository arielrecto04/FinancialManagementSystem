import AccountingBaseLayout from "@/Layouts/AccountingBaseLayout.jsx";
import { Button } from "@headlessui/react";
import { useState, useCallback, useEffect } from "react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Swal from "sweetalert2";
import Pagination from "@/Components/Pagination";
import { router } from "@inertiajs/react";
import debounce from "lodash.debounce";

export default function ChartOfAccounts({ chartOfAccounts }) {
    //#region Static Data
    const chartOfAccountTypes = [
        { value: "bank & cash", label: "Bank & Cash", category: "Asset" },
        { value: "receivable", label: "Receivable", category: "Asset" },
        { value: "current assets", label: "Current Assets", category: "Asset" },
        { value: "fixed assets", label: "Fixed Assets", category: "Asset" },
        {
            value: "non-current assets",
            label: "Non-current Assets",
            category: "Asset",
        },
        { value: "repayments", label: "Repayments", category: "Asset" },
        { value: "fixed assets", label: "Fixed Assets", category: "Asset" },

        { value: "payable", label: "Payable", category: "Liability" },
        {
            value: "current liabilities",
            label: "Current Liabilities",
            category: "Liability",
        },
        {
            value: "non-current liabilities",
            label: "Non-current Liabilities",
            category: "Liability",
        },

        { value: "equity", label: "Equity", category: "Equity" },
        {
            value: "current year income",
            label: "Current Year Income",
            category: "Equity",
        },

        { value: "income", label: "Income", category: "Income" },
        { value: "other income", label: "Other Income", category: "Income" },

        { value: "expense", label: "Expense", category: "Expense" },
        { value: "other expense", label: "Other Expense", category: "Expense" },
        { value: "depreciation", label: "Depreciation", category: "Expense" },
        {
            value: "cost of revenue",
            label: "Cost of Revenue",
            category: "Expense",
        },
        {
            value: "operating expenses",
            label: "Operating Expenses",
            category: "Expense",
        },

        {
            value: "off-balance sheet",
            label: "Off-balance Sheet",
            category: "Other",
        },
    ];

    const currencies = [
        { value: "PHP", label: "PHP" },
        { value: "USD", label: "USD" },
        { value: "EUR", label: "EUR" },
        { value: "GBP", label: "GBP" },
        { value: "JPY", label: "JPY" },
    ];
    //#endregion

    //#region State
    const [newChartOfAccounts, setNewChartOfAccounts] = useState([]);

    const [chartOfAccountsData, setChartOfAccountsData] = useState([
        ...chartOfAccounts.data,
    ]);

    const [chartOfAccount, setChartOfAccount] = useState({
        name: "",
        code: "",
        type: chartOfAccountTypes[0].value,
        allow_reconcile: false,
        is_active: true,
        currency: "PHP",
    });

    const [updatedAccount, setUpdatedAccount] = useState(null);

    const [selectedAccounts, setSelectedAccounts] = useState([]);

    //#endregion

    //#region Functions
    const addChartOfAccount = () => {
        setNewChartOfAccounts([
            ...newChartOfAccounts,
            {
                ...chartOfAccount,
                id: newChartOfAccounts.length + 1,
            },
        ]);
    };

    const saveNewChartOfAccounts = () => {
        Promise.all(
            newChartOfAccounts.map((newChartOfAccount) => {
                axios.post("/accounting/chart-of-accounts", {
                    ...newChartOfAccount,
                    allow_reconcile: newChartOfAccount.allow_reconcile ? 1 : 0,
                    is_active: newChartOfAccount.is_active ? 1 : 0,
                });
            })
        )
            .then((response) => {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Chart of Accounts saved successfully",
                });
                router.visit("/accounting/chart-of-accounts");
                setNewChartOfAccounts([]);
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Chart of Accounts failed to save",
                });
                console.error(error);
            });
    };

    const cancelNewChartOfAccounts = () => {
        setNewChartOfAccounts([]);
    };

    const debouncedSave = useCallback(
        debounce(async (updatedAccount) => {
            try {
                await axios.put(
                    `/accounting/chart-of-accounts/${updatedAccount.id}`,
                    updatedAccount
                );

                console.log(
                    `Successfully saved account ID: ${updatedAccount.id}`
                );
            } catch (error) {
                console.error("Failed to auto-save:", error);
                Swal.fire({
                    icon: "error",
                    title: "Save Failed",
                    text: `Could not save changes for ${updatedAccount.name}. error: ${error?.response?.data?.message}`,
                });
            }
        }, 1500),
        []
    );

    useEffect(() => {
        if (updatedAccount) {
            debouncedSave(updatedAccount);
        }
    }, [updatedAccount]);

    const handleEditChartOfAccount = (id, field, value) => {
        setChartOfAccountsData((prev) =>
            prev.map((chartOfAccount) => {
                if (chartOfAccount.id === id) {
                    setUpdatedAccount({ ...chartOfAccount, [field]: value });
                    return { ...chartOfAccount, [field]: value };
                }
                return chartOfAccount;
            })
        );
    };

    //#endregion

    return (
        <AccountingBaseLayout>
            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-2 bg-gray-50">
                        <div className="flex justify-between items-center px-5 py-2 mb-6 bg-white rounded-lg shadow-sm">
                            <h1 className="flex gap-5 items-center text-2xl font-bold text-gray-800">
                                <span> Chart of Accounts </span>
                                {newChartOfAccounts.length > 0 && (
                                    <>
                                        <div className="flex gap-2">
                                            <span>
                                                <button
                                                    onClick={
                                                        saveNewChartOfAccounts
                                                    }
                                                    className="p-2 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                                >
                                                    <CheckIcon className="w-3 h-3" />
                                                </button>
                                            </span>
                                            <span>
                                                <button
                                                    onClick={
                                                        cancelNewChartOfAccounts
                                                    }
                                                    className="p-2 text-xs text-white bg-red-600 rounded-md hover:bg-red-700"
                                                >
                                                    <XMarkIcon className="w-3 h-3" />
                                                </button>
                                            </span>
                                        </div>
                                    </>
                                )}
                            </h1>


                            <Button
                                onClick={addChartOfAccount}
                                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Add Chart of Account
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto p-2 bg-white rounded-lg shadow-sm">
                        <table className="min-w-full divide-y-2 divide-gray-200">
                            <thead>
                                <tr>
                                    {/* <th className="px-4 py-2 text-sm font-medium text-left text-gray-900">

                                    </th> */}
                                    <th className="px-4 py-2 text-sm font-medium text-left text-gray-900">
                                        Name
                                    </th>
                                    <th className="px-4 py-2 text-sm font-medium text-left text-gray-900">
                                        Code
                                    </th>
                                    <th className="px-4 py-2 text-sm font-medium text-left text-gray-900">
                                        Type
                                    </th>
                                    <th className="px-4 py-2 text-sm font-medium text-left text-gray-900">
                                        Allow Reconcile
                                    </th>
                                    <th className="px-4 py-2 text-sm font-medium text-left text-gray-900">
                                        Currency
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {chartOfAccounts.data.length > 0 ||
                                chartOfAccounts.data.length === 0 ? (
                                    <>
                                        {newChartOfAccounts.length > 0
                                            ? newChartOfAccounts.map(
                                                  (chartOfAccount) => (
                                                      <tr
                                                          key={
                                                              chartOfAccount.id
                                                          }
                                                      >
                                                          <td className="px-4 py-2 text-sm text-gray-900">
                                                              <input
                                                                  className="w-full border-none focus:ring-0 focus:border-b-2 focus:border-b-blue-500"
                                                                  type="text"
                                                                  value={
                                                                      chartOfAccount.name
                                                                  }
                                                                  onChange={(
                                                                      e
                                                                  ) => {
                                                                      setNewChartOfAccounts(
                                                                          newChartOfAccounts.map(
                                                                              (
                                                                                  prevData
                                                                              ) =>
                                                                                  prevData.id ===
                                                                                  chartOfAccount.id
                                                                                      ? {
                                                                                            ...prevData,
                                                                                            name: e
                                                                                                .target
                                                                                                .value,
                                                                                        }
                                                                                      : prevData
                                                                          )
                                                                      );
                                                                  }}
                                                              />
                                                          </td>
                                                          <td className="px-4 py-2 text-sm text-gray-900">
                                                              <input
                                                                  type="text"
                                                                  className="w-full border-none focus:ring-0 focus:border-b-2 focus:border-b-blue-500"
                                                                  value={
                                                                      chartOfAccount.code
                                                                  }
                                                                  onChange={(
                                                                      e
                                                                  ) => {
                                                                      setNewChartOfAccounts(
                                                                          newChartOfAccounts.map(
                                                                              (
                                                                                  prevData
                                                                              ) =>
                                                                                  prevData.id ===
                                                                                  chartOfAccount.id
                                                                                      ? {
                                                                                            ...prevData,
                                                                                            code: e
                                                                                                .target
                                                                                                .value,
                                                                                        }
                                                                                      : prevData
                                                                          )
                                                                      );
                                                                  }}
                                                              />
                                                          </td>
                                                          <td className="px-4 py-2 text-sm text-gray-900">
                                                              <select
                                                                  className="border-none focus:ring-0 focus:border-b-2 focus:border-b-blue-500"
                                                                  value={
                                                                      chartOfAccount.type ||
                                                                      chartOfAccountTypes[0]
                                                                          .value
                                                                  }
                                                                  onChange={(
                                                                      e
                                                                  ) => {
                                                                      setNewChartOfAccounts(
                                                                          newChartOfAccounts.map(
                                                                              (
                                                                                  prevData
                                                                              ) =>
                                                                                  prevData.id ===
                                                                                  chartOfAccount.id
                                                                                      ? {
                                                                                            ...prevData,
                                                                                            type: e
                                                                                                .target
                                                                                                .value,
                                                                                        }
                                                                                      : prevData
                                                                          )
                                                                      );
                                                                  }}
                                                              >
                                                                  {chartOfAccountTypes.map(
                                                                      (
                                                                          chartOfAccountType
                                                                      ) => (
                                                                          <option
                                                                              key={
                                                                                  chartOfAccountType.value
                                                                              }
                                                                              value={
                                                                                  chartOfAccountType.value
                                                                              }
                                                                          >
                                                                              {
                                                                                  chartOfAccountType.label
                                                                              }
                                                                          </option>
                                                                      )
                                                                  )}
                                                                  onChange=
                                                                  {(e) => {}}
                                                              </select>
                                                          </td>
                                                          <td className="px-4 py-2 text-sm text-gray-900">
                                                              <input
                                                                  type="checkbox"
                                                                  className="rounded-lg border-blue-500"
                                                                  onChange={(
                                                                      e
                                                                  ) => {
                                                                      setNewChartOfAccounts(
                                                                          newChartOfAccounts.map(
                                                                              (
                                                                                  prevData
                                                                              ) =>
                                                                                  prevData.id ===
                                                                                  chartOfAccount.id
                                                                                      ? {
                                                                                            ...prevData,
                                                                                            allow_reconcile:
                                                                                                e
                                                                                                    .target
                                                                                                    .checked,
                                                                                        }
                                                                                      : prevData
                                                                          )
                                                                      );
                                                                  }}
                                                              />
                                                          </td>
                                                          <td className="px-4 py-2 text-sm text-gray-900">
                                                              <select
                                                                  className="border-none focus:ring-0 focus:border-b-2 focus:border-b-blue-500"
                                                                  value={
                                                                      chartOfAccount.currency
                                                                  }
                                                                  onChange={(
                                                                      e
                                                                  ) => {
                                                                      setNewChartOfAccounts(
                                                                          newChartOfAccounts.map(
                                                                              (
                                                                                  prevData
                                                                              ) =>
                                                                                  prevData.id ===
                                                                                  chartOfAccount.id
                                                                                      ? {
                                                                                            ...prevData,
                                                                                            currency:
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                        }
                                                                                      : prevData
                                                                          )
                                                                      );
                                                                  }}
                                                              >
                                                                  {currencies.map(
                                                                      (
                                                                          currency
                                                                      ) => (
                                                                          <option
                                                                              key={
                                                                                  currency.value
                                                                              }
                                                                              value={
                                                                                  currency.value
                                                                              }
                                                                          >
                                                                              {
                                                                                  currency.label
                                                                              }
                                                                          </option>
                                                                      )
                                                                  )}
                                                              </select>
                                                          </td>
                                                      </tr>
                                                  )
                                              )
                                            : null}

                                        {chartOfAccountsData.map((account) => (
                                            <tr key={account.id}>
                                                {/* <td className="px-4 py-2 text-sm text-gray-900">
                                                   <input type="checkbox" name="" id="" className="border-blue-500 border-1" />
                                                </td> */}
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                    <input
                                                        className="border-none focus:outline-none"
                                                        type="text"
                                                        value={account.name}
                                                        onChange={(e) => {
                                                            handleEditChartOfAccount(
                                                                account.id,
                                                                "name",
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                    <input
                                                        className="border-none focus:outline-none"
                                                        type="text"
                                                        value={account.code}
                                                        onChange={(e) => {
                                                            handleEditChartOfAccount(
                                                                account.id,
                                                                "code",
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                    <select
                                                        className="border-none focus:outline-none"
                                                        value={account.type}
                                                        onChange={(e) => {
                                                            handleEditChartOfAccount(
                                                                account.id,
                                                                "type",
                                                                e.target.value
                                                            );
                                                        }}
                                                    >
                                                        {chartOfAccountTypes.map(
                                                            (
                                                                chartOfAccountType
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        chartOfAccountType.value
                                                                    }
                                                                    value={
                                                                        chartOfAccountType.value
                                                                    }
                                                                >
                                                                    {
                                                                        chartOfAccountType.label
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                    <input
                                                        className="rounded-lg border-blue-500 border-1"
                                                        type="checkbox"
                                                        checked={
                                                            account.allow_reconcile
                                                        }
                                                        onChange={(e) => {
                                                            handleEditChartOfAccount(
                                                                account.id,
                                                                "allow_reconcile",
                                                                e.target.checked
                                                            );
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                    <select
                                                        className="border-none focus:outline-none"
                                                        value={account.currency}
                                                        onChange={(e) => {
                                                            handleEditChartOfAccount(
                                                                account.id,
                                                                "currency",
                                                                e.target.value
                                                            );
                                                        }}
                                                    >
                                                        {currencies.map(
                                                            (currency) => (
                                                                <option
                                                                    key={
                                                                        currency.value
                                                                    }
                                                                    value={
                                                                        currency.value
                                                                    }
                                                                >
                                                                    {
                                                                        currency.label
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ) : null}

                                {chartOfAccounts.data.length === 0 &&
                                newChartOfAccounts.length === 0 ? (
                                    <tr>
                                        <td
                                            className="px-4 py-2 text-sm text-gray-900"
                                            colSpan={5}
                                        >
                                            No chart of accounts found.
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>

                    <div className="py-4">
                        <Pagination links={chartOfAccounts.links} />
                    </div>
                </div>
            </div>
        </AccountingBaseLayout>
    );
}
