import React, { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"; // Assuming you use Heroicons

// This component will receive a single `comment` object and all the necessary functions as props.
export default function CommentThread({
    comment,
    auth,
    onReply,
    onEdit,
    onDelete,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [content, setContent] = useState(comment.content);

    const handleEdit = () => {
        // Call the onEdit function passed from the parent
        onEdit({ ...comment, content });
        setIsEditing(false); // Close the edit form
    };

    const handleReply = (replyContent) => {
        // Call the onReply function passed from the parent
        onReply({
            content: replyContent,
            commentable_id: comment.id,
            commentable_type: comment.model_path,
        });
        setIsReplying(false); // Close the reply form
    };

    return (
        <div className="relative pl-8">
            {/* The vertical thread line */}
            <span
                className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                aria-hidden="true"
            />

            <div className="flex relative items-start space-x-3">
                <img
                    className="flex-shrink-0 w-10 h-10 bg-gray-400 rounded-full"
                    src={
                        comment.user?.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${comment.user?.name}`
                    }
                    alt=""
                />
                <div className="flex-1 min-w-0">
                    <div>
                        <div className="text-sm">
                            <span className="font-medium text-gray-900">
                                {comment.user.name}
                            </span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                            Commented {comment.created_at}
                        </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                        {/* Show textarea if editing, otherwise show content */}
                        {isEditing ? (
                            <>
                                <div className="flex-1 gap-2">
                                    <textarea
                                        value={content}
                                        onChange={(e) =>
                                            setContent(e.target.value)
                                        }
                                        className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                        rows={3}
                                    />

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit()}
                                            className="text-xs font-semibold text-blue-600"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="text-xs font-semibold text-red-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p>{comment.content}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 items-center mt-2">
                        {isReplying ? (
                            <>
                                <div className="flex-1 gap-2">
                                    <textarea
                                        onChange={(e) =>
                                            setContent(e.target.value)
                                        }
                                        className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                        rows={3}
                                    />

                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleReply(content)}
                                            className="text-xs font-semibold text-blue-600"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() =>
                                                setIsReplying(!isReplying)
                                            }
                                            className="text-xs font-semibold text-red-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="text-xs font-semibold text-gray-600"
                            >
                                REPLY
                            </button>
                        )}
                        {auth.user.id === comment.user.id &&
                            !(isEditing || isReplying) && (
                                <>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        <PencilIcon
                                            className={`${
                                                isEditing
                                                    ? "text-red-600"
                                                    : "text-blue-600"
                                            } w-4 h-4`}
                                        />
                                    </button>
                                    <button onClick={() => onDelete(comment)}>
                                        <TrashIcon className="w-4 h-4 text-red-600" />
                                    </button>
                                </>
                            )}
                    </div>
                </div>
            </div>

            {/* ============== THE RECURSIVE PART ============== */}
            {/* If this comment has replies, render them by calling this SAME component for each reply. */}
            <div className="mt-4">
                {comment.replies &&
                    comment.replies.map((reply) => (
                        <CommentThread
                            key={reply.id}
                            comment={reply} // Pass the reply object down
                            auth={auth}
                            onReply={onReply}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
            </div>
        </div>
    );
}
