<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{

    public function userNotifications()
    {
        $notifications = Notification::where('notify_to', auth()->user()->id)->get();




        return Inertia::render('Notifications/NotificationIndex', [
            'notifications' => $notifications,
        ]);
    }
    public function listNotifications()
    {
        $notifications = Notification::where('notify_to', auth()->user()->id)->get();

        return response()->json($notifications);
    }
}
