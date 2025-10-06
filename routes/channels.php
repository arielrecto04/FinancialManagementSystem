<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('conversation.{conversation}', function ($user, Conversation $conversation) {
    // 1. Your authorization logic is correct.
    $is_authorized = $conversation->participants()->where('user_id', $user->id)->exists()
        || $conversation->owner_id === $user->id;

    // 2. If the user is authorized, return an array of their data.
    // This is what tells Laravel to treat it as a presence channel.
    if ($is_authorized) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'avatar' => $user->avatar,
        ];
    }

    // If you return null or false, authorization fails.
    return false;
});

Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
