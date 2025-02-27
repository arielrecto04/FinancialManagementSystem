<?php

namespace App\Http\Controllers;

use App\Models\SupplyRequest;
use App\Models\ReimbursementRequest;
use App\Models\Liquidation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\RequestsExport;
use Barryvdh\DomPDF\Facade\Pdf;

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

        // Query supply requests
        $supplyRequests = SupplyRequest::with('user');
        if ($isDateRangeActive) {
            $supplyRequests = $supplyRequests->whereBetween('created_at', [$startDate, $endDate]);
        }
            
        // Apply type filter for supply requests
        if ($requestType !== 'all' && $requestType !== 'supply') {
            $supplyRequests = collect([]);
        } else {
            $supplyRequests = $supplyRequests->get()->map(function ($request) {
                return [
                    'id' => $request->id,
                    'request_number' => $request->request_number,
                    'type' => 'Supply',
                    'department' => $request->department,
                    'status' => $request->status,
                    'purpose' => $request->purpose,
                    'date_needed' => $request->date_needed,
                    'items_json' => json_decode($request->items_json, true),
                    'total_amount' => $request->total_amount,
                    'remarks' => $request->remarks,
                    'created_at' => $request->created_at,
                    'user_name' => $request->user->name,
                    'created_at_formatted' => Carbon::parse($request->created_at)->format('M d, Y'),
                ];
            });
        }

        // Query reimbursement requests
        $reimbursementRequests = ReimbursementRequest::with('user');
        if ($isDateRangeActive) {
            $reimbursementRequests = $reimbursementRequests->whereBetween('created_at', [$startDate, $endDate]);
        }

        // Apply type filter for reimbursement requests
        if ($requestType !== 'all' && $requestType !== 'reimbursement') {
            $reimbursementRequests = collect([]);
        } else {
            $reimbursementRequests = $reimbursementRequests->get()->map(function ($request) {
                return [
                    'id' => $request->id,
                    'request_number' => $request->request_number,
                    'type' => 'Reimbursement',
                    'department' => $request->department,
                    'status' => $request->status,
                    'expense_date' => $request->expense_date,
                    'expense_type' => $request->expense_type,
                    'amount' => $request->amount,
                    'description' => $request->description,
                    'receipt_path' => $request->receipt_path,
                    'remarks' => $request->remarks,
                    'created_at' => $request->created_at,
                    'user_name' => $request->user->name,
                    'created_at_formatted' => Carbon::parse($request->created_at)->format('M d, Y'),
                ];
            });
        }

        // Query liquidation requests
        $liquidationRequests = Liquidation::with('user', 'items');
        if ($isDateRangeActive) {
            $liquidationRequests = $liquidationRequests->whereBetween('created_at', [$startDate, $endDate]);
        }

        // Apply type filter for liquidation requests
        if ($requestType !== 'all' && $requestType !== 'liquidation') {
            $liquidationRequests = collect([]);
        } else {
            $liquidationRequests = $liquidationRequests->get()->map(function ($request) {
                return [
                    'id' => $request->id,
                    'request_number' => 'LIQ-' . str_pad($request->id, 8, '0', STR_PAD_LEFT),
                    'type' => 'Liquidation',
                    'department' => $request->department,
                    'status' => $request->status,
                    'date' => $request->date,
                    'particulars' => $request->particulars,
                    'total_amount' => $request->total_amount,
                    'cash_advance_amount' => $request->cash_advance_amount,
                    'amount_to_refund' => $request->amount_to_refund,
                    'amount_to_reimburse' => $request->amount_to_reimburse,
                    'items' => $request->items,
                    'created_at' => $request->created_at,
                    'user_name' => $request->user->name,
                    'user_email' => $request->user->email,
                    'created_at_formatted' => Carbon::parse($request->created_at)->format('M d, Y'),
                    'remarks' => $request->remarks,
                ];
            });
        }

        // Merge and sort all requests
        $allRequests = $supplyRequests->concat($reimbursementRequests)
                                    ->concat($liquidationRequests)
                                    ->sortByDesc('created_at')
                                    ->values()
                                    ->all();

        // Calculate statistics for the current period
        $statistics = [
            'totalRequests' => count($allRequests),
            'pendingRequests' => collect($allRequests)->where('status', 'pending')->count(),
            'completedRequests' => collect($allRequests)->whereIn('status', ['approved', 'rejected'])->count(),
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

        $previousRequests = $previousSupplyRequests
            ->concat($previousReimbursementRequests)
            ->concat($previousLiquidationRequests);

        // Calculate change percentages
        $previousTotal = $previousRequests->count();
        $previousCompleted = $previousRequests->whereIn('status', ['approved', 'rejected'])->count();

        $statistics['totalRequestsChange'] = $previousTotal > 0 
            ? round((($statistics['totalRequests'] - $previousTotal) / $previousTotal) * 100, 1)
            : 0;

        $statistics['completedRequestsChange'] = $previousCompleted > 0
            ? round((($statistics['completedRequests'] - $previousCompleted) / $previousCompleted) * 100, 1)
            : 0;

        return Inertia::render('Reports', [
            'requests' => $allRequests,
            'statistics' => $statistics,
            'filters' => [
                'startDate' => $isDateRangeActive ? $startDate->toDateString() : null,
                'endDate' => $isDateRangeActive ? $endDate->toDateString() : null,
                'requestType' => $requestType,
                'isDateRangeActive' => $isDateRangeActive,
            ],
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
        
        $pdf = PDF::loadView('exports.requests-pdf', [
            'requests' => $requests,
            'date' => Carbon::now()->format('F d, Y'),
            'companyName' => 'Innovato Information Technology Solutions',
            'reportTitle' => 'Requests Report'
        ]);
        
        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('requests_report_' . Carbon::now()->format('Y-m-d') . '.pdf');
    }

    private function getFilteredRequests($request)
    {
        $isDateRangeActive = $request->boolean('isDateRangeActive', false);
        
        if ($isDateRangeActive) {
            $startDate = $request->input('startDate') ? Carbon::parse($request->input('startDate')) : Carbon::now()->subDays(30);
            $endDate = $request->input('endDate') ? Carbon::parse($request->input('endDate')) : Carbon::now();
        } else {
            $startDate = Carbon::createFromTimestamp(0);
            $endDate = Carbon::now()->addYear();
        }

        $requestType = strtolower($request->input('requestType', 'all'));

        // Reuse your existing query logic
        $supplyRequests = SupplyRequest::with('user');
        $reimbursementRequests = ReimbursementRequest::with('user');
        $liquidationRequests = Liquidation::with('user', 'items');

        // Apply date filters
        if ($isDateRangeActive) {
            $supplyRequests = $supplyRequests->whereBetween('created_at', [$startDate, $endDate]);
            $reimbursementRequests = $reimbursementRequests->whereBetween('created_at', [$startDate, $endDate]);
            $liquidationRequests = $liquidationRequests->whereBetween('created_at', [$startDate, $endDate]);
        }

        // Apply type filters and transform data
        $supplyRequests = $requestType === 'all' || $requestType === 'supply' ? 
            $supplyRequests->get()->map($this->transformSupplyRequest()) : collect([]);
        
        $reimbursementRequests = $requestType === 'all' || $requestType === 'reimbursement' ? 
            $reimbursementRequests->get()->map($this->transformReimbursementRequest()) : collect([]);
        
        $liquidationRequests = $requestType === 'all' || $requestType === 'liquidation' ? 
            $liquidationRequests->get()->map($this->transformLiquidationRequest()) : collect([]);

        return $supplyRequests->concat($reimbursementRequests)
            ->concat($liquidationRequests)
            ->sortByDesc('created_at')
            ->values()
            ->all();
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
                'remarks' => $request->remarks
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
                'description' => $request->description
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
                'cash_advance_amount' => $request->cash_advance_amount,
                'amount_to_refund' => $request->amount_to_refund,
                'amount_to_reimburse' => $request->amount_to_reimburse
            ];
        };
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'type' => 'required|in:Supply,Reimbursement,Liquidation',
            'remarks' => 'nullable|string'
        ]);

        if ($request->type === 'Supply') {
            $requestModel = SupplyRequest::findOrFail($id);
        } else if ($request->type === 'Reimbursement') {
            $requestModel = ReimbursementRequest::findOrFail($id);
        } else {
            $requestModel = Liquidation::findOrFail($id);
        }

        $requestModel->update([
            'status' => $request->status,
            'remarks' => $request->remarks
        ]);

        return back()->with('success', 'Request status updated successfully');
    }
}