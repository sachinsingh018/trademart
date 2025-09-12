import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        // Test database connection
        const userCount = await prisma.user.count();

        // Get first few users (without passwords)
        const users = await prisma.user.findMany({
            take: 5,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                passwordHash: false, // Don't include password hash
            }
        });

        return NextResponse.json({
            success: true,
            userCount,
            users,
            databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
            nodeEnv: process.env.NODE_ENV,
        });
    } catch (error) {
        console.error("Debug endpoint error:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
            nodeEnv: process.env.NODE_ENV,
        }, { status: 500 });
    }
}
