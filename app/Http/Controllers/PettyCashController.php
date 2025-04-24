<?php

namespace App\Http\Controllers;

use App\Models\PettyCashRequest;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PettyCashController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'dateNeeded' => 'required|date',
            'purpose' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string',
            'description' => 'required|string',
            'department' => 'required|string',
        ]);

        try {
            // Generate request number
            $requestNumber = 'PC-' . Str::random(8);

            // Create petty cash request
            $pettyCashRequest = PettyCashRequest::create([
                'request_number' => $requestNumber,
                'user_id' => auth()->id(),
                'date_requested' => $validated['date'],
                'date_needed' => $validated['dateNeeded'],
                'purpose' => $validated['purpose'],
                'amount' => $validated['amount'],
                'department' => $validated['department'],
                'category' => $validated['category'],
                'description' => $validated['description'],
                'status' => 'pending'
            ]);
            
            // Send email notification to admin and superadmin users
            EmailService::sendNewRequestEmail(
                [
                    'date' => $validated['date'],
                    'date_needed' => $validated['dateNeeded'],
                    'purpose' => $validated['purpose'],
                    'amount' => $validated['amount'],
                    'department' => $validated['department'],
                    'category' => $validated['category'],
                    'description' => $validated['description'],
                ],
                'Petty Cash',
                auth()->user()->name,
                $requestNumber
            );

            return redirect()->back()->with('success', 'Petty cash request created successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create petty cash request: ' . $e->getMessage());
        }
    }
} 