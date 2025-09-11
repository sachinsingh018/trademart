import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get("category")
        const status = searchParams.get("status")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")

        const where: any = {}
        if (category) where.category = category
        if (status) where.status = status

        const rfqs = await prisma.rfq.findMany({
            where,
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
                    }
                },
                _count: {
                    select: {
                        quotes: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (page - 1) * limit,
            take: limit
        })

        const total = await prisma.rfq.count({ where })

        return NextResponse.json({
            rfqs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error("Error fetching RFQs:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { title, description, category } = await request.json()

        if (!title || !description) {
            return NextResponse.json(
                { error: "Title and description are required" },
                { status: 400 }
            )
        }

        const rfq = await prisma.rfq.create({
            data: {
                title,
                description,
                category,
                buyerId: session.user.id
            },
            include: {
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
                }
            }
        })

        return NextResponse.json(rfq, { status: 201 })
    } catch (error) {
        console.error("Error creating RFQ:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
