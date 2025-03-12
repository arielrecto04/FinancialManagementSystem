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

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        
        // Get budget information
        $adminBudget = AdminBudget::first();
        
        // Get all approved requests for different time periods
        $summaryData = [
            'daily' => $this->getDailySummary(),
            'weekly' => $this->getWeeklySummary(),
            'monthly' => $this->getMonthlySummary(),
            'annual' => $this->getAnnualSummary(),
        ];

        // Get monthly data for chart
        $monthlyData = $this->getMonthlyChartData();

        // Get highest expenses
        $highestExpenses = $this->getHighestExpenses();

        // Get recent logs
        $recentLogs = $this->getRecentLogs();

        // Get budget overview
        $budgetOverview = [
            'total_budget' => $adminBudget->total_budget ?? 0,
            'remaining_budget' => $adminBudget->remaining_budget ?? 0,
            'used_budget' => $adminBudget->used_budget ?? 0,
            'budget_percentage' => $adminBudget->total_budget > 0 
                ? ($adminBudget->used_budget / $adminBudget->total_budget) * 100 
                : 0
        ];

        // Get request statistics
        $requestStats = [
            'total_requests' => $this->getTotalRequests(),
            'pending_requests' => $this->getPendingRequests(),
            'approved_requests' => $this->getApprovedRequests(),
            'rejected_requests' => $this->getRejectedRequests()
        ];

        return Inertia::render('Dashboard', [
            'summaryData' => $summaryData,
            'monthlyData' => $monthlyData,
            'highestExpenses' => $highestExpenses,
            'recentLogs' => $recentLogs,
            'budgetOverview' => $budgetOverview,
            'requestStats' => $requestStats
        ]);
    }

    private function getDailySummary()
    {
        $today = Carbon::today();
        
        return [
            'supply' => SupplyRequest::whereDate('created_at', $today)
                ->where('status', 'approved')
                ->sum('total_amount'),
            'reimbursement' => ReimbursementRequest::whereDate('created_at', $today)
                ->where('status', 'approved')
                ->sum('amount'),
            'liquidation' => Liquidation::whereDate('created_at', $today)
                ->where('status', 'approved')
                ->sum('total_amount'),
            'hr' => HrExpense::whereDate('created_at', $today)
                ->where('status', 'approved')
                ->sum('total_amount_requested'),
            'operating' => OperatingExpense::whereDate('created_at', $today)
                ->where('status', 'approved')
                ->sum('total_amount')
        ];
    }

    // Similar methods for weekly, monthly, and annual summaries...

    private function getHighestExpenses()
    {
        $expenses = collect([]);
        
        // Get top expenses from each type
        $expenses = $expenses->merge(
            SupplyRequest::where('status', 'approved')
                ->orderBy('total_amount', 'desc')
                ->take(5)
                ->get()
                ->map(fn($req) => [
                    'type' => 'Supply Request',
                    'amount' => $req->total_amount,
                    'date' => $req->created_at,
                    'description' => $req->description
                ])
        );

        // Add other request types similarly...

        return $expenses->sortByDesc('amount')->take(5);
    }

    private function getRecentLogs()
    {
        $logs = collect([]);
        
        // Merge all request types and get recent ones
        $logs = $logs->merge(
            SupplyRequest::with('user')
                ->latest()
                ->take(10)
                ->get()
                ->map(fn($req) => [
                    'type' => 'Supply Request',
                    'amount' => $req->total_amount,
                    'date' => $req->created_at,
                    'status' => $req->status,
                    'user' => $req->user->name,
                    'description' => $req->description
                ])
        );

        // Add other request types similarly...

        return $logs->sortByDesc('date')->take(10);
    }
} 