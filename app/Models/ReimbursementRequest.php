<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\AuditLogTrait;

class ReimbursementRequest extends Model
{
    use AuditLogTrait;

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
        'remarks',
        'expense_items'
    ];

    protected $casts = [
        'expense_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
