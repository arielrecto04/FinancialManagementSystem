<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SupplyRequest;
use App\Models\ReimbursementRequest;
use App\Models\Liquidation;
use App\Models\HrExpense;
use App\Models\OperatingExpense;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('startDate') ? Carbon::parse($request->input('startDate')) : Carbon::now()->startOfMonth();
        $endDate = $request->input('endDate') ? Carbon::parse($request->input('endDate')) : Carbon::now();
        
        // Get all expenses within date range
        $expenses = collect([])
            ->merge($this->getSupplyRequests($startDate, $endDate))
            ->merge($this->getReimbursements($startDate, $endDate))
            ->merge($this->getLiquidations($startDate, $endDate))
            ->merge($this->getHrExpenses($startDate, $endDate))
            ->merge($this->getOperatingExpenses($startDate, $endDate));

        // Calculate statistics for different periods
        $dailyStats = $this->calculateDailyStats($expenses);
        $weeklyStats = $this->calculateWeeklyStats($expenses);
        $monthlyStats = $this->calculateMonthlyStats($expenses);
        $annualStats = $this->calculateAnnualStats($expenses);

        // Calculate category distribution
        $categoryDistribution = $this->calculateCategoryDistribution($expenses);

        return Inertia::render('Statistics', [
            'statistics' => [
                'daily' => $dailyStats,
                'weekly' => $weeklyStats,
                'monthly' => $monthlyStats,
                'annual' => $annualStats
            ],
            'categoryData' => $categoryDistribution
        ]);
    }

    private function getSupplyRequests($startDate, $endDate)
    {
        return SupplyRequest::whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->map(function ($request) {
                return [
                    'amount' => $request->total_amount,
                    'date' => $request->created_at,
                    'category' => 'Supply Request',
                    'type' => 'Expense'
                ];
            });
    }

    private function getReimbursements($startDate, $endDate)
    {
        return ReimbursementRequest::whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->map(function ($request) {
                return [
                    'amount' => $request->amount,
                    'date' => $request->created_at,
                    'category' => $request->expense_type,
                    'type' => 'Expense'
                ];
            });
    }

    private function getLiquidations($startDate, $endDate)
    {
        return Liquidation::whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->map(function ($request) {
                return [
                    'amount' => $request->total_amount,
                    'date' => $request->created_at,
                    'category' => 'Liquidation',
                    'type' => 'Expense'
                ];
            });
    }

    private function getHrExpenses($startDate, $endDate)
    {
        return HrExpense::whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->map(function ($request) {
                return [
                    'amount' => $request->total_amount_requested,
                    'date' => $request->created_at,
                    'category' => $request->expenses_category,
                    'type' => 'Expense'
                ];
            });
    }

    private function getOperatingExpenses($startDate, $endDate)
    {
        return OperatingExpense::whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->map(function ($request) {
                return [
                    'amount' => $request->total_amount,
                    'date' => $request->created_at,
                    'category' => $request->expense_category,
                    'type' => 'Expense'
                ];
            });
    }

    private function calculateDailyStats($expenses)
    {
        $dailyExpenses = $expenses->groupBy(function ($expense) {
            return $expense['date']->format('Y-m-d');
        });

        $totalExpenses = $expenses->sum('amount');
        $averageExpense = $dailyExpenses->count() > 0 ? $totalExpenses / $dailyExpenses->count() : 0;
        $highestDay = $dailyExpenses->map(function ($dayExpenses) {
            return collect($dayExpenses)->sum('amount');
        })->sortDesc()->keys()->first();

        return [
            'totalExpenses' => $totalExpenses,
            'averageExpense' => $averageExpense,
            'highestDay' => $highestDay ?? 'N/A'
        ];
    }

    private function calculateWeeklyStats($expenses)
    {
        $weeklyExpenses = $expenses->groupBy(function ($expense) {
            return $expense['date']->format('Y-W');
        });

        $totalExpenses = $expenses->sum('amount');
        $averageExpense = $weeklyExpenses->count() > 0 ? $totalExpenses / $weeklyExpenses->count() : 0;
        $highestWeek = $weeklyExpenses->map(function ($weekExpenses) {
            return collect($weekExpenses)->sum('amount');
        })->sortDesc()->keys()->first();

        return [
            'totalExpenses' => $totalExpenses,
            'averageExpense' => $averageExpense,
            'highestWeek' => $highestWeek ? 'Week ' . substr($highestWeek, -2) : 'N/A'
        ];
    }

    private function calculateMonthlyStats($expenses)
    {
        $monthlyExpenses = $expenses->groupBy(function ($expense) {
            return $expense['date']->format('Y-m');
        });

        $totalExpenses = $expenses->sum('amount');
        $averageExpense = $monthlyExpenses->count() > 0 ? $totalExpenses / $monthlyExpenses->count() : 0;
        $highestMonth = $monthlyExpenses->map(function ($monthExpenses) {
            return collect($monthExpenses)->sum('amount');
        })->sortDesc()->keys()->first();

        return [
            'totalExpenses' => $totalExpenses,
            'averageExpense' => $averageExpense,
            'highestMonth' => $highestMonth ? Carbon::createFromFormat('Y-m', $highestMonth)->format('F Y') : 'N/A'
        ];
    }

    private function calculateAnnualStats($expenses)
    {
        $annualExpenses = $expenses->groupBy(function ($expense) {
            return $expense['date']->format('Y');
        });

        $totalExpenses = $expenses->sum('amount');
        $averageExpense = $annualExpenses->count() > 0 ? $totalExpenses / $annualExpenses->count() : 0;
        $highestYear = $annualExpenses->map(function ($yearExpenses) {
            return collect($yearExpenses)->sum('amount');
        })->sortDesc()->keys()->first();

        return [
            'totalExpenses' => $totalExpenses,
            'averageExpense' => $averageExpense,
            'highestYear' => $highestYear ?? 'N/A'
        ];
    }

    private function calculateCategoryDistribution($expenses)
    {
        return $expenses->groupBy('category')
            ->map(function ($categoryExpenses) {
                return collect($categoryExpenses)->sum('amount');
            })
            ->toArray();
    }
}