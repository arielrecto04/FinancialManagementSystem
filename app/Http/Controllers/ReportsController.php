<?php

namespace App\Http\Controllers;

use App\Models\SupplyRequest;
use App\Models\ReimbursementRequest;
use App\Models\Liquidation;
use App\Models\AdminBudget;
use App\Models\HrExpense;
use App\Models\OperatingExpense;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\RequestsExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use App\Models\AuditLog;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        $isDateRangeActive = $request->boolean('isDateRangeActive', false);
        
        // Set date range based on active state
        if ($isDateRangeActive) {
            $startDate = $request->input('startDate') ? Carbon::parse($request->input('startDate')) : Carbon::now()->subDays(30);
            $endDate = $request->input('endDate') ? Carbon::parse($request->input('endDate')) : Carbon::now();
        } else {
            // When inactive, don't apply date filter
            $startDate = Carbon::createFromTimestamp(0); // Unix epoch start
            $endDate = Carbon::now()->addYear(); // Future date to include all
        }

        $requestType = strtolower($request->input('requestType', 'all'));
        $page = $request->input('page', 1);
        $perPage = 10;

        // Get filtered requests
        $allRequests = $this->getFilteredRequests($request);
        
        // Calculate statistics for the current period
        $statistics = [
            'totalRequests' => count($allRequests),
            'pendingRequests' => collect($allRequests)->where('status', 'pending')->count(),
            'approvedRequests' => collect($allRequests)->where('status', 'approved')->count(),
            'rejectedRequests' => collect($allRequests)->where('status', 'rejected')->count()
        ];

        // Calculate statistics for the previous period
        $previousStartDate = $startDate->copy()->subDays($startDate->diffInDays($endDate));
        $previousEndDate = $startDate;

        $previousRequests = collect([]);
        
        // Get previous period supply requests
        $previousSupplyRequests = SupplyRequest::with('user')
            ->whereBetween('created_at', [$previousStartDate, $previousEndDate])
            ->get()
            ->map(function ($request) {
                return ['status' => $request->status];
            });
        
        // Get previous period reimbursement requests
        $previousReimbursementRequests = ReimbursementRequest::with('user')
            ->whereBetween('created_at', [$previousStartDate, $previousEndDate])
            ->get()
            ->map(function ($request) {
                return ['status' => $request->status];
            });
        
        // Get previous period liquidation requests
        $previousLiquidationRequests = Liquidation::with('user')
            ->whereBetween('created_at', [$previousStartDate, $previousEndDate])
            ->get()
            ->map(function ($request) {
                return ['status' => $request->status];
            });

        // Get previous period HR expense requests
        $previousHrExpenseRequests = HrExpense::with('user')
            ->whereBetween('created_at', [$previousStartDate, $previousEndDate])
            ->get()
            ->map(function ($request) {
                return ['status' => $request->status];
            });

        $previousRequests = $previousSupplyRequests
            ->concat($previousReimbursementRequests)
            ->concat($previousLiquidationRequests)
            ->concat($previousHrExpenseRequests);

        // Calculate change percentages
        $previousTotal = $previousRequests->count();
        $previousApproved = $previousRequests->where('status', 'approved')->count();
        $previousRejected = $previousRequests->where('status', 'rejected')->count();

        $statistics['totalRequestsChange'] = $previousTotal > 0 
            ? round((($statistics['totalRequests'] - $previousTotal) / $previousTotal) * 100, 1)
            : 0;

        $statistics['approvedRequestsChange'] = $previousApproved > 0
            ? round((($statistics['approvedRequests'] - $previousApproved) / $previousApproved) * 100, 1)
            : 0;

        $statistics['rejectedRequestsChange'] = $previousRejected > 0
            ? round((($statistics['rejectedRequests'] - $previousRejected) / $previousRejected) * 100, 1)
            : 0;

        // Get admin budget
        $adminBudget = null;
        if (auth()->user()->isAdmin() || auth()->user()->isSuperAdmin()) {
            $adminBudget = AdminBudget::where('user_id', auth()->id())->first();
            
            if (!$adminBudget) {
                $adminBudget = AdminBudget::create([
                    'user_id' => auth()->id(),
                    'total_budget' => 1000000,
                    'remaining_budget' => 1000000,
                    'used_budget' => 0
                ]);
            }
        }

        // Paginate the results
        $paginatedRequests = collect($allRequests)->forPage($page, $perPage)->values();
        $totalPages = ceil(count($allRequests) / $perPage);

        return Inertia::render('Reports', [
            'requests' => $paginatedRequests,
            'pagination' => [
                'current_page' => (int)$page,
                'per_page' => $perPage,
                'total' => count($allRequests),
                'total_pages' => $totalPages,
            ],
            'statistics' => $statistics,
            'filters' => [
                'startDate' => $isDateRangeActive ? $startDate->toDateString() : null,
                'endDate' => $isDateRangeActive ? $endDate->toDateString() : null,
                'requestType' => $requestType,
                'status' => $request->input('status', 'all'),
                'isDateRangeActive' => $isDateRangeActive,
                'sortOrder' => $request->input('sortOrder', 'newest'),
            ],
            'adminBudget' => $adminBudget
        ]);
    }

    public function exportExcel(Request $request)
    {
        $requests = $this->getFilteredRequests($request);
        $fileName = 'requests_report_' . Carbon::now()->format('Y-m-d') . '.xlsx';
        
        return Excel::download(new RequestsExport($requests), $fileName);
    }

    public function exportPDF(Request $request)
    {
        $requests = $this->getFilteredRequests($request);
        $isDateRangeActive = $request->boolean('isDateRangeActive', false);
        
        // Get the date range for the PDF title
        $dateRangeText = '';
        if ($isDateRangeActive) {
            $startDate = Carbon::parse($request->input('startDate'))->format('M d, Y');
            $endDate = Carbon::parse($request->input('endDate'))->format('M d, Y');
            $dateRangeText = "($startDate - $endDate)";
        }
        
        $pdf = PDF::loadView('exports.requests-pdf', [
            'requests' => $requests,
            'date' => Carbon::now()->format('F d, Y'),
            'companyName' => 'Innovato Information Technology Solutions',
            'reportTitle' => 'Requests Report ' . $dateRangeText,
            'isDateRangeActive' => $isDateRangeActive,
            'startDate' => $isDateRangeActive ? $startDate : null,
            'endDate' => $isDateRangeActive ? $endDate : null
        ]);
        
        $pdf->setPaper('a4', 'portrait');

        return $pdf->download('requests_report_' . Carbon::now()->format('Y-m-d') . '.pdf');
    }

    private function getFilteredRequests(Request $request)
    {
        $isDateRangeActive = $request->boolean('isDateRangeActive', false);
        
        // Set date range based on active state
        if ($isDateRangeActive) {
            $startDate = $request->input('startDate') ? Carbon::parse($request->input('startDate')) : Carbon::now()->subDays(30);
            $endDate = $request->input('endDate') ? Carbon::parse($request->input('endDate')) : Carbon::now();
        } else {
            // When inactive, don't apply date filter
            $startDate = Carbon::createFromTimestamp(0); // Unix epoch start
            $endDate = Carbon::now()->addYear(); // Future date to include all
        }
        
        $requestType = strtolower($request->input('requestType', 'all'));
        $status = strtolower($request->input('status', 'all'));
        
        // Initialize query builders
        $supplyRequests = SupplyRequest::with('user');
        $reimbursementRequests = ReimbursementRequest::with('user');
        $liquidationRequests = Liquidation::with('user');
        $hrExpenseRequests = HrExpense::with('user');
        $operatingExpenseRequests = OperatingExpense::with('user');
        
        // Apply date filters
        if ($isDateRangeActive) {
            $supplyRequests = $supplyRequests->whereBetween('created_at', [$startDate, $endDate]);
            $reimbursementRequests = $reimbursementRequests->whereBetween('created_at', [$startDate, $endDate]);
            $liquidationRequests = $liquidationRequests->whereBetween('created_at', [$startDate, $endDate]);
            $hrExpenseRequests = $hrExpenseRequests->whereBetween('created_at', [$startDate, $endDate]);
            $operatingExpenseRequests = $operatingExpenseRequests->whereBetween('created_at', [$startDate, $endDate]);
        }
        
        // Apply status filter
        if ($status !== 'all') {
            $supplyRequests = $supplyRequests->where('status', $status);
            $reimbursementRequests = $reimbursementRequests->where('status', $status);
            $liquidationRequests = $liquidationRequests->where('status', $status);
            $hrExpenseRequests = $hrExpenseRequests->where('status', $status);
            $operatingExpenseRequests = $operatingExpenseRequests->where('status', $status);
        }
        
        // Get filtered requests based on request type
        $supplyRequests = $requestType === 'all' || $requestType === 'supply' ? 
            $supplyRequests->get()->map($this->transformSupplyRequest()) : collect([]);
        
        $reimbursementRequests = $requestType === 'all' || $requestType === 'reimbursement' ? 
            $reimbursementRequests->get()->map($this->transformReimbursementRequest()) : collect([]);
        
        $liquidationRequests = $requestType === 'all' || $requestType === 'liquidation' ? 
            $liquidationRequests->get()->map($this->transformLiquidationRequest()) : collect([]);
        
        $hrExpenseRequests = $requestType === 'all' || $requestType === 'hrexpense' ? 
            $hrExpenseRequests->get()->map($this->transformHrExpenseRequest()) : collect([]);
            
        $operatingExpenseRequests = $requestType === 'all' || $requestType === 'operatingexpense' ? 
            $operatingExpenseRequests->get()->map($this->transformOperatingExpenseRequest()) : collect([]);

        // Get sort order from request
        $sortOrder = $request->input('sortOrder', 'newest');
        
        // Apply sorting based on sortOrder parameter
        // For 'newest', we want descending order (true for sortByDesc)
        // For 'oldest', we want ascending order (false for sortByDesc)
        $sortedRequests = $supplyRequests->concat($reimbursementRequests)
            ->concat($liquidationRequests)
            ->concat($hrExpenseRequests)
            ->concat($operatingExpenseRequests);
        
        if ($sortOrder === 'newest') {
            $sortedRequests = $sortedRequests->sortByDesc('created_at');
        } else {
            $sortedRequests = $sortedRequests->sortBy('created_at');
        }
        
        return $sortedRequests->values()->all();
    }

    // Transform functions for consistent data structure
    private function transformSupplyRequest()
    {
        return function ($request) {
            return [
                'request_number' => $request->request_number,
                'type' => 'Supply',
                'user_name' => $request->user->name,
                'department' => $request->department,
                'status' => $request->status,
                'total_amount' => $request->total_amount,
                'created_at' => $request->created_at->format('Y-m-d'),
                'remarks' => $request->remarks,
                'items_json' => $request->items_json
            ];
        };
    }

    // Add similar transform functions for reimbursement and liquidation
    private function transformReimbursementRequest()
    {
        return function ($request) {
            return [
                'request_number' => $request->request_number,
                'type' => 'Reimbursement',
                'user_name' => $request->user->name,
                'department' => $request->department,
                'status' => $request->status,
                'amount' => $request->amount,
                'created_at' => $request->created_at->format('Y-m-d'),
                'remarks' => $request->remarks,
                'expense_type' => $request->expense_type,
                'description' => $request->description,
                'receipt_path' => $request->receipt_path
            ];
        };
    }

    private function transformLiquidationRequest()
    {
        return function ($request) {
            return [
                'request_number' => 'LIQ-' . str_pad($request->id, 8, '0', STR_PAD_LEFT),
                'type' => 'Liquidation',
                'user_name' => $request->user->name,
                'department' => $request->department,
                'status' => $request->status,
                'total_amount' => $request->total_amount,
                'created_at' => $request->created_at->format('Y-m-d'),
                'remarks' => $request->remarks,
                'expense_type' => $request->expense_type,
                'cash_advance_amount' => $request->cash_advance_amount,
                'amount_to_refund' => $request->amount_to_refund,
                'amount_to_reimburse' => $request->amount_to_reimburse,
                'particulars' => $request->particulars,
                'items' => $request->items,
                'receipt_path' => $request->receipt_path
            ];
        };
    }

    private function transformHrExpenseRequest()
    {
        return function ($request) {
            return [
                'request_number' => 'HR-' . str_pad($request->id, 8, '0', STR_PAD_LEFT),
                'type' => 'HR Expense',
                'user_name' => $request->user->name,
                'department' => 'HR',
                'status' => $request->status,
                'total_amount' => $request->total_amount_requested,
                'created_at' => $request->created_at->format('Y-m-d'),
                'remarks' => $request->rejection_reason,
                'expenses_category' => $request->expenses_category,
                'description' => $request->description_of_expenses,
                'breakdown' => $request->breakdown_of_expense,
                'expected_payment_date' => $request->expected_payment_date
            ];
        };
    }

    private function transformOperatingExpenseRequest()
    {
        return function ($request) {
            return [
                'request_number' => 'OP-' . str_pad($request->id, 8, '0', STR_PAD_LEFT),
                'type' => 'Operating Expense',
                'user_name' => $request->user->name,
                'department' => $request->department,
                'status' => $request->status,
                'total_amount' => $request->total_amount,
                'created_at' => $request->created_at->format('Y-m-d'),
                'remarks' => $request->remarks,
                'expense_type' => $request->expense_category,
                'description' => $request->description,
                'receipt_path' => $request->receipt_path,
                'expected_payment_date' => $request->expected_payment_date,
                'breakdown_of_expense' => $request->breakdown_of_expense
            ];
        };
    }

    private function formatNumber($number)
    {
        return number_format((float)$number, 2, '.', ',');
    }

    public function updateStatus($id, Request $request)
    {
        // Validate the request
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'type' => 'required|string',
            'remarks' => 'nullable|string'
        ]);

        // Get admin budget
        $adminBudget = AdminBudget::where('user_id', auth()->id())->first();
        
        if (!$adminBudget) {
            return response()->json([
                'error' => 'Admin budget not found'
            ], 404);
        }

        // Get request amount based on type and convert to float for comparison
        $requestAmount = 0;
        $requestModel = null;
        
        // Normalize the type string to match our model lookups
        $type = strtolower($request->type);
        
        // Log the incoming ID for debugging
        \Log::info('Received ID for update', [
            'id' => $id,
            'type' => $type
        ]);
        
        // Try to find the model with the exact ID first
        if (strpos($type, 'supply') !== false) {
            $requestModel = SupplyRequest::find($id);
            
            // If not found, try to find by request_number
            if (!$requestModel) {
                $requestModel = SupplyRequest::where('request_number', 'LIKE', "SR-%".$id)->first();
            }
            
            $requestAmount = $requestModel ? floatval($requestModel->total_amount) : 0;
        } else if (strpos($type, 'reimbursement') !== false) {
            $requestModel = ReimbursementRequest::find($id);
            
            // If not found, try to find by request_number
            if (!$requestModel) {
                $requestModel = ReimbursementRequest::where('request_number', 'LIKE', "RR-%".$id)->first();
            }
            
            $requestAmount = $requestModel ? floatval($requestModel->amount) : 0;
        } else if (strpos($type, 'hrexpense') !== false || strpos($type, 'hr expense') !== false) {
            $requestModel = HrExpense::find($id);
            
            // If not found, try to find by request_number
            if (!$requestModel) {
                $requestModel = HrExpense::where('request_number', 'LIKE', "HR-%".$id)->first();
            }
            
            $requestAmount = $requestModel ? floatval($requestModel->total_amount_requested) : 0;
        } else if (strpos($type, 'operatingexpense') !== false || strpos($type, 'operating expense') !== false) {
            $requestModel = OperatingExpense::find($id);
            
            // If not found, try to find by request_number
            if (!$requestModel) {
                $requestModel = OperatingExpense::where('request_number', 'LIKE', "OP-%".$id)->first();
            }
            
            $requestAmount = $requestModel ? floatval($requestModel->total_amount) : 0;
        } else if (strpos($type, 'liquidation') !== false) {
            $requestModel = Liquidation::find($id);
            
            // If not found, try to find by request_number
            if (!$requestModel) {
                $requestModel = Liquidation::where('request_number', 'LIKE', "LIQ-%".$id)->first();
            }
            
            $requestAmount = $requestModel ? floatval($requestModel->total_amount) : 0;
        }
        
        if (!$requestModel) {
            \Log::error('Request model not found', [
                'id' => $id,
                'type' => $request->type,
                'normalized_type' => $type
            ]);
            return response()->json([
                'error' => 'Request not found',
                'message' => 'Could not find the request with ID: ' . $id
            ], 404);
        }

        // Debug logging
        \Log::info('Budget Check', [
            'id' => $id,
            'type' => $request->type,
            'normalized_type' => $type,
            'model_found' => $requestModel ? get_class($requestModel) : 'None',
            'remaining_budget' => $adminBudget->remaining_budget,
            'request_amount' => $requestAmount,
            'comparison' => floatval($adminBudget->remaining_budget) < $requestAmount
        ]);

        // Strict budget check for approvals
        if ($request->status === 'approved') {
            if (floatval($adminBudget->remaining_budget) < $requestAmount) {
                return back()->with('error', [
                    'title' => 'Insufficient Budget',
                    'message' => sprintf(
                        'Unable to approve this request. Your remaining budget is ₱%s, but this request requires ₱%s.',
                        $this->formatNumber($adminBudget->remaining_budget),
                        $this->formatNumber($requestAmount)
                    )
                ]);
            }

            DB::beginTransaction();
            try {
                // Update request status
                $requestModel->update([
                    'status' => $request->status,
                    'remarks' => $request->remarks ?? ''
                ]);

                // Update admin budget
                $newRemainingBudget = floatval($adminBudget->remaining_budget) - $requestAmount;
                $newUsedBudget = floatval($adminBudget->used_budget) + $requestAmount;
                
                $adminBudget->update([
                    'remaining_budget' => $newRemainingBudget,
                    'used_budget' => $newUsedBudget
                ]);

                // Get the authenticated user
                $user = auth()->user();

                // Create audit log for approval
                AuditLog::create([
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'user_role' => $user->role,
                    'type' => 'request_approve',
                    'action' => 'Approve Request',
                    'description' => 'Approved ' . $requestModel->getTable() . ' #' . $id,
                    'amount' => $requestAmount,
                    'ip_address' => request()->ip()
                ]);

                DB::commit();

                // Get updated statistics
                $updatedStats = $this->getUpdatedStatistics();

                return back()->with([
                    'success' => 'Request approved and budget updated successfully',
                    'statistics' => $updatedStats
                ]);
            } catch (\Exception $e) {
                DB::rollback();
                \Log::error('Transaction failed: ' . $e->getMessage());
                return response()->json([
                    'error' => 'Transaction failed',
                    'message' => 'Failed to process the approval: ' . $e->getMessage()
                ], 500);
            }
        } else {
            // For rejections
            $requestModel->update([
                'status' => $request->status,
                'remarks' => $request->remarks ?? ''
            ]);

            // Get the authenticated user
            $user = auth()->user();

            // Create audit log for rejection
            AuditLog::create([
                'user_id' => $user->id,
                'user_name' => $user->name,
                'user_role' => $user->role,
                'type' => 'request_reject',
                'action' => 'Reject Request',
                'description' => 'Rejected ' . $requestModel->getTable() . ' #' . $id,
                'amount' => $requestAmount,
                'ip_address' => request()->ip()
            ]);

            // Get updated statistics
            $updatedStats = $this->getUpdatedStatistics();

            return back()->with([
                'success' => 'Request rejected successfully',
                'statistics' => $updatedStats
            ]);
        }
    }

    private function getUpdatedStatistics()
    {
        $allRequests = $this->getFilteredRequests(request());
        
        return [
            'totalRequests' => count($allRequests),
            'pendingRequests' => collect($allRequests)->where('status', 'pending')->count(),
            'approvedRequests' => collect($allRequests)->where('status', 'approved')->count(),
            'rejectedRequests' => collect($allRequests)->where('status', 'rejected')->count()
        ];
    }

    public function getBudget()
    {
        if (!auth()->user()->isAdmin() && !auth()->user()->isSuperAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $adminBudget = AdminBudget::where('user_id', auth()->id())->first();
        
        if (!$adminBudget) {
            $adminBudget = AdminBudget::create([
                'user_id' => auth()->id(),
                'total_budget' => 1000000,
                'remaining_budget' => 1000000,
                'used_budget' => 0
            ]);
        }
        
        return response()->json([
            'total_budget' => $this->formatNumber($adminBudget->total_budget),
            'remaining_budget' => $this->formatNumber($adminBudget->remaining_budget),
            'used_budget' => $this->formatNumber($adminBudget->used_budget)
        ]);
    }
}