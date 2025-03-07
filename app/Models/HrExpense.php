<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HrExpense extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'requestor_name',
        'date_of_request',
        'expenses_category',
        'description_of_expenses',
        'breakdown_of_expense',
        'total_amount_requested',
        'expected_payment_date',
        'additional_comment',
        'status',
        'rejection_reason',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_of_request' => 'date',
        'expected_payment_date' => 'date',
        'total_amount_requested' => 'decimal:2',
    ];

    /**
     * Get the user that owns the HR expense request.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
