<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $requestData;
    protected $requestType;
    protected $requesterName;
    protected $requestNumber;

    /**
     * Create a new notification instance.
     *
     * @param  array  $requestData
     * @param  string  $requestType
     * @param  string  $requesterName
     * @param  string  $requestNumber
     * @return void
     */
    public function __construct(array $requestData, string $requestType, string $requesterName, string $requestNumber)
    {
        $this->requestData = $requestData;
        $this->requestType = $requestType;
        $this->requesterName = $requesterName;
        $this->requestNumber = $requestNumber;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $messageBuilder = (new MailMessage)
            ->subject("New {$this->requestType} Request #{$this->requestNumber}")
            ->greeting("Hello {$notifiable->name},")
            ->line("A new {$this->requestType} request has been submitted by {$this->requesterName}.")
            ->line("Request Number: {$this->requestNumber}")
            ->line("Details:");

        // Add request details based on request type
        switch (strtolower($this->requestType)) {
            case 'supply':
                $messageBuilder->line("Department: {$this->requestData['department']}");
                $messageBuilder->line("Purpose: {$this->requestData['purpose']}");
                $messageBuilder->line("Date Needed: {$this->requestData['date_needed']}");
                $messageBuilder->line("Total Amount: " . number_format($this->requestData['total_amount'], 2));
                break;
            
            case 'reimbursement':
                $messageBuilder->line("Department: {$this->requestData['department']}");
                $messageBuilder->line("Expense Type: {$this->requestData['expense_type']}");
                $messageBuilder->line("Expense Date: {$this->requestData['expense_date']}");
                $messageBuilder->line("Amount: " . number_format($this->requestData['amount'], 2));
                $messageBuilder->line("Description: {$this->requestData['description']}");
                break;
            
            case 'liquidation':
                $messageBuilder->line("Department: {$this->requestData['department']}");
                $messageBuilder->line("Expense Type: {$this->requestData['expense_type']}");
                $messageBuilder->line("Date: {$this->requestData['date']}");
                $messageBuilder->line("Cash Advance: " . number_format($this->requestData['cash_advance_amount'], 2));
                $messageBuilder->line("Total Amount: " . number_format($this->requestData['total_amount'], 2));
                break;
                
            case 'petty cash':
                $messageBuilder->line("Department: {$this->requestData['department']}");
                $messageBuilder->line("Purpose: {$this->requestData['purpose']}");
                $messageBuilder->line("Date Needed: {$this->requestData['date_needed']}");
                $messageBuilder->line("Amount: " . number_format($this->requestData['amount'], 2));
                $messageBuilder->line("Category: {$this->requestData['category']}");
                break;
                
            case 'hr expenses':
                $messageBuilder->line("Date of Request: {$this->requestData['date_of_request']}");
                $messageBuilder->line("Expenses Category: {$this->requestData['expenses_category']}");
                $messageBuilder->line("Total Amount: " . number_format($this->requestData['total_amount_requested'], 2));
                $messageBuilder->line("Expected Payment Date: {$this->requestData['expected_payment_date']}");
                break;
                
            case 'operating expenses':
                $messageBuilder->line("Date of Request: {$this->requestData['date_of_request']}");
                $messageBuilder->line("Expense Category: {$this->requestData['expense_category']}");
                $messageBuilder->line("Total Amount: " . number_format($this->requestData['total_amount'], 2));
                $messageBuilder->line("Expected Payment Date: {$this->requestData['expected_payment_date']}");
                break;
        }
        
        return $messageBuilder
            ->action('View Request', url('/requests'))
            ->line('Please review this request at your earliest convenience.')
            ->salutation('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'request_type' => $this->requestType,
            'request_number' => $this->requestNumber,
            'requester_name' => $this->requesterName,
        ];
    }
} 