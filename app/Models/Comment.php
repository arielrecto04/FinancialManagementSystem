<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{


    protected $fillable = [
        'content',
        'user_id',
        'commentable_id',
        'commentable_type',
        'is_viewed',
    ];

    protected $appends = [
        'model_path',
        'total_unread_comments'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function replies()
    {
        return $this->morphMany(Comment::class, 'commentable')->with(['user', 'replies']);
    }


    public function getTotalUnreadCommentsAttribute()
    {
        return $this->replies()->where('is_viewed', false)->count();
    }


    public function getModelPathAttribute(): string
    {
        return self::class;
    }
}
