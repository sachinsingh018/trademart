import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Test database connection
        const userCount = await prisma.user.count();
        const supplierCount = await prisma.supplier.count();
        const productCount = await prisma.product.count();

        return NextResponse.json({
            success: true,
            message: "Database connection successful",
            data: {
                users: userCount,
                suppliers: supplierCount,
                products: productCount,
            },
        });
    } catch (error) {
        console.error("Database test error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Database connection failed",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
