<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\AuditLogTrait;

class ReimbursementRequest extends Model
{
    use AuditLogTrait;

    protected $fillable = [
        'user_id',
        'request_number',
        'department',
        'status',
        'expense_date',
        'expense_type',
        'amount',
        'description',
        'receipt_path',
        'remarks',
        'expense_items'
    ];

    protected $casts = [
        'expense_date' => 'date',
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
        $budgetTypeExpense =   BudgetTypeExpense::where('expense_model', get_class($this))->first();


        if ($budgetTypeExpense) {
            Budget::create([
                'budget_type_id' => $budgetTypeExpense->budget_type_id,
                'name' => $this->request_number . ' - ' . $this->expense_type . ' - ' . $this->created_at->format('Y-m-d') . ' - ' . 'Reimbursement',
                'amount' => $budgetTypeExpense->is_expense ? $this->amount * -1 : $this->amount,
                'type' => $budgetTypeExpense->is_expense ? 'expense' : 'income',
            ]);
        }
    }
}
