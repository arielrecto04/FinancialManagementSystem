<?php

namespace App\Http\Controllers;

use App\Models\ReimbursementRequest;
use App\Models\AuditLog;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ReimbursementRequestController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'department' => 'required|string',
                'expense_date' => 'required|date',
                'expense_type' => 'required|string',
                'amount' => 'required|numeric',
                'description' => 'required|string',
                'receipt' => 'required|file|mimes:pdf,jpg,jpeg,png',
                'remarks' => 'nullable|string',
                'request_number' => 'required|string|unique:reimbursement_requests'
            ]);

            $reimbursement = new ReimbursementRequest($request->except('receipt'));
            $reimbursement->user_id = auth()->id();
            $reimbursement->status = 'pending';
            
            if ($request->hasFile('receipt')) {
                $reimbursement->receipt_path = $request->file('receipt')->store('receipts', 'public');
            }
            
            $reimbursement->save();

            // Log the reimbursement request creation
            AuditLog::create([
                'user_id' => auth()->id(),
                'user_name' => auth()->user()->name,
                'user_role' => auth()->user()->role,
                'type' => 'create',
                'action' => 'Reimbursement Request Created',
                'description' => 'Created new reimbursement request for ' . $validated['expense_type'],
                'amount' => $validated['amount'],
                'ip_address' => $request->ip()
            ]);
            
            // Send email notification to admin and superadmin users
            EmailService::sendNewRequestEmail(
                [
                    'department' => $validated['department'],
                    'expense_date' => $validated['expense_date'],
                    'expense_type' => $validated['expense_type'],
                    'amount' => $validated['amount'],
                    'description' => $validated['description'],
                    'remarks' => $validated['remarks'] ?? '',
                ],
                'Reimbursement',
                auth()->user()->name,
                $validated['request_number']
            );

            return redirect()->back()->with('success', 'Reimbursement request submitted successfully!');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            \Log::error('Reimbursement submission error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Failed to submit reimbursement request')
                ->withInput();
        }
    }

    public function updateStatus(Request $request, ReimbursementRequest $reimbursement)
    {
        $this->authorize('update', $reimbursement);
        
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'remarks' => 'required|string'
        ]);

        $reimbursement->update([
            'status' => $validated['status'],
            'remarks' => $validated['remarks']
        ]);

        // Log the status change
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => $validated['status'] === 'approved' ? 'approve' : 'reject',
            'action' => 'Reimbursement Request ' . ucfirst($validated['status']),
            'description' => 'Reimbursement request ' . $validated['status'] . ' by ' . auth()->user()->name,
            'amount' => $reimbursement->amount,
            'ip_address' => $request->ip()
        ]);

        return redirect()->back()->with('success', 'Reimbursement request status updated successfully.');
    }

    public function destroy(ReimbursementRequest $reimbursement)
    {
        $this->authorize('delete', $reimbursement);
        
        // Store info for audit log
        $amount = $reimbursement->amount;
        $type = $reimbursement->expense_type;
        
        $reimbursement->delete();

        // Log the deletion
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => 'delete',
            'action' => 'Reimbursement Request Deleted',
            'description' => 'Deleted reimbursement request for ' . $type,
            'amount' => $amount,
            'ip_address' => request()->ip()
        ]);

        return redirect()->back()->with('success', 'Reimbursement request deleted successfully.');
    }
} 