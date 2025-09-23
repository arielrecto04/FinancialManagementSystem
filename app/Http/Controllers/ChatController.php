<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Events\NewMessage;
use Illuminate\Support\Str;
use App\Models\Conversation;
use App\Models\Notification;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;
use App\Models\ConversationMessage;
use Illuminate\Support\Facades\Auth;
use App\Models\ConversationParticipant;

class ChatController extends Controller
{
    public function index()
    {

        $conversations = Conversation::with(['participants', 'messages.user', 'owner'])->where('owner_id', auth()->id())
            ->orWhereHas('participants', function ($query) {
                $query->where('user_id', auth()->id());
            })->paginate(10);
        return Inertia::render('Chat/ChatIndex', compact('conversations'));
    }

    public function storeMessage(Request $request)
    {


        $conversation = Conversation::findOrFail($request->conversation_id);

        $message = $conversation->messages()->create([
            'user_id' => auth()->id(),
            'message' => $request->message,
        ]);


        $message->load('user');



        $notifyUsers = $conversation->participants()->where('user_id', '!=', auth()->id())
            ->orWhere('user_id', '!=', $conversation->owner_id)->get();


        foreach ($notifyUsers as $user) {
            Notification::create([
                'user_id' => auth()->id(),
                'notify_to' => $user->id,
                'type' => 'new_message',
                'title' => 'New Message',
                'message' => "New message {$request->message}",
                'url' => route('chat.index')
            ]);
        }



        NewMessage::dispatch($message);


        return response()->json([
            'message' => $message,
        ]);
    }

    public function editMessage(Request $request, $id)
    {
        $message = ConversationMessage::findOrFail($id);

        $message->update([
            'message' => $request->message,
        ]);

        return response()->json([
            'message' => $message,
        ]);
    }

    public function deleteMessage($id)
    {
        $message = ConversationMessage::findOrFail($id);

        $message->delete();

        return response()->json([
            'message' => $message,
        ]);
    }

    public function search(Request $request)
    {
        $conversations = Conversation::with(['participants', 'messages.user', 'owner'])->where('name', 'like', '%' . $request->search . '%')
            ->orWhere('slug', 'like', '%' . $request->search . '%')
            ->orWhereHas('participants', function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            })
            ->where('owner_id', auth()->id())
            ->orWhereHas('participants', function ($query) use ($request) {
                $query->where('user_id', auth()->id());
            })
            ->get();


        return response()->json([
            'data' => $conversations,
        ]);
    }

    public function getConversation($id)
    {
        $conversation = Conversation::with(['participants', 'messages.user', 'owner'])->where('id', $id)
            ->orWhere('owner_id', $id)
            ->orWhereHas('participants', function ($query) use ($id) {
                $query->where('user_id', $id);
            })->latest()->first();


        $conversation = $conversation->with(['participants', 'messages.user', 'owner'])->latest()->first();



        return response()->json([
            'conversation' => $conversation,
        ]);
    }


    public function searchUser(Request $request)
    {
        $users = User::where('name', 'like', '%' . $request->search . '%')
            ->orWhere('email', 'like', '%' . $request->search . '%')
            ->get();

        return response()->json([
            'data' => $users,
        ]);
    }

    public function createConversation(Request $request)
    {
        try {
            $conversation = Conversation::create([
                'owner_id' => auth()->id(),
                'name' => $request->name,
                'slug' => Str::slug($request->name),
            ]);

            foreach ($request->participants as $participant) {
                ConversationParticipant::create([
                    'conversation_id' => $conversation->id,
                    'user_id' => $participant['id'],
                ]);
            }

            return response()->json([
                'conversation' => $conversation->with(['participants', 'messages.user', 'owner'])->latest()->first(),
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'error' => $th->getMessage(),
            ], 500);
        }
    }
}
