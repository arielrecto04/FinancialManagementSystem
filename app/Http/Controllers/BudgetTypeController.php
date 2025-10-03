<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\HrExpense;
use App\Models\BudgetType;
use App\Models\Liquidation;
use Illuminate\Http\Request;
use App\Models\SupplyRequest;
use App\Models\OperatingExpense;
use App\Models\PettyCashRequest;
use App\Models\ReimbursementRequest;

class BudgetTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $budgetTypes = BudgetType::with('BudgetTypeExpenses')->paginate(10);

        $expenseModels = $this->getExpenseModel();
        return Inertia::render('Budget/BudgetTypeIndex', compact('budgetTypes', 'expenseModels'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Store a newly created expense in storage.
     */
    public function storeExpense(Request $request, BudgetType $budgetType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'expense_model' => 'nullable|string|max:255',
            'is_expense' => 'required|boolean',
        ]);

        $budgetType->budgetTypeExpenses()->create($validated);

        return redirect()->back()->with('success', 'Expense item added successfully');
    }


    private function getExpenseModel()
    {
        $options = [
            [
                'expense_model' => get_class(new ReimbursementRequest()),
                'name' => 'Reimbursement',
            ],
            [
                'expense_model' => get_class(new PettyCashRequest()),
                'name' => 'Petty Cash',
            ],
            [
                'expense_model' => get_class(new Liquidation()),
                'name' => 'Liquidation',
            ],
            [
                'expense_model' => get_class(new HrExpense()),
                'name' => 'HR Expense',
            ],
            [
                'expense_model' => get_class(new  SupplyRequest()),
                'name' => 'Supply Request',
            ],
            [
                'expense_model' => get_class(new  OperatingExpense()),
                'name' => 'Operating Expense',
            ]
        ];

        return $options;
    }
}
