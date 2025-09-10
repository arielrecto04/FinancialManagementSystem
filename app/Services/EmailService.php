<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailService
{
    /**
     * Send direct emails to all admin and superadmin users about a new request
     *
     * @param array $requestData
     * @param string $requestType
     * @param string $requesterName
     * @param string $requestNumber
     * @return void
     */
    public static function sendNewRequestEmail(array $requestData, string $requestType, string $requesterName, string $requestNumber)
    {
        try {
            // Log the start of the email sending process
            Log::info('Starting email notification process', [
                'request_type' => $requestType,
                'request_number' => $requestNumber,
                'requester' => $requesterName
            ]);

            // Get all admin and superadmin users
            $adminUsers = User::whereIn('role', ['admin', 'superadmin'])->get();

            Log::info('Found admin users', [
                'count' => $adminUsers->count(),
                'emails' => $adminUsers->pluck('email')->toArray()
            ]);

            if ($adminUsers->isEmpty()) {
                Log::warning('No admin users found to notify about new request');
                return;
            }

            foreach ($adminUsers as $admin) {
                Log::info('Preparing to send email to admin', [
                    'admin_name' => $admin->name,
                    'admin_email' => $admin->email
                ]);

                try {
                    // Using the HTML email template with view()
                    Mail::send('emails.request-notification', [
                        'adminName' => $admin->name,
                        'requestData' => $requestData,
                        'requestType' => $requestType,
                        'requesterName' => $requesterName,
                        'requestNumber' => $requestNumber
                    ], function ($message) use ($admin, $requestType, $requestNumber) {
                        $message->to($admin->email)
                            ->subject("New {$requestType} Request #{$requestNumber}");
                    });

                    Log::info("New {$requestType} request email sent to admin", [
                        'admin_name' => $admin->name,
                        'admin_email' => $admin->email,
                        'request_number' => $requestNumber
                    ]);
                } catch (\Exception $mailError) {
                    Log::error("Failed to send email to {$admin->email}", [
                        'error' => $mailError->getMessage(),
                        'trace' => $mailError->getTraceAsString()
                    ]);
                }
            }

            Log::info('Email notification process completed', [
                'request_type' => $requestType,
                'request_number' => $requestNumber
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send request email', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_type' => $requestType,
                'request_number' => $requestNumber
            ]);
        }
    }
}
