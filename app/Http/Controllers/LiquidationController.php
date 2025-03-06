<?php

namespace App\Http\Controllers;

use App\Models\Liquidation;
use App\Models\LiquidationItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LiquidationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'department' => 'required|string',
            'date' => 'required|date',
            'particulars' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.category' => 'required|string|max:50',
            'items.*.description' => 'required|string',
            'items.*.amount' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'cash_advance_amount' => 'required|numeric|min:0',
            'amount_to_refund' => 'required|numeric|min:0',
            'amount_to_reimburse' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $liquidation = Liquidation::create([
                'user_id' => auth()->id(),
                'department' => $validated['department'],
                'date' => $validated['date'],
                'particulars' => $validated['particulars'],
                'total_amount' => $validated['total_amount'],
                'cash_advance_amount' => $validated['cash_advance_amount'],
                'amount_to_refund' => $validated['amount_to_refund'],
                'amount_to_reimburse' => $validated['amount_to_reimburse'],
                'status' => 'pending',
            ]);

            foreach ($validated['items'] as $item) {
                $liquidation->items()->create([
                    'category' => $item['category'],
                    'description' => $item['description'],
                    'amount' => $item['amount'],
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Liquidation request submitted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Liquidation submission error: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => 'Failed to submit liquidation request.'])
                ->withInput();
        }
    }

    public function index()
    {
        $liquidations = Liquidation::with(['items', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($liquidations);
    }

    public function show(Liquidation $liquidation)
    {
        return response()->json($liquidation->load(['items', 'user']));
    }

    public function update(Request $request, Liquidation $liquidation)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'remarks' => 'nullable|string',
        ]);

        $liquidation->update($validated);

        return redirect()->back()->with('success', 'Liquidation request updated successfully.');
    }
} 