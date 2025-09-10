<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    protected $fillable = [
        'name',
        'account_id',
        'suspense_account_id',
        'code',
        'type',
        'is_active',
        'currency',
    ];

    public function account()
    {
        return $this->belongsTo(ChartOfAccount::class);
    }

    public function suspenseAccount()
    {
        return $this->belongsTo(ChartOfAccount::class, 'suspense_account_id');
    }

    public function paymentMethods()
    {
        return $this->hasMany(PaymentMethod::class);
    }

    public function journalEntries()
    {
        return $this->hasMany(JournalEntry::class);
    }
}
