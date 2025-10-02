<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\AuditLogTrait;
use App\Models\Budget;

class PettyCashRequest extends Model
{
    use HasFactory, AuditLogTrait;

    protected $fillable = [
        'request_number',
        'user_id',
        'date_requested',
        'date_needed',
        'purpose',
        'amount',
        'department',
        'category',
        'description',
        'status',
        'remarks'
    ];

    protected $casts = [
        'date_requested' => 'date',
        'date_needed' => 'date',
        'amount' => 'decimal:2'
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

    public function entryBudgetType(): void
    {
        $budgetTypeExpense = BudgetTypeExpense::where('expense_model', get_class($this))->first();

        if ($budgetTypeExpense) {
            Budget::create([
                'name' => $this->request_number . ' - ' . $this->category . ' - ' . $this->purpose . ' - ' . $this->department,
                'amount' => $budgetTypeExpense->is_expense ? $this->amount * -1 : $this->amount,
                'budget_type_id' => $budgetTypeExpense->budget_type_id,
                'type' => $budgetTypeExpense->is_expense ? 'expense' : 'income',
            ]);
        }
    }
}
