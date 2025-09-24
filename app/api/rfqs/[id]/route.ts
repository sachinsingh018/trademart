import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const rfqId = params.id;

        // Fetch the RFQ with all related data
        const rfq = await prisma.rfq.findUnique({
            where: { id: rfqId },
            include: {
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                quotes: {
                    include: {
                        supplier: {
                            select: {
                                id: true,
                                companyName: true,
                                country: true,
                                verified: true,
                                rating: true,
                                user: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!rfq) {
            return NextResponse.json({ success: false, error: 'RFQ not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: { rfq }
        });

    } catch (error) {
        console.error("RFQ fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch RFQ",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const rfqId = params.id;

        // Check if the RFQ exists and belongs to the current user
        const rfq = await prisma.rfq.findUnique({
            where: { id: rfqId },
            select: { buyerId: true }
        });

        if (!rfq) {
            return NextResponse.json({ success: false, error: 'RFQ not found' }, { status: 404 });
        }

        // Check if the user is the owner of the RFQ
        if (rfq.buyerId !== session.user.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized to delete this RFQ' }, { status: 403 });
        }

        // Delete the RFQ (this will cascade delete related quotes due to foreign key constraints)
        await prisma.rfq.delete({
            where: { id: rfqId }
        });

        return NextResponse.json({
            success: true,
            message: 'RFQ deleted successfully'
        });

    } catch (error) {
        console.error("RFQ delete error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to delete RFQ",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}