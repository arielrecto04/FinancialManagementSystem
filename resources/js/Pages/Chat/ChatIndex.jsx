import { useState, useRef, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal";
import { TrashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

// Mock data for conversations
const mockConversations = [
    {
        id: 1,
        user: {
            name: "John Doe",
            avatar: "https://ui-avatars.com/api/?name=John+Doe&background=4f46e5&color=fff",
            status: "online",
            role: "Finance Manager",
        },
        lastMessage: "Can you review the budget report?",
        time: "10:30 AM",
        unread: 2,
        isOnline: true,
    },
    {
        id: 2,
        user: {
            name: "Jane Smith",
            avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff",
            status: "online",
            role: "Department Head",
        },
        lastMessage: "The meeting is scheduled for tomorrow",
        time: "Yesterday",
        unread: 0,
        isOnline: true,
    },
    {
        id: 3,
        user: {
            name: "Alex Johnson",
            avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=3b82f6&color=fff",
            status: "offline",
            role: "CFO",
        },
        lastMessage: "Please send me the Q3 financials",
        time: "Monday",
        unread: 0,
        isOnline: false,
    },
    {
        id: 4,
        user: {
            name: "Sarah Williams",
            avatar: "https://ui-avatars.com/api/?name=Sarah+Williams&background=ec4899&color=fff",
            status: "offline",
            role: "Accountant",
        },
        lastMessage: "I've updated the expense report",
        time: "9/12/2023",
        unread: 0,
        isOnline: false,
    },
];

// Mock messages for the selected conversation
const mockMessages = [
    {
        id: 1,
        sender: {
            id: 2,
            name: "Jane Smith",
            avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff",
        },
        message: "Hi there! How can I help you today?",
        time: "10:00 AM",
        isOwn: false,
    },
    {
        id: 2,
        sender: {
            id: 1,
            name: "You",
            avatar: "https://ui-avatars.com/api/?name=You&background=6b7280&color=fff",
        },
        message:
            "I need to discuss the budget allocation for the upcoming project.",
        time: "10:02 AM",
        isOwn: true,
    },
    {
        id: 3,
        sender: {
            id: 2,
            name: "Jane Smith",
            avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff",
        },
        message:
            "Sure, I can help with that. What specific aspects would you like to discuss?",
        time: "10:05 AM",
        isOwn: false,
    },
];

export default function ChatIndex({ auth, conversations }) {
    //#region State
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [conversationData, setConversationData] = useState([
        ...conversations.data,
    ]);
    const messagesEndRef = useRef(null);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [open, setOpen] = useState(false);
    const [searchUser, setSearchUser] = useState("");
    const [searchUserResults, setSearchUserResults] = useState([]);

    const [conversationForm, setConversationForm] = useState({
        name: "",
        slug: "",
        participants: [],
    });

    const audio = new Audio("/messenger.mp3");

    console.log(conversationData, auth);
    //#endregion

    //#region useEffect
    useEffect(() => {
        // In a real app, you would fetch messages for the selected conversation
        if (selectedConversation) {
            console.log(
                selectedConversation?.messages,
                "selectedConversation?.messages"
            );
            setMessages(selectedConversation?.messages);
        } else {
            setMessages([]);
        }
        scrollToBottom();
    }, [selectedConversation]);

    useEffect(() => {
        if (search === "") {
            setSearchResults([]);
            return;
        }

        handleSearch(search);
    }, [search]);

    useEffect(() => {
        if (searchUser === "") {
            setSearchUserResults([]);
            return;
        }

        handleSearchUser(searchUser);
    }, [searchUser]);


    useEffect(()=> {
        conversationData.forEach((conversation) => {
            if(conversation.id === selectedConversation?.id){
                setSelectedConversation(conversation);
            }
        })
    }, [conversationData])

    // useEffect(() => {
    //     if (!selectedConversation) return;
    //     window.Echo.private("conversation." + selectedConversation.id).listen(
    //         ".new-message",
    //         (e) => {
    //            setSelectedConversation((prev) => ({
    //                ...prev,
    //                messages: [...prev.messages, e.message],
    //            }));
    //            audio.play();
    //            scrollToBottom();
    //         }
    //     );
    // }, [selectedConversation]);

    useEffect(() => {
        window.Echo.private("user." + auth.user.id).listen(
            ".new-message",
            (e) => {
                setConversationData((prev) => {
                    return prev.map((conversation) => {
                        if (conversation.id === e.message.conversation_id) {
                            return {
                                ...conversation,
                                messages: [...conversation.messages, e.message],
                            };
                        }
                        return conversation;
                    });
                });
                console.log("conversationData", conversationData);
                audio.play();
            }
        );
    }, []);

    //#endregion

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    //#endregion

    //#region Method

    const handleSendMessage = async (e) => {
        try {
            e.preventDefault();
            if (message.trim() === "") return;

            const response = await axios.post("/chat/store-message", {
                message: message,
                conversation_id: selectedConversation.id,
            });

            setConversationData((prev) => {
                return prev.map((conversation) => {
                    if (conversation.id === selectedConversation.id) {
                        return {
                            ...conversation,
                            messages: [...conversation.messages, response.data.message],
                        };
                    }
                    return conversation;
                });
            });
            setMessage("");
            scrollToBottom();
        } catch (error) {
            console.log("error");
        }
    };

    const handleSearch = async (searchUser) => {
        try {
            const response = await axios.get("/chat/search", {
                params: {
                    search: searchUser,
                },
            });

            setSearchResults(response.data.data);

            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearchUser = async (search) => {
        try {
            const response = await axios.get("/chat/search-user", {
                params: {
                    search: search,
                },
            });

            setSearchUserResults(response.data.data);

            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getConversation = async (id) => {
        try {
            const response = await axios.get(`/chat/get-conversation/${id}`);

            setSelectedConversation(response.data.conversation);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearchSelectResult = async (result) => {
        try {
            const conversation = await getConversation(result.id);
            setSearchResults([]);
            setSearch("");
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectUser = (user) => {
        setConversationForm((prev) => ({
            ...prev,
            participants: [...prev.participants, user],
        }));

        setSearchUserResults((prev) =>
            prev.filter((item) => item.id !== user.id)
        );
    };

    const handleRemoveUser = (user) => {
        setConversationForm((prev) => ({
            ...prev,
            participants: prev.participants.filter(
                (item) => item.id !== user.id
            ),
        }));
        setSearchUserResults((prev) => [...prev, user]);
    };

    const handleCreateConversation = async () => {
        try {
            const response = await axios.post(
                "/chat/create-conversation",
                conversationForm
            );
            setSelectedConversation(response.data.conversation);
            setConversationData((prev) => [
                ...prev,
                response.data.conversation,
            ]);
            setOpen(false);
            setConversationForm({
                name: "",
                participants: [],
            });
            setSearchUserResults([]);
            setSearchUser("");
            Swal.fire({
                icon: "success",
                title: "Conversation created successfully",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleModalOpen = () => {
        setOpen(true);
    };

    const handleModalClose = () => {
        setOpen(false);
    };

    //#endregion

    //#region Render

    const displayImage = () => {
        if (selectedConversation.owner_id != auth.id) {
            return (
                <>
                    {selectedConversation.participants.map((participant) => (
                        <>
                            <img
                                key={participant.id}
                                className="w-10 h-10 rounded-full"
                                src={
                                    participant.avatar ??
                                    "https://ui-avatars.com/api/?name=" +
                                        participant.name
                                }
                            />
                        </>
                    ))}
                </>
            );
        } else {
            return (
                <img
                    key={selectedConversation?.owner?.id}
                    className="w-10 h-10 rounded-full"
                    src={
                        selectedConversation?.owner?.avatar ??
                        "https://ui-avatars.com/api/?name=" +
                            selectedConversation?.owner?.name
                    }
                />
            );
        }
    };

    const displayImageSearchResult = (result) => {
        if (result.owner_id != auth.id) {
            return (
                <img
                    key={result.owner.id}
                    className="w-10 h-10 rounded-full"
                    src={
                        result.owner.avatar ??
                        "https://ui-avatars.com/api/?name=" + result.owner.name
                    }
                />
            );
        } else {
            return (
                <img
                    key={result.user.id}
                    className="w-10 h-10 rounded-full"
                    src={
                        result.user.avatar ??
                        "https://ui-avatars.com/api/?name=" +
                            result.participants.find(
                                (participant) => participant.name == search
                            ).name
                    }
                />
            );
        }
    };

    const displayImageConversation = () => {
        if (selectedConversation?.owner_id != auth.id) {
            return (
                <>
                    {selectedConversation.participants.map((participant) => (
                        <>
                            <img
                                key={participant.id}
                                className="w-10 h-10 rounded-full"
                                src={
                                    participant.avatar ??
                                    "https://ui-avatars.com/api/?name=" +
                                        participant.name
                                }
                            />
                        </>
                    ))}
                </>
            );
        } else {
            return (
                <img
                    key={selectedConversation?.owner?.id}
                    className="w-10 h-10 rounded-full"
                    src={
                        selectedConversation?.owner?.avatar ??
                        "https://ui-avatars.com/api/?name=" +
                            selectedConversation?.owner?.name
                    }
                />
            );
        }
    };

    //#endregion

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Messages
                </h2>
            }
        >
            <Head title="Chat" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex h-[calc(100vh-180px)] bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        {/* Conversations List */}
                        <div className="flex flex-col w-full bg-white border-r border-gray-100 md:w-1/3">
                            {/* Search Bar */}

                            <div className="flex gap-2 items-center border-b border-gray-100">
                                <div className="p-4 border-b border-gray-100 grow">
                                    <div className="relative w-full">
                                        <div className="relative">
                                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                                <svg
                                                    className="w-5 h-5 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                                className="block py-2 pr-3 pl-10 w-full bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Search conversations..."
                                            />
                                        </div>

                                        {searchResults.length > 0 && (
                                            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
                                                <div className="py-1">
                                                    {searchResults.map(
                                                        (result) => (
                                                            <div
                                                                key={result.id}
                                                                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                                onClick={() => {
                                                                    handleSearchSelectResult(
                                                                        result
                                                                    );
                                                                }}
                                                            >
                                                                <img
                                                                    className="w-8 h-8 rounded-full"
                                                                    src={
                                                                        result.image ||
                                                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                            result
                                                                                .user
                                                                                ?.name ||
                                                                                displayImageSearchResult(
                                                                                    result
                                                                                )
                                                                        )}&background=6b7280&color=fff`
                                                                    }
                                                                    alt={
                                                                        result
                                                                            .user
                                                                            ?.name ||
                                                                        "User"
                                                                    }
                                                                />
                                                                <div className="ml-3">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {
                                                                            result
                                                                                .user
                                                                                ?.name
                                                                        }
                                                                    </p>
                                                                    {result.user
                                                                        ?.email && (
                                                                        <p className="text-xs text-gray-500">
                                                                            {
                                                                                result
                                                                                    .user
                                                                                    .email
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handleModalOpen}
                                    className="flex gap-2 items-center p-4 mr-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                                >
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Conversations */}
                            <div className="overflow-y-auto flex-1">
                                {conversationData.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        className={`flex items-center p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 ${
                                            selectedConversation?.id ===
                                            conversation.id
                                                ? "bg-blue-50"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setSelectedConversation(
                                                conversation
                                            );
                                            scrollToBottom();
                                        }}
                                    >
                                        <div className="relative">
                                            {displayImageConversation()}
                                            {conversation?.isOnline && (
                                                <span className="block absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 ml-4 min-w-0">
                                            <div className="flex justify-between items-center">
                                                {conversation.owner_id !==
                                                auth.id ? (
                                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                                        {conversation?.participants
                                                            .map(
                                                                (participant) =>
                                                                    participant.name
                                                            )
                                                            .join(", ")}
                                                    </h3>
                                                ) : (
                                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                                        {
                                                            conversation?.owner
                                                                ?.name
                                                        }
                                                    </h3>
                                                )}
                                                <span className="text-xs text-gray-500">
                                                    {conversation?.time}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">
                                                {conversation?.lastMessage}
                                            </p>
                                        </div>
                                        {conversation?.unread > 0 && (
                                            <span className="inline-flex justify-center items-center ml-2 w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                                                {conversation?.unread}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chat Area */}
                        {selectedConversation ? (
                            <div className="hidden flex-col flex-1 md:flex">
                                {/* Chat Header */}
                                <div className="flex items-center p-4 border-b border-gray-100">
                                    <div className="relative">
                                        {displayImage()}
                                        {selectedConversation.isOnline && (
                                            <span className="block absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></span>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        {selectedConversation?.owner_id !=
                                        auth.id ? (
                                            <h3 className="text-sm font-medium text-gray-900">
                                                {selectedConversation?.participants
                                                    .map(
                                                        (participant) =>
                                                            participant.name
                                                    )
                                                    .join(", ")}
                                            </h3>
                                        ) : (
                                            <h3 className="text-sm font-medium text-gray-900">
                                                {
                                                    selectedConversation?.owner
                                                        ?.name
                                                }
                                            </h3>
                                        )}
                                        {/* <h3 className="text-sm font-medium text-gray-900">
                                            {selectedConversation?.owner_id ==
                                            auth.id ?
                                                    {selectedConversation?.participants
                                                        .map(
                                                            (participant) =>
                                                                participant.name
                                                        )},
                                            : (
                                                selectedConversation?.owner
                                                    ?.name
                                            )}
                                        </h3> */}
                                        <p className="text-xs text-gray-500">
                                            {selectedConversation.isOnline
                                                ? "Online"
                                                : "Offline"}
                                        </p>
                                    </div>
                                    <div className="flex ml-auto space-x-2">
                                        <button className="p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                        </button>
                                        <button className="p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </button>
                                        <button className="p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="overflow-y-auto flex-1 p-4 bg-gray-50">
                                    <div className="space-y-4">
                                        {messages == null ||
                                        messages.length === 0 ? (
                                            <div className="flex justify-center items-center h-full">
                                                <p className="text-gray-500">
                                                    No messages yet.
                                                </p>
                                            </div>
                                        ) : (
                                            messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={`flex ${
                                                        msg.user_id ===
                                                        auth.user.id
                                                            ? "justify-end"
                                                            : "justify-start"
                                                    }`}
                                                >
                                                    {!msg.user_id !==
                                                        auth.user.id && (
                                                        <img
                                                            className="self-end mr-2 w-8 h-8 rounded-full"
                                                            src={
                                                                msg?.user
                                                                    ?.avatar ||
                                                                "https://ui-avatars.com/api/?name=" +
                                                                    msg?.user
                                                                        ?.name
                                                            }
                                                            alt={
                                                                msg?.user?.name
                                                            }
                                                        />
                                                    )}

                                                    <div
                                                        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                                                            msg.user_id ==
                                                            auth.user.id
                                                                ? "bg-blue-600 text-white rounded-br-none"
                                                                : "bg-white border border-gray-200 rounded-bl-none"
                                                        }`}
                                                    >
                                                        {!msg.user_id ===
                                                            auth.user.id && (
                                                            <p className="text-xs font-medium text-gray-900">
                                                                {
                                                                    msg?.user
                                                                        ?.name
                                                                }
                                                            </p>
                                                        )}
                                                        <p className="text-sm">
                                                            {msg?.message}
                                                        </p>
                                                        <p className="mt-1 text-xs text-right opacity-70">
                                                            {msg?.created_at}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>

                                {/* Message Input */}
                                <div className="p-4 bg-white border-t border-gray-100">
                                    <form
                                        onSubmit={handleSendMessage}
                                        className="flex items-center space-x-2"
                                    >
                                        <button
                                            type="button"
                                            className="p-2 text-gray-400 hover:text-gray-600"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            className="p-2 text-gray-400 hover:text-gray-600"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                />
                                            </svg>
                                        </button>
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) =>
                                                setMessage(e.target.value)
                                            }
                                            className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Type a message..."
                                        />
                                        <button
                                            type="submit"
                                            className="p-2 text-blue-600 hover:text-blue-800"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                />
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            // Empty state when no conversation is selected
                            <div className="hidden flex-col flex-1 justify-center items-center p-8 text-center bg-gray-50 md:flex">
                                <div className="flex justify-center items-center mb-4 w-24 h-24 bg-blue-100 rounded-full">
                                    <svg
                                        className="w-12 h-12 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-xl font-medium text-gray-900">
                                    Select a conversation
                                </h3>
                                <p className="max-w-md text-gray-500">
                                    Choose a conversation from the list or start
                                    a new one to begin messaging.
                                </p>
                            </div>
                        )}

                        {/* Mobile view when no conversation is selected */}
                        {!selectedConversation && (
                            <div className="flex flex-1 justify-center items-center p-8 text-center bg-gray-50 md:hidden">
                                <div className="flex justify-center items-center mb-4 w-20 h-20 bg-blue-100 rounded-full">
                                    <svg
                                        className="w-10 h-10 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-gray-900">
                                    No conversation selected
                                </h3>
                                <p className="text-gray-500">
                                    Select a conversation to start messaging.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal show={open} onClose={handleModalClose} closeable={true}>
                <div className="flex flex-col gap-2 p-2 w-full">
                    <div className="flex-1">
                        <h1 className="pt-2 text-xl font-semibold border-b border-gray-200">
                            Create New Conversation
                        </h1>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="searchUser"
                            className="text-sm font-semibold"
                        >
                            Search User
                        </label>
                        <input
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                            type="text"
                            placeholder="Search User"
                            className="p-2 rounded border border-gray-200"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="Name"
                            className="text-sm font-semibold text-gray-500"
                        >
                            Conversation Name
                        </label>
                        <input
                            value={conversationForm.name}
                            onChange={(e) =>
                                setConversationForm({
                                    ...conversationForm,
                                    name: e.target.value,
                                })
                            }
                            type="text"
                            placeholder="Name"
                            className="p-2 rounded border border-gray-200"
                        />
                    </div>

                    {searchUserResults.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {searchUserResults.map((user) => (
                                <a
                                    onClick={() => handleSelectUser(user)}
                                    key={user.id}
                                    className="flex gap-2 cursor-pointer"
                                >
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user.name}&background=000000&color=ffffff`}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="flex flex-col">
                                        <h1 className="text-sm font-semibold">
                                            {user.name}
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            {user.email}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}

                    {conversationForm.participants.length > 0 && (
                        <div className="flex flex-col gap-2 p-2 w-full rounded border border-gray-200">
                            <h1 className="text-sm font-semibold">
                                Selected Users
                            </h1>
                            {conversationForm.participants.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex gap-2 p-2 w-full bg-gray-50 rounded"
                                >
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user.name}&background=000000&color=ffffff`}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="flex flex-col grow">
                                        <h1 className="text-sm font-semibold">
                                            {user.name}
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            {user.email}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleRemoveUser(user)}
                                        className="p-2 text-red-500"
                                    >
                                        <TrashIcon className="w-6 h-6" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-2 justify-end py-2 border-t border-gray-200">
                        <button
                            onClick={handleCreateConversation}
                            className="p-2 text-white bg-blue-500 rounded hover:text-gray-600"
                        >
                            Create
                        </button>
                        <button
                            className="p-2 text-gray-600 bg-gray-200 rounded hover:text-gray-600"
                            onClick={handleModalClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
