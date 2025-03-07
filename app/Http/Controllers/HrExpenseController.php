<?php

namespace App\Http\Controllers;

use App\Models\HrExpense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HrExpenseController extends Controller
{
    /**
     * Display a listing of the HR expense requests.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Admin can see all requests, HR users can see their own
        $hrExpenses = $user->role === 'admin' 
            ? HrExpense::with('user')->latest()->paginate(10)
            : HrExpense::where('user_id', $user->id)->latest()->paginate(10);
        
        return Inertia::render('HrExpenses/Index', [
            'hrExpenses' => $hrExpenses
        ]);
    }

    /**
     * Store a newly created HR expense request in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date_of_request' => 'required|date',
            'expenses_category' => 'required|string|max:255',
            'description_of_expenses' => 'required|string',
            'breakdown_of_expense' => 'required|string',
            'total_amount_requested' => 'required|numeric|min:0',
            'expected_payment_date' => 'required|date',
            'additional_comment' => 'nullable|string',
        ]);

        try {
            $user = Auth::user();
            
            $hrExpense = new HrExpense($validated);
            $hrExpense->user_id = $user->id;
            $hrExpense->requestor_name = $user->name;
            $hrExpense->status = 'pending';
            $hrExpense->save();

            return redirect()->back()->with('success', 'HR expense request submitted successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to submit HR expense request: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified HR expense request.
     */
    public function show(HrExpense $hrExpense)
    {
        $this->authorize('view', $hrExpense);
        
        return Inertia::render('HrExpenses/Show', [
            'hrExpense' => $hrExpense->load('user')
        ]);
    }

    /**
     * Update the specified HR expense request status.
     */
    public function updateStatus(Request $request, HrExpense $hrExpense)
    {
        $this->authorize('update', $hrExpense);
        
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|nullable|string',
        ]);

        $hrExpense->update($validated);

        return redirect()->back()->with('success', 'HR expense request status updated successfully.');
    }

    /**
     * Remove the specified HR expense request from storage.
     */
    public function destroy(HrExpense $hrExpense)
    {
        $this->authorize('delete', $hrExpense);
        
        $hrExpense->delete();

        return redirect()->route('hr-expenses.index')->with('success', 'HR expense request deleted successfully.');
    }
}
