import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { id } = await params

        const transaction = await prisma.transaction.findUnique({
            where: { id },
            include: {
                buyer: true,
                supplier: true
            }
        })

        if (!transaction) {
            return NextResponse.json(
                { error: "Transaction not found" },
                { status: 404 }
            )
        }

        // Check if user is the buyer
        if (transaction.buyerId !== session.user.id) {
            return NextResponse.json(
                { error: "Only the buyer can release funds" },
                { status: 403 }
            )
        }

        if (transaction.status !== "held") {
            return NextResponse.json(
                { error: "Transaction is not in held status" },
                { status: 400 }
            )
        }

        const updatedTransaction = await prisma.transaction.update({
            where: { id },
            data: { status: "released" },
            include: {
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                supplier: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                rfq: {
                    select: {
                        id: true,
                        title: true,
                        description: true
                    }
                }
            }
        })

        return NextResponse.json(updatedTransaction)
    } catch (error) {
        console.error("Error releasing transaction:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
