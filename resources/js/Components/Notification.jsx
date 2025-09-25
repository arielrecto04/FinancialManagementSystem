import { BellIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import axios from "axios";

export default function Notification() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([

    ]);

    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/notifications/list');
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const response = await axios.post(`/notifications/mark-as-read/${id}`);

            const data = response.data;
            setNotifications((prev) => prev.map((notification) => notification.id === id ? data.notification : notification));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };


    const markAllAsRead = async () => {
        try {
            const response = await axios.post('/notifications/mark-all-as-read');
            const data = response.data;
            setNotifications([...data.notifications]);
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };



    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none"
                aria-label="Notifications"
            >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="flex absolute top-0 right-0 justify-center items-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-80 bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg">
                    <div className="p-2 border-b border-gray-200">
                        <div className="flex justify-between items-center px-2 py-2">
                            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-800"
                                disabled={unreadCount === 0}
                            >
                                Mark all as read
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto py-1 max-h-96">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex items-start">
                                        {notification.avatar ? (
                                            <img
                                                className="mr-3 w-10 h-10 rounded-full"
                                                src={notification.avatar}
                                                alt=""
                                            />
                                        ) : (
                                            <div className="flex justify-center items-center mr-3 w-10 h-10 bg-gray-200 rounded-full">
                                                <BellIcon className="w-5 h-5 text-gray-500" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                            <p className="text-sm text-gray-500 truncate">{notification.message}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-gray-400">{notification.time}</span>
                                                {!notification.read && (
                                                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="ml-2 text-gray-400 hover:text-gray-500"
                                            title="Mark as read"
                                        >
                                            <CheckIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center">
                                <p className="text-sm text-gray-500">No new notifications</p>
                            </div>
                        )}
                    </div>

                    <div className="px-4 py-2 text-center bg-gray-50">
                        <Link
                            href={route('notifications.user-notifications')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            View all notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
