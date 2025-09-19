<?php

namespace App\Events;

use App\Models\ConversationMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NewMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public ConversationMessage $message)
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [];

        // $channels[] = new PrivateChannel('conversation.' . $this->message->conversation_id);

        $participants = $this->message->conversation->participants;

        // FIX #1: Pass $channels into the function's scope with `use (&$channels)`
        // The '&' makes it a reference, so we are modifying the original array.
        $participants->each(function ($participant) use (&$channels) {
            if ($participant->id != $this->message->user_id) {
                // FIX #2: Just add to the array, don't use `return`
                $channels[] = new PrivateChannel('user.' . $participant->id);
            }
        });

        if($this->message->user_id != $this->message->conversation->owner_id){
            $channels[] = new PrivateChannel('user.' . $this->message->conversation->owner_id);
        }


        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'new-message';
    }

    public function broadcastWith(): array
    {
        return [
            'message' => $this->message,
        ];
    }
}
