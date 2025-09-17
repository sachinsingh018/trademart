import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get admin dashboard data
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // Get all statistics
        const [
            totalUsers,
            totalSuppliers,
            totalProducts,
            totalRfqs,
            totalQuotes,
            totalTransactions,
            pendingVerifications,
            recentUsers,
            recentRfqs,
            topSuppliers
        ] = await Promise.all([
            prisma.user.count(),
            prisma.supplier.count(),
            prisma.product.count(),
            prisma.rfq.count(),
            prisma.quote.count(),
            prisma.transaction.count(),
            prisma.supplier.count({ where: { verified: false } }),
            
            // Recent users (last 10)
            prisma.user.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            }),
            
            // Recent RFQs (last 10)
            prisma.rfq.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    buyer: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            
            // Top suppliers by rating and orders
            prisma.supplier.findMany({
                take: 10,
                orderBy: [
                    { rating: 'desc' },
                    { totalOrders: 'desc' }
                ],
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            })
        ]);

        const dashboardStats = {
            totalUsers,
            totalSuppliers,
            totalProducts,
            totalRfqs,
            totalQuotes,
            totalTransactions,
            pendingVerifications,
            recentUsers,
            recentRfqs,
            topSuppliers
        };

        return NextResponse.json({
            success: true,
            ...dashboardStats
        });

    } catch (error) {
        console.error('Admin dashboard error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to fetch dashboard data' 
        }, { status: 500 });
    }
}
