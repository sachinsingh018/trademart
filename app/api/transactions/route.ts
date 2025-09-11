import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get("status")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")

        const where: Record<string, unknown> = {
            OR: [
                { buyerId: session.user.id },
                { supplier: { userId: session.user.id } }
            ]
        }

        if (status) {
            where.status = status
        }

        const transactions = await prisma.transaction.findMany({
            where,
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
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (page - 1) * limit,
            take: limit
        })

        const total = await prisma.transaction.count({ where })

        return NextResponse.json({
            transactions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error("Error fetching transactions:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
