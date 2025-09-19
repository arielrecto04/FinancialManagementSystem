import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import RequestDetailsModal from "@/Components/RequestDetailsModal";
import CommentThread from "@/Components/CommentThread";
import axios from "axios";
import Swal from "sweetalert2";

const Pagination = ({ links }) => (
    <div className="flex justify-center mt-6 space-x-1">
        {links.map((link, index) => (
            <Link
                key={index}
                href={link.url}
                className={`px-4 py-2 border rounded-md text-sm ${
                    link.active
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700"
                } ${
                    !link.url
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50"
                }`}
                dangerouslySetInnerHTML={{ __html: link.label }}
            />
        ))}
    </div>
);

const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case "approved":
            return "bg-green-100 text-green-800";
        case "pending":
            return "bg-yellow-100 text-yellow-800";
        case "rejected":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export default function RequestHistory({ auth, requests, filters = {} }) {
    // State for managing the search and filter inputs
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");

    //#region State
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comment, setComment] = useState(null);
    //#endregion

    // This effect watches for changes in the search or status state.
    useEffect(() => {
        const debounce = setTimeout(() => {
            router.get(
                route("requests.history"),
                {
                    search: search,
                    status: status,
                },
                {
                    preserveState: true,
                    replace: true,
                }
            );
        }, 300); // Debounce to avoid excessive requests while typing

        return () => clearTimeout(debounce);
    }, [search, status]);

    //#region recursive function

    const addReplyToComment = (comments, newReply) => {
        return comments.map((comment) => {
            if (comment.id === newReply.commentable_id) {
                return {
                    ...comment,
                    replies: [...comment.replies, newReply],
                };
            }

            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: addReplyToComment(comment.replies, newReply),
                };
            }

            return comment;
        });
    };

    const removeReplyFromComment = (comments, replyId) => {
        const filteredComments = comments.filter(
            (comment) => comment.id !== replyId
        );
        return filteredComments.map((comment) => {
            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: removeReplyFromComment(comment.replies, replyId),
                };
            }

            return comment;
        });
    };


    const updateReplyToComment = (comments, updatedReply) => {
        return comments.map((comment) => {
            if (comment.id === updatedReply.commentable_id) {
                return {
                    ...comment,
                    replies: comment.replies.map((reply) =>
                        reply.id === updatedReply.id ? updatedReply : reply
                    ),
                };
            }

            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: updateReplyToComment(comment.replies, updatedReply),
                };
            }

            return comment;
        });
    };

    //#endregion

    //#region Functions
    const handleComment = async (_comment) => {
        try {
            console.log(_comment);
            const response = await axios.post("/comments", _comment);

            setComment(null);

            Swal.fire({
                icon: "success",
                title: "Comment added successfully!",
                showConfirmButton: false,
                timer: 1500,
            });

            if (selectedRequest.model === response.data.commentable_type) {
                setSelectedRequest({
                    ...selectedRequest,
                    comments: [...(selectedRequest.comments || []), response.data],
                });

                return;
            }

            setSelectedRequest((prev) => ({
                ...prev,
                comments: addReplyToComment(prev.comments || [], response.data),
            }));
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error adding comment!",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    const updateComment = async (comment) => {
        try {

            const response = await axios.put(route("comments.update", comment.id), comment);

            setComment(null);

            Swal.fire({
                icon: "success",
                title: "Comment updated successfully!",
                showConfirmButton: false,
                timer: 1500,
            });

            if (selectedRequest.model === response.data.commentable_type) {
                setSelectedRequest({
                    ...selectedRequest,
                    comments: selectedRequest.comments.map(
                        (comment) =>
                            comment.id === response.data.id ? response.data : comment
                    ),
                });

                return;
            }

            setSelectedRequest((prev) => ({
                ...prev,
                comments: updateReplyToComment(prev.comments, response.data),
            }));
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error updating comment!",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    const deleteComment = async (comment) => {
        try {
            await axios.delete(route("comments.destroy", comment.id));

            Swal.fire({
                icon: "success",
                title: "Comment deleted successfully!",
                showConfirmButton: false,
                timer: 1500,
            });

            if (selectedRequest.model === comment.commentable_type) {
                setSelectedRequest({
                    ...selectedRequest,
                    comments: selectedRequest.comments.filter(
                        (comment) => comment.id !== comment.id
                    ),
                });

                return;
            }

            setSelectedRequest((prev) => ({
                ...prev,
                comments: removeReplyFromComment(prev.comments, comment.id),
            }));
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error deleting comment!",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };
    //#endregion

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Request History" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-6 bg-white border-b border-gray-200">
                            {/* --- Page Header --- */}
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    Request History
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    A complete log of all your submitted
                                    requests. Total of {requests.total}{" "}
                                    record(s) found.
                                </p>
                            </div>

                            {/* --- Search and Filter Controls --- */}
                            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by ID or type..."
                                    className="px-4 py-2 w-full rounded-md border border-gray-300 md:w-1/2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="px-4 py-2 w-full rounded-md border border-gray-300 md:w-auto focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            {/* --- Requests Table --- */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Request ID
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Date Submitted
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {requests.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="py-16 text-center text-gray-500"
                                                >
                                                    No requests found for your
                                                    selected filters.
                                                </td>
                                            </tr>
                                        ) : (
                                            requests.data.map((request) => (
                                                <tr
                                                    onClick={() => {
                                                        console.log("Inspecting the request object:", request);
                                                        setSelectedRequest(
                                                            request
                                                        );
                                                        setIsModalOpen(true);
                                                    }}
                                                    key={`${request.type}-${request.id}`}
                                                    className="transition-colors duration-150 cursor-pointer hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                        #{request.id}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                        {request.type}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                        {new Date(
                                                            request.created_at
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                                                                request.status
                                                            )}`}
                                                        >
                                                            {request.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* --- Pagination --- */}
                            {requests.data.length > 0 && (
                                <Pagination links={requests.links} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Request Details Modal --- */}
            <RequestDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                request={selectedRequest}
            >
                <div className="p-2 space-y-6">
                    {/* Section Title */}

                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            Activity Feed
                        </h3>

                        {!comment && (
                            <button
                                onClick={() =>
                                    setComment({
                                        commentable_id: selectedRequest.id,
                                        commentable_type: selectedRequest.model,
                                        content: "",
                                    })
                                }
                                type="button"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Post Comment
                            </button>
                        )}
                    </div>

                    {selectedRequest?.comments.map((comment, commentidx) => (
                        <CommentThread
                            key={comment.id}
                            comment={comment}
                            auth={auth}
                            onReply={handleComment}
                            onEdit={updateComment}
                            onDelete={deleteComment}
                        />
                    ))}

                    {comment && (
                        <div className="flex gap-3 mt-6">
                            <img
                                src={
                                    auth.user?.avatarUrl ||
                                    `https://ui-avatars.com/api/?name=${auth.user.name}`
                                }
                                alt=""
                                className="flex-shrink-0 w-10 h-10 bg-gray-400 rounded-full"
                            />
                            <div className="w-full">
                                <textarea
                                    id="remarks"
                                    name="remarks"
                                    rows={3}
                                    value={comment.content}
                                    onChange={(e) =>
                                        setComment({
                                            ...comment,
                                            content: e.target.value,
                                        })
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="Add a comment..."
                                />
                                <div className="flex gap-2 justify-end mt-2">
                                    <button
                                        onClick={() => setComment(null)}
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md border border-transparent shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleComment(comment)}
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Post Comment
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </RequestDetailsModal>
        </AuthenticatedLayout>
    );
}
