<?php

use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SupplyRequestController;
use App\Http\Controllers\ReimbursementRequestController;
use App\Http\Controllers\LiquidationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

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

    Route::get('/request-form', function () {
        return Inertia::render('RequestForm');
    })->name('request.form');

    // Supply and Reimbursement routes
    Route::post('/request/supply', [SupplyRequestController::class, 'store'])->name('request.supply.store');
    Route::post('/request/reimbursement', [ReimbursementRequestController::class, 'store'])->name('request.reimbursement.store');
    
    // Liquidation routes
    Route::post('/request/liquidation', [LiquidationController::class, 'store'])->name('request.liquidation.store');
    Route::get('/liquidations', [LiquidationController::class, 'index'])->name('liquidations.index');
    Route::get('/liquidations/{liquidation}', [LiquidationController::class, 'show'])->name('liquidations.show');
    Route::patch('/liquidations/{liquidation}', [LiquidationController::class, 'update'])->name('liquidations.update');

    // Admin budget routes
    Route::get('/admin/budget', [ReportsController::class, 'getBudget'])->name('admin.budget');
});

Route::get('/reports/export-excel', [ReportsController::class, 'exportExcel'])->name('reports.export-excel');
Route::get('/reports/export-pdf', [ReportsController::class, 'exportPDF'])->name('reports.export-pdf');

require __DIR__ . '/auth.php';
