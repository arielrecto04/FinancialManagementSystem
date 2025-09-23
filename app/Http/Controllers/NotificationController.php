<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{

    public function userNotifications()
    {
        $notifications = Notification::where('notify_to', auth()->user()->id)->latest()->get();




        return Inertia::render('Notifications/NotificationIndex', [
            'notifications' => $notifications,
        ]);
    }
    public function listNotifications()
    {
        $notifications = Notification::where('notify_to', auth()->user()->id)->latest()->get();

        return response()->json($notifications);
    }

    public function markAsRead($id)
    {
        $notification = Notification::where('notify_to', auth()->user()->id)->where('id', $id)->firstOrFail();
        $notification->update([
            'read' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read',
            'notification' => $notification
        ]);
    }

    public function markAllAsRead()
    {
        $notifications = Notification::where('notify_to', auth()->user()->id)->get();

        foreach ($notifications as $notification) {
            $notification->update([
                'read' => true,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read',
            'notifications' => collect($notifications)->sortByDesc('created_at'),
        ]);
    }
}
