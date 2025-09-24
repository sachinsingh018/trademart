"use client";

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface Notification {
    id: string;
    type: 'rfq_created' | 'quote_received' | 'quote_accepted' | 'quote_rejected' | 'order_placed' | 'order_updated' | 'system' | 'whatsapp_sent';
    title: string;
    message: string;
    data?: Record<string, unknown>;
    read: boolean;
    createdAt: string;
}

export interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
}

export function useNotifications() {
    const { data: session, status } = useSession();
    const [state, setState] = useState<NotificationState>({
        notifications: [],
        unreadCount: 0,
        isConnected: false,
        isLoading: true,
        error: null,
    });

    const [eventSource, setEventSource] = useState<EventSource | null>(null);

    // Fetch initial notifications
    const fetchNotifications = useCallback(async () => {
        if (!session?.user?.id) return;

        try {
            const response = await fetch('/api/notifications');
            const data = await response.json();

            if (data.success) {
                setState(prev => ({
                    ...prev,
                    notifications: data.data.notifications,
                    unreadCount: data.data.unreadCount,
                    isLoading: false,
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    error: data.error || 'Failed to fetch notifications',
                    isLoading: false,
                }));
            }
        } catch {
            setState(prev => ({
                ...prev,
                error: 'Failed to fetch notifications',
                isLoading: false,
            }));
        }
    }, [session?.user?.id]);

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            const response = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId }),
            });

            if (response.ok) {
                setState(prev => ({
                    ...prev,
                    notifications: prev.notifications.map(n =>
                        n.id === notificationId ? { ...n, read: true } : n
                    ),
                    unreadCount: Math.max(0, prev.unreadCount - 1),
                }));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }, []);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            const response = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAll: true }),
            });

            if (response.ok) {
                setState(prev => ({
                    ...prev,
                    notifications: prev.notifications.map(n => ({ ...n, read: true })),
                    unreadCount: 0,
                }));
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    }, []);

    // Setup SSE connection
    useEffect(() => {
        if (status !== 'authenticated' || !session?.user?.id) {
            setState(prev => ({ ...prev, isConnected: false }));
            return;
        }

        // Create EventSource connection
        const es = new EventSource('/api/notifications/stream');
        setEventSource(es);

        es.onopen = () => {
            setState(prev => ({ ...prev, isConnected: true, error: null }));
        };

        es.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'connected') {
                    console.log('Connected to notifications stream');
                } else if (data.type === 'heartbeat') {
                    // Keep connection alive
                } else if (data.type && data.title && data.message) {
                    // New notification received
                    const newNotification: Notification = {
                        id: data.id,
                        type: data.type,
                        title: data.title,
                        message: data.message,
                        data: data.data,
                        read: data.read,
                        createdAt: data.createdAt,
                    };

                    setState(prev => ({
                        ...prev,
                        notifications: [newNotification, ...prev.notifications],
                        unreadCount: prev.unreadCount + (data.read ? 0 : 1),
                    }));
                }
            } catch (error) {
                console.error('Error parsing SSE message:', error);
            }
        };

        es.onerror = (error) => {
            console.error('SSE connection error:', error);
            setState(prev => ({
                ...prev,
                isConnected: false,
                error: 'Connection lost. Reconnecting...'
            }));
        };

        return () => {
            es.close();
            setEventSource(null);
        };
    }, [status, session?.user?.id]);

    // Fetch initial notifications when authenticated
    useEffect(() => {
        if (status === 'authenticated') {
            fetchNotifications();
        }
    }, [status, fetchNotifications]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [eventSource]);

    return {
        ...state,
        markAsRead,
        markAllAsRead,
        refetch: fetchNotifications,
    };
}
