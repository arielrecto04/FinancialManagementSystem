<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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


        $conversation = Conversation::where('id', $request->conversation_id)->orWhere('owner_id', auth()->id())->orWhereHas('participants', function ($query) use ($request) {
            $query->where('user_id', $request->user_id);
        })->firstOrCreate([
            'owner_id' => auth()->id(),
            'name' => User::find(auth()->id())->name,
            'slug' => Str::slug(User::find(auth()->id())->name),
        ]);



        if ($conversation->participants()->where('user_id', $request->user_id)->count() == 0) {
            ConversationParticipant::create([
                'conversation_id' => $conversation->id,
                'user_id' => $request->participant_id,
            ]);
        }

        $message = $conversation->messages()->create([
            'user_id' => auth()->id(),
            'message' => $request->message,
        ]);



        return response()->json([
            'message' => $message,
        ]);
    }


    public function search(Request $request)
    {
        $conversations = Conversation::where('name', 'like', '%' . $request->search . '%')
            ->orWhere('slug', 'like', '%' . $request->search . '%')
            ->orWhereHas('participants', function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            })
            ->get();

        $user = User::where('name', 'like', '%' . $request->search . '%')->get();


        $data = collect($conversations)->merge($user)
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'slug' => $item->slug ??  Str::slug($item->name),
                    'image' => $item->image ??  'https://ui-avatars.com/api/?name=' . str_replace(' ', '+', $item->name) . '&background=6b7280&color=fff',
                    'status' => $item->status ?? 'online',
                    'model' => $item instanceof Conversation ? 'conversation' : 'user',
                    'user' => $item instanceof Conversation ? $item->participants()->first()->user : [
                        'id' => $item->id,
                        'name' => $item->name,
                        'slug' => $item->slug ??  Str::slug($item->name),
                        'image' => $item->image ??  'https://ui-avatars.com/api/?name=' . str_replace(' ', '+', $item->name) . '&background=6b7280&color=fff',
                        'status' => $item->status ?? 'online',
                    ],
                ];
            });



        return response()->json([
            'data' => $data,
        ]);
    }
}
