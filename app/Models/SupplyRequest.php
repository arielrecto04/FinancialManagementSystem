<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\AuditLogTrait;

class SupplyRequest extends Model
{
    use AuditLogTrait;

    protected $fillable = [
        'id',
        'user_id',
        'request_number',
        'department',
        'status',
        'purpose',
        'date_needed',
        'items_json',
        'total_amount',
        'location',
        'remarks'
    ];

    protected $casts = [
        'items_json' => 'array',
        'date_needed' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}
