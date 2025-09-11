import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Check if user is a supplier
        const supplier = await prisma.supplier.findUnique({
            where: { userId: session.user.id }
        })

        if (!supplier) {
            return NextResponse.json(
                { error: "Only suppliers can submit quotes" },
                { status: 403 }
            )
        }

        const { rfqId, price, leadTimeDays, notes } = await request.json()

        if (!rfqId || !price || !leadTimeDays) {
            return NextResponse.json(
                { error: "RFQ ID, price, and lead time are required" },
                { status: 400 }
            )
        }

        // Check if RFQ exists and is open
        const rfq = await prisma.rfq.findUnique({
            where: { id: rfqId }
        })

        if (!rfq) {
            return NextResponse.json(
                { error: "RFQ not found" },
                { status: 404 }
            )
        }

        if (rfq.status !== "open") {
            return NextResponse.json(
                { error: "RFQ is not open for quotes" },
                { status: 400 }
            )
        }

        // Check if supplier already quoted this RFQ
        const existingQuote = await prisma.quote.findFirst({
            where: {
                rfqId,
                supplierId: supplier.id
            }
        })

        if (existingQuote) {
            return NextResponse.json(
                { error: "You have already submitted a quote for this RFQ" },
                { status: 400 }
            )
        }

        const quote = await prisma.quote.create({
            data: {
                rfqId,
                supplierId: supplier.id,
                price,
                leadTimeDays,
                notes
            },
            include: {
                supplier: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                rfq: {
                    select: {
                        title: true,
                        description: true
                    }
                }
            }
        })

        return NextResponse.json(quote, { status: 201 })
    } catch (error) {
        console.error("Error creating quote:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
