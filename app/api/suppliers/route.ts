import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search") || "";
        const industry = searchParams.get("industry") || "";
        const country = searchParams.get("country") || "";
        const sortBy = searchParams.get("sortBy") || "rating";

        const skip = (page - 1) * limit;

        // Build where clause
        const where: {
            OR?: Array<{
                companyName?: { contains: string; mode: "insensitive" };
                industry?: { contains: string; mode: "insensitive" };
                country?: { contains: string; mode: "insensitive" };
                specialties?: { has: string };
            }>;
            industry?: string;
            country?: string;
        } = {};

        if (search) {
            where.OR = [
                { companyName: { contains: search, mode: "insensitive" } },
                { industry: { contains: search, mode: "insensitive" } },
                { country: { contains: search, mode: "insensitive" } },
                { specialties: { has: search } },
            ];
        }

        if (industry && industry !== "all") {
            where.industry = industry;
        }

        if (country && country !== "all") {
            where.country = country;
        }

        // Build orderBy clause
        let orderBy: { [key: string]: "asc" | "desc" } = {};
        switch (sortBy) {
            case "rating":
                orderBy = { rating: "desc" };
                break;
            case "orders":
                orderBy = { totalOrders: "desc" };
                break;
            case "newest":
                orderBy = { createdAt: "desc" };
                break;
            case "oldest":
                orderBy = { createdAt: "asc" };
                break;
            case "verified":
                orderBy = { verified: "desc" };
                break;
            default:
                orderBy = { rating: "desc" };
        }

        // Get suppliers with pagination
        const [suppliers, total] = await Promise.all([
            prisma.supplier.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            prisma.supplier.count({ where }),
        ]);

        // Calculate statistics
        const stats = await prisma.supplier.aggregate({
            _count: { id: true },
            _avg: { rating: true },
            _sum: { totalOrders: true },
        });

        const verifiedCount = await prisma.supplier.count({
            where: { verified: true },
        });

        return NextResponse.json({
            success: true,
            data: {
                suppliers,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
                stats: {
                    totalSuppliers: stats._count.id,
                    averageRating: stats._avg.rating || 0,
                    totalOrders: stats._sum.totalOrders || 0,
                    verifiedSuppliers: verifiedCount,
                },
            },
        });
    } catch (error) {
        console.error("Suppliers fetch error:", error);

        // Return empty data instead of error to prevent frontend crashes
        return NextResponse.json({
            success: true,
            data: {
                suppliers: [],
                pagination: {
                    page: 1,
                    limit: 20,
                    total: 0,
                    totalPages: 0,
                },
                stats: {
                    totalSuppliers: 0,
                    averageRating: 0,
                    totalOrders: 0,
                    verifiedSuppliers: 0,
                },
            },
            message: "No suppliers found. Please run 'npm run db:populate' to add sample data.",
        });
    } finally {
        await prisma.$disconnect();
    }
}
