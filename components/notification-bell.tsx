"use client";

import { useState } from 'react';
import { Bell, Check, CheckCheck, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationBell() {
    const {
        notifications,
        unreadCount,
        isConnected,
        isLoading,
        error,
        markAsRead,
        markAllAsRead
    } = useNotifications();

    const [isOpen, setIsOpen] = useState(false);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'rfq_created':
                return '📋';
            case 'quote_received':
                return '💰';
            case 'quote_accepted':
                return '✅';
            case 'quote_rejected':
                return '❌';
            case 'order_placed':
                return '📦';
            case 'order_updated':
                return '🔄';
            case 'system':
                return '🔔';
            default:
                return '🔔';
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'rfq_created':
                return 'text-blue-600';
            case 'quote_received':
                return 'text-green-600';
            case 'quote_accepted':
                return 'text-green-600';
            case 'quote_rejected':
                return 'text-red-600';
            case 'order_placed':
                return 'text-purple-600';
            case 'order_updated':
                return 'text-orange-600';
            case 'system':
                return 'text-gray-600';
            default:
                return 'text-gray-600';
        }
    };

    const handleNotificationClick = async (notification: any) => {
        if (!notification.read) {
            await markAsRead(notification.id);
        }
        setIsOpen(false);
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                    {!isConnected && (
                        <div className="absolute -bottom-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Notifications</CardTitle>
                            <div className="flex items-center gap-2">
                                {isConnected ? (
                                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                                ) : (
                                    <div className="h-2 w-2 bg-red-500 rounded-full" />
                                )}
                                {unreadCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={markAllAsRead}
                                        className="h-6 px-2 text-xs"
                                    >
                                        <CheckCheck className="h-3 w-3 mr-1" />
                                        Mark all read
                                    </Button>
                                )}
                            </div>
                        </div>
                        {error && (
                            <CardDescription className="text-red-600 text-sm">
                                {error}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span className="ml-2 text-sm text-gray-600">Loading notifications...</span>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                <Bell className="h-8 w-8 mb-2" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            <ScrollArea className="h-96">
                                <div className="space-y-1">
                                    {notifications.map((notification, index) => (
                                        <div key={notification.id}>
                                            <div
                                                className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                                    }`}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="text-lg">
                                                        {getNotificationIcon(notification.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className={`text-sm font-medium ${getNotificationColor(notification.type)}`}>
                                                                {notification.title}
                                                            </h4>
                                                            {!notification.read && (
                                                                <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                    {!notification.read && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead(notification.id);
                                                            }}
                                                        >
                                                            <Check className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            {index < notifications.length - 1 && <Separator />}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
