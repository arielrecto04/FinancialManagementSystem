<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\NewRequestNotification;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Send email notifications to all admin and superadmin users about a new request
     *
     * @param array $requestData
     * @param string $requestType
     * @param string $requesterName
     * @param string $requestNumber
     * @return void
     */
    public static function sendNewRequestNotification(array $requestData, string $requestType, string $requesterName, string $requestNumber)
    {
        try {
            // Get all admin and superadmin users
            $adminUsers = User::whereIn('role', ['admin', 'superadmin'])->get();
            
            if ($adminUsers->isEmpty()) {
                Log::warning('No admin users found to notify about new request');
                return;
            }
            
            // Create notification instance
            $notification = new NewRequestNotification(
                $requestData,
                $requestType,
                $requesterName,
                $requestNumber
            );
            
            // Send notification to each admin
            foreach ($adminUsers as $admin) {
                $admin->notify($notification);
                Log::info("New {$requestType} request notification sent to admin", [
                    'admin_name' => $admin->name,
                    'admin_email' => $admin->email,
                    'request_number' => $requestNumber
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to send request notification', [
                'error' => $e->getMessage(),
                'request_type' => $requestType,
                'request_number' => $requestNumber
            ]);
        }
    }
} 