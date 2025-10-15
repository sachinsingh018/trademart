import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { type, id } = await request.json();

        if (!type || !id) {
            return NextResponse.json({ success: false, error: 'Type and ID are required' }, { status: 400 });
        }

        let result;
        switch (type) {
            case 'product':
                result = await prisma.product.update({
                    where: { id },
                    data: { views: { increment: 1 } }
                });
                break;
            case 'service':
                result = await prisma.service.update({
                    where: { id },
                    data: { views: { increment: 1 } }
                });
                break;
            case 'supplier':
                // Suppliers don't have a viewCount field, just fetch the supplier
                result = await prisma.supplier.findUnique({
                    where: { id }
                });
                break;
            case 'rfq':
                // RFQs don't have a viewCount field, just fetch the RFQ
                result = await prisma.rfq.findUnique({
                    where: { id }
                });
                break;
            default:
                return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
        }

        if (!result) {
            return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
        }

        const viewCount = 'views' in result ? result.views : 0;

        return NextResponse.json({
            success: true,
            viewCount
        });

    } catch (error) {
        console.error('Error tracking view:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
