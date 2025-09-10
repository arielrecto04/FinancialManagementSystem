<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChartOfAccount extends Model
{
    protected $fillable = [
        'name',
        'code',
        'type',
        'allow_reconcile',
        'is_active',
        'currency',
    ];


    public function journalItems()
    {
        return $this->hasMany(JournalItem::class);
    }

    public function journal()
    {
        return $this->belongsTo(Journal::class);
    }
}
