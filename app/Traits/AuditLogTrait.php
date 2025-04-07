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
                
                // For petty cash and budget-related items, pass true as fourth param to mark as financial
                $isFinancial = in_array(class_basename($model), ['PettyCashRequest', 'Budget', 'BudgetAllocation']);
                self::logAction($model, $action, $description, $isFinancial);
            }
        });
    }

    protected static function logAction($model, $type, $description, $isFinancial = false)
    {
        $logData = [
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'action' => class_basename($model) . ' ' . $type,
            'type' => $isFinancial ? 'budget_' . $type : $type,
            'description' => $description,
            'ip_address' => request()->ip()
        ];
        
        // Add amount for financial transactions if it exists in the model
        if ($isFinancial && isset($model->amount)) {
            $logData['amount'] = $model->amount;
        }
        
        // For petty cash approvals, get amount from request if available
        if ($isFinancial && class_basename($model) === 'PettyCashRequest' && $type === 'approve' && request()->has('amount')) {
            $logData['amount'] = request()->amount;
        }
        
        AuditLog::create($logData); 
    }
} 