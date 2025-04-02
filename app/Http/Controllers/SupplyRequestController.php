<?php

namespace App\Http\Controllers;

use App\Models\SupplyRequest;
use App\Models\AuditLog;
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
} 