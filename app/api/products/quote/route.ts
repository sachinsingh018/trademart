import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { productId, supplierId, quantity, specifications, notes } = body;

        if (!productId || !supplierId || !quantity) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // First, get the product details to create a proper RFQ
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { name: true, category: true, subcategory: true, unit: true, price: true, currency: true }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Create an RFQ for the product quote request
        const rfq = await prisma.rfq.create({
            data: {
                buyerId: session.user.id,
                title: `Quote Request for ${product.name}`,
                description: `Product Quote Request:\nQuantity: ${quantity} ${product.unit}\nSpecifications: ${JSON.stringify(specifications)}\nNotes: ${notes || 'None'}`,
                category: product.category,
                subcategory: product.subcategory,
                quantity: parseInt(quantity),
                unit: product.unit,
                budget: product.price ? parseFloat(product.price.toString()) * parseInt(quantity) : null,
                currency: product.currency,
                status: "open",
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            },
        });

        // Now create a quote for this RFQ
        const quote = await prisma.quote.create({
            data: {
                rfqId: rfq.id,
                supplierId,
                price: 0, // Will be updated by supplier
                currency: product.currency,
                leadTimeDays: 30, // Default
                notes: `Product Quote Request:\nQuantity: ${quantity}\nSpecifications: ${JSON.stringify(specifications)}\nNotes: ${notes || 'None'}`,
            },
        });

        return NextResponse.json({
            success: true,
            quote: {
                id: quote.id,
                rfqId: rfq.id,
                status: "pending",
                createdAt: quote.createdAt,
            }
        });

    } catch (error) {
        console.error("Error creating product quote:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
