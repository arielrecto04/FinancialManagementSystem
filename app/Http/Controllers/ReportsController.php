<?php

namespace App\Http\Controllers;

use App\Models\SupplyRequest;
use App\Models\ReimbursementRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('startDate') ? Carbon::parse($request->input('startDate')) : Carbon::now()->subDays(30);
        $endDate = $request->input('endDate') ? Carbon::parse($request->input('endDate')) : Carbon::now();
        $requestType = strtolower($request->input('requestType', 'all'));

        // Query supply requests
        $supplyRequests = SupplyRequest::with('user')
            ->whereBetween('created_at', [$startDate, $endDate]);
            
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
        $reimbursementRequests = ReimbursementRequest::with('user')
            ->whereBetween('created_at', [$startDate, $endDate]);

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

        // Merge and sort requests
        $allRequests = $supplyRequests->concat($reimbursementRequests)
            ->sortByDesc('created_at')
            ->values()
            ->all();

        // Calculate statistics
        $statistics = [
            'totalRequests' => count($allRequests),
            'pendingRequests' => collect($allRequests)->where('status', 'pending')->count(),
            'completedRequests' => collect($allRequests)->whereIn('status', ['approved', 'rejected'])->count(),
        ];

        return Inertia::render('Reports', [
            'requests' => $allRequests,
            'statistics' => $statistics,
            'filters' => [
                'startDate' => $startDate->toDateString(),
                'endDate' => $endDate->toDateString(),
                'requestType' => $requestType,
            ],
        ]);
    }

    public function exportExcel()
    {
        // TODO: Implement Excel export
    }

    public function exportPDF()
    {
        // TODO: Implement PDF export
    }
}