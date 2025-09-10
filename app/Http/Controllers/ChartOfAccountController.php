<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\ChartOfAccount;
use Laravel\Pail\ValueObjects\Origin\Console;

class ChartOfAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $chartOfAccounts = ChartOfAccount::latest()->paginate(100);

        return Inertia::render('Accounting/ChartOfAccounts/Index', [
            'chartOfAccounts' => $chartOfAccounts,
        ]);
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
            'name' => 'required',
            'code' => 'required|unique:chart_of_accounts,code',
            'type' => 'required',
            'allow_reconcile' => 'required|boolean',
            'is_active' => 'required|boolean',
            'currency' => 'required',
        ]);

        $chartOfAccount = ChartOfAccount::create($request->all());

        return response()->json([
            'message' => 'Chart of Account created successfully',
            'chartOfAccount' => $chartOfAccount,
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
        $request->validate([
            'name' => 'required',
            'code' => 'required|unique:chart_of_accounts,code,' . $id,
            'type' => 'required',
            'allow_reconcile' => 'required|boolean',
            'is_active' => 'required|boolean',
            'currency' => 'required',
        ]);

        $chartOfAccount = ChartOfAccount::findOrFail($id);
        $chartOfAccount->update($request->all());

        return response()->json([
            'message' => 'Chart of Account updated successfully',
            'chartOfAccount' => $chartOfAccount,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
