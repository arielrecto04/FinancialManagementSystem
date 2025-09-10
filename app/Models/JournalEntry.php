<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalEntry extends Model
{
    protected $fillable = [
        'reference',
        'accounting_date',
        'journal_id',
        'internal_reference',
    ];

    public function journal()
    {
        return $this->belongsTo(Journal::class);
    }

    public function journalItems()
    {
        return $this->hasMany(JournalItem::class);
    }
}
