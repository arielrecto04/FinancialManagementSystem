<?php

namespace App\Policies;

use App\Models\HrExpense;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class HrExpensePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'hr';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, HrExpense $hrExpense): bool
    {
        return $user->role === 'admin' || $user->id === $hrExpense->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'hr';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, HrExpense $hrExpense): bool
    {
        // Only admins can update status, or the owner if it's still pending
        if ($user->role === 'admin') {
            return true;
        }
        
        return $user->id === $hrExpense->user_id && $hrExpense->status === 'pending';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, HrExpense $hrExpense): bool
    {
        // Only admins can delete any request, or the owner if it's still pending
        if ($user->role === 'admin') {
            return true;
        }
        
        return $user->id === $hrExpense->user_id && $hrExpense->status === 'pending';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, HrExpense $hrExpense): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, HrExpense $hrExpense): bool
    {
        return false;
    }
}
