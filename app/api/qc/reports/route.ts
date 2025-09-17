import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notificationService } from "@/lib/notifications";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { orderId, photos, videos, notes, score, status } = await request.json();

        if (!orderId || (!photos?.length && !videos?.length)) {
            return NextResponse.json({
                success: false,
                error: 'Order ID and at least one photo or video are required'
            }, { status: 400 });
        }

        // Verify order exists and user has access
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                buyer: true,
                supplier: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        // Check if user is buyer or supplier for this order
        if (session.user.id !== order.buyerId && session.user.id !== order.supplier.userId) {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
        }

        // Create QC report
        const qcReport = await prisma.qCReport.create({
            data: {
                orderId,
                status: status || (score >= 70 ? 'passed' : 'failed'),
                photos: photos || [],
                videos: videos || [],
                notes: notes || '',
                score: score || 0
            },
            include: {
                order: {
                    include: {
                        buyer: true,
                        supplier: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });

        // Update order status based on QC result
        if (qcReport.status === 'passed') {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: 'delivered' }
            });

            // Release escrow funds
            try {
                const escrowAccount = await prisma.escrowAccount.findUnique({
                    where: { orderId }
                });

                if (escrowAccount && escrowAccount.status === 'funded') {
                    await prisma.escrowAccount.update({
                        where: { id: escrowAccount.id },
                        data: {
                            status: 'released',
                            releasedAt: new Date(),
                            qcPassed: true
                        }
                    });

                    // Send payment release notification
                    await notificationService.sendToUser(
                        order.supplier.userId,
                        {
                            type: 'payment_released',
                            title: 'Payment Released!',
                            message: `Payment of ₹${order.totalAmount} has been released for order #${order.orderNumber}`,
                            read: false,
                        }
                    );

                    // WhatsApp notification removed - integration simplified
                }
            } catch (error) {
                console.error('Error releasing escrow funds:', error);
            }
        } else if (qcReport.status === 'failed') {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: 'disputed' }
            });

            // Send dispute notification
            await notificationService.sendToUser(
                order.buyerId,
                {
                    type: 'dispute_created',
                    title: 'QC Failed - Order Disputed',
                    message: `Order #${order.orderNumber} has been disputed due to QC failure`,
                    read: false,
                }
            );

            await notificationService.sendToUser(
                order.supplier.userId,
                {
                    type: 'dispute_created',
                    title: 'QC Failed - Order Disputed',
                    message: `Order #${order.orderNumber} has been disputed due to QC failure`,
                    read: false,
                }
            );
        }

        // Send QC completion notification
        await notificationService.sendToUser(
            order.buyerId,
            {
                type: 'qc_completed',
                title: 'QC Report Submitted',
                message: `QC report has been submitted for order #${order.orderNumber}`,
                read: false,
            }
        );

        await notificationService.sendToUser(
            order.supplier.userId,
            {
                type: 'qc_completed',
                title: 'QC Report Submitted',
                message: `QC report has been submitted for order #${order.orderNumber}`,
                read: false,
            }
        );

        return NextResponse.json({
            success: true,
            data: qcReport
        }, { status: 201 });

    } catch (error) {
        console.error('QC report creation error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to create QC report'
        }, { status: 500 });
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

        if (!orderId) {
            return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
        }

        // Verify order exists and user has access
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                buyer: true,
                supplier: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        // Check if user is buyer or supplier for this order
        if (session.user.id !== order.buyerId && session.user.id !== order.supplier.userId) {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
        }

        // Get QC reports for the order
        const qcReports = await prisma.qCReport.findMany({
            where: { orderId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: qcReports
        });

    } catch (error) {
        console.error('QC report fetch error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch QC reports'
        }, { status: 500 });
    }
}
