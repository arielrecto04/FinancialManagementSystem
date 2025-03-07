<?php

namespace App\Http\Controllers;

use App\Models\SupplyRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SupplyRequestController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'department' => 'required|string',
                'purpose' => 'required|string',
                'date_needed' => 'required|date',
                'items_json' => 'required|json',
                'total_amount' => 'required|numeric',
                'remarks' => 'nullable|string',
                'request_number' => 'required|string|unique:supply_requests'
            ]);

            $supplyRequest = new SupplyRequest($validated);
            $supplyRequest->user_id = auth()->id();
            $supplyRequest->status = 'pending';
            $supplyRequest->save();

            return redirect()->back()->with('success', 'Supply request submitted successfully!');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            \Log::error('Supply request submission error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Failed to submit supply request')
                ->withInput();
        }
    }
} 