<?php

namespace App\Http\Controllers;

use App\Models\OperatingExpense;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OperatingExpenseController extends Controller
{
    /**
     * Display a listing of the operating expense requests.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Admin can see all requests, others can see their own
        $operatingExpenses = $user->role === 'admin' 
            ? OperatingExpense::with('user')->latest()->paginate(10)
            : OperatingExpense::where('user_id', $user->id)->latest()->paginate(10);
        
        return Inertia::render('OperatingExpenses/Index', [
            'operatingExpenses' => $operatingExpenses
        ]);
    }

    /**
     * Store a newly created operating expense request in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'date_of_request' => 'required|date',
                'expense_category' => 'required|string|max:255',
                'description' => 'required|string',
                'breakdown_of_expense' => 'required|string',
                'total_amount' => 'required|numeric|min:0',
                'expected_payment_date' => 'required|date',
                'additional_comment' => 'nullable|string',
            ]);

            $operatingExpense = new OperatingExpense($validated);
            $operatingExpense->requestor_name = auth()->user()->name;
            $operatingExpense->user_id = auth()->id();
            $operatingExpense->status = 'pending';
            $operatingExpense->save();

            // Log the operating expense request creation
            AuditLog::create([
                'user_id' => auth()->id(),
                'user_name' => auth()->user()->name,
                'user_role' => auth()->user()->role,
                'type' => 'create',
                'action' => 'Operating Expense Request Created',
                'description' => 'Created new operating expense request for ' . $validated['expense_category'],
                'amount' => $validated['total_amount'],
                'ip_address' => $request->ip()
            ]);

            return redirect()->back()->with('success', 'Operating expense request submitted successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to submit operating expense request: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified operating expense request.
     */
    public function show(OperatingExpense $operatingExpense)
    {
        $this->authorize('view', $operatingExpense);
        
        return Inertia::render('OperatingExpenses/Show', [
            'operatingExpense' => $operatingExpense->load('user')
        ]);
    }

    /**
     * Update the specified operating expense request status.
     */
    public function updateStatus(Request $request, OperatingExpense $operatingExpense)
    {
        $this->authorize('update', $operatingExpense);
        
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|nullable|string',
        ]);

        $operatingExpense->update($validated);

        // Log the status change
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => $validated['status'] === 'approved' ? 'approve' : 'reject',
            'action' => 'Operating Expense Request ' . ucfirst($validated['status']),
            'description' => 'Operating expense request ' . $validated['status'] . ' by ' . auth()->user()->name,
            'amount' => $operatingExpense->total_amount,
            'ip_address' => $request->ip()
        ]);

        return redirect()->back()->with('success', 'Operating expense request status updated successfully.');
    }

    /**
     * Remove the specified operating expense request from storage.
     */
    public function destroy(OperatingExpense $operatingExpense)
    {
        $this->authorize('delete', $operatingExpense);
        
        // Store info for audit log
        $amount = $operatingExpense->total_amount;
        $category = $operatingExpense->expense_category;
        
        $operatingExpense->delete();

        // Log the deletion
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => 'delete',
            'action' => 'Operating Expense Request Deleted',
            'description' => 'Deleted operating expense request for ' . $category,
            'amount' => $amount,
            'ip_address' => request()->ip()
        ]);

        return redirect()->route('operating-expenses.index')->with('success', 'Operating expense request deleted successfully.');
    }
}
