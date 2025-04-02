<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Models\AdminBudget;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::paginate(10),
            'budgets' => AdminBudget::with('user')->paginate(10)
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create', [
            'roles' => ['user', 'admin', 'hr', 'superadmin']
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|in:user,admin,hr,superadmin'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // Log user creation
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => 'create',
            'action' => 'User Created',
            'description' => 'Created new user: ' . $user->name . ' (' . $user->role . ')',
            'ip_address' => $request->ip()
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully');
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => ['user', 'admin', 'hr', 'superadmin']
        ]);
    }

    public function update(Request $request, User $user)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string|in:user,admin,hr,superadmin'
        ];

        // Only validate password if it's provided
        if ($request->filled('password')) {
            $rules['password'] = ['required', 'confirmed', Rules\Password::defaults()];
        }

        $validated = $request->validate($rules);

        // Store old values for audit log
        $oldName = $user->name;
        $oldRole = $user->role;

        // Update user data
        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ];

        // Only update password if it's provided
        if ($request->filled('password')) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $user->update($userData);

        // Log user update
        $changes = [];
        if ($oldName !== $user->name) $changes[] = 'name';
        if ($oldRole !== $user->role) $changes[] = 'role';
        if ($request->filled('password')) $changes[] = 'password';

        if (!empty($changes)) {
            AuditLog::create([
                'user_id' => auth()->id(),
                'user_name' => auth()->user()->name,
                'user_role' => auth()->user()->role,
                'type' => 'update',
                'action' => 'User Updated',
                'description' => 'Updated user ' . $oldName . ': ' . implode(', ', $changes),
                'ip_address' => $request->ip()
            ]);
        }

        return redirect()->route('users.index')->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        // Prevent deleting your own account
        if ($user->id === auth()->id()) {
            return redirect()->route('users.index')->with('error', 'You cannot delete your own account');
        }

        // Store user info for audit log
        $userName = $user->name;
        $userRole = $user->role;

        $user->delete();

        // Log user deletion
        AuditLog::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'user_role' => auth()->user()->role,
            'type' => 'delete',
            'action' => 'User Deleted',
            'description' => 'Deleted user: ' . $userName . ' (' . $userRole . ')',
            'ip_address' => request()->ip()
        ]);

        return redirect()->route('users.index')->with('success', 'User deleted successfully');
    }
} 