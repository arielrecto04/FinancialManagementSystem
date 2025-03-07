<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PettyCashItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'petty_cash_request_id',
        'category',
        'description',
        'amount'
    ];

    protected $casts = [
        'amount' => 'decimal:2'
    ];

    public function request()
    {
        return $this->belongsTo(PettyCashRequest::class, 'petty_cash_request_id');
    }
} 