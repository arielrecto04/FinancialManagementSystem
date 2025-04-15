<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\AuditLogTrait;

class OperatingExpense extends Model
{
    use HasFactory, AuditLogTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'requestor_name',
        'date_of_request',
        'expense_category',
        'description',
        'breakdown_of_expense',
        'total_amount',
        'expected_payment_date',
        'additional_comment',
        'status',
        'rejection_reason',
        'request_number'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_of_request' => 'date',
        'expected_payment_date' => 'date',
        'total_amount' => 'decimal:2',
    ];

    /**
     * Get the user that owns the operating expense request.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
