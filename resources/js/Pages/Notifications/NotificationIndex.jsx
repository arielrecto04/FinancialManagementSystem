import { BellIcon, CheckIcon, ClockIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import { useState } from "react";

// Helper function to get icon based on notification type
const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
        case 'new_request':
            return <BellIcon className={`text-blue-500 ${iconClass}`} />;
        case 'approved':
            return <CheckCircleIcon className={`text-green-500 ${iconClass}`} />;
        case 'reminder':
            return <ClockIcon className={`text-yellow-500 ${iconClass}`} />;
        case 'system':
            return <InformationCircleIcon className={`text-purple-500 ${iconClass}`} />;
        case 'alert':
            return <ExclamationTriangleIcon className={`text-red-500 ${iconClass}`} />;
        default:
            return <BellIcon className={`text-gray-400 ${iconClass}`} />;
    }
};

// Hardcoded notifications data
// const notifications = [
//     {
//         id: 1,
//         type: 'new_request',
//         title: 'New Petty Cash Request',
//         message: 'John Doe submitted a new petty cash request for $500',
//         time: '2025-09-22T10:30:00Z',
//         read: false,
//         url: '/petty-cash/requests/42'
//     },
//     {
//         id: 2,
//         type: 'approved',
//         title: 'Request Approved',
//         message: 'Your supply request #SUP-0042 has been approved by Sarah Johnson',
//         time: '2025-09-22T09:15:00Z',
//         read: true,
//         url: '/supply-requests/42'
//     },
//     {
//         id: 3,
//         type: 'reminder',
//         title: 'Payment Due',
//         message: 'Reminder: Invoice #INV-2023-056 for $1,250.00 is due in 2 days',
//         time: '2025-09-21T14:20:00Z',
//         read: true,
//         url: '/invoices/56'
//     },
//     {
//         id: 4,
//         type: 'system',
//         title: 'System Maintenance',
//         message: 'Scheduled maintenance this Saturday from 2:00 AM to 4:00 AM',
//         time: '2025-09-20T16:45:00Z',
//         read: true,
//         url: '/announcements/5'
//     },
//     {
//         id: 5,
//         type: 'alert',
//         title: 'Action Required',
//         message: 'Your expense report #EXP-2023-089 requires additional documentation',
//         time: '2025-09-19T11:10:00Z',
//         read: false,
//         url: '/expense-reports/89'
//     }
// ];

// Format date to relative time (e.g., "2 hours ago")
const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / seconds);
        if (interval >= 1) {
            return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
    }

    return 'Just now';
};

export default function NotificationIndex({ notifications }) {




    const [notificationsData, setNotificationsData] = useState(notifications);

    const markAsRead = async (id) => {
        try {
            const response = await axios.post(`/notifications/mark-as-read/${id}`);
            const data = response.data;
            setNotificationsData((prev) => prev.map((notification) => notification.id === id ? data.notification : notification));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await axios.post('/notifications/mark-all-as-read');
            const data = response.data;
            setNotificationsData([...data.notifications]);
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <AuthenticatedLayout>
            <div className="px-4 py-8 mx-auto max-w-4xl sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                        </p>
                    </div>
                    <button
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                            unreadCount > 0
                                ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                                : 'text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Mark all as read
                    </button>
                </div>

                <div className="overflow-hidden bg-white shadow sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {notificationsData.map((notification) => (
                            <li key={notification.id} className={!notification.read ? 'bg-blue-50' : 'bg-white'}>
                                <Link
                                    href={notification.url}
                                    className="block hover:bg-gray-50"
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                >
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 pt-0.5">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 ml-3">
                                                <div className="flex justify-between items-center">
                                                    <p className={`text-sm font-medium ${
                                                        notification.read ? 'text-gray-900' : 'text-blue-700'
                                                    }`}>
                                                        {notification.title}
                                                    </p>
                                                    <div className="flex flex-shrink-0 ml-2">
                                                        {!notification.read && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                New
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                                    <span>{formatRelativeTime(notification.time)}</span>
                                                    {!notification.read && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                markAsRead(notification.id);
                                                            }}
                                                            className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Empty state */}
                {notifications.length === 0 && (
                    <div className="py-12 text-center">
                        <BellIcon className="mx-auto w-12 h-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            You don't have any notifications at the moment.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
