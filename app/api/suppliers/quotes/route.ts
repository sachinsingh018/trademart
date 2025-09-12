import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get supplier's quotes
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'supplier') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // Get supplier
        const supplier = await prisma.supplier.findUnique({
            where: { userId: session.user.id }
        });

        if (!supplier) {
            return NextResponse.json({ success: false, error: 'Supplier profile not found' }, { status: 404 });
        }

        const quotes = await prisma.quote.findMany({
            where: { supplierId: supplier.id },
            include: {
                rfq: {
                    include: {
                        buyer: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: quotes
        });

    } catch (error) {
        console.error('Quotes fetch error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch quotes' }, { status: 500 });
    }
}
