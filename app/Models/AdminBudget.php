<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class AdminBudget extends Model
{
    protected $fillable = [
        'user_id',
        'total_budget',
        'remaining_budget',
        'used_budget',
        'remarks'
    ];

    protected $casts = [
        'total_budget' => 'decimal:2',
        'remaining_budget' => 'decimal:2',
        'used_budget' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($budget) {
            Log::info('Before saving budget:', $budget->toArray());
            
            // When total_budget is being set to 0, also reset used_budget
            if ($budget->isDirty('total_budget') && $budget->total_budget == 0) {
                $budget->used_budget = 0;
                $budget->remaining_budget = 0;
            }
            // When only total_budget changes, update remaining_budget
            else if ($budget->isDirty('total_budget')) {
                $budget->remaining_budget = $budget->total_budget - $budget->used_budget;
            }
            
            Log::info('After saving budget:', $budget->toArray());
        });
    }
} 