import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "supplier") {
            return NextResponse.json({ error: "Access denied. Supplier role required." }, { status: 403 });
        }

        // Get supplier profile
        console.log("Looking for supplier with userId:", session.user.id);
        const supplier = await prisma.supplier.findUnique({
            where: { userId: session.user.id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        console.log("Found supplier:", supplier);

        if (!supplier) {
            console.log("No supplier found for user:", session.user.id);
            return NextResponse.json(
                { error: "Supplier profile not found" },
                { status: 404 }
            );
        }

        console.log("Returning supplier data:", supplier);
        return NextResponse.json({
            success: true,
            data: supplier,
        });
    } catch (error) {
        console.error("Supplier profile fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch supplier profile",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
