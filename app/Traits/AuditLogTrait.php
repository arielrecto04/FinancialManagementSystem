<?php

namespace App\Traits;

use App\Models\AuditLog;

trait AuditLogTrait
{
    protected static function bootAuditLogTrait()
    {
        // Log creation
        static::created(function ($model) {
            self::logAction($model, 'create', 'Created new ' . class_basename($model));
        });

        // Log status changes (approval/rejection)
        static::updated(function ($model) {
            if ($model->isDirty('status')) {
                $newStatus = $model->status;
                $action = $newStatus === 'approved' ? 'approve' : 'reject';
                $description = ucfirst($action) . 'd ' . class_basename($model) . ' #' . $model->id;
                self::logAction($model, $action, $description);
            }
        });
    }

    protected static function logAction($model, $type, $description)
    {
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'action' => class_basename($model) . ' ' . $type,
            'type' => $type,
            'description' => $description,
            'ip_address' => request()->ip()
        ]);
    }
} 