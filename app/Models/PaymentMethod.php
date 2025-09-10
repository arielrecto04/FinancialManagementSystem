<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $fillable = [
        'name',
        'outstanding_account_id',
        'type',
        'is_active',
        'currency',
        'journal_id',
    ];


    public function journal()
    {
        return $this->belongsTo(Journal::class);
    }

    public function outstandingAccount()
    {
        return $this->belongsTo(Account::class, 'outstanding_account_id');
    }
}
