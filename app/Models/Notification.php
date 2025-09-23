<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'type',
        'title',
        'message',
        'read',
        'url',
        'notify_to',
        'user_id',
    ];



    public function notifyTo()
    {
        return $this->belongsTo(User::class, 'notify_to');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
