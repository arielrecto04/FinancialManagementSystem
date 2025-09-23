<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Str;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Services\EmailService;
use App\Models\PettyCashRequest;
use Illuminate\Support\Facades\DB;
use App\Actions\GenerateRequestNumber;

class PettyCashController extends Controller
{

    public function __construct(public GenerateRequestNumber $generateRequestNumber){}

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
            $requestNumber = $this->generateRequestNumber->handle('petty_cash_request', new PettyCashRequest());

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


            $superAdmin = User::where('role', 'superadmin')->first();

            if ($superAdmin) {


                Notification::create([
                    'user_id' => auth()->id(),
                    'notify_to' => $superAdmin->id,
                    'type' => 'new_petty_cash_request',
                    'title' => 'New Petty Cash Request',
                    'message' => 'A new petty cash request has been submitted',
                    'url' => route('petty-cash-requests.approvals')
                ]);
            }

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
