<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    protected $fillable = [
        'name',
        'amount',
        'budget_type_id',
        'type',
    ];


    public function budgetType()
    {
        return $this->belongsTo(BudgetType::class);
    }
}
