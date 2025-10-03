<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\AuditLog;
use App\Models\HrExpense;
use App\Models\Attachment;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Services\EmailService;
use Illuminate\Support\Facades\Auth;
use App\Actions\GenerateRequestNumber;

class HrExpenseController extends Controller
{
    /**
     * Display a listing of the HR expense requests.
     */

    public function __construct(public GenerateRequestNumber $generateRequestNumber) {}
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
            $hrExpense->request_number = $this->generateRequestNumber->handle('hr_expense', new HrExpense());
            $hrExpense->status = 'pending';
            $hrExpense->save();

            // Log the HR expense request creation


            $notifyUsers = User::where('role', 'admin')->orWhere('role', 'superadmin')->get();



            if ($request->hasFile('receipt')) {

                $path = $request->file('receipt')->storeAs('receipts', $request->file('receipt')->getClientOriginalName(), 'public');
                Attachment::create([
                    'file_name' => $request->file('receipt')->getClientOriginalName(),
                    'file_path' => asset('storage/' . $path),
                    'file_type' => $request->file('receipt')->getClientOriginalExtension(),
                    'file_size' => $request->file('receipt')->getSize(),
                    'file_extension' => $request->file('receipt')->getClientOriginalExtension(),
                    'attachable_id' => $hrExpense->id,
                    'attachable_type' => get_class($hrExpense),
                ]);
            }

            foreach ($notifyUsers as $user) {
                Notification::create([
                    'user_id' => auth()->id(),
                    'notify_to' => $user->id,
                    'type' => 'new_hr_expense_request',
                    'title' => 'New HR Expense Request',
                    'message' => 'A new HR expense request has been submitted',
                    'url' => route('reports.index')
                ]);
            }


            AuditLog::create([
                'user_id' => auth()->id(),
                'user_name' => auth()->user()->name,
                'user_role' => auth()->user()->role,
                'type' => 'create',
                'action' => 'HR Expense Request Created',
                'description' => 'Created new HR expense request for ' . $validated['expenses_category'],
                'amount' => $validated['total_amount_requested'],
                'ip_address' => $request->ip()
            ]);

            // Send email notification to admin and superadmin users
            EmailService::sendNewRequestEmail(
                [
                    'date_of_request' => $validated['date_of_request'],
                    'expenses_category' => $validated['expenses_category'],
                    'description_of_expenses' => $validated['description_of_expenses'],
                    'total_amount_requested' => $validated['total_amount_requested'],
                    'expected_payment_date' => $validated['expected_payment_date'],
                    'additional_comment' => $validated['additional_comment'] ?? '',
                ],
                'HR Expenses',
                $user->name,
                $hrExpense->request_number
            );

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

        // Log the status change
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => $validated['status'] === 'approved' ? 'approve' : 'reject',
            'action' => 'HR Expense Request ' . ucfirst($validated['status']),
            'description' => 'HR expense request ' . $validated['status'] . ' by ' . auth()->user()->name,
            'amount' => $hrExpense->total_amount_requested,
            'ip_address' => $request->ip()
        ]);

        return redirect()->back()->with('success', 'HR expense request status updated successfully.');
    }

    /**
     * Remove the specified HR expense request from storage.
     */
    public function destroy(HrExpense $hrExpense)
    {
        $this->authorize('delete', $hrExpense);

        // Store info for audit log
        $amount = $hrExpense->total_amount_requested;
        $category = $hrExpense->expenses_category;

        $hrExpense->delete();

        // Log the deletion
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => 'delete',
            'action' => 'HR Expense Request Deleted',
            'description' => 'Deleted HR expense request for ' . $category,
            'amount' => $amount,
            'ip_address' => request()->ip()
        ]);

        return redirect()->route('hr-expenses.index')->with('success', 'HR expense request deleted successfully.');
    }

    /**
     * Update the items of an HR expense request.
     */
    public function updateItems(Request $request, $requestNumber)
    {
        // Find the HR expense request by request_number
        $hrExpense = HrExpense::where('request_number', $requestNumber)->firstOrFail();

        // Allow updates if:
        // 1. User is a superadmin
        // 2. User owns the request and it's pending
        // 3. User is an admin
        $user = auth()->user();
        $canEdit =
            $user->role === 'superadmin' ||
            $user->role === 'admin' ||
            ($user->id === $hrExpense->user_id && $hrExpense->status === 'pending');

        if (!$canEdit) {
            return response()->json([
                'message' => 'You are not authorized to edit this request'
            ], 403);
        }

        // Get breakdown from either breakdown or breakdown_of_expense field
        $breakdown = $request->input('breakdown') ?? $request->input('breakdown_of_expense');
        if (!$breakdown) {
            return response()->json([
                'message' => 'The breakdown field is required',
                'errors' => ['breakdown_of_expense' => ['The breakdown field is required']]
            ], 422);
        }

        $validated = [
            'breakdown_of_expense' => $breakdown,
            'total_amount_requested' => $request->input('total_amount_requested')
        ];

        // Validate the total amount
        if (!is_numeric($validated['total_amount_requested']) || $validated['total_amount_requested'] < 0) {
            return response()->json([
                'message' => 'The total amount must be a positive number',
                'errors' => ['total_amount_requested' => ['The total amount must be a positive number']]
            ], 422);
        }

        $hrExpense->update($validated);

        // Log the update
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => 'update',
            'action' => 'HR Expense Request Updated',
            'description' => 'Updated breakdown of expense in HR expense request for ' . $hrExpense->expenses_category,
            'amount' => $validated['total_amount_requested'],
            'ip_address' => $request->ip()
        ]);

        return response()->json([
            'message' => 'Breakdown updated successfully',
            'request' => $hrExpense->load('user')
        ]);
    }
}
