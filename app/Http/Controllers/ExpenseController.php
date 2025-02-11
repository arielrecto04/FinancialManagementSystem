<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        $query = Expense::query()
            ->orderBy('date', 'desc');

        // Handle search filter
        if (request('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('requestNo', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        // Handle month filter
        if (request('month')) {
            $query->whereMonth('date', date('m', strtotime(request('month'))))
                ->whereYear('date', date('Y', strtotime(request('month'))));
        }

        return Inertia::render('Expenses', [
            'expenses' => $query->get(),
            'filters' => request()->only(['search', 'month']),
            'statistics' => [
                'total_expenses' => $query->where('type', 'Expense')->sum('amount'),
                'total_replenish' => $query->where('type', 'Replenish')->sum('amount'),
                'balance' => $query->where('type', 'Replenish')->sum('amount') -
                    $query->where('type', 'Expense')->sum('amount'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|in:Expense,Replenish',
            'description' => 'required|string|max:255',
            'requestNo' => 'required|string|max:50',
            'quantity' => 'required|numeric|min:0',
            'amount' => 'required|numeric|min:0',
            'mop' => 'required|string|in:CASH,CHECK,ONLINE',
            'reference' => 'required|string|max:100',
            'category' => 'required|string|max:50',
            'receipt' => 'nullable|image|max:2048',
        ]);

        try {
            if ($request->hasFile('receipt')) {
                $path = $request->file('receipt')->store('receipts', 'public');
                $validated['receipt'] = $path;
            }

            Expense::create($validated);

            return redirect()->back()->with('success', 'Expense created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create expense. Please try again.');
        }
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|in:Expense,Replenish',
            'description' => 'required|string|max:255',
            'requestNo' => 'required|string|max:50',
            'quantity' => 'required|numeric|min:0',
            'amount' => 'required|numeric|min:0',
            'mop' => 'required|string|in:CASH,CHECK,ONLINE',
            'reference' => 'required|string|max:100',
            'category' => 'required|string|max:50',
            'receipt' => 'nullable|image|max:2048',
        ]);

        try {
            if ($request->hasFile('receipt')) {
                if ($expense->receipt) {
                    Storage::disk('public')->delete($expense->receipt);
                }
                $path = $request->file('receipt')->store('receipts', 'public');
                $validated['receipt'] = $path;
            }

            $expense->update($validated);

            return redirect()->back()->with('success', 'Expense updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update expense. Please try again.');
        }
    }

    public function destroy(Expense $expense)
    {
        try {
            if ($expense->receipt) {
                Storage::disk('public')->delete($expense->receipt);
            }

            $expense->delete();

            return redirect()->back()->with('success', 'Expense deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete expense. Please try again.');
        }
    }
}