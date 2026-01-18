'use client';

import { useState } from 'react';
import {
  Bell,
  X,
  CheckCircle,
  Video,
  DollarSign,
  Star,
  AlertCircle,
  Clock,
  User,
  MessageSquare,
  Gift,
  TrendingUp
} from 'lucide-react';
import { Button } from './ui/Button';

export type NotificationType =
  | 'booking_confirmed'
  | 'video_ready'
  | 'payment_received'
  | 'review_received'
  | 'booking_request'
  | 'talent_approved'
  | 'message_received'
  | 'promotion'
  | 'reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface NotificationCenterProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
}

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'video_ready',
    title: 'Your video is ready! 🎉',
    message: 'Winky D has completed your video for Sarah\'s birthday',
    timestamp: '2026-01-16T10:30:00Z',
    read: false,
    actionUrl: '/booking/1',
  },
  {
    id: '2',
    type: 'booking_request',
    title: 'New booking request',
    message: 'Someone requested a video from you for $50',
    timestamp: '2026-01-16T08:15:00Z',
    read: false,
    actionUrl: '/dashboard',
  },
  {
    id: '3',
    type: 'payment_received',
    title: 'Payment received',
    message: 'You earned $37.50 from a completed video',
    timestamp: '2026-01-15T14:20:00Z',
    read: false,
  },
  {
    id: '4',
    type: 'review_received',
    title: 'New 5-star review',
    message: 'John D. left you an amazing review!',
    timestamp: '2026-01-15T09:00:00Z',
    read: true,
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Response deadline approaching',
    message: 'You have 24 hours to respond to a booking request',
    timestamp: '2026-01-14T16:30:00Z',
    read: true,
  },
];

export function NotificationCenter({
  notifications = mockNotifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'booking_confirmed':
        return <CheckCircle className={`${iconClass} text-green-400`} />;
      case 'video_ready':
        return <Video className={`${iconClass} text-purple-400`} />;
      case 'payment_received':
        return <DollarSign className={`${iconClass} text-green-400`} />;
      case 'review_received':
        return <Star className={`${iconClass} text-yellow-400`} />;
      case 'booking_request':
        return <Bell className={`${iconClass} text-pink-400`} />;
      case 'talent_approved':
        return <CheckCircle className={`${iconClass} text-blue-400`} />;
      case 'message_received':
        return <MessageSquare className={`${iconClass} text-purple-400`} />;
      case 'promotion':
        return <Gift className={`${iconClass} text-pink-400`} />;
      case 'reminder':
        return <Clock className={`${iconClass} text-yellow-400`} />;
      default:
        return <Bell className={`${iconClass} text-neutral-400`} />;
    }
  };

  const getNotificationBgColor = (type: NotificationType) => {
    switch (type) {
      case 'booking_confirmed':
      case 'payment_received':
        return 'bg-green-500/20';
      case 'video_ready':
      case 'message_received':
        return 'bg-purple-500/20';
      case 'review_received':
      case 'reminder':
        return 'bg-yellow-500/20';
      case 'booking_request':
      case 'promotion':
        return 'bg-pink-500/20';
      case 'talent_approved':
        return 'bg-blue-500/20';
      default:
        return 'bg-neutral-700/20';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now.getTime() - notificationTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notificationTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-pink-500 rounded-full text-xs flex items-center justify-center px-1 font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-12 w-96 max-w-[calc(100vw-2rem)] bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <div>
                <h3 className="font-bold text-lg">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-sm text-neutral-400">{unreadCount} unread</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && onMarkAllAsRead && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-sm text-purple-400 hover:text-purple-300 transition"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-neutral-800 rounded transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-neutral-600" />
                  </div>
                  <p className="text-neutral-400 text-center">No notifications yet</p>
                  <p className="text-neutral-500 text-sm text-center mt-1">
                    We'll notify you when something important happens
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-800">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-neutral-800/50 transition cursor-pointer ${
                        !notification.read ? 'bg-neutral-800/30' : ''
                      }`}
                      onClick={() => {
                        if (onMarkAsRead && !notification.read) {
                          onMarkAsRead(notification.id);
                        }
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl;
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 ${getNotificationBgColor(notification.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-semibold text-sm leading-tight">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-neutral-400 line-clamp-2 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-neutral-500">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                            {onDelete && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(notification.id);
                                }}
                                className="text-xs text-neutral-500 hover:text-red-400 transition"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-neutral-800">
                <button className="w-full text-sm text-purple-400 hover:text-purple-300 transition font-medium">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Live notification badge component for real-time updates
export function LiveNotificationBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span className="animate-pulse bg-pink-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
      {count > 9 ? '9+' : count}
    </span>
  );
}

// Toast notification component for real-time alerts
export function NotificationToast({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const getNotificationIcon = (type: NotificationType) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'video_ready':
        return <Video className={`${iconClass} text-purple-400`} />;
      case 'payment_received':
        return <DollarSign className={`${iconClass} text-green-400`} />;
      case 'booking_request':
        return <Bell className={`${iconClass} text-pink-400`} />;
      default:
        return <Bell className={`${iconClass} text-neutral-400`} />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-in-right">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm mb-1">{notification.title}</p>
            <p className="text-sm text-neutral-400 line-clamp-2">
              {notification.message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 rounded transition flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
