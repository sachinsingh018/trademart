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

        // Get supplier ID
        const supplier = await prisma.supplier.findUnique({
            where: { userId: session.user.id },
        });

        if (!supplier) {
            return NextResponse.json(
                { error: "Supplier profile not found" },
                { status: 404 }
            );
        }

        // Get supplier's products
        const products = await prisma.product.findMany({
            where: { supplierId: supplier.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error("Supplier products fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch supplier products",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
