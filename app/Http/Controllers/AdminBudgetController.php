<?php

namespace App\Http\Controllers;

use App\Models\AdminBudget;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminBudgetController extends Controller
{
    public function index()
    {
        return AdminBudget::with('user')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'total_budget' => 'required|numeric|min:0'
        ]);

        try {
            // Check if budget already exists
            $existingBudget = AdminBudget::where('user_id', $validated['user_id'])->first();
            if ($existingBudget) {
                return redirect()->back()->withErrors(['error' => 'Budget already exists for this user']);
            }

            $budget = AdminBudget::create([
                'user_id' => $validated['user_id'],
                'total_budget' => $validated['total_budget'],
                'remaining_budget' => $validated['total_budget'],
                'used_budget' => 0
            ]);

            // Log the budget creation
            AuditLog::create([
                'user_id' => auth()->id(),
                'user_name' => auth()->user()->name,
                'user_role' => auth()->user()->role,
                'type' => 'budget_update',
                'action' => 'Budget Created',
                'description' => 'Initial budget allocation for ' . $budget->user->name,
                'amount' => floatval($validated['total_budget']),
                'ip_address' => $request->ip()
            ]);

            return redirect()->back()->with('success', 'Budget allocated successfully');
        } catch (\Exception $e) {
            Log::error('Failed to create budget:', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'Failed to create budget: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            
            $budget = AdminBudget::findOrFail($id);
            
            $validated = $request->validate([
                'total_budget' => 'required|numeric|min:0',
                'replenishment_amount' => 'nullable|numeric|min:0'
            ]);

            $updateData = [];
            $logType = '';
            $logAction = '';
            $logDescription = '';
            $logAmount = 0;

            // If replenishment amount is provided, add it to current total
            if (!empty($validated['replenishment_amount'])) {
                $newTotal = $budget->total_budget + floatval($validated['replenishment_amount']);
                $updateData['total_budget'] = $newTotal;
                $updateData['remaining_budget'] = $newTotal - $budget->used_budget;
                $logType = 'budget_replenish';
                $logAction = 'Budget Replenished';
                $logDescription = 'Budget replenished for ' . $budget->user->name;
                $logAmount = floatval($validated['replenishment_amount']);
            } else {
                // Otherwise, use the provided total_budget
                $updateData['total_budget'] = floatval($validated['total_budget']);
                $updateData['remaining_budget'] = floatval($validated['total_budget']) - $budget->used_budget;
                $logType = 'budget_update';
                $logAction = 'Budget Updated';
                $logDescription = 'Budget updated for ' . $budget->user->name;
                $logAmount = floatval($validated['total_budget']);
            }

            // If total_budget is being reset to 0, also reset used_budget
            if ($updateData['total_budget'] == 0) {
                $updateData['used_budget'] = 0;
                $updateData['remaining_budget'] = 0;
                $logType = 'budget_reset';
                $logAction = 'Budget Reset';
                $logDescription = 'Budget reset to 0 for ' . $budget->user->name;
                $logAmount = 0;
            }

            // Update the budget
            $budget->update($updateData);

            // Create the audit log
            AuditLog::create([
                'user_id' => auth()->id(),
                'user_name' => auth()->user()->name,
                'user_role' => auth()->user()->role,
                'type' => $logType,
                'action' => $logAction,
                'description' => $logDescription,
                'amount' => $logAmount,
                'ip_address' => $request->ip()
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Budget updated successfully');
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Failed to update budget:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->withErrors(['error' => 'Failed to update budget: ' . $e->getMessage()]);
        }
    }

    public function destroy(AdminBudget $budget)
    {
        try {
            // Store budget info for audit log
            $budgetAmount = $budget->total_budget;
            $userName = $budget->user->name;

            $budget->delete();

            // Log budget deletion
            AuditLog::create([
                'user_id' => auth()->id(),
                'user_name' => auth()->user()->name,
                'user_role' => auth()->user()->role,
                'type' => 'budget_delete',
                'action' => 'Budget Deleted',
                'description' => 'Deleted budget for user: ' . $userName,
                'amount' => $budgetAmount,
                'ip_address' => request()->ip()
            ]);

            return redirect()->back()->with('success', 'Budget removed successfully');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to remove budget: ' . $e->getMessage()]);
        }
    }
} 