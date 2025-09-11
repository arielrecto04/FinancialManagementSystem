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
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function replies()
    {
        return $this->morphMany(Comment::class, 'commentable')->with(['user', 'replies']);
    }

    public function getModelPathAttribute(): string
    {
        return self::class;
    }
}
