<?php

namespace App\Http\Controllers;

use App\Models\PettyCashRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PettyCashRequestController extends Controller
{
    public function index()
    {
        $requests = PettyCashRequest::with(['user', 'approver'])
            ->when(!Auth::user()->hasRole('admin'), function ($query) {
                return $query->where('user_id', Auth::id());
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('PettyCashRequests/Index', [
            'requests' => $requests
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'purpose' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_requested' => 'required|date',
            'date_needed' => 'required|date',
            'department' => 'required|string',
            'category' => 'required|string',
            'receipt' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $pettyCashRequest = new PettyCashRequest([
            'user_id' => Auth::id(),
            'request_number' => 'PCR-' . date('Y') . '-' . Str::random(8),
            'date_requested' => $validated['date_requested'],
            'date_needed' => $validated['date_needed'],
            'amount' => $validated['amount'],
            'purpose' => $validated['purpose'],
            'description' => $validated['description'] ?? null,
            'department' => $validated['department'],
            'category' => $validated['category'],
            'status' => 'pending',
        ]);

        if ($request->hasFile('receipt')) {
            $path = $request->file('receipt')->store('receipts', 'public');
            $pettyCashRequest->receipt_path = $path;
        }

        $pettyCashRequest->save();

        return redirect()->back()->with('success', 'Petty cash request submitted successfully.');
    }

    public function show(PettyCashRequest $pettyCashRequest)
    {
        $this->authorize('view', $pettyCashRequest);

        return Inertia::render('PettyCashRequests/Show', [
            'request' => $pettyCashRequest->load(['user', 'approver'])
        ]);
    }

    public function update(Request $request, PettyCashRequest $pettyCashRequest)
    {
        $this->authorize('update', $pettyCashRequest);

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|nullable|string',
        ]);

        $pettyCashRequest->update([
            'status' => $validated['status'],
            'rejection_reason' => $validated['rejection_reason'] ?? null,
            'approved_by' => $validated['status'] === 'approved' ? Auth::id() : null,
            'approved_at' => $validated['status'] === 'approved' ? now() : null,
        ]);

        return redirect()->back()->with('success', 'Petty cash request updated successfully.');
    }

    public function destroy(PettyCashRequest $pettyCashRequest)
    {
        $this->authorize('delete', $pettyCashRequest);
        
        $pettyCashRequest->delete();

        return redirect()->back()->with('success', 'Petty cash request deleted successfully.');
    }

    public function updateStatus(Request $request, $id)
    {
        if (!auth()->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $pettyCashRequest = PettyCashRequest::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'remarks' => 'required|string'
        ]);

        $pettyCashRequest->update([
            'status' => $validated['status'],
            'remarks' => $validated['remarks']
        ]);

        return response()->json([
            'message' => 'Status updated successfully',
            'request' => $pettyCashRequest->load('user')
        ]);
    }

    public function approvals(Request $request)
    {
        if (!auth()->user() || auth()->user()->role !== 'superadmin') {
            abort(403, 'Unauthorized action.');
        }

        $status = $request->get('status', 'all');
        $sortOrder = $request->get('sortOrder', 'newest');

        $query = PettyCashRequest::with('user')
            ->when($status !== 'all', function ($query) use ($status) {
                return $query->where('status', $status);
            });

        if ($sortOrder === 'newest') {
            $query->latest();
        } else {
            $query->oldest();
        }

        $requests = $query->paginate(10)
            ->withQueryString();

        return Inertia::render('PettyCashRequests/Approvals', [
            'requests' => $requests,
            'filters' => [
                'status' => $status,
                'sortOrder' => $sortOrder
            ]
        ]);
    }

    public function getPettyCashStatistics()
    {
        $total = PettyCashRequest::count();
        $pending = PettyCashRequest::where('status', 'pending')->count();
        $completed = PettyCashRequest::whereIn('status', ['approved', 'rejected'])->count();

        return [
            'pettyCashRequests' => $total,
            'pendingPettyCashRequests' => $pending,
            'completedPettyCashRequests' => $completed
        ];
    }
} 