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

    // Add relationships
    public function supplyRequest()
    {
        return $this->hasOne(SupplyRequest::class);
    }

    public function reimbursement()
    {
        return $this->hasOne(ReimbursementRequest::class);
    }

    public function liquidation()
    {
        return $this->hasOne(Liquidation::class);
    }

    public function pettyCash()
    {
        return $this->hasOne(PettyCashRequest::class);
    }

    public function hrExpense()
    {
        return $this->hasOne(HrExpense::class);
    }

    public function operatingExpense()
    {
        return $this->hasOne(OperatingExpense::class);
    }
}