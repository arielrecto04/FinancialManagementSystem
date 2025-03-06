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
        $request->validate([
            'department' => 'required|string',
            'purpose' => 'required|string',
            'date_needed' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.unit' => 'required|string',
            'items.*.price' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'remarks' => 'nullable|string',
        ]);

        // Create the supply request
        $supplyRequest = SupplyRequest::create([
            'user_id' => auth()->id(),
            'request_number' => 'SR-' . Str::random(8),
            'department' => $request->department,
            'status' => 'pending',
            'purpose' => $request->purpose,
            'date_needed' => $request->date_needed,
            'items_json' => json_encode($request->items),
            'total_amount' => $request->total_amount,
            'remarks' => $request->remarks,
        ]);

        return redirect()->route('dashboard')->with('success', 'Supply request submitted successfully!');
    }
} 