<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\AuditLog;
use App\Models\AdminBudget;
use Illuminate\Support\Str;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Models\PettyCashRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Actions\GenerateRequestNumber;
use App\Notifications\NewRequestNotification;

class PettyCashRequestController extends Controller
{

    public function __construct(public GenerateRequestNumber $generateRequestNumber){}

    public function index()
    {
        $requests = PettyCashRequest::with(['user', 'approver', 'attachments'])
            ->when(!Auth::user()->hasRole('admin'), function ($query) {
                return $query->where('user_id', Auth::id());
            })
            ->latest()
            ->paginate(10);




        return Inertia::render('PettyCashRequests/Index', [
            'requests' => $requests
        ]);
    }

    public function store(Request $request)
    {





        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'purpose' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_requested' => 'required|date',
            'date_needed' => 'required|date',
            'department' => 'required|string',
            'category' => 'required|string',
            'receipt' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $pettyCashRequest = new PettyCashRequest([
            'user_id' => Auth::id(),
            'date_requested' => $validated['date_requested'],
            'date_needed' => $validated['date_needed'],
            'amount' => $validated['amount'],
            'purpose' => $validated['purpose'],
            'description' => $validated['description'] ?? null,
            'department' => $validated['department'],
            'category' => $validated['category'],
            'status' => 'pending',
        ]);


        $pettyCashRequest->request_number = $this->generateRequestNumber->handle('petty_cash_request', $pettyCashRequest);

        if ($request->hasFile('receipt')) {
            $path = $request->file('receipt')->store('receipts', 'public');
            $pettyCashRequest->receipt_path = $path;
        }

        $pettyCashRequest->save();

        $superAdmin = User::where('role', 'superadmin')->first();


        if ($superAdmin) {
            $superAdmin->notify(new NewRequestNotification(
               [
                "department" => $validated['department'],
                "purpose" => $validated['purpose'],
                "description" => $validated['description'] ?? null,
                "date_requested" => $validated['date_requested'],
                "date_needed" => $validated['date_needed'],
                "amount" => $validated['amount'],
                "category" => $validated['category'],
               ],
               'Petty Cash',
               Auth::user()->name,
               $pettyCashRequest->request_number
            ));


            Notification::create([
                'user_id' => auth()->id(),
                'notify_to' => $superAdmin->id,
                'type' => 'new_petty_cash_request',
                'title' => 'New Petty Cash Request',
                'message' => 'A new petty cash request has been submitted',
                'url' => route('petty-cash-requests.approvals')
            ]);
        }


        // Log the petty cash request creation
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => 'create',
            'action' => 'Petty Cash Request Created',
            'description' => 'Created new petty cash request for ' . $validated['purpose'],
            'amount' => $validated['amount'],
            'ip_address' => $request->ip()
        ]);

        return redirect()->back()->with('success', 'Petty cash request submitted successfully.');
    }

    public function show(PettyCashRequest $pettyCashRequest)
    {
        $this->authorize('view', $pettyCashRequest);

        return Inertia::render('PettyCashRequests/Show', [
            'request' => $pettyCashRequest->load(['user', 'approver'])
        ]);
    }

    public function update(Request $request, PettyCashRequest $pettyCashRequest)
    {
        $this->authorize('update', $pettyCashRequest);

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|nullable|string',
        ]);

        $pettyCashRequest->update([
            'status' => $validated['status'],
            'rejection_reason' => $validated['rejection_reason'] ?? null,
            'approved_by' => $validated['status'] === 'approved' ? Auth::id() : null,
            'approved_at' => $validated['status'] === 'approved' ? now() : null,
        ]);

        // Log the status change
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => $validated['status'] === 'approved' ? 'approve' : 'reject',
            'action' => 'Petty Cash Request ' . ucfirst($validated['status']),
            'description' => 'Petty cash request ' . $validated['status'] . ' by ' . auth()->user()->name,
            'amount' => $pettyCashRequest->amount,
            'ip_address' => $request->ip()
        ]);

        return redirect()->back()->with('success', 'Petty cash request updated successfully.');
    }

    public function destroy(PettyCashRequest $pettyCashRequest)
    {
        $this->authorize('delete', $pettyCashRequest);

        // Store info for audit log
        $amount = $pettyCashRequest->amount;
        $purpose = $pettyCashRequest->purpose;

        $pettyCashRequest->delete();

        // Log the deletion
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => 'delete',
            'action' => 'Petty Cash Request Deleted',
            'description' => 'Deleted petty cash request for ' . $purpose,
            'amount' => $amount,
            'ip_address' => request()->ip()
        ]);

        return redirect()->back()->with('success', 'Petty cash request deleted successfully.');
    }

    public function updateStatus(Request $request, $id)
    {
        if (!auth()->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $pettyCashRequest = PettyCashRequest::with('user')->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'remarks' => 'required|string',
            'amount' => 'sometimes|numeric'  // Get the amount from the request
        ]);


        try {
            DB::beginTransaction();

            // Update the petty cash request status
            $pettyCashRequest->update([
                'status' => $validated['status'],
                'remarks' => $validated['remarks']
            ]);

            // If request is approved, replenish the user's budget
            if ($validated['status'] === 'approved') {
                // Get the user's current budget
                $userBudget = AdminBudget::where('user_id', $pettyCashRequest->user_id)->latest()->first();



                if ($userBudget) {
                    // Calculate new budget values
                    $amount = $request->has('amount') ? $request->amount : $pettyCashRequest->amount;
                    $newTotalBudget = $userBudget->total_budget + $amount;
                    $newRemainingBudget = $userBudget->remaining_budget + $amount;

                    // Update the budget
                    $userBudget->update([
                        'total_budget' => $newTotalBudget,
                        'remaining_budget' => $newRemainingBudget,
                        'replenishment_amount' => $amount
                    ]);
                }


                if (!$userBudget) {
                    AdminBudget::create([
                        'user_id' => $pettyCashRequest->user_id,
                        'total_budget' => $pettyCashRequest->amount,
                    ]);
                }
            }

            // Create audit log entry with financial information
            AuditLog::create([
                'user_id' => auth()->id(),
                'user_name' => auth()->user()->name,
                'user_role' => auth()->user()->role,
                'type' => 'budget_' . ($validated['status'] === 'approved' ? 'approve' : 'reject'),
                'action' => 'PettyCashRequest ' . ($validated['status'] === 'approved' ? 'approve' : 'reject'),
                'description' => ucfirst($validated['status']) . ' petty cash request #' . $pettyCashRequest->request_number .
                    ($validated['status'] === 'approved' ? ' and replenished budget' : ''),
                'amount' => $request->has('amount') ? $request->amount : $pettyCashRequest->amount,
                'ip_address' => $request->ip()
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Status updated successfully',
                'request' => $pettyCashRequest->load('user')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'An error occurred while updating status: ' . $e->getMessage()
            ], 500);
        }
    }

    public function approvals(Request $request)
    {
        if (!auth()->user() || auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized action.');
        }

        $status = $request->get('status', 'all');
        $sortOrder = $request->get('sortOrder', 'newest');

        $query = PettyCashRequest::with(['user', 'attachments'])
            ->when($status !== 'all', function ($query) use ($status) {
                return $query->where('status', $status);
            });

        if ($sortOrder === 'newest') {
            $query->latest();
        } else {
            $query->oldest();
        }

        $requests = $query->paginate(10)
            ->withQueryString();

        return Inertia::render('PettyCashRequests/Approvals', [
            'requests' => $requests,
            'filters' => [
                'status' => $status,
                'sortOrder' => $sortOrder
            ]
        ]);
    }

    public function getPettyCashStatistics()
    {
        $total = PettyCashRequest::count();
        $pending = PettyCashRequest::where('status', 'pending')->count();
        $completed = PettyCashRequest::whereIn('status', ['approved', 'rejected'])->count();

        return [
            'pettyCashRequests' => $total,
            'pendingPettyCashRequests' => $pending,
            'completedPettyCashRequests' => $completed
        ];
    }

    public function analytics(Request $request)
    {
        // Ensure user has permission
        if (!auth()->user() || auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized action.');
        }

        // Initialize query with filters
        $query = PettyCashRequest::query();

        // Apply year and month filters
        if ($request->has('year') && $request->year) {
            $query->whereYear('created_at', $request->year);
        }

        if ($request->has('month') && $request->month) {
            $query->whereMonth('created_at', $request->month);
        }

        // Apply category filter if provided
        if ($request->has('category') && $request->category && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Get total requests count
        $totalRequests = $query->count();

        // Get status counts with the same filters
        $statusCounts = [
            'approved' => (clone $query)->where('status', 'approved')->count(),
            'rejected' => (clone $query)->where('status', 'rejected')->count(),
            'pending' => (clone $query)->where('status', 'pending')->count(),
        ];

        // Calculate total approved amount
        $approvedAmount = (clone $query)->where('status', 'approved')->sum('amount');

        // Get current month count - if we're not already filtering by month
        $currentMonth = now()->format('Y-m');
        $currentMonthQuery = clone $query;
        if (!$request->has('month') || !$request->month) {
            $currentMonthQuery = $currentMonthQuery->whereRaw("DATE_FORMAT(created_at, '%Y-%m') = ?", [$currentMonth]);
        }
        $currentMonthCount = $currentMonthQuery->count();

        // Get monthly trend (for selected year or last 6 months if year not specified)
        $monthlyTrend = [];

        if ($request->has('year') && $request->year) {
            // If year is specified, show all months of that year
            for ($i = 1; $i <= 12; $i++) {
                $monthQuery = clone $query;
                $monthQuery->whereYear('created_at', $request->year)
                          ->whereMonth('created_at', $i);

                $monthName = date('M', mktime(0, 0, 0, $i, 10));

                $monthlyTrend[] = [
                    'month' => $monthName . ' ' . $request->year,
                    'count' => $monthQuery->count(),
                    'amount' => $monthQuery->sum('amount')
                ];
            }
        } else {
            // Default to showing last 6 months
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $monthQuery = clone $query;
                $monthQuery->whereYear('created_at', $date->year)
                          ->whereMonth('created_at', $date->month);

                $monthlyTrend[] = [
                    'month' => $date->format('M Y'),
                    'count' => $monthQuery->count(),
                    'amount' => $monthQuery->sum('amount')
                ];
            }
        }

        // Get category stats with the same base filters
        $categoryQuery = clone $query;
        $categoryStats = $categoryQuery->select('category')
            ->selectRaw('COUNT(*) as count')
            ->selectRaw('SUM(amount) as totalAmount')
            ->groupBy('category')
            ->orderByDesc('totalAmount')
            ->get();

        // Average processing time (days between date_requested and updated_at for approved/rejected)
        $processingTimeQuery = clone $query;
        $avgProcessingTime = $processingTimeQuery->whereIn('status', ['approved', 'rejected'])
            ->whereNotNull('updated_at')
            ->selectRaw('AVG(DATEDIFF(updated_at, date_requested)) as avg_days')
            ->first()
            ->avg_days ?? 0;

        // Get processing time distribution for histogram
        $processingTimeDistribution = [
            'same_day' => 0, // 0 days
            '1_2_days' => 0, // 1-2 days
            '3_5_days' => 0, // 3-5 days
            '1_2_weeks' => 0, // 6-14 days
            'more_than_2_weeks' => 0 // 15+ days
        ];

        $processingTimeData = (clone $query)->whereIn('status', ['approved', 'rejected'])
            ->whereNotNull('updated_at')
            ->selectRaw('DATEDIFF(updated_at, date_requested) as days')
            ->get();

        foreach ($processingTimeData as $item) {
            $days = $item->days;

            if ($days == 0) {
                $processingTimeDistribution['same_day']++;
            } elseif ($days <= 2) {
                $processingTimeDistribution['1_2_days']++;
            } elseif ($days <= 5) {
                $processingTimeDistribution['3_5_days']++;
            } elseif ($days <= 14) {
                $processingTimeDistribution['1_2_weeks']++;
            } else {
                $processingTimeDistribution['more_than_2_weeks']++;
            }
        }

        // Get this week vs last week data
        $now = now();
        $thisWeekStart = $now->copy()->startOfWeek();
        $thisWeekEnd = $now->copy()->endOfWeek();
        $lastWeekStart = $now->copy()->subWeek()->startOfWeek();
        $lastWeekEnd = $now->copy()->subWeek()->endOfWeek();

        $weeklyComparison = [
            'thisWeek' => [],
            'lastWeek' => []
        ];

        // Get data for each day of the week
        for ($i = 0; $i < 7; $i++) {
            $thisWeekDay = $thisWeekStart->copy()->addDays($i);
            $lastWeekDay = $lastWeekStart->copy()->addDays($i);

            $weeklyComparison['thisWeek'][$i] = (clone $query)
                ->whereDate('created_at', $thisWeekDay->format('Y-m-d'))
                ->count();

            $weeklyComparison['lastWeek'][$i] = (clone $query)
                ->whereDate('created_at', $lastWeekDay->format('Y-m-d'))
                ->count();
        }

        // Get basic request data for amount histogram
        $requestsData = (clone $query)->select('id', 'amount', 'status', 'created_at')->get();

        return [
            'totalRequests' => $totalRequests,
            'statusCounts' => $statusCounts,
            'approvedAmount' => $approvedAmount,
            'currentMonthCount' => $currentMonthCount,
            'monthlyTrend' => $monthlyTrend,
            'categoryStats' => $categoryStats,
            'avgProcessingTime' => round($avgProcessingTime, 1),
            'processingTimeDistribution' => array_values($processingTimeDistribution),
            'weeklyComparison' => $weeklyComparison,
            'requestsData' => $requestsData,
            // Include applied filters in response
            'appliedFilters' => [
                'year' => $request->year,
                'month' => $request->month,
                'category' => $request->category
            ]
        ];
    }
}
