<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::query();

        // Apply search filter
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('user_name', 'like', "%{$searchTerm}%")
                  ->orWhere('action', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Apply type filter
        if ($request->has('filter') && $request->input('filter') !== 'all') {
            $query->where('type', $request->input('filter'));
        }

        // Apply tab filter and paginate based on tab
        if ($request->has('tab')) {
            if ($request->input('tab') === 'financial') {
                $query->where(function ($q) {
                    $q->where('type', 'like', 'budget_%')
                      ->orWhere('action', 'like', '%budget%');
                });
            } else {
                $query->where(function ($q) {
                    $q->where('type', 'not like', 'budget_%')
                      ->where('action', 'not like', '%budget%');
                });
            }
        } else {
            // Default to request logs if no tab specified
            $query->where(function ($q) {
                $q->where('type', 'not like', 'budget_%')
                  ->where('action', 'not like', '%budget%');
            });
        }

        $logs = $query->latest()->paginate(10);

        return Inertia::render('AuditLogs', [
            'logs' => [
                'data' => $logs->items(),
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
            ],
        ]);
    }
} 