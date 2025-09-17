import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { whatsappService } from '@/lib/whatsapp';
import { notificationService } from '@/lib/notifications';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";
        const status = searchParams.get("status") || "";
        const sortBy = searchParams.get("sortBy") || "newest";
        const supplier = searchParams.get("supplier") === "true";

        const skip = (page - 1) * limit;

        // Build where clause
        const where: {
            OR?: Array<{
                title?: { contains: string; mode: "insensitive" };
                description?: { contains: string; mode: "insensitive" };
                category?: { contains: string; mode: "insensitive" };
                requirements?: { has: string };
            } | {
                category?: string;
                requirements?: { hasSome: string[] };
            }>;
            category?: string;
            status?: string;
        } = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } },
                { requirements: { has: search } },
            ];
        }

        if (category && category !== "all") {
            where.category = category;
        }

        if (status && status !== "all") {
            where.status = status;
        }

        // If supplier view, filter by supplier's industry and specialties
        if (supplier) {
            const session = await getServerSession(authOptions);
            if (session?.user?.role === 'supplier') {
                const supplierProfile = await prisma.supplier.findUnique({
                    where: { userId: session.user.id }
                });

                if (supplierProfile) {
                    const orConditions = [];
                    if (supplierProfile.industry) {
                        orConditions.push({ category: supplierProfile.industry });
                    }
                    if (supplierProfile.specialties && supplierProfile.specialties.length > 0) {
                        orConditions.push({ requirements: { hasSome: supplierProfile.specialties } });
                    }
                    if (orConditions.length > 0) {
                        where.OR = orConditions;
                    }
                }
            }
        }

        // Build orderBy clause
        let orderBy: { [key: string]: "asc" | "desc" } | { quotes: { _count: "desc" } } = {};
        switch (sortBy) {
            case "newest":
                orderBy = { createdAt: "desc" };
                break;
            case "oldest":
                orderBy = { createdAt: "asc" };
                break;
            case "budget-high":
                orderBy = { budget: "desc" };
                break;
            case "budget-low":
                orderBy = { budget: "asc" };
                break;
            case "quotes":
                orderBy = { quotes: { _count: "desc" } };
                break;
            default:
                orderBy = { createdAt: "desc" };
        }

        // Get RFQs with pagination
        const [rfqs, total] = await Promise.all([
            prisma.rfq.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    buyer: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    quotes: {
                        select: {
                            id: true,
                        },
                    },
                },
            }),
            prisma.rfq.count({ where }),
        ]);

        // Calculate statistics
        const stats = await prisma.rfq.aggregate({
            _count: { id: true },
            _sum: { budget: true },
        });

        const openCount = await prisma.rfq.count({
            where: { status: "open" },
        });

        const quotedCount = await prisma.rfq.count({
            where: { status: "quoted" },
        });

        const totalQuotes = await prisma.quote.count();

        return NextResponse.json({
            success: true,
            data: {
                rfqs,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
                stats: {
                    totalRfqs: stats._count.id,
                    totalBudget: stats._sum.budget || 0,
                    openRfqs: openCount,
                    quotedRfqs: quotedCount,
                    totalQuotes,
                },
            },
        });
    } catch (error) {
        console.error("RFQs fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch RFQs",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'buyer') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            title,
            description,
            category,
            subcategory,
            quantity,
            unit,
            budget,
            currency = 'USD',
            requirements = [],
            specifications = {},
            attachments = [],
            additionalInfo,
            expiresAt
        } = body;

        // Validate required fields
        if (!title || !description || !category) {
            return NextResponse.json({
                success: false,
                error: 'Title, description, and category are required'
            }, { status: 400 });
        }

        // Create RFQ
        const rfq = await prisma.rfq.create({
            data: {
                buyerId: session.user.id,
                title,
                description,
                category,
                subcategory,
                quantity: quantity ? parseInt(quantity) : null,
                unit,
                budget: budget ? parseFloat(budget) : null,
                currency,
                requirements: Array.isArray(requirements) ? requirements : [],
                specifications: typeof specifications === 'object' ? specifications : {},
                attachments: Array.isArray(attachments) ? attachments : [],
                additionalInfo,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                status: 'open'
            },
            include: {
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        // Send WhatsApp notifications to relevant suppliers
        try {
            await sendRFQNotifications(rfq);
        } catch (error) {
            console.error('Error sending RFQ notifications:', error);
            // Don't fail the RFQ creation if notifications fail
        }

        return NextResponse.json({
            success: true,
            data: rfq
        }, { status: 201 });

    } catch (error) {
        console.error('RFQ creation error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to create RFQ' 
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// Helper function to send RFQ notifications to relevant suppliers
async function sendRFQNotifications(rfq: any) {
    try {
        // Find suppliers that match the RFQ category or have relevant specialties
        const relevantSuppliers = await prisma.supplier.findMany({
            where: {
                verified: true,
                OR: [
                    { industry: rfq.category },
                    { specialties: { has: rfq.category } },
                    { specialties: { hasSome: rfq.requirements || [] } }
                ]
            },
            include: {
                user: {
                    select: {
                        name: true,
                        phone: true
                    }
                }
            },
            take: 10 // Limit to first 10 suppliers to avoid spam
        });

        console.log(`Found ${relevantSuppliers.length} relevant suppliers for RFQ: ${rfq.title}`);

        // Send WhatsApp notifications to each supplier
        for (const supplier of relevantSuppliers) {
            if (supplier.user.phone && whatsappService.validatePhoneNumber(supplier.user.phone)) {
                try {
                    const result = await whatsappService.sendRFQNotification(
                        supplier.user.phone,
                        rfq.title,
                        rfq.buyer.name,
                        rfq.id
                    );

                    if (result.success) {
                        console.log(`✅ WhatsApp notification sent to ${supplier.companyName} (${supplier.user.phone})`);
                        // Send real-time notification to supplier
                        await notificationService.sendToUser(
                            supplier.userId,
                            notificationService.createRFQNotification(
                                rfq.title,
                                rfq.buyer.name,
                                rfq.id
                            )
                        );
                    } else {
                        console.log(`❌ Failed to send WhatsApp notification to ${supplier.companyName}: ${result.error}`);
                        // Send real-time notification even if WhatsApp fails
                        await notificationService.sendToUser(
                            supplier.userId,
                            notificationService.createRFQNotification(
                                rfq.title,
                                rfq.buyer.name,
                                rfq.id
                            )
                        );
                    }
                } catch (error) {
                    console.error(`Error sending notification to ${supplier.companyName}:`, error);
                    // Send real-time notification even if WhatsApp fails
                    await notificationService.sendToUser(
                        supplier.userId,
                        notificationService.createRFQNotification(
                            rfq.title,
                            rfq.buyer.name,
                            rfq.id
                        )
                    );
                }
            } else {
                console.log(`⚠️ Skipping ${supplier.companyName} - invalid phone number: ${supplier.user.phone}`);
                // Send real-time notification even if WhatsApp fails
                await notificationService.sendToUser(
                    supplier.userId,
                    notificationService.createRFQNotification(
                        rfq.title,
                        rfq.buyer.name,
                        rfq.id
                    )
                );
            }
        }
    } catch (error) {
        console.error('Error in sendRFQNotifications:', error);
        throw error;
    }
}