import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";
        const subcategory = searchParams.get("subcategory") || "";
        const sortBy = searchParams.get("sortBy") || "popular";

        const skip = (page - 1) * limit;

        // Build where clause
        const where: {
            OR?: Array<{
                name?: { contains: string; mode: "insensitive" };
                description?: { contains: string; mode: "insensitive" };
                category?: { contains: string; mode: "insensitive" };
                tags?: { has: string };
            }>;
            category?: string;
            subcategory?: string;
        } = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } },
                { tags: { has: search } },
            ];
        }

        if (category && category !== "all") {
            where.category = category;
        }

        if (subcategory && subcategory !== "all") {
            where.subcategory = subcategory;
        }

        // Build orderBy clause
        let orderBy: { [key: string]: "asc" | "desc" } = {};
        switch (sortBy) {
            case "popular":
                orderBy = { views: "desc" };
                break;
            case "rating":
                orderBy = { rating: "desc" };
                break;
            case "price-low":
                orderBy = { price: "asc" };
                break;
            case "price-high":
                orderBy = { price: "desc" };
                break;
            case "newest":
                orderBy = { createdAt: "desc" };
                break;
            case "oldest":
                orderBy = { createdAt: "asc" };
                break;
            default:
                orderBy = { views: "desc" };
        }

        // Get services with pagination
        const [services, total] = await Promise.all([
            prisma.service.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    category: true,
                    subcategory: true,
                    price: true,
                    currency: true,
                    pricingModel: true,
                    minDuration: true,
                    maxDuration: true,
                    unit: true,
                    specifications: true,
                    features: true,
                    tags: true,
                    images: true,
                    isAvailable: true,
                    leadTime: true,
                    views: true,
                    orders: true,
                    rating: true,
                    reviews: true,
                    deliveryMethod: true,
                    experience: true,
                    certifications: true,
                    portfolio: true,
                    createdAt: true,
                    updatedAt: true,
                    supplier: {
                        select: {
                            id: true,
                            companyName: true,
                            country: true,
                            verified: true,
                            rating: true,
                            totalOrders: true,
                            responseTime: true,
                            user: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.service.count({ where }),
        ]);

        // Calculate statistics
        const stats = await prisma.service.aggregate({
            _count: { id: true },
            _sum: { views: true, orders: true },
        });

        const availableCount = await prisma.service.count({
            where: { isAvailable: true },
        });

        return NextResponse.json({
            success: true,
            data: {
                services,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
                stats: {
                    totalServices: stats._count.id,
                    totalViews: stats._sum.views || 0,
                    totalOrders: stats._sum.orders || 0,
                    availableServices: availableCount,
                },
            },
        });
    } catch (error) {
        console.error("Services fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch services",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
