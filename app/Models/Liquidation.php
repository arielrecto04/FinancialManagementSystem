<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\AuditLogTrait;

class Liquidation extends Model
{
    use AuditLogTrait;

    protected $fillable = [
        'user_id',
        'department',
        'date',
        'particulars',
        'total_amount',
        'cash_advance_amount',
        'amount_to_refund',
        'amount_to_reimburse',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'total_amount' => 'decimal:2',
        'cash_advance_amount' => 'decimal:2',
        'amount_to_refund' => 'decimal:2',
        'amount_to_reimburse' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(LiquidationItem::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 