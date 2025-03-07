<?php

namespace App\Http\Controllers;

use App\Models\ReimbursementRequest;
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
} 