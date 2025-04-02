<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::orderBy('created_at', 'desc');

        // Filter by type if specified
        if ($request->has('type') && $request->type !== 'all') {
            if ($request->type === 'financial') {
                // For financial tab, show only budget-related activities
                $query->where(function ($q) {
                    $q->where('type', 'like', 'budget_%')
                      ->orWhere('action', 'like', '%Budget%')
                      ->orWhere('action', 'like', '%budget%');
                });
            } else {
                // For requests tab, exclude budget-related activities
                $query->where(function ($q) {
                    $q->where(function ($subQ) {
                        $subQ->where('type', 'not like', 'budget_%')
                             ->where('action', 'not like', '%Budget%')
                             ->where('action', 'not like', '%budget%');
                    });
                });
            }
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('user_name', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $logs = $query->paginate(10);

        return Inertia::render('AuditLogs', [
            'logs' => [
                'data' => collect($logs->items())->map(function ($log) {
                    return [
                        'id' => $log->id,
                        'user_name' => $log->user_name,
                        'user_role' => $log->user_role,
                        'action' => $log->action,
                        'type' => $log->type,
                        'description' => $log->description,
                        'amount' => $log->amount ? number_format((float)$log->amount, 2, '.', '') : null,
                        'ip_address' => $log->ip_address,
                        'created_at' => $log->created_at,
                    ];
                })->all(),
                'meta' => [
                    'current_page' => $logs->currentPage(),
                    'from' => $logs->firstItem(),
                    'last_page' => $logs->lastPage(),
                    'links' => $logs->linkCollection()->toArray(),
                    'path' => $logs->path(),
                    'per_page' => $logs->perPage(),
                    'to' => $logs->lastItem(),
                    'total' => $logs->total(),
                ],
            ]
        ]);
    }
} 