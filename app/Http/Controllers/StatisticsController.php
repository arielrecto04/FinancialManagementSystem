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
        $viewOption = $request->input('viewOption', 'daily');
        $isAllTime = $request->boolean('isAllTime', false);
        
        // Get date range from request
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        
        // If all time is selected, get the earliest and latest dates from the database
        if ($isAllTime) {
            $startDate = HrExpense::min('created_at') ?? now()->startOfYear();
            $endDate = HrExpense::max('created_at') ?? now();
        } else {
            // If no dates provided, default to current year
            if (!$startDate || !$endDate) {
                $startDate = now()->startOfYear();
                $endDate = now();
            } else {
                // Parse and set time to start/end of day
                $startDate = Carbon::parse($startDate)->startOfDay();
                $endDate = Carbon::parse($endDate)->endOfDay();
            }
        }

        // Validate date range
        if ($startDate > $endDate) {
            return back()->with('error', 'Start date cannot be after end date.');
        }

        // Get statistics for each view option
        $statistics = $this->getStatisticsByViewOption($viewOption, $startDate, $endDate);
        
        // Get category data
        $categoryData = $this->getCategoryData($viewOption, $startDate, $endDate);
        
        // Get detailed statistics
        $detailedStats = $this->getDetailedStatistics($viewOption, $startDate, $endDate);
        
        // Add view period information
        $detailedStats['view_period'] = [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'isAllTime' => $isAllTime
        ];

        return Inertia::render('Statistics', [
            'statistics' => $statistics,
            'categoryData' => $categoryData,
            'detailedStats' => $detailedStats,
            'currentViewOption' => $viewOption
        ]);
    }

    private function getStatisticsByViewOption($viewOption, $startDate, $endDate)
    {
        $statistics = [];
        
        // Get all expense types with their correct amount columns
        $expenseTypes = [
            'hr' => ['model' => HrExpense::class, 'amount_column' => 'total_amount_requested'],
            'operating' => ['model' => OperatingExpense::class, 'amount_column' => 'total_amount'],
            'liquidation' => ['model' => Liquidation::class, 'amount_column' => 'total_amount'],
            'reimbursement' => ['model' => ReimbursementRequest::class, 'amount_column' => 'amount'],
            'supply' => ['model' => SupplyRequest::class, 'amount_column' => 'total_amount']
        ];

        $totalExpenses = 0;
        $totalCount = 0;
        $highestAmount = 0;
        $highestPeriod = null;

        foreach ($expenseTypes as $type => $config) {
            $query = $config['model']::where('status', 'approved')
                ->whereBetween('created_at', [$startDate, $endDate]);

            $periodData = match($viewOption) {
                'daily' => $query->select(
                    DB::raw('DATE(created_at) as period'),
                    DB::raw('COUNT(*) as count'),
                    DB::raw("SUM({$config['amount_column']}) as total")
                )->groupBy(DB::raw('DATE(created_at)'))->get(),
                'weekly' => $query->select(
                    DB::raw('YEARWEEK(created_at) as period'),
                    DB::raw('COUNT(*) as count'),
                    DB::raw("SUM({$config['amount_column']}) as total")
                )->groupBy(DB::raw('YEARWEEK(created_at)'))->get(),
                'monthly' => $query->select(
                    DB::raw('DATE_FORMAT(created_at, "%Y-%m") as period'),
                    DB::raw('COUNT(*) as count'),
                    DB::raw("SUM({$config['amount_column']}) as total")
                )->groupBy(DB::raw('DATE_FORMAT(created_at, "%Y-%m")'))->get(),
                'annual' => $query->select(
                    DB::raw('YEAR(created_at) as period'),
                    DB::raw('COUNT(*) as count'),
                    DB::raw("SUM({$config['amount_column']}) as total")
                )->groupBy(DB::raw('YEAR(created_at)'))->get(),
                default => $query->select(
                    DB::raw('DATE(created_at) as period'),
                    DB::raw('COUNT(*) as count'),
                    DB::raw("SUM({$config['amount_column']}) as total")
                )->groupBy(DB::raw('DATE(created_at)'))->get()
            };

            $statistics[$type] = $periodData;

            // Calculate totals for overview
            $totalExpenses += $periodData->sum('total');
            $totalCount += $periodData->sum('count');

            // Find highest period
            $highestPeriodData = $periodData->sortByDesc('total')->first();
            if ($highestPeriodData && $highestPeriodData->total > $highestAmount) {
                $highestAmount = $highestPeriodData->total;
                $highestPeriod = $highestPeriodData->period;
            }
        }

        // Add overview statistics
        $statistics['overview'] = [
            'totalExpenses' => $totalExpenses,
            'averageExpense' => $totalCount > 0 ? $totalExpenses / $totalCount : 0,
            'highestAmount' => $highestAmount,
            'highestPeriod' => $highestPeriod,
            'totalRequests' => $totalCount
        ];

        return $statistics;
    }

    private function getCategoryData($viewOption, $startDate, $endDate)
    {
        $categoryData = [];
        
        // Get all expense types with their correct amount columns
        $expenseTypes = [
            'Supply Request' => ['model' => SupplyRequest::class, 'amount_column' => 'total_amount'],
            'Reimbursement' => ['model' => ReimbursementRequest::class, 'amount_column' => 'amount'],
            'Liquidation' => ['model' => Liquidation::class, 'amount_column' => 'total_amount'],
            'HR Expenses Request' => ['model' => HrExpense::class, 'amount_column' => 'total_amount_requested'],
            'Operating Expenses Request' => ['model' => OperatingExpense::class, 'amount_column' => 'total_amount']
        ];

        foreach ($expenseTypes as $category => $config) {
            $query = $config['model']::where('status', 'approved')
                ->whereBetween('created_at', [$startDate, $endDate]);

                    switch ($viewOption) {
                        case 'daily':
                    $categoryData[$category] = $query->select(
                        DB::raw('DATE(created_at) as date'),
                        DB::raw("AVG({$config['amount_column']}) as daily_average")
                    )
                    ->groupBy(DB::raw('DATE(created_at)'))
                    ->get()
                    ->avg('daily_average');
                    break;
                        case 'weekly':
                    $categoryData[$category] = $query->select(
                        DB::raw('YEARWEEK(created_at) as week'),
                        DB::raw("AVG({$config['amount_column']}) as weekly_average")
                    )
                    ->groupBy(DB::raw('YEARWEEK(created_at)'))
                    ->get()
                    ->avg('weekly_average');
                    break;
                        case 'monthly':
                    $categoryData[$category] = $query->select(
                        DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                        DB::raw("AVG({$config['amount_column']}) as monthly_average")
                    )
                    ->groupBy(DB::raw('DATE_FORMAT(created_at, "%Y-%m")'))
                    ->get()
                    ->avg('monthly_average');
                    break;
                        case 'annual':
                    $categoryData[$category] = $query->select(
                        DB::raw('YEAR(created_at) as year'),
                        DB::raw("AVG({$config['amount_column']}) as yearly_average")
                    )
                    ->groupBy(DB::raw('YEAR(created_at)'))
                    ->get()
                    ->avg('yearly_average');
                    break;
            }
        }

        return $categoryData;
    }

    private function getDetailedStatistics($viewOption, $startDate, $endDate)
    {
        $detailedStats = [];
        
        // Get all expense types with their correct amount columns
        $expenseTypes = [
            'hr' => ['model' => HrExpense::class, 'amount_column' => 'total_amount_requested', 'category_column' => 'expenses_category'],
            'operating' => ['model' => OperatingExpense::class, 'amount_column' => 'total_amount', 'category_column' => 'expense_category'],
            'liquidation' => ['model' => Liquidation::class, 'amount_column' => 'total_amount', 'category_column' => 'expense_type'],
            'supply' => ['model' => SupplyRequest::class, 'amount_column' => 'total_amount', 'category_column' => 'department'],
            'reimbursement' => ['model' => ReimbursementRequest::class, 'amount_column' => 'amount', 'category_column' => 'expense_type']
        ];

        foreach ($expenseTypes as $type => $config) {
            $query = $config['model']::where('status', 'approved')
                ->whereBetween('created_at', [$startDate, $endDate]);

            $periodSelect = match($viewOption) {
                'daily' => DB::raw('DATE(created_at) as period'),
                'weekly' => DB::raw('YEARWEEK(created_at) as period'),
                'monthly' => DB::raw('DATE_FORMAT(created_at, "%Y-%m") as period'),
                'annual' => DB::raw('YEAR(created_at) as period'),
                default => DB::raw('DATE(created_at) as period')
            };

            $periodGroupBy = match($viewOption) {
                'daily' => DB::raw('DATE(created_at)'),
                'weekly' => DB::raw('YEARWEEK(created_at)'),
                'monthly' => DB::raw('DATE_FORMAT(created_at, "%Y-%m")'),
                'annual' => DB::raw('YEAR(created_at)'),
                default => DB::raw('DATE(created_at)')
            };

            $categories = $query->select(
                $config['category_column'],
                $periodSelect,
                DB::raw('COUNT(*) as count'),
                DB::raw("SUM({$config['amount_column']}) as total"),
                DB::raw("AVG({$config['amount_column']}) as average"),
                DB::raw('COUNT(DISTINCT user_id) as unique_requestors'),
                DB::raw("MAX({$config['amount_column']}) as highest_amount"),
                DB::raw("MIN({$config['amount_column']}) as lowest_amount")
            )
            ->groupBy($config['category_column'], $periodGroupBy)
            ->get()
            ->groupBy($config['category_column']);

            $detailedStats[$type] = [
                'categories' => $categories,
                'total_amount' => $query->sum($config['amount_column']),
                'total_requests' => $query->count(),
                'unique_requestors' => $query->distinct('user_id')->count('user_id')
            ];

            if ($type === 'liquidation') {
                $detailedStats[$type]['total_cash_advance'] = $query->sum('cash_advance_amount');
                $detailedStats[$type]['total_refund'] = $query->sum('amount_to_refund');
                $detailedStats[$type]['total_reimburse'] = $query->sum('amount_to_reimburse');
            }

            // Add logging for debugging
            \Log::info("Processing {$type} expenses", [
                'categories_count' => $categories->count(),
                'total_amount' => $detailedStats[$type]['total_amount'],
                'total_requests' => $detailedStats[$type]['total_requests']
            ]);
        }

        // Get monthly trends
        $detailedStats['monthly_trends'] = $this->getMonthlyTrends($startDate, $endDate);

        return $detailedStats;
    }

    private function getMonthlyTrends($startDate, $endDate)
    {
        $trends = [];
        $currentDate = Carbon::parse($startDate)->startOfMonth();
        $endDate = Carbon::parse($endDate)->endOfMonth();

        while ($currentDate <= $endDate) {
            $monthKey = $currentDate->format('Y-m');
            
            $trends[$monthKey] = [
                'hr' => HrExpense::where('status', 'approved')
                    ->whereYear('created_at', $currentDate->year)
                    ->whereMonth('created_at', $currentDate->month)
                    ->avg('total_amount_requested') ?? 0,
                'operating' => OperatingExpense::where('status', 'approved')
                    ->whereYear('created_at', $currentDate->year)
                    ->whereMonth('created_at', $currentDate->month)
                    ->avg('total_amount') ?? 0,
                'liquidations' => Liquidation::where('status', 'approved')
                    ->whereYear('created_at', $currentDate->year)
                    ->whereMonth('created_at', $currentDate->month)
                    ->avg('total_amount') ?? 0,
                'reimbursements' => ReimbursementRequest::where('status', 'approved')
                    ->whereYear('created_at', $currentDate->year)
                    ->whereMonth('created_at', $currentDate->month)
                    ->avg('amount') ?? 0
            ];

            $currentDate->addMonth();
        }

        return $trends;
    }
}   