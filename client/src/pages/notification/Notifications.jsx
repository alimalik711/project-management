import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
} from "../../services/notificationService";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getMyNotifications();
            setNotifications(Array.isArray(data.notifications) ? data.notifications : Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load notifications"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            setError("");
            setSuccess("");
            await markAsRead(id);
            setNotifications((prev) =>
                prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
            );
            setSuccess("Notification marked as read");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to mark notification as read");
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            setError("");
            setSuccess("");
            await markAllAsRead();
            setNotifications((prev) =>
                prev.map((item) => ({ ...item, is_read: true }))
            );
            setSuccess("All notifications marked as read");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to mark all notifications as read");
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-gray-500">Loading notifications...</p>
            </div>
        );
    }

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
        <div className="p-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Notifications
                    </h1>
                    <p className="mt-1 text-gray-500">
                        Stay updated on project changes and task assignments
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={handleMarkAllAsRead}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 font-medium"
                    >
                        Mark All as Read
                    </button>
                )}
            </div>

            {error && (
                <p className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-red-700">
                    {error}
                </p>
            )}

            {success && (
                <p className="mb-6 rounded-lg bg-green-100 px-4 py-3 text-green-700">
                    {success}
                </p>
            )}

            {notifications.length === 0 ? (
                <div className="rounded-xl bg-white p-8 shadow">
                    <p className="text-gray-500">No notifications found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`rounded-xl bg-white p-5 shadow border-l-4 ${
                                notification.is_read
                                    ? "border-gray-300 opacity-75"
                                    : "border-blue-600 bg-blue-50/30"
                            } flex items-start justify-between gap-4`}
                        >
                            <div>
                                <p className="font-medium text-gray-800">
                                    {notification.message}
                                </p>
                                <span className="mt-1 inline-block text-xs text-gray-400">
                                    {notification.created_at
                                        ? new Date(notification.created_at).toLocaleString()
                                        : ""}
                                </span>

                                <div className="mt-2 flex items-center gap-3">
                                    {notification.task_id && (
                                        <Link
                                            to={`/tasks/${notification.task_id}`}
                                            className="text-xs text-blue-600 hover:underline"
                                        >
                                            View Task →
                                        </Link>
                                    )}
                                    {notification.project_id && (
                                        <Link
                                            to={`/projects/${notification.project_id}`}
                                            className="text-xs text-blue-600 hover:underline"
                                        >
                                            View Project →
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {!notification.is_read && (
                                <button
                                    type="button"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="rounded-lg border px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                                >
                                    Mark as Read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Notifications;
