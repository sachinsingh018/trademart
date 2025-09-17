import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notificationService } from "@/lib/notifications";

// Escrow Service for TradeMart
class EscrowService {
    // Create escrow account for order
    async createEscrowAccount(orderId: string, amount: number, currency: string = 'INR') {
        try {
            const escrowAccount = await prisma.escrowAccount.create({
                data: {
                    orderId,
                    amount,
                    currency,
                    status: 'pending',
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                }
            });

            return {
                success: true,
                escrowId: escrowAccount.id,
                accountNumber: this.generateAccountNumber(escrowAccount.id),
                amount,
                currency,
                status: 'pending'
            };
        } catch (error) {
            console.error('Error creating escrow account:', error);
            return { success: false, error: 'Failed to create escrow account' };
        }
    }

    // Release funds after delivery confirmation
    async releaseFunds(escrowId: string, orderId: string, qcPassed: boolean = true) {
        try {
            const escrowAccount = await prisma.escrowAccount.findUnique({
                where: { id: escrowId },
                include: { order: true }
            });

            if (!escrowAccount) {
                return { success: false, error: 'Escrow account not found' };
            }

            if (escrowAccount.status !== 'funded') {
                return { success: false, error: 'Escrow account not funded' };
            }

            // Update escrow status
            await prisma.escrowAccount.update({
                where: { id: escrowId },
                data: {
                    status: qcPassed ? 'released' : 'disputed',
                    releasedAt: new Date(),
                    qcPassed
                }
            });

            // Update order status
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: qcPassed ? 'completed' : 'disputed',
                    paymentStatus: qcPassed ? 'paid' : 'disputed'
                }
            });

            // Send notifications
            if (qcPassed) {
                await this.sendPaymentReleaseNotification(escrowAccount.order);
            } else {
                await this.sendDisputeNotification(escrowAccount.order);
            }

            return {
                success: true,
                status: qcPassed ? 'released' : 'disputed',
                amount: escrowAccount.amount,
                currency: escrowAccount.currency
            };
        } catch (error) {
            console.error('Error releasing funds:', error);
            return { success: false, error: 'Failed to release funds' };
        }
    }

    // Fund escrow account
    async fundEscrowAccount(escrowId: string, paymentMethod: string, transactionId: string) {
        try {
            const escrowAccount = await prisma.escrowAccount.findUnique({
                where: { id: escrowId }
            });

            if (!escrowAccount) {
                return { success: false, error: 'Escrow account not found' };
            }

            if (escrowAccount.status !== 'pending') {
                return { success: false, error: 'Escrow account already processed' };
            }

            // Update escrow account
            await prisma.escrowAccount.update({
                where: { id: escrowId },
                data: {
                    status: 'funded',
                    fundedAt: new Date(),
                    paymentMethod,
                    transactionId
                }
            });

            // Update order status
            await prisma.order.update({
                where: { id: escrowAccount.orderId },
                data: {
                    paymentStatus: 'escrowed',
                    status: 'confirmed'
                }
            });

            return {
                success: true,
                status: 'funded',
                amount: escrowAccount.amount,
                currency: escrowAccount.currency
            };
        } catch (error) {
            console.error('Error funding escrow account:', error);
            return { success: false, error: 'Failed to fund escrow account' };
        }
    }

    // Refund escrow account
    async refundEscrowAccount(escrowId: string, reason: string) {
        try {
            const escrowAccount = await prisma.escrowAccount.findUnique({
                where: { id: escrowId },
                include: { order: true }
            });

            if (!escrowAccount) {
                return { success: false, error: 'Escrow account not found' };
            }

            if (escrowAccount.status !== 'funded') {
                return { success: false, error: 'Escrow account not funded' };
            }

            // Update escrow status
            await prisma.escrowAccount.update({
                where: { id: escrowId },
                data: {
                    status: 'refunded',
                    refundedAt: new Date(),
                    refundReason: reason
                }
            });

            // Update order status
            await prisma.order.update({
                where: { id: escrowAccount.orderId },
                data: {
                    status: 'cancelled',
                    paymentStatus: 'refunded'
                }
            });

            // Send refund notification
            await this.sendRefundNotification(escrowAccount.order);

            return {
                success: true,
                status: 'refunded',
                amount: escrowAccount.amount,
                currency: escrowAccount.currency
            };
        } catch (error) {
            console.error('Error refunding escrow account:', error);
            return { success: false, error: 'Failed to refund escrow account' };
        }
    }

    // Generate unique account number
    private generateAccountNumber(escrowId: string): string {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `ESC${timestamp}${random}`;
    }

    // Send payment release notification
    private async sendPaymentReleaseNotification(order: any) {
        try {
            // Send to supplier
            await notificationService.sendToUser(
                order.supplierId,
                {
                    type: 'payment_released',
                    title: 'Payment Released!',
                    message: `Payment of ₹${order.totalAmount} has been released for order #${order.id}`,
                    read: false,
                }
            );

            // Send WhatsApp notification to supplier
            // WhatsApp notification removed - integration simplified
        } catch (error) {
            console.error('Error sending payment release notification:', error);
        }
    }

    // Send dispute notification
    private async sendDisputeNotification(order: any) {
        try {
            // Send to both parties
            await notificationService.sendToUser(
                order.buyerId,
                {
                    type: 'dispute_created',
                    title: 'Order Disputed',
                    message: `Order #${order.id} has been disputed due to QC issues`,
                    read: false,
                }
            );

            await notificationService.sendToUser(
                order.supplierId,
                {
                    type: 'dispute_created',
                    title: 'Order Disputed',
                    message: `Order #${order.id} has been disputed due to QC issues`,
                    read: false,
                }
            );
        } catch (error) {
            console.error('Error sending dispute notification:', error);
        }
    }

    // Send refund notification
    private async sendRefundNotification(order: any) {
        try {
            // Send to buyer
            await notificationService.sendToUser(
                order.buyerId,
                {
                    type: 'refund_processed',
                    title: 'Refund Processed',
                    message: `Refund of ₹${order.totalAmount} has been processed for order #${order.id}`,
                    read: false,
                }
            );

            // WhatsApp notification removed - integration simplified
        } catch (error) {
            console.error('Error sending refund notification:', error);
        }
    }
}

export const escrowService = new EscrowService();

// API Routes for Escrow
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { action, orderId, escrowId, amount, currency, paymentMethod, transactionId, qcPassed, reason } = await request.json();

        switch (action) {
            case 'create':
                if (!orderId || !amount) {
                    return NextResponse.json({ success: false, error: 'Order ID and amount are required' }, { status: 400 });
                }
                return NextResponse.json(await escrowService.createEscrowAccount(orderId, amount, currency));

            case 'fund':
                if (!escrowId || !paymentMethod || !transactionId) {
                    return NextResponse.json({ success: false, error: 'Escrow ID, payment method, and transaction ID are required' }, { status: 400 });
                }
                return NextResponse.json(await escrowService.fundEscrowAccount(escrowId, paymentMethod, transactionId));

            case 'release':
                if (!escrowId || !orderId) {
                    return NextResponse.json({ success: false, error: 'Escrow ID and order ID are required' }, { status: 400 });
                }
                return NextResponse.json(await escrowService.releaseFunds(escrowId, orderId, qcPassed));

            case 'refund':
                if (!escrowId || !reason) {
                    return NextResponse.json({ success: false, error: 'Escrow ID and reason are required' }, { status: 400 });
                }
                return NextResponse.json(await escrowService.refundEscrowAccount(escrowId, reason));

            default:
                return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Escrow API error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');
        const escrowId = searchParams.get('escrowId');

        if (orderId) {
            const escrowAccount = await prisma.escrowAccount.findFirst({
                where: { orderId },
                include: { order: true }
            });
            return NextResponse.json({ success: true, data: escrowAccount });
        }

        if (escrowId) {
            const escrowAccount = await prisma.escrowAccount.findUnique({
                where: { id: escrowId },
                include: { order: true }
            });
            return NextResponse.json({ success: true, data: escrowAccount });
        }

        return NextResponse.json({ success: false, error: 'Order ID or Escrow ID is required' }, { status: 400 });
    } catch (error) {
        console.error('Escrow GET API error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
