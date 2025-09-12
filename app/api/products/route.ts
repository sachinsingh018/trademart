import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
            case "orders":
                orderBy = { orders: "desc" };
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

        // Get products with pagination
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    supplier: {
                        select: {
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
            prisma.product.count({ where }),
        ]);

        // Calculate statistics
        const stats = await prisma.product.aggregate({
            _count: { id: true },
            _sum: { views: true, orders: true },
        });

        const inStockCount = await prisma.product.count({
            where: { inStock: true },
        });

        return NextResponse.json({
            success: true,
            data: {
                products,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
                stats: {
                    totalProducts: stats._count.id,
                    totalViews: stats._sum.views || 0,
                    totalOrders: stats._sum.orders || 0,
                    inStockProducts: inStockCount,
                },
            },
        });
    } catch (error) {
        console.error("Products fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch products",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
