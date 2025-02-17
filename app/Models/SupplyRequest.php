<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupplyRequest extends Model
{
    protected $fillable = [
        'user_id',
        'request_number',
        'department',
        'status',
        'purpose',
        'date_needed',
        'items_json',
        'total_amount',
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
} 