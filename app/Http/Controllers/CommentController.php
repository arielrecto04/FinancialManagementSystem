<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required',
            'commentable_id' => 'required',
            'commentable_type' => 'required',
        ]);



        $comment = Comment::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        return response()->json($comment->load('user'));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'content' => 'required',
        ]);

        $comment = Comment::where('user_id', auth()->id())->where('id', $id)->firstOrFail();
        $comment->update($validated);

        return response()->json($comment->load('user'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $comment = Comment::where('user_id', auth()->id())->where('id', $id)->firstOrFail();
        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully',
        ]);
    }

    public function markAsRead(Request $request, $type, $id){

        $modelMap = [
            'supplyrequest' => \App\Models\SupplyRequest::class,
            'liquidation' => \App\Models\Liquidation::class,
            'reimbursement' => \App\Models\ReimbursementRequest::class,
            'hrexpense' => \App\Models\HrExpense::class,
            'operatingexpense' => \App\Models\OperatingExpense::class,
        ];
        $modelClass = $modelMap[$type] ?? null;

        if (!$modelClass) {
            return response()->json(['message' => 'Invalid request type.'], 400);
        }

        $comments = Comment::where('commentable_type', $modelClass)
            ->where('commentable_id', $id)
            ->get();

        function updateNestedComments($comments)
        {
            foreach ($comments as $comment) {
                $comment->update(['is_viewed' => true]);
                if ($comment->replies()->exists()) {
                    updateNestedComments($comment->replies);
                }
            }
        }

        // Start the recursive update.
        updateNestedComments($comments);

        return response()->json(['message' => 'Comments marked as read.']);
    
    }

}
