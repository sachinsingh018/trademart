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
                result = await prisma.supplier.update({
                    where: { id },
                    data: { viewCount: { increment: 1 } }
                });
                break;
            case 'rfq':
                result = await prisma.rfq.update({
                    where: { id },
                    data: { viewCount: { increment: 1 } }
                });
                break;
            default:
                return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
        }

        const viewCount = 'views' in result ? result.views : 'viewCount' in result ? result.viewCount : 0;

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
