<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $fillable = [
        'user_id',
        'user_name',
        'user_role',
        'action',
        'type',
        'description',
        'amount',
        'ip_address',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (isset($model->amount)) {
                $model->amount = number_format((float)$model->amount, 2, '.', '');
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 