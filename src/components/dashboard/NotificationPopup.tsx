import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationAPI } from '@/lib/api';
import { Bell, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notification } from '@/types';

interface NotificationPopupProps {
    onClose: () => void;
}

const NotificationPopup = ({ onClose }: NotificationPopupProps) => {
    const navigate = useNavigate();
    const popupRef = useRef<HTMLDivElement>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await notificationAPI.getAll();
                setNotifications(response.data);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleNotificationClick = async (notification: Notification) => {
        try {
            await notificationAPI.markAsRead(notification._id);
            navigate(notification.actionRoute);
            onClose();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString();
    };

    return (
        <div
            ref={popupRef}
            className="absolute right-0 top-12 w-80 bg-background border rounded-lg shadow-lg z-50 overflow-hidden"
        >
            <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <div className="flex items-center gap-2">
                    {notifications.some(n => !n.read) && (
                        <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                            Mark all read
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-4 border-b cursor-pointer hover:bg-secondary/50 transition-colors ${!notification.read ? 'bg-primary/5' : ''
                                }`}
                        >
                            <p className={`text-sm ${!notification.read ? 'font-medium' : 'text-muted-foreground'}`}>
                                {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(notification.createdAt)}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationPopup;
