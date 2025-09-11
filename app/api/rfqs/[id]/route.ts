import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        
        const rfq = await prisma.rfq.findUnique({
            where: { id },
            include: {
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
                },
                quotes: {
                    include: {
                        supplier: {
                            include: {
                                user: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        })

        if (!rfq) {
            return NextResponse.json(
                { error: "RFQ not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(rfq)
    } catch (error) {
        console.error("Error fetching RFQ:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
