<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BudgetType extends Model
{
    protected $fillable = [
        'name',
    ];

    public function budgets()
    {
        return $this->hasMany(Budget::class);
    }

    public function BudgetTypeExpenses()
    {
        return $this->morphMany(BudgetTypeExpense::class, 'expenseable');
    }
}
