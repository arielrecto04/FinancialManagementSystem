<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
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
            // Get user statistics
            $userStats = [
                'total_users' => User::count(),
                'admin_users' => User::where('role', 'admin')->count(),
                'regular_users' => User::where('role', 'user')->count(),
                'superadmin_users' => User::where('role', 'superadmin')->count(),
            ];

            Log::info('User Statistics:', $userStats);

            // Get request statistics
            $allRequests = collect([])
                ->concat(SupplyRequest::all())
                ->concat(ReimbursementRequest::all())
                ->concat(Liquidation::all())
                ->concat(HrExpense::all())
                ->concat(OperatingExpense::all());

            $statistics = [
                'totalRequests' => $allRequests->count(),
                'pendingRequests' => $allRequests->where('status', 'pending')->count(),
                'approvedRequests' => $allRequests->where('status', 'approved')->count(),
                'rejectedRequests' => $allRequests->where('status', 'rejected')->count()
            ];

            return Inertia::render('Dashboard', [
                'auth' => [
                    'user' => auth()->user(),
                ],
                'userStats' => $userStats,
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
                'userStats' => [
                    'total_users' => 0,
                    'admin_users' => 0,
                    'regular_users' => 0,
                    'superadmin_users' => 0
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
