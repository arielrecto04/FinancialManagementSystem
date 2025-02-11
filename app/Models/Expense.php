<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'type',
        'description',
        'requestNo',
        'quantity',
        'amount',
        'mop',
        'reference',
        'category',
        'receipt',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
        'quantity' => 'decimal:2',
    ];
}