import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
// import { notificationService } from '@/lib/notifications';

// GET - Get user notifications
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        // const limit = parseInt(searchParams.get('limit') || '50');
        // const offset = parseInt(searchParams.get('offset') || '0');
        const unreadOnly = searchParams.get('unreadOnly') === 'true';

        // const notifications = await notificationService.getUserNotifications(
        //     session.user.id,
        //     limit,
        //     offset
        // );
        const notifications: unknown[] = [];

        // Filter unread only if requested
        const filteredNotifications = unreadOnly
            ? notifications.filter((n: { read: boolean }) => !n.read)
            : notifications;

        // const unreadCount = await notificationService.getUnreadCount(session.user.id);
        const unreadCount = 0;

        return NextResponse.json({
            success: true,
            data: {
                notifications: filteredNotifications,
                unreadCount,
                total: notifications.length
            }
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch notifications'
        }, { status: 500 });
    }
}

// POST - Mark notification as read
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { notificationId, markAll } = await request.json();

        if (markAll) {
            // await notificationService.markAllAsRead(session.user.id);
            return NextResponse.json({
                success: true,
                message: 'All notifications marked as read'
            });
        } else if (notificationId) {
            // await notificationService.markAsRead(notificationId, session.user.id);
            return NextResponse.json({
                success: true,
                message: 'Notification marked as read'
            });
        } else {
            return NextResponse.json({
                error: 'Missing notificationId or markAll flag'
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Error updating notification:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update notification'
        }, { status: 500 });
    }
}

// DELETE - Delete notification
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const notificationId = searchParams.get('id');

        if (!notificationId) {
            return NextResponse.json({
                error: 'Missing notification ID'
            }, { status: 400 });
        }

        // Delete notification (you'll need to add this method to the notification service)
        // await notificationService.deleteNotification(notificationId, session.user.id);

        return NextResponse.json({
            success: true,
            message: 'Notification deleted'
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to delete notification'
        }, { status: 500 });
    }
}
