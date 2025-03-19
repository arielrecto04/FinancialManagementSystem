<?php

namespace App\Http\Controllers;

use App\Models\AdminBudget;
use App\Models\User;
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

            return redirect()->back()->with('success', 'Budget allocated successfully');
        } catch (\Exception $e) {
            Log::error('Failed to create budget:', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'Failed to create budget: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $budget = AdminBudget::findOrFail($id);
            
            $validated = $request->validate([
                'total_budget' => 'required|numeric|min:0'
            ]);

            Log::info('Received update data:', $validated);

            $updateData = [
                'total_budget' => $validated['total_budget']
            ];

            // If total_budget is being reset to 0, also reset used_budget
            if ($validated['total_budget'] == 0) {
                $updateData['used_budget'] = 0;
                $updateData['remaining_budget'] = 0;
            }

            Log::info('Updating budget:', [
                'budget_id' => $id,
                'old_data' => $budget->toArray(),
                'new_data' => $updateData
            ]);

            $result = $budget->update($updateData);
            
            if (!$result) {
                throw new \Exception('Failed to update budget');
            }

            $budget->refresh();
            Log::info('Updated budget:', $budget->toArray());

            return redirect()->back()->with('success', 'Budget updated successfully');
        } catch (\Exception $e) {
            Log::error('Failed to update budget:', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'Failed to update budget: ' . $e->getMessage()]);
        }
    }

    public function destroy(AdminBudget $budget)
    {
        try {
            $budget->delete();
            return redirect()->back()->with('success', 'Budget removed successfully');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to remove budget: ' . $e->getMessage()]);
        }
    }
} 