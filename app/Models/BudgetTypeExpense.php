<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BudgetTypeExpense extends Model
{
    protected $fillable = [
        'budget_type_id',
        'expense_model',
        'name',
        'is_expense'
    ];


    public function budgetType()
    {
        return $this->belongsTo(BudgetType::class);
    }
}
