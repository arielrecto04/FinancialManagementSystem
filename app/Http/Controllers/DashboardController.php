<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SupplyRequest;
use App\Models\ReimbursementRequest;
use App\Models\Liquidation;
use App\Models\HrExpense;
use App\Models\OperatingExpense;
use App\Models\AdminBudget;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            Log::info('Fetching dashboard statistics...');

            // Get all types of requests
            $supplyRequests = SupplyRequest::all();
            Log::info('Supply Requests:', ['count' => $supplyRequests->count()]);

            $reimbursementRequests = ReimbursementRequest::all();
            Log::info('Reimbursement Requests:', ['count' => $reimbursementRequests->count()]);

            $liquidationRequests = Liquidation::all();
            Log::info('Liquidation Requests:', ['count' => $liquidationRequests->count()]);

            $hrExpenseRequests = HrExpense::all();
            Log::info('HR Expense Requests:', ['count' => $hrExpenseRequests->count()]);

            $operatingExpenseRequests = OperatingExpense::all();
            Log::info('Operating Expense Requests:', ['count' => $operatingExpenseRequests->count()]);

            // Combine all requests
            $allRequests = collect([])
                ->concat($supplyRequests)
                ->concat($reimbursementRequests)
                ->concat($liquidationRequests)
                ->concat($hrExpenseRequests)
                ->concat($operatingExpenseRequests);

            // Calculate statistics
            $statistics = [
                'totalRequests' => $allRequests->count(),
                'pendingRequests' => $allRequests->where('status', 'pending')->count(),
                'approvedRequests' => $allRequests->where('status', 'approved')->count(),
                'rejectedRequests' => $allRequests->where('status', 'rejected')->count()
            ];

            Log::info('Dashboard Statistics:', $statistics);

            // Debug the data being sent
            Log::info('Rendering dashboard with data:', [
                'user' => auth()->user()->id,
                'statistics' => $statistics
            ]);

            return Inertia::render('Dashboard', [
                'auth' => [
                    'user' => auth()->user(),
                ],
                'statistics' => $statistics
            ]);

        } catch (\Exception $e) {
            Log::error('Error in Dashboard Controller:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('Dashboard', [
                'auth' => [
                    'user' => auth()->user(),
                ],
                'statistics' => [
                    'totalRequests' => 0,
                    'pendingRequests' => 0,
                    'approvedRequests' => 0,
                    'rejectedRequests' => 0
                ]
            ]);
        }
    }

    private function getDailySummary()
    {
        $today = Carbon::today();
        
        return [
            'supply' => SupplyRequest::whereDate('created_at', $today)->sum('amount'),
            'reimbursement' => ReimbursementRequest::whereDate('created_at', $today)->sum('amount'),
            'liquidation' => Liquidation::whereDate('created_at', $today)->sum('amount'),
            'hr_expense' => HrExpense::whereDate('created_at', $today)->sum('amount'),
            'operating_expense' => OperatingExpense::whereDate('created_at', $today)->sum('amount'),
            'total' => SupplyRequest::whereDate('created_at', $today)->sum('amount') + ReimbursementRequest::whereDate('created_at', $today)->sum('amount') + Liquidation::whereDate('created_at', $today)->sum('amount') + HrExpense::whereDate('created_at', $today)->sum('amount') + OperatingExpense::whereDate('created_at', $today)->sum('amount')
        ];
    }
}
