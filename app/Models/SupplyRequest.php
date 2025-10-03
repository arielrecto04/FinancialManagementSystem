<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\AuditLogTrait;

class SupplyRequest extends Model
{
    use AuditLogTrait;

    protected $fillable = [
        'id',
        'user_id',
        'request_number',
        'department',
        'status',
        'purpose',
        'date_needed',
        'items_json',
        'total_amount',
        'location',
        'remarks'
    ];

    protected $casts = [
        'items_json' => 'array',
        'date_needed' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function entryBudgetType(): void{
        $budgetTypeExpense = BudgetTypeExpense::where('expense_model', get_class($this))->first();

        if ($budgetTypeExpense) {
            Budget::create([
                'budget_type_id' => $budgetTypeExpense->budget_type_id,
                'name' => $this->request_number . ' - ' . $this->purpose . ' - ' . $this->created_at->format('Y-m-d') . ' - ' . 'Supply Request',
                'amount' => $budgetTypeExpense->is_expense ? $this->total_amount * -1 : $this->total_amount,
                'type' => $budgetTypeExpense->is_expense ? 'expense' : 'income',
            ]);
        }
    }
}
