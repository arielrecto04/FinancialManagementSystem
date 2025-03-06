<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LiquidationItem extends Model
{
    protected $fillable = [
        'liquidation_id',
        'category',
        'description',
        'amount',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function liquidation(): BelongsTo
    {
        return $this->belongsTo(Liquidation::class);
    }
} 