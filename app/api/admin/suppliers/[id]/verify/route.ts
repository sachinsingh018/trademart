import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH - Verify/Unverify supplier
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { verified } = await request.json();

        if (typeof verified !== 'boolean') {
            return NextResponse.json({ 
                success: false, 
                error: 'Invalid verification status' 
            }, { status: 400 });
        }

        const supplier = await prisma.supplier.update({
            where: { id },
            data: { verified },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: supplier
        });

    } catch (error) {
        console.error('Supplier verification error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to update supplier verification' 
        }, { status: 500 });
    }
}

// GET - Get supplier details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const supplier = await prisma.supplier.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        createdAt: true
                    }
                },
                products: {
                    take: 10,
                    orderBy: { createdAt: 'desc' }
                },
                quotes: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        rfq: {
                            select: {
                                id: true,
                                title: true,
                                buyer: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                reviews: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        buyer: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (!supplier) {
            return NextResponse.json({ 
                success: false, 
                error: 'Supplier not found' 
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: supplier
        });

    } catch (error) {
        console.error('Supplier fetch error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to fetch supplier details' 
        }, { status: 500 });
    }
}
