<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PettyCashRequest extends Model
{
    use HasFactory;

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
}