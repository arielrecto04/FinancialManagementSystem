import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PaperAirplaneIcon, EllipsisHorizontalIcon, VideoCameraIcon, PhoneIcon, FaceSmileIcon, PaperClipIcon } from '@heroicons/react/24/outline';

// Mock data for conversations
const mockConversations = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4f46e5&color=fff',
      status: 'online'
    },
    lastMessage: 'Can you review the budget report?',
    time: '10:30 AM',
    unread: 2,
    isOnline: true
  },
  {
    id: 2,
    user: {
      name: 'Jane Smith',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff',
      status: 'online'
    },
    lastMessage: 'The meeting is scheduled for tomorrow',
    time: '9:15 AM',
    unread: 1,
    isOpen: false,
    isOnline: true
  },
  {
    id: 3,
    user: {
      name: 'Alex Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=3b82f6&color=fff',
      status: 'offline'
    },
    lastMessage: 'Please send me the Q3 financials',
    time: 'Yesterday',
    unread: 0,
    isOpen: false,
    isOnline: false
  }
];

const ChatFloating = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeChat, setActiveChat] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const chatRef = useRef(null);

  // Handle click outside to close chat
  useEffect(() => {
    function handleClickOutside(event) {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsMinimized(true);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleChat = (conversationId) => {
    setConversations(convs =>
      convs.map(conv =>
        conv.id === conversationId
          ? { ...conv, isOpen: !conv.isOpen }
          : { ...conv, isOpen: false }
      )
    );
    setActiveChat(conversationId);
    setIsMinimized(false);
  };

  const closeChat = (e, conversationId) => {
    e.stopPropagation();
    setConversations(convs =>
      convs.map(conv =>
        conv.id === conversationId ? { ...conv, isOpen: false } : conv
      )
    );
    if (activeChat === conversationId) {
      setActiveChat(null);
    }
  };

  const handleSendMessage = (e, conversationId) => {
    e.preventDefault();
    if (!message.trim()) return;

    // In a real app, you would send the message to your backend here
    console.log(`Sending message to conversation ${conversationId}:`, message);

    // Clear the input field
    setMessage('');
  };

  // Get the 3 most recent conversations with unread messages
  const recentConversations = conversations
    .filter(conv => conv.unread > 0)
    .slice(0, 3);

  return (
    <div className="flex fixed right-0 bottom-0 z-50 items-end p-4 space-x-4">
      {recentConversations.map(conversation => {
        const isActive = activeChat === conversation.id && !isMinimized;

        return (
          <div
            key={conversation.id}
            className={`bg-white rounded-t-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
              isActive ? 'w-80 h-96' : 'w-56 h-12 hover:h-14'
            }`}
            style={{
              transitionProperty: 'width, height',
              marginBottom: isActive ? '0' : '-8px'
            }}
          >
            {/* Chat Header */}
            <div
              className={`flex items-center justify-between p-3 bg-blue-600 text-white cursor-pointer ${
                isActive ? 'rounded-t-lg' : 'rounded-lg'
              }`}
              onClick={() => toggleChat(conversation.id)}
            >
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={conversation.user.avatar}
                    alt={conversation.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  {conversation.isOnline && (
                    <div className="absolute right-0 bottom-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <span className="ml-2 font-medium">{conversation.user.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }}
                  className="p-1 text-white rounded hover:bg-blue-500"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <button
                  onClick={(e) => closeChat(e, conversation.id)}
                  className="p-1 text-white rounded hover:bg-blue-500"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {isActive && (
              <div className="flex flex-col h-[calc(100%-3rem)]">
                {/* Messages */}
                <div className="overflow-y-auto flex-1 p-4 bg-gray-50">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <img
                        src={conversation.user.avatar}
                        alt={conversation.user.name}
                        className="mr-2 w-8 h-8 rounded-full"
                      />
                      <div className="p-3 max-w-xs bg-white rounded-lg shadow-sm">
                        <p className="text-sm">{conversation.lastMessage}</p>
                        <p className="mt-1 text-xs text-right text-gray-500">{conversation.time}</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="p-3 max-w-xs text-white bg-blue-500 rounded-lg shadow-sm">
                        <p className="text-sm">This is a sample reply</p>
                        <p className="mt-1 text-xs text-right text-blue-100">Just now</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-3 bg-white border-t border-gray-200">
                  <form onSubmit={(e) => handleSendMessage(e, conversation.id)} className="flex items-center">
                    <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                      <FaceSmileIcon className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                      <PaperClipIcon className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 px-3 py-2 mx-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Type a message..."
                    />
                    <button type="submit" className="p-2 text-blue-600 hover:text-blue-800">
                      <PaperAirplaneIcon className="w-5 h-5 transform rotate-90" />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Chat Toggle Button */}
      {recentConversations.length === 0 && (
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="flex justify-center items-center w-12 h-12 text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatFloating;
