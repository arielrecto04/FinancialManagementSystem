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
        $request->validate([
            'department' => 'required|string',
            'expense_date' => 'required|date',
            'expense_type' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string',
            'receipt' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'remarks' => 'nullable|string',
        ]);

        // Handle file upload
        $receiptPath = $request->file('receipt')->store('receipts', 'public');

        // Create reimbursement request
        $reimbursementRequest = ReimbursementRequest::create([
            'user_id' => auth()->id(),
            'request_number' => 'RR-' . Str::random(8),
            'department' => $request->department,
            'status' => 'pending',
            'expense_date' => $request->expense_date,
            'expense_type' => $request->expense_type,
            'amount' => $request->amount,
            'description' => $request->description,
            'receipt_path' => $receiptPath,
            'remarks' => $request->remarks,
        ]);

        return redirect()->route('dashboard')->with('success', 'Reimbursement request submitted successfully!');
    }
} 