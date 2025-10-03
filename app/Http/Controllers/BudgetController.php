<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Budget;
use App\Models\HRExpense;
use App\Models\BudgetType;
use App\Models\Liquidation;
use Illuminate\Http\Request;
use App\Models\SupplyRequest;
use App\Models\OperatingExpense;
use App\Models\PettyCashRequest;
use App\Models\BudgetTypeExpense;
use App\Models\ReimbursementRequest;

class BudgetController extends Controller
{
    public function index()
    {
        $budgetTypes = BudgetType::with(['budgets'])->get();



        return Inertia::render('Budget/BudgetIndex', compact('budgetTypes'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'amount' => 'required',
            'budget_type_id' => 'required',
            'type' => 'required',
        ]);

        $budget = Budget::create($request->all());

        return response()->json([
            'budget' => $budget,
        ]);
    }

    public function assignExpenseType(Request $request)
    {


        $request->validate([
            'budget_type_id' => 'required',
            'expense_model' => 'required',
            'name' => 'required',
            'is_expense' => 'nullable',
        ]);

        $budgetTypeExpense = BudgetTypeExpense::create($request->all());

        return response()->json([
            'budgetTypeExpense' => $budgetTypeExpense,
        ]);
    }
}
