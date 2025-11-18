<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AuditLog;
use App\Models\Attachment;
use App\Models\Liquidation;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Services\EmailService;
use App\Models\LiquidationItem;
use Illuminate\Support\Facades\DB;
use App\Actions\GenerateRequestNumber;

class LiquidationController extends Controller
{

    public function __construct(
        private GenerateRequestNumber $generateRequestNumber,
    ) {}

    public function store(Request $request)
    {


        $validated = $request->validate([
            'department' => 'required|string',
            'date' => 'required|date',
            'expense_type' => 'required|string',
            'particulars' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.category' => 'required|string|max:50',
            'items.*.description' => 'required|string',
            'items.*.amount' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'cash_advance_amount' => 'required|numeric|min:0',
            'amount_to_refund' => 'required|numeric|min:0',
            'amount_to_reimburse' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $liquidation = Liquidation::create([
                'user_id' => auth()->id(),
                'request_number' => $this->generateRequestNumber->handle('liquidation', new Liquidation()),
                'department' => $validated['department'],
                'date' => $validated['date'],
                'expense_type' => $validated['expense_type'],
                'particulars' => $validated['particulars'],
                'total_amount' => $validated['total_amount'],
                'cash_advance_amount' => $validated['cash_advance_amount'],
                'amount_to_refund' => $validated['amount_to_refund'],
                'amount_to_reimburse' => $validated['amount_to_reimburse'],
                'status' => 'pending',
            ]);

            foreach ($validated['items'] as $item) {
                $liquidation->items()->create([
                    'category' => $item['category'],
                    'description' => $item['description'],
                    'amount' => $item['amount'],
                ]);
            }



            if ($request->hasFile('receipt')) {
                foreach ($request->file('receipt') as $file) {
                    $path = $file->storeAs('receipts', $file->getClientOriginalName(), 'public');
                    Attachment::create([
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => asset('storage/' . $path),
                        'file_type' => $file->getClientOriginalExtension(),
                        'file_size' => $file->getSize(),
                        'file_extension' => $file->getClientOriginalExtension(),
                        'attachable_id' => $liquidation->id,
                        'attachable_type' => get_class($liquidation),
                    ]);
                }
            }



            $notifyUsers = User::where('role', 'admin')->orWhere('role', 'superadmin')->get();



            foreach ($notifyUsers as $user) {
                Notification::create([
                    'user_id' => auth()->id(),
                    'notify_to' => $user->id,
                    'type' => 'new_liquidation_request',
                    'title' => 'New Liquidation Request',
                    'message' => 'A new liquidation request has been submitted',
                    'url' => route('reports.index')
                ]);
            }

            // Log the liquidation request creation
            AuditLog::create([
                'user_id' => auth()->id(),
                'user_name' => auth()->user()->name,
                'user_role' => auth()->user()->role,
                'type' => 'create',
                'action' => 'Liquidation Request Created',
                'description' => 'Created new liquidation request for ' . $validated['expense_type'],
                'amount' => $validated['total_amount'],
                'ip_address' => $request->ip()
            ]);

            // Send email notification to admin and superadmin users
            EmailService::sendNewRequestEmail(
                [
                    'department' => $validated['department'],
                    'date' => $validated['date'],
                    'expense_type' => $validated['expense_type'],
                    'particulars' => $validated['particulars'],
                    'total_amount' => $validated['total_amount'],
                    'cash_advance_amount' => $validated['cash_advance_amount'],
                    'amount_to_refund' => $validated['amount_to_refund'],
                    'amount_to_reimburse' => $validated['amount_to_reimburse'],
                ],
                'Liquidation',
                auth()->user()->name,
                'LR-' . $liquidation->id // Generate a request number for the notification
            );

            DB::commit();

            return redirect()->back()->with('success', 'Liquidation request submitted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Liquidation submission error: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => 'Failed to submit liquidation request.'])
                ->withInput();
        }
    }

    public function index()
    {
        $liquidations = Liquidation::with(['items', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($liquidations);
    }

    public function show(Liquidation $liquidation)
    {
        return response()->json($liquidation->load(['items', 'user']));
    }

    public function update(Request $request, Liquidation $liquidation)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'remarks' => 'nullable|string',
        ]);

        try {
            $liquidation->update($validated);

            // Log the status change
            AuditLog::create([
                'user_id' => auth()->id(),
                'user_name' => auth()->user()->name,
                'user_role' => auth()->user()->role,
                'type' => $validated['status'] === 'approved' ? 'approve' : 'reject',
                'action' => 'Liquidation Request ' . ucfirst($validated['status']),
                'description' => 'Liquidation request ' . $validated['status'] . ' by ' . auth()->user()->name,
                'amount' => $liquidation->total_amount,
                'ip_address' => $request->ip()
            ]);

            return redirect()->back()->with('success', 'Liquidation request updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Failed to update liquidation request.'])
                ->withInput();
        }
    }

    public function destroy(Liquidation $liquidation)
    {
        $this->authorize('delete', $liquidation);

        // Store info for audit log
        $amount = $liquidation->total_amount;
        $type = $liquidation->expense_type;

        $liquidation->delete();

        // Log the deletion
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => 'delete',
            'action' => 'Liquidation Request Deleted',
            'description' => 'Deleted liquidation request for ' . $type,
            'amount' => $amount,
            'ip_address' => request()->ip()
        ]);

        return redirect()->back()->with('success', 'Liquidation request deleted successfully.');
    }
}
