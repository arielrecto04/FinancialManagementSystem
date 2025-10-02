<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\AuditLogTrait;
use App\Models\Budget;
use App\Models\BudgetTypeExpense;

class Liquidation extends Model
{
    use AuditLogTrait;

    protected $fillable = [
        'user_id',
        'department',
        'date',
        'expense_type',
        'particulars',
        'total_amount',
        'cash_advance_amount',
        'amount_to_refund',
        'amount_to_reimburse',
        'request_number',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'total_amount' => 'decimal:2',
        'cash_advance_amount' => 'decimal:2',
        'amount_to_refund' => 'decimal:2',
        'amount_to_reimburse' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(LiquidationItem::class);
    }

    public function user(): BelongsTo
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
                'name' => $this->request_number . ' - ' . $this->expense_type . ' - ' . $this->particulars . ' - ' . $this->department,
                'amount' => $budgetTypeExpense->is_expense ? $this->total_amount * -1 : $this->total_amount,
                'budget_type_id' => $budgetTypeExpense->budget_type_id,
                'type' => $budgetTypeExpense->is_expense ? 'expense' : 'income',
            ]);
        }
    }
}
