import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user is a buyer
        if (session.user.role !== "buyer") {
            return NextResponse.json(
                { error: "Only buyers can view quotes" },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const rfqId = searchParams.get("rfqId");

        // Build where clause
        const where: {
            rfq: {
                buyerId: string;
            };
            rfqId?: string;
        } = {
            rfq: {
                buyerId: session.user.id
            }
        };

        // If specific RFQ ID is provided, filter by that
        if (rfqId) {
            where.rfqId = rfqId;
        }

        // Get quotes for buyer's RFQs
        const quotes = await prisma.quote.findMany({
            where,
            include: {
                rfq: {
                    select: {
                        id: true,
                        title: true,
                        budget: true,
                        currency: true,
                        status: true,
                        createdAt: true
                    }
                },
                supplier: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                phone: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // Group quotes by RFQ for better organization
        const quotesByRfq = quotes.reduce((acc, quote) => {
            const rfqId = quote.rfq.id;
            if (!acc[rfqId]) {
                acc[rfqId] = {
                    rfq: {
                        ...quote.rfq,
                        budget: quote.rfq.budget ? Number(quote.rfq.budget) : null
                    },
                    quotes: []
                };
            }
            acc[rfqId].quotes.push({
                id: quote.id,
                price: Number(quote.price),
                leadTimeDays: quote.leadTimeDays,
                notes: quote.notes,
                status: quote.status,
                createdAt: quote.createdAt,
                supplier: quote.supplier
            });
            return acc;
        }, {} as Record<string, {
            rfq: {
                id: string;
                title: string;
                budget: number | null;
                currency: string | null;
                status: string;
                createdAt: Date;
            };
            quotes: Array<{
                id: string;
                price: number;
                leadTimeDays: number;
                notes: string | null;
                status: string;
                createdAt: Date;
                supplier: {
                    id: string;
                    companyName: string;
                    user: {
                        name: string | null;
                        email: string;
                        phone: string | null;
                    };
                };
            }>;
        }>);

        return NextResponse.json({
            success: true,
            data: {
                quotes: quotes,
                quotesByRfq: quotesByRfq,
                totalQuotes: quotes.length
            }
        });

    } catch (error) {
        console.error("Error fetching buyer quotes:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
