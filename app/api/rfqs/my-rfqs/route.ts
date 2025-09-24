import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        if (session.user.role !== 'buyer') {
            return NextResponse.json({ success: false, error: 'Only buyers can access their RFQs' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";
        const status = searchParams.get("status") || "";
        const sortBy = searchParams.get("sortBy") || "newest";

        const skip = (page - 1) * limit;

        // Build where clause for user's RFQs
        const where: {
            buyerId: string;
            OR?: Array<{
                title?: { contains: string; mode: "insensitive" };
                description?: { contains: string; mode: "insensitive" };
                category?: { contains: string; mode: "insensitive" };
                requirements?: { has: string };
            }>;
            category?: string;
            status?: string;
        } = {
            buyerId: session.user.id
        };

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } },
                { requirements: { has: search } },
            ];
        }

        if (category && category !== "all") {
            where.category = category;
        }

        if (status && status !== "all") {
            where.status = status;
        }

        // Build orderBy clause
        let orderBy: { [key: string]: "asc" | "desc" } | { quotes: { _count: "desc" } } = {};
        switch (sortBy) {
            case "newest":
                orderBy = { createdAt: "desc" };
                break;
            case "oldest":
                orderBy = { createdAt: "asc" };
                break;
            case "budget-high":
                orderBy = { budget: "desc" };
                break;
            case "budget-low":
                orderBy = { budget: "asc" };
                break;
            case "quotes":
                orderBy = { quotes: { _count: "desc" } };
                break;
            default:
                orderBy = { createdAt: "desc" };
        }

        // Get user's RFQs with pagination
        console.log("Fetching RFQs for user:", session.user.id, "with where clause:", where);
        const [rfqs, total] = await Promise.all([
            prisma.rfq.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    buyer: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    quotes: {
                        select: {
                            id: true,
                        },
                    },
                },
            }),
            prisma.rfq.count({ where }),
        ]);
        console.log("Found RFQs:", rfqs.length, "total:", total);

        // Calculate statistics for user's RFQs
        const stats = await prisma.rfq.aggregate({
            where: { buyerId: session.user.id },
            _count: { id: true },
            _sum: { budget: true },
        });

        const openCount = await prisma.rfq.count({
            where: { buyerId: session.user.id, status: "open" },
        });

        const quotedCount = await prisma.rfq.count({
            where: { buyerId: session.user.id, status: "quoted" },
        });

        const totalQuotes = await prisma.quote.count({
            where: {
                rfq: {
                    buyerId: session.user.id
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                rfqs,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
                stats: {
                    totalRfqs: stats._count.id,
                    totalBudget: stats._sum.budget || 0,
                    openRfqs: openCount,
                    quotedRfqs: quotedCount,
                    totalQuotes,
                },
            },
        });
    } catch (error) {
        console.error("User RFQs fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch user RFQs",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
