import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { status } = await request.json()

        if (!status || !["accepted", "rejected"].includes(status)) {
            return NextResponse.json(
                { error: "Status must be 'accepted' or 'rejected'" },
                { status: 400 }
            )
        }

        // Get the quote with RFQ details
        const quote = await prisma.quote.findUnique({
            where: { id: params.id },
            include: {
                rfq: true,
                supplier: true
            }
        })

        if (!quote) {
            return NextResponse.json(
                { error: "Quote not found" },
                { status: 404 }
            )
        }

        // Check if user is the buyer of this RFQ
        if (quote.rfq.buyerId !== session.user.id) {
            return NextResponse.json(
                { error: "Only the buyer can accept/reject quotes" },
                { status: 403 }
            )
        }

        // Update quote status
        const updatedQuote = await prisma.quote.update({
            where: { id: params.id },
            data: { status },
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

        // If quote is accepted, create transaction and close RFQ
        if (status === "accepted") {
            await prisma.$transaction([
                prisma.transaction.create({
                    data: {
                        buyerId: session.user.id,
                        supplierId: quote.supplierId,
                        rfqId: quote.rfqId,
                        amount: quote.price
                    }
                }),
                prisma.rfq.update({
                    where: { id: quote.rfqId },
                    data: { status: "closed" }
                })
            ])
        }

        return NextResponse.json(updatedQuote)
    } catch (error) {
        console.error("Error updating quote:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
