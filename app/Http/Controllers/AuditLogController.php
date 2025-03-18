<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::with('user')
            ->orderBy('created_at', 'desc');

        // Filter by type if specified
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%");
                })
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
                        'user_name' => $log->user->name,
                        'user_role' => $log->user->role,
                        'action' => $log->action,
                        'type' => $log->type,
                        'description' => $log->description,
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