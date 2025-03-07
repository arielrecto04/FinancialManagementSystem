<?php

namespace App\Policies;

use App\Models\HrExpenseRequest;
use App\Models\User;

class HrExpenseRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['hr', 'admin']);
    }

    public function view(User $user, HrExpenseRequest $hrExpenseRequest): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->role === 'hr' && $user->id === $hrExpenseRequest->user_id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['hr', 'admin']);
    }

    public function update(User $user, HrExpenseRequest $hrExpenseRequest): bool
    {
        // Only admins can approve/reject requests
        if ($user->role === 'admin') {
            return true;
        }

        // HR users can only update their own pending requests
        return $user->role === 'hr' 
            && $user->id === $hrExpenseRequest->user_id 
            && $hrExpenseRequest->status === 'pending';
    }

    public function delete(User $user, HrExpenseRequest $hrExpenseRequest): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->role === 'hr' 
            && $user->id === $hrExpenseRequest->user_id 
            && $hrExpenseRequest->status === 'pending';
    }
} 