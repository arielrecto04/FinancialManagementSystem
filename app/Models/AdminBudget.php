<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminBudget extends Model
{
    protected $fillable = [
        'user_id',
        'total_budget',
        'remaining_budget',
        'used_budget'
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
} 