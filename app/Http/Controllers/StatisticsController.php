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
        // Add isAllTime check
        $isAllTime = $request->boolean('isAllTime', false);
        
        if ($isAllTime) {
            // For all time, get the earliest date from any request type
            $startDate = min(
                SupplyRequest::min('created_at') ?? now(),
                ReimbursementRequest::min('created_at') ?? now(),
                Liquidation::min('created_at') ?? now(),
                HrExpense::min('created_at') ?? now(),
                OperatingExpense::min('created_at') ?? now()
            );
            $endDate = now();
        } else {
            $startDate = $request->input('startDate') ? Carbon::parse($request->input('startDate')) : Carbon::now()->startOfMonth();
            $endDate = $request->input('endDate') ? Carbon::parse($request->input('endDate')) : Carbon::now();
        }
        
        // Add view option
        $viewOption = $request->input('viewOption', 'daily');

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

        // Add new detailed statistics with date range and view period
        $detailedStats = [
            'hr_expenses' => [
                'categories' => HrExpense::where('status', 'approved')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->select(
                        'expenses_category',
                        DB::raw('COUNT(*) as count'),
                        DB::raw('SUM(total_amount_requested) as total'),
                        DB::raw('AVG(total_amount_requested) as average')
                    )
                    ->when($viewOption === 'daily', function ($query) {
                        return $query->addSelect(DB::raw('DATE(created_at) as period'));
                    })
                    ->when($viewOption === 'weekly', function ($query) {
                        return $query->addSelect(DB::raw('YEARWEEK(created_at) as period'));
                    })
                    ->when($viewOption === 'monthly', function ($query) {
                        return $query->addSelect(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as period'));
                    })
                    ->when($viewOption === 'annual', function ($query) {
                        return $query->addSelect(DB::raw('YEAR(created_at) as period'));
                    })
                    ->groupBy('expenses_category', 'period')
                    ->get()
                    ->groupBy('expenses_category'),
                'total_amount' => HrExpense::where('status', 'approved')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('total_amount_requested'),
            ],
            'operating_expenses' => [
                'categories' => OperatingExpense::where('status', 'approved')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->select(
                        'expense_category',
                        DB::raw('COUNT(*) as count'),
                        DB::raw('SUM(total_amount) as total'),
                        DB::raw('AVG(total_amount) as average')
                    )
                    ->when($viewOption === 'daily', function ($query) {
                        return $query->addSelect(DB::raw('DATE(created_at) as period'));
                    })
                    ->when($viewOption === 'weekly', function ($query) {
                        return $query->addSelect(DB::raw('YEARWEEK(created_at) as period'));
                    })
                    ->when($viewOption === 'monthly', function ($query) {
                        return $query->addSelect(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as period'));
                    })
                    ->when($viewOption === 'annual', function ($query) {
                        return $query->addSelect(DB::raw('YEAR(created_at) as period'));
                    })
                    ->groupBy('expense_category', 'period')
                    ->get()
                    ->groupBy('expense_category'),
                'total_amount' => OperatingExpense::where('status', 'approved')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('total_amount'),
            ],
            'liquidations' => [
                'categories' => Liquidation::where('status', 'approved')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->select(
                        'expense_type',
                        DB::raw('COUNT(*) as count'),
                        DB::raw('SUM(total_amount) as total'),
                        DB::raw('AVG(total_amount) as average')
                    )
                    ->when($viewOption === 'daily', function ($query) {
                        return $query->addSelect(DB::raw('DATE(created_at) as period'));
                    })
                    ->when($viewOption === 'weekly', function ($query) {
                        return $query->addSelect(DB::raw('YEARWEEK(created_at) as period'));
                    })
                    ->when($viewOption === 'monthly', function ($query) {
                        return $query->addSelect(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as period'));
                    })
                    ->when($viewOption === 'annual', function ($query) {
                        return $query->addSelect(DB::raw('YEAR(created_at) as period'));
                    })
                    ->groupBy('expense_type', 'period')
                    ->get()
                    ->groupBy('expense_type'),
                'total_amount' => Liquidation::where('status', 'approved')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('total_amount'),
            ],
            'reimbursements' => [
                'categories' => ReimbursementRequest::where('status', 'approved')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->select(
                        'expense_type',
                        DB::raw('COUNT(*) as count'),
                        DB::raw('SUM(amount) as total'),
                        DB::raw('AVG(amount) as average')
                    )
                    ->when($viewOption === 'daily', function ($query) {
                        return $query->addSelect(DB::raw('DATE(created_at) as period'));
                    })
                    ->when($viewOption === 'weekly', function ($query) {
                        return $query->addSelect(DB::raw('YEARWEEK(created_at) as period'));
                    })
                    ->when($viewOption === 'monthly', function ($query) {
                        return $query->addSelect(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as period'));
                    })
                    ->when($viewOption === 'annual', function ($query) {
                        return $query->addSelect(DB::raw('YEAR(created_at) as period'));
                    })
                    ->groupBy('expense_type', 'period')
                    ->get()
                    ->groupBy('expense_type'),
                'total_amount' => ReimbursementRequest::where('status', 'approved')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('amount'),
            ],
            'monthly_trends' => $this->getMonthlyTrends($startDate, $endDate),
            'view_period' => [
                'type' => $viewOption,
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
        ];

        return Inertia::render('Statistics', [
            'statistics' => [
                'daily' => $dailyStats,
                'weekly' => $weeklyStats,
                'monthly' => $monthlyStats,
                'annual' => $annualStats
            ],
            'categoryData' => $categoryDistribution,
            'detailedStats' => $detailedStats
        ]);
    }

    private function getSupplyRequests($startDate, $endDate)
    {
        return SupplyRequest::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'approved')
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
            ->where('status', 'approved')
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
            ->where('status', 'approved')
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
            ->where('status', 'approved')
            ->get()
            ->map(function ($request) {
                return [
                    'amount' => $request->total_amount_requested,
                    'date' => $request->created_at,
                    'category' => 'HR Expenses Request',
                    'type' => 'Expense'
                ];
            });
    }

    private function getOperatingExpenses($startDate, $endDate)
    {
        return OperatingExpense::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'approved')
            ->get()
            ->map(function ($request) {
                return [
                    'amount' => $request->total_amount,
                    'date' => $request->created_at,
                    'category' => 'Operating Expenses Request',
                    'type' => 'Expense'
                ];
            });
    }

    private function calculateDailyStats($expenses)
    {
        // Group expenses by date (YYYY-MM-DD)
        $dailyExpenses = $expenses->groupBy(function ($expense) {
            return $expense['date']->format('Y-m-d');
        });

        // Calculate total expenses for the period
        $totalExpenses = $expenses->sum('amount');

        // Calculate average daily expense
        $numberOfDays = $dailyExpenses->count() ?: 1; // Avoid division by zero
        $averageExpense = $totalExpenses / $numberOfDays;

        // Find the day with highest expenses
        $highestDayData = $dailyExpenses
            ->map(function ($dayExpenses) {
                return [
                    'date' => $dayExpenses->first()['date']->format('Y-m-d'),
                    'total' => collect($dayExpenses)->sum('amount')
                ];
            })
            ->sortByDesc('total')
            ->first();

        return [
            'totalExpenses' => $totalExpenses,
            'averageExpense' => $averageExpense,
            'highestDay' => $highestDayData ? $highestDayData['date'] : 'N/A',
            'highestAmount' => $highestDayData ? $highestDayData['total'] : 0
        ];
    }

    private function calculateWeeklyStats($expenses)
    {
        // Group expenses by week number (YYYY-WW)
        $weeklyExpenses = $expenses->groupBy(function ($expense) {
            return $expense['date']->format('Y-W');
        });

        $totalExpenses = $expenses->sum('amount');
        $numberOfWeeks = $weeklyExpenses->count() ?: 1;
        $averageExpense = $totalExpenses / $numberOfWeeks;

        // Find week with highest expenses
        $highestWeekData = $weeklyExpenses
            ->map(function ($weekExpenses) {
                return [
                    'week' => $weekExpenses->first()['date']->format('Y-W'),
                    'total' => collect($weekExpenses)->sum('amount')
                ];
            })
            ->sortByDesc('total')
            ->first();

        return [
            'totalExpenses' => $totalExpenses,
            'averageExpense' => $averageExpense,
            'highestWeek' => $highestWeekData ? 'Week ' . substr($highestWeekData['week'], -2) : 'N/A',
            'highestAmount' => $highestWeekData ? $highestWeekData['total'] : 0
        ];
    }

    private function calculateMonthlyStats($expenses)
    {
        // Group expenses by month (YYYY-MM)
        $monthlyExpenses = $expenses->groupBy(function ($expense) {
            return $expense['date']->format('Y-m');
        });

        $totalExpenses = $expenses->sum('amount');
        $numberOfMonths = $monthlyExpenses->count() ?: 1;
        $averageExpense = $totalExpenses / $numberOfMonths;

        // Find month with highest expenses
        $highestMonthData = $monthlyExpenses
            ->map(function ($monthExpenses) {
                return [
                    'month' => $monthExpenses->first()['date']->format('F Y'),
                    'total' => collect($monthExpenses)->sum('amount')
                ];
            })
            ->sortByDesc('total')
            ->first();

        return [
            'totalExpenses' => $totalExpenses,
            'averageExpense' => $averageExpense,
            'highestMonth' => $highestMonthData ? $highestMonthData['month'] : 'N/A',
            'highestAmount' => $highestMonthData ? $highestMonthData['total'] : 0
        ];
    }

    private function calculateAnnualStats($expenses)
    {
        // Group expenses by year (YYYY)
        $annualExpenses = $expenses->groupBy(function ($expense) {
            return $expense['date']->format('Y');
        });

        $totalExpenses = $expenses->sum('amount');
        $numberOfYears = $annualExpenses->count() ?: 1;
        $averageExpense = $totalExpenses / $numberOfYears;

        // Find year with highest expenses
        $highestYearData = $annualExpenses
            ->map(function ($yearExpenses) {
                return [
                    'year' => $yearExpenses->first()['date']->format('Y'),
                    'total' => collect($yearExpenses)->sum('amount')
                ];
            })
            ->sortByDesc('total')
            ->first();

        return [
            'totalExpenses' => $totalExpenses,
            'averageExpense' => $averageExpense,
            'highestYear' => $highestYearData ? $highestYearData['year'] : 'N/A',
            'highestAmount' => $highestYearData ? $highestYearData['total'] : 0
        ];
    }

    private function calculateCategoryDistribution($expenses)
    {
        $categories = [
            'Supply Request',
            'Reimbursement',
            'Liquidation',
            'Petty Cash Request',
            'HR Expenses Request',
            'Operating Expenses Request'
        ];

        $distribution = $expenses->groupBy('category')
            ->map(function ($categoryExpenses) {
                return collect($categoryExpenses)->sum('amount');
            })
            ->toArray();

        // Ensure all categories exist in the distribution, with 0 if no expenses
        foreach ($categories as $category) {
            if (!isset($distribution[$category])) {
                $distribution[$category] = 0;
            }
        }

        // Keep only the specified categories
        return array_intersect_key($distribution, array_flip($categories));
    }

    private function getMonthlyTrends($startDate, $endDate)
    {
        $months = [];
        $current = Carbon::parse($startDate)->startOfMonth();
        $end = Carbon::parse($endDate)->endOfMonth();

        while ($current <= $end) {
            $monthKey = $current->format('Y-m');
            $months[$monthKey] = [
                'hr' => HrExpense::where('status', 'approved')
                    ->whereYear('created_at', $current->year)
                    ->whereMonth('created_at', $current->month)
                    ->sum('total_amount_requested'),
                'operating' => OperatingExpense::where('status', 'approved')
                    ->whereYear('created_at', $current->year)
                    ->whereMonth('created_at', $current->month)
                    ->sum('total_amount'),
                'liquidations' => Liquidation::where('status', 'approved')
                    ->whereYear('created_at', $current->year)
                    ->whereMonth('created_at', $current->month)
                    ->sum('total_amount'),
                'reimbursements' => ReimbursementRequest::where('status', 'approved')
                    ->whereYear('created_at', $current->year)
                    ->whereMonth('created_at', $current->month)
                    ->sum('amount'),
            ];
            $current->addMonth();
        }

        return $months;
    }
}   