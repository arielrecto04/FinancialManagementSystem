<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BudgetTypeExpense;

class BudgetTypeExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $request->validate([
            'budget_type_id' => 'required',
            'expense_model' => 'required',
            'name' => 'required',
            'is_expense' => 'nullable',
        ]);


        $budgetTypeExpense = BudgetTypeExpense::create($request->all());


        return response()->json([
            'budgetTypeExpense' => $budgetTypeExpense,
            'message' => 'Expense type assigned successfully.',
        ]);
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
}
