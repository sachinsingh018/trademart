import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Create new quote
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'supplier') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            rfqId,
            price,
            currency,
            leadTimeDays,
            notes,
        } = body;

        // Get supplier
        const supplier = await prisma.supplier.findUnique({
            where: { userId: session.user.id }
        });

        if (!supplier) {
            return NextResponse.json({ success: false, error: 'Supplier profile not found' }, { status: 404 });
        }

        // Verify RFQ exists
        const rfq = await prisma.rfq.findUnique({
            where: { id: rfqId }
        });

        if (!rfq) {
            return NextResponse.json({ success: false, error: 'RFQ not found' }, { status: 404 });
        }

        // Check if supplier already quoted this RFQ
        const existingQuote = await prisma.quote.findFirst({
            where: {
                rfqId: rfqId,
                supplierId: supplier.id
            }
        });

        if (existingQuote) {
            return NextResponse.json({ success: false, error: 'You have already submitted a quote for this RFQ' }, { status: 400 });
        }

        const quote = await prisma.quote.create({
            data: {
                rfqId,
                supplierId: supplier.id,
                price: parseFloat(price),
                currency,
                leadTimeDays: parseInt(leadTimeDays),
                notes,
                status: 'pending'
            },
            include: {
                rfq: {
                    include: {
                        buyer: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: quote
        });

    } catch (error) {
        console.error('Quote creation error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create quote' }, { status: 500 });
    }
}
