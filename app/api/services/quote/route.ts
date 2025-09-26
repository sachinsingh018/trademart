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
        const { serviceId, supplierId, budget, timeline, requirements, contactInfo } = body;

        if (!serviceId || !supplierId || !budget || !timeline || !requirements) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Create the service quote
        const quote = await prisma.serviceQuote.create({
            data: {
                serviceId,
                supplierId,
                buyerId: session.user.id,
                price: 0, // Will be updated by supplier
                currency: "USD",
                leadTimeDays: parseInt(timeline) || 30,
                notes: `${requirements}\n\nBudget: ${budget}\nContact: ${contactInfo || 'Not provided'}`,
                status: "pending",
            },
        });

        return NextResponse.json({
            success: true,
            quote: {
                id: quote.id,
                status: quote.status,
                createdAt: quote.createdAt,
            }
        });

    } catch (error) {
        console.error("Error creating service quote:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
