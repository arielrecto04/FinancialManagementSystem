<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\AuditLog;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Services\EmailService;
use App\Models\OperatingExpense;
use Illuminate\Support\Facades\Auth;
use App\Actions\GenerateRequestNumber;

class OperatingExpenseController extends Controller
{

    public function __construct(public GenerateRequestNumber $generateRequestNumber)
    {
    }
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

            // Generate request number
            // $latestRequest = OperatingExpense::latest()->first();
            // $latestNumber = $latestRequest ? intval(substr($latestRequest->request_number, 3)) : 0;
            // $newNumber = str_pad($latestNumber + 1, 8, '0', STR_PAD_LEFT);
            // $requestNumber = 'OP-' . $newNumber;

            $operatingExpense = new OperatingExpense($validated);
            $operatingExpense->requestor_name = auth()->user()->name;
            $operatingExpense->user_id = auth()->id();
            $operatingExpense->status = 'pending';
            $operatingExpense->request_number = $this->generateRequestNumber->handle('operating_expense', new OperatingExpense());
            $operatingExpense->save();



            $notifyUsers = User::where('role', 'admin')->orWhere('role', 'superadmin')->get();

            foreach ($notifyUsers as $user) {
                Notification::create([
                    'user_id' => auth()->id(),
                    'notify_to' => $user->id,
                    'type' => 'new_operating_expense_request',
                    'title' => 'New Operating Expense Request',
                    'message' => 'A new operating expense request has been submitted',
                    'url' => route('reports.index')
                ]);
            }

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

            // Send email notification to admin and superadmin users
            EmailService::sendNewRequestEmail(
                [
                    'date_of_request' => $validated['date_of_request'],
                    'expense_category' => $validated['expense_category'],
                    'description' => $validated['description'],
                    'total_amount' => $validated['total_amount'],
                    'expected_payment_date' => $validated['expected_payment_date'],
                    'additional_comment' => $validated['additional_comment'] ?? '',
                ],
                'Operating Expenses',
                auth()->user()->name,
                $operatingExpense->request_number
            );

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

    /**
     * Update the items/breakdown of an operating expense request.
     */
    public function updateItems(Request $request, $requestNumber)
    {
        $operatingExpense = OperatingExpense::where('request_number', $requestNumber)->firstOrFail();

        $user = auth()->user();
        $canEdit =
            $user->role === 'superadmin' ||
            $user->role === 'admin' ||
            ($user->id === $operatingExpense->user_id && $operatingExpense->status === 'pending');

        if (!$canEdit) {
            return response()->json([
                'message' => 'You are not authorized to edit this request'
            ], 403);
        }

        $breakdown = $request->input('breakdown_of_expense');
        if (!$breakdown) {
            return response()->json([
                'message' => 'The breakdown field is required',
                'errors' => ['breakdown_of_expense' => ['The breakdown field is required']]
            ], 422);
        }

        $validated = [
            'breakdown_of_expense' => $breakdown,
            'total_amount' => $request->input('total_amount')
        ];

        if (!is_numeric($validated['total_amount']) || $validated['total_amount'] < 0) {
            return response()->json([
                'message' => 'The total amount must be a positive number',
                'errors' => ['total_amount' => ['The total amount must be a positive number']]
            ], 422);
        }

        $operatingExpense->update($validated);

        return response()->json(['message' => 'Items updated successfully']);
    }
}
