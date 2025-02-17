<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReimbursementRequest extends Model
{
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
        'remarks'
    ];

    protected $casts = [
        'expense_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 