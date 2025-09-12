import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";
        const status = searchParams.get("status") || "";
        const sortBy = searchParams.get("sortBy") || "newest";
        const supplier = searchParams.get("supplier") === "true";

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

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

        // If supplier view, filter by supplier's industry and specialties
        if (supplier) {
            const session = await getServerSession(authOptions);
            if (session?.user?.role === 'supplier') {
                const supplierProfile = await prisma.supplier.findUnique({
                    where: { userId: session.user.id }
                });

                if (supplierProfile) {
                    where.OR = [
                        { category: supplierProfile.industry },
                        { requirements: { hasSome: supplierProfile.specialties } }
                    ];
                }
            }
        }

        // Build orderBy clause
        let orderBy: any = {};
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

        // Get RFQs with pagination
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

        // Calculate statistics
        const stats = await prisma.rfq.aggregate({
            _count: { id: true },
            _sum: { budget: true },
        });

        const openCount = await prisma.rfq.count({
            where: { status: "open" },
        });

        const quotedCount = await prisma.rfq.count({
            where: { status: "quoted" },
        });

        const totalQuotes = await prisma.quote.count();

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
        console.error("RFQs fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch RFQs",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}