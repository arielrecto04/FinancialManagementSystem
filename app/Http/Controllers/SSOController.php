<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Encryption\Encrypter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class SSOController extends Controller
{
    public function authenticate(Request $request)
    {
        $userData = $request->validate([
            'user' => 'required|array',
            'token' => 'required|string'
        ]);

        // Determine role based on SSO roles
        $ssoRoles = $userData['user']['roles'] ?? [];
        $role = $this->determineUserRole($ssoRoles);

        // Create or update user
        $user = User::firstOrCreate(
            ['email' => $userData['user']['email']],
            [
                'name' => $userData['user']['name'],
                'password' => Hash::make(str()->random(32)),
                'role' => $role
            ]
        );

        // Login user using session
        Auth::login($user);

        return redirect()->route('dashboard');
    }

    private function determineUserRole(array $ssoRoles): string
    {
        // Convert roles array to lowercase for case-insensitive comparison
        $roles = array_map('strtolower', $ssoRoles);

        if (in_array('admin', $roles)) {
            return 'admin';
        }

        if (in_array('hr', $roles) && in_array('employee', $roles)) {
            return 'hr';
        }

        if (in_array('employee', $roles)) {
            return 'user';
        }

        // Default role if none of the conditions match
        return 'user';
    }

    public function verify(Request $request)
    {
        if (Auth::check()) {
            return response()->json(Auth::user());
        }
        return response()->json(['error' => 'Unauthenticated'], 401);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    public function ssoLogin(Request $request)
    {
        $token = $request->query('token');



        if (!$token) {
            return redirect()->route('login')->withErrors(['error' => 'SSO token is missing.']);
        }

        $encrypter = new Encrypter(env('SSO_SECRET_KEY'), config('app.cipher'));


        $dedodeToken = json_decode($encrypter->decrypt($token));




        if ($dedodeToken->expiry < now()->timestamp) {
            return redirect()->route('login')->withErrors(['error' => 'SSO token has expired.']);
        }


        if (env('VITE_SSO_CLIENT_ID') != $dedodeToken->client_id && env('SSO_SECRET_KEY') != $dedodeToken->client_secret) {
            return redirect()->route('login')->withErrors(['error' => 'Invalid SSO client ID or secret key.']);
        }

        $localUser = User::updateOrCreate(
            [
                'email' => $dedodeToken->email,
                'name' => $dedodeToken->name,
                'role' => $dedodeToken->roles[0]->name
            ],
            [
                'email' => $dedodeToken->email,
                'name' => $dedodeToken->name,
                'role' => $dedodeToken->roles[0]->name,
                'password' => Hash::make(str()->random(32)),
                'external_id' => $dedodeToken->user_id
            ]
        );

        Auth::login($localUser);

        return redirect()->route('dashboard');
    }
}
