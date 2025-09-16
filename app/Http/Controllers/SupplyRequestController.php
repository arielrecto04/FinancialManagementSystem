<?php

namespace App\Http\Controllers;

use App\Models\SupplyRequest;
use App\Models\AuditLog;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class SupplyRequestController extends Controller
{
    use AuthorizesRequests;

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
                'request_number' => 'required|string|unique:supply_requests',
                'location' => 'required|string',
            ]);

            $supplyRequest = new SupplyRequest($validated);
            $supplyRequest->user_id = auth()->id();
            $supplyRequest->status = 'pending';
            $supplyRequest->save();

            // Log the supply request creation
            AuditLog::create([
                'user_id' => auth()->id(),
                'user_name' => auth()->user()->name,
                'user_role' => auth()->user()->role,
                'type' => 'create',
                'action' => 'Supply Request Created',
                'description' => 'Created new supply request for ' . $validated['department'],
                'amount' => $validated['total_amount'],
                'ip_address' => $request->ip()
            ]);



            if($request->hasFile('attachments')) {
                $attachments = $request->file('attachments');

                foreach ($attachments as $attachment) {
                    $path = $attachment->storeAs('attachments', $attachment->getClientOriginalName(), 'public');
                    $supplyRequest->attachments()->create([
                        'file_path' => asset('storage/' . $path),
                        'file_name' => $attachment->getClientOriginalName(),
                        'file_type' => $attachment->getClientMimeType(),
                        'file_size' => $attachment->getSize(),
                        'file_extension' => $attachment->getClientOriginalExtension()
                    ]);
                }
            }

            // Send email notification to admin and superadmin users
            EmailService::sendNewRequestEmail(
                $validated,
                'Supply',
                auth()->user()->name,
                $validated['request_number']
            );


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

    public function updateStatus(Request $request, SupplyRequest $supplyRequest)
    {
        $this->authorize('update', $supplyRequest);

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'remarks' => 'required|string'
        ]);

        $supplyRequest->update([
            'status' => $validated['status'],
            'remarks' => $validated['remarks']
        ]);

        // Log the status change
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => $validated['status'] === 'approved' ? 'approve' : 'reject',
            'action' => 'Supply Request ' . ucfirst($validated['status']),
            'description' => 'Supply request ' . $validated['status'] . ' by ' . auth()->user()->name,
            'amount' => $supplyRequest->total_amount,
            'ip_address' => $request->ip()
        ]);

        return response()->json([
            'message' => 'Status updated successfully',
            'request' => $supplyRequest->load('user')
        ]);
    }

    public function destroy(SupplyRequest $supplyRequest)
    {
        $this->authorize('delete', $supplyRequest);

        // Store info for audit log
        $amount = $supplyRequest->total_amount;
        $department = $supplyRequest->department;

        $supplyRequest->delete();

        // Log the deletion
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => 'delete',
            'action' => 'Supply Request Deleted',
            'description' => 'Deleted supply request for ' . $department,
            'amount' => $amount,
            'ip_address' => request()->ip()
        ]);

        return redirect()->back()->with('success', 'Supply request deleted successfully.');
    }

    public function updateItems(Request $request, $requestNumber)
    {
        // Find the supply request by request_number
        $supplyRequest = SupplyRequest::where('request_number', $requestNumber)->firstOrFail();

        // Check if user is authorized to update this request
        if (!auth()->user()->role === 'superadmin' && $supplyRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending requests can be edited'
            ], 403);
        }

        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|numeric',
            'items.*.price' => 'required|numeric'
        ]);

        // Calculate total amount
        $totalAmount = collect($validated['items'])->reduce(function ($carry, $item) {
            return $carry + ($item['quantity'] * $item['price']);
        }, 0);

        $supplyRequest->update([
            'items_json' => $validated['items'],
            'total_amount' => $totalAmount
        ]);

        // Log the items update
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => 'update',
            'action' => 'Supply Request Items Updated',
            'description' => 'Updated items in supply request for ' . $supplyRequest->department,
            'amount' => $totalAmount,
            'ip_address' => $request->ip()
        ]);

        return response()->json([
            'message' => 'Items updated successfully',
            'request' => $supplyRequest->load('user')
        ]);
    }
}
