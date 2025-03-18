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
use Illuminate\Support\Facades\DB;

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

            // Get current year
            $year = now()->year;

            // Get monthly approved expenses for each type
            $monthlyExpenses = collect(range(1, 12))->map(function ($month) use ($year) {
                $startDate = Carbon::create($year, $month, 1)->startOfMonth();
                $endDate = Carbon::create($year, $month, 1)->endOfMonth();

                // HR Expenses
                $hrExpenses = HrExpense::where('status', 'approved')
                    ->whereBetween('date_of_request', [$startDate, $endDate])
                    ->sum('total_amount_requested');

                // Operating Expenses
                $operatingExpenses = OperatingExpense::where('status', 'approved')
                    ->whereBetween('date_of_request', [$startDate, $endDate])
                    ->sum('total_amount');

                // Supply Requests
                $supplyRequests = SupplyRequest::where('status', 'approved')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('total_amount');

                // Reimbursement Requests
                $reimbursements = ReimbursementRequest::where('status', 'approved')
                    ->whereBetween('expense_date', [$startDate, $endDate])
                    ->sum('amount');

                // Liquidations
                $liquidations = Liquidation::where('status', 'approved')
                    ->whereBetween('date', [$startDate, $endDate])
                    ->sum('total_amount');

                return [
                    'hr' => round($hrExpenses, 2),
                    'operating' => round($operatingExpenses, 2),
                    'supply' => round($supplyRequests, 2),
                    'reimbursement' => round($reimbursements, 2),
                    'liquidation' => round($liquidations, 2)
                ];
            })->values()->toArray();

            // Fetch highest expenses from all types
            $highestExpenses = collect();

            // HR Expenses
            $hrExpenses = HrExpense::where('status', 'approved')
                ->select('id', 'expenses_category as category', 'total_amount_requested as amount', 'date_of_request as date')
                ->get()
                ->map(function ($expense) {
                    return [
                        'id' => $expense->id,
                        'type' => 'HR Expense',
                        'category' => $expense->category,
                        'amount' => $expense->amount,
                        'date' => $expense->date
                    ];
                });
            $highestExpenses = $highestExpenses->concat($hrExpenses);

            // Operating Expenses
            $operatingExpenses = OperatingExpense::where('status', 'approved')
                ->select('id', 'expense_category as category', 'total_amount as amount', 'date_of_request as date')
                ->get()
                ->map(function ($expense) {
                    return [
                        'id' => $expense->id,
                        'type' => 'Operating Expense',
                        'category' => $expense->category,
                        'amount' => $expense->amount,
                        'date' => $expense->date
                    ];
                });
            $highestExpenses = $highestExpenses->concat($operatingExpenses);

            // Supply Requests
            $supplyRequests = SupplyRequest::where('status', 'approved')
                ->select('id', 'purpose as category', 'total_amount as amount', 'date_needed as date')
                ->get()
                ->map(function ($expense) {
                    return [
                        'id' => $expense->id,
                        'type' => 'Supply Request',
                        'category' => $expense->category,
                        'amount' => $expense->amount,
                        'date' => $expense->date
                    ];
                });
            $highestExpenses = $highestExpenses->concat($supplyRequests);

            // Reimbursement Requests
            $reimbursements = ReimbursementRequest::where('status', 'approved')
                ->select('id', 'expense_type as category', 'amount', 'expense_date as date')
                ->get()
                ->map(function ($expense) {
                    return [
                        'id' => $expense->id,
                        'type' => 'Reimbursement',
                        'category' => $expense->category,
                        'amount' => $expense->amount,
                        'date' => $expense->date
                    ];
                });
            $highestExpenses = $highestExpenses->concat($reimbursements);

            // Liquidations
            $liquidations = Liquidation::where('status', 'approved')
                ->select('id', 'particulars as category', 'total_amount as amount', 'date')
                ->get()
                ->map(function ($expense) {
                    return [
                        'id' => $expense->id,
                        'type' => 'Liquidation',
                        'category' => $expense->category,
                        'amount' => $expense->amount,
                        'date' => $expense->date
                    ];
                });
            $highestExpenses = $highestExpenses->concat($liquidations);

            // Sort by amount and take top 6
            $highestExpenses = $highestExpenses->sortByDesc('amount')->take(6)->values();

            return Inertia::render('Dashboard', [
                'auth' => [
                    'user' => auth()->user(),
                ],
                'userStats' => $userStats,
                'statistics' => $statistics,
                'monthlyExpenses' => $monthlyExpenses,
                'highestExpenses' => $highestExpenses
            ]);

        } catch (\Exception $e) {
            Log::error('Error in Dashboard Controller:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('Dashboard', [
                'auth' => ['user' => auth()->user()],
                'userStats' => [
                    'total_users' => 0,
                    'admin_users' => 0,
                    'regular_users' => 0,
                    'superadmin_users' => 0
                ],
                'statistics' => [],
                'monthlyExpenses' => [],
                'highestExpenses' => []
            ]);
        }
    }
}
