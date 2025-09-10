<?php

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\SSOController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HrExpenseController;
use App\Http\Controllers\PettyCashController;
use App\Http\Controllers\AccountingController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\AdminBudgetController;
use App\Http\Controllers\LiquidationController;
use App\Http\Controllers\JournalEntryController;
use App\Http\Controllers\SupplyRequestController;
use App\Http\Controllers\ChartOfAccountController;
use App\Http\Controllers\OperatingExpenseController;
use App\Http\Controllers\PettyCashRequestController;
use App\Http\Controllers\ReimbursementRequestController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard route should be at the top
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // User management routes (admin only)
    Route::middleware([\App\Http\Middleware\AdminMiddleware::class])->group(function () {
        Route::resource('users', UserController::class);

        // Admin budget routes
        Route::post('/admin-budgets', [AdminBudgetController::class, 'store'])->name('admin-budgets.store');
        Route::patch('/admin-budgets/{adminBudget}', [AdminBudgetController::class, 'update'])->name('admin-budgets.update');
        Route::delete('/admin-budgets/{adminBudget}', [AdminBudgetController::class, 'destroy'])->name('admin-budgets.destroy');

        // Add route to fetch budgets
        Route::get('/admin-budgets', [AdminBudgetController::class, 'index'])->name('admin-budgets.index');
    });

    // Statistics
    Route::get('/statistics', function () {
        return Inertia::render('Statistics');
    })->name('statistics');

    // Expenses
    Route::resource('expenses', ExpenseController::class);

    // Reports
    Route::get('/reports', [ReportsController::class, 'index'])->name('reports.index');
    Route::get('/reports/export-excel', [ReportsController::class, 'exportExcel'])->name('reports.export-excel');
    Route::get('/reports/export-pdf', [ReportsController::class, 'exportPDF'])->name('reports.export-pdf');
    Route::post('/reports/{id}/update-status', [ReportsController::class, 'updateStatus'])->name('reports.update-status');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/request-form', function (Request $request) {
        return Inertia::render('RequestForm', [
            'type' => $request->type
        ]);
    })->name('request.form');

    // Supply and Reimbursement routes
    Route::post('/request/supply', [SupplyRequestController::class, 'store'])->name('request.supply.store');
    Route::post('/request/reimbursement', [ReimbursementRequestController::class, 'store'])->name('request.reimbursement.store');

    // HR Expenses routes
    Route::post('/request/hr-expenses', [HrExpenseController::class, 'store'])->name('request.hrExpenses.store');
    Route::middleware(['can:viewAny,App\Models\HrExpense'])->group(function () {
        Route::get('/hr-expenses', [HrExpenseController::class, 'index'])->name('hr-expenses.index');
        Route::get('/hr-expenses/{hrExpense}', [HrExpenseController::class, 'show'])->name('hr-expenses.show');
        Route::patch('/hr-expenses/{hrExpense}/status', [HrExpenseController::class, 'updateStatus'])->name('hr-expenses.update-status');
        Route::delete('/hr-expenses/{hrExpense}', [HrExpenseController::class, 'destroy'])->name('hr-expenses.destroy');
    });
    Route::put('/hr-expenses/{requestNumber}/items', [HrExpenseController::class, 'updateItems'])->name('hr-expenses.update-items');

    // Operating Expenses routes
    Route::post('/request/operating-expenses', [OperatingExpenseController::class, 'store'])->name('request.operatingExpenses.store');
    Route::middleware(['can:viewAny,App\Models\OperatingExpense'])->group(function () {
        Route::get('/operating-expenses', [OperatingExpenseController::class, 'index'])->name('operating-expenses.index');
        Route::get('/operating-expenses/{operatingExpense}', [OperatingExpenseController::class, 'show'])->name('operating-expenses.show');
        Route::patch('/operating-expenses/{operatingExpense}/status', [OperatingExpenseController::class, 'updateStatus'])->name('operating-expenses.update-status');
        Route::delete('/operating-expenses/{operatingExpense}', [OperatingExpenseController::class, 'destroy'])->name('operating-expenses.destroy');
    });
    Route::put('/operating-expenses/{requestNumber}/items', [OperatingExpenseController::class, 'updateItems'])
        ->name('operating-expenses.update-items');

    // Liquidation routes
    Route::post('/request/liquidation', [LiquidationController::class, 'store'])->name('request.liquidation.store');
    Route::get('/liquidations', [LiquidationController::class, 'index'])->name('liquidations.index');
    Route::get('/liquidations/{liquidation}', [LiquidationController::class, 'show'])->name('liquidations.show');
    Route::patch('/liquidations/{liquidation}', [LiquidationController::class, 'update'])->name('liquidations.update');

    // Admin budget routes
    Route::get('/admin/budget', [ReportsController::class, 'getBudget'])->name('admin.budget');

    // Petty Cash routes
    Route::post('/petty-cash', [PettyCashController::class, 'store'])->name('petty-cash.store');

    // Petty Cash Approvals (superadmin only)
    Route::middleware(['auth'])->group(function () {
        Route::get('/petty-cash-requests/approvals', [PettyCashRequestController::class, 'approvals'])
            ->name('petty-cash-requests.approvals');
        Route::post('/petty-cash-requests/{id}/update-status', [PettyCashRequestController::class, 'updateStatus'])
            ->name('petty-cash-requests.update-status');
        Route::get('/petty-cash-requests/analytics', [PettyCashRequestController::class, 'analytics'])
            ->name('petty-cash-requests.analytics');
    });

    // Audit Logs routes (admin and superadmin only)
    Route::get('/audit-logs', [AuditLogController::class, 'index'])
        ->name('audit-logs.index');

    // Add this new route for updating supply request items
    Route::put('/supply-requests/{requestNumber}/items', [SupplyRequestController::class, 'updateItems'])
        ->name('supply-requests.update-items');


       Route::prefix('accounting')->as('accounting.')->group(function () {
        Route::get('/dashboard', [AccountingController::class, 'index'])->name('dashboard');
        Route::resource('journal', JournalController::class);
        Route::resource('journal-entry', JournalEntryController::class);
        Route::resource('chart-of-accounts', ChartOfAccountController::class);
       });
});

// SSO Callback route
Route::prefix('sso')->group(function () {
    Route::post('/authenticate', [SSOController::class, 'authenticate'])->name('sso.authenticate');
    Route::get('/verify', [SSOController::class, 'verify'])->name('sso.verify');
    Route::post('/logout', [SSOController::class, 'logout'])->name('sso.logout');
});


Route::middleware(['auth'])->group(function () {
    // Statistics routes
    Route::get('/statistics', [StatisticsController::class, 'index'])->name('statistics.index');
    Route::get('/statistics/data', [StatisticsController::class, 'getData'])->name('statistics.data');

    // Reports routes
    Route::get('/reports', [ReportsController::class, 'index'])->name('reports.index');
    Route::get('/reports/export-excel', [ReportsController::class, 'exportExcel'])->name('reports.export-excel');
    Route::get('/reports/export-pdf', [ReportsController::class, 'exportPDF'])->name('reports.export-pdf');
});

// Test route for email sending - accessible only in local environment
if (app()->environment('local')) {
    Route::get('/test-email', function () {
        try {
            $admin = \App\Models\User::where('role', 'admin')->orWhere('role', 'superadmin')->first();

            if (!$admin) {
                return 'No admin user found to send test email.';
            }

            \Illuminate\Support\Facades\Mail::send('emails.request-notification', [
                'adminName' => $admin->name,
                'requestData' => [
                    'department' => 'Test Department',
                    'purpose' => 'Testing email functionality',
                    'date_needed' => now()->format('Y-m-d'),
                    'total_amount' => 1000,
                ],
                'requestType' => 'Test',
                'requesterName' => 'System Test',
                'requestNumber' => 'TEST-' . rand(1000, 9999)
            ], function ($message) use ($admin) {
                $message->to($admin->email)
                    ->subject('Test Email from Financial Management System');
            });

            return 'Test email sent to ' . $admin->email . '. Please check your email or Mailtrap inbox.';
        } catch (\Exception $e) {
            return 'Error sending test email: ' . $e->getMessage();
        }
    });
}

require __DIR__ . '/auth.php';
