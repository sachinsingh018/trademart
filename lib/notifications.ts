// import { prisma } from '@/lib/prisma';

// // Type for response objects that can handle SSE connections
// export interface SSEResponse {
//     on?: (event: string, callback: () => void) => void;
//     write?: (data: string) => void;
//     end?: () => void;
// }

// export interface Notification {
//     id: string;
//     userId: string;
//     type: 'rfq_created' | 'quote_received' | 'quote_accepted' | 'quote_rejected' | 'order_placed' | 'order_updated' | 'system';
//     title: string;
//     message: string;
//     data?: Record<string, unknown>;
//     read: boolean;
//     createdAt: Date;
//     updatedAt: Date;
// }

// export interface NotificationData {
//     rfqId?: string;
//     quoteId?: string;
//     orderId?: string;
//     supplierId?: string;
//     buyerId?: string;
//     amount?: number;
//     currency?: string;
//     [key: string]: unknown;
// }

// class NotificationService {
//     private static instance: NotificationService;
//     private clients: Map<string, Set<SSEResponse>> = new Map();

//     static getInstance(): NotificationService {
//         if (!NotificationService.instance) {
//             NotificationService.instance = new NotificationService();
//         }
//         return NotificationService.instance;
//     }

//     // Add client to notification stream
//     addClient(userId: string, response: SSEResponse) {
//         if (!this.clients.has(userId)) {
//             this.clients.set(userId, new Set());
//         }
//         this.clients.get(userId)!.add(response);

//         // Remove client when connection closes
//         if (response.on && typeof response.on === 'function') {
//             response.on('close', () => {
//                 this.removeClient(userId, response);
//             });
//         }
//     }

//     // Remove client from notification stream
//     removeClient(userId: string, response: SSEResponse) {
//         const userClients = this.clients.get(userId);
//         if (userClients) {
//             userClients.delete(response);
//             if (userClients.size === 0) {
//                 this.clients.delete(userId);
//             }
//         }
//     }

//     // Send notification to specific user
//     async sendToUser(userId: string, notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) {
//         try {
//             // Save notification to database
//             const savedNotification = await prisma.notification.create({
//                 data: {
//                     userId,
//                     type: notification.type,
//                     title: notification.title,
//                     message: notification.message,
//                     data: notification.data ? JSON.stringify(notification.data) : null,
//                     read: notification.read,
//                 }
//             });

//             // Send to connected clients
//             const userClients = this.clients.get(userId);
//             if (userClients && userClients.size > 0) {
//                 const notificationData = {
//                     id: savedNotification.id,
//                     type: savedNotification.type,
//                     title: savedNotification.title,
//                     message: savedNotification.message,
//                     data: notification.data,
//                     read: savedNotification.read,
//                     createdAt: savedNotification.createdAt,
//                 };

//                 const message = `data: ${JSON.stringify(notificationData)}\n\n`;

//                 // Send to all connected clients for this user
//                 for (const client of userClients) {
//                     try {
//                         client.write?.(message);
//                     } catch (error) {
//                         console.error('Error sending notification to client:', error);
//                         this.removeClient(userId, client);
//                     }
//                 }
//             }

//             return savedNotification;
//         } catch (error) {
//             console.error('Error creating notification:', error);
//             throw error;
//         }
//     }

//     // Send notification to multiple users
//     async sendToUsers(userIds: string[], notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) {
//         const results = [];
//         for (const userId of userIds) {
//             try {
//                 const result = await this.sendToUser(userId, notification);
//                 results.push(result);
//             } catch (error) {
//                 console.error(`Error sending notification to user ${userId}:`, error);
//             }
//         }
//         return results;
//     }

//     // Send notification to all users of a specific role
//     async sendToRole(role: 'buyer' | 'supplier' | 'admin', notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) {
//         try {
//             const users = await prisma.user.findMany({
//                 where: { role },
//                 select: { id: true }
//             });

//             const userIds = users.map(user => user.id);
//             return await this.sendToUsers(userIds, notification);
//         } catch (error) {
//             console.error('Error sending notification to role:', error);
//             throw error;
//         }
//     }

//     // Get user notifications
//     async getUserNotifications(userId: string, limit: number = 50, offset: number = 0) {
//         try {
//             const notifications = await prisma.notification.findMany({
//                 where: { userId },
//                 orderBy: { createdAt: 'desc' },
//                 take: limit,
//                 skip: offset,
//             });

//             return notifications.map(notification => ({
//                 ...notification,
//                 data: notification.data ? JSON.parse(notification.data) : null,
//             }));
//         } catch (error) {
//             console.error('Error fetching user notifications:', error);
//             throw error;
//         }
//     }

//     // Mark notification as read
//     async markAsRead(notificationId: string, userId: string) {
//         try {
//             return await prisma.notification.updateMany({
//                 where: {
//                     id: notificationId,
//                     userId
//                 },
//                 data: { read: true }
//             });
//         } catch (error) {
//             console.error('Error marking notification as read:', error);
//             throw error;
//         }
//     }

//     // Mark all notifications as read for user
//     async markAllAsRead(userId: string) {
//         try {
//             return await prisma.notification.updateMany({
//                 where: { userId },
//                 data: { read: true }
//             });
//         } catch (error) {
//             console.error('Error marking all notifications as read:', error);
//             throw error;
//         }
//     }

//     // Get unread count for user
//     async getUnreadCount(userId: string) {
//         try {
//             return await prisma.notification.count({
//                 where: {
//                     userId,
//                     read: false
//                 }
//             });
//         } catch (error) {
//             console.error('Error getting unread count:', error);
//             throw error;
//         }
//     }

//     // Create notification templates
//     createRFQNotification(rfqTitle: string, buyerName: string, rfqId: string): Omit<Notification, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
//         return {
//             type: 'rfq_created',
//             title: 'New RFQ Available',
//             message: `New RFQ: "${rfqTitle}" from ${buyerName}`,
//             data: { rfqId, rfqTitle, buyerName },
//             read: false,
//         };
//     }

//     createQuoteNotification(rfqTitle: string, supplierName: string, amount: number, currency: string, quoteId: string): Omit<Notification, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
//         return {
//             type: 'quote_received',
//             title: 'New Quote Received',
//             message: `Quote for "${rfqTitle}" from ${supplierName}: ${currency} ${amount}`,
//             data: { rfqTitle, supplierName, amount, currency, quoteId },
//             read: false,
//         };
//     }

//     createQuoteStatusNotification(rfqTitle: string, status: 'accepted' | 'rejected', supplierName: string, quoteId: string): Omit<Notification, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
//         return {
//             type: status === 'accepted' ? 'quote_accepted' : 'quote_rejected',
//             title: `Quote ${status === 'accepted' ? 'Accepted' : 'Rejected'}`,
//             message: `Your quote for "${rfqTitle}" has been ${status}`,
//             data: { rfqTitle, status, supplierName, quoteId },
//             read: false,
//         };
//     }


//     createSystemNotification(title: string, message: string, data?: Record<string, unknown>): Omit<Notification, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
//         return {
//             type: 'system',
//             title,
//             message,
//             data,
//             read: false,
//         };
//     }
// }

// export const notificationService = NotificationService.getInstance();
// export default NotificationService;