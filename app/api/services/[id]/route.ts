import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: serviceId } = await params;

        // Get the service with supplier information
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            select: {
                id: true,
                name: true,
                description: true,
                category: true,
                subcategory: true,
                price: true,
                currency: true,
                pricingModel: true,
                minDuration: true,
                maxDuration: true,
                unit: true,
                specifications: true,
                features: true,
                tags: true,
                images: true,
                isAvailable: true,
                leadTime: true,
                views: true,
                orders: true,
                rating: true,
                reviews: true,
                deliveryMethod: true,
                experience: true,
                certifications: true,
                portfolio: true,
                createdAt: true,
                updatedAt: true,
                supplier: {
                    select: {
                        id: true,
                        companyName: true,
                        country: true,
                        verified: true,
                        rating: true,
                        totalOrders: true,
                        responseTime: true,
                        phone: true,
                        contactPhone: true,
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!service) {
            return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
        }

        // Increment view count
        await prisma.service.update({
            where: { id: serviceId },
            data: { views: { increment: 1 } }
        });

        // Get related services (same category, different service)
        const relatedServices = await prisma.service.findMany({
            where: {
                category: service.category,
                id: { not: serviceId },
                isAvailable: true
            },
            take: 3,
            select: {
                id: true,
                name: true,
                price: true,
                currency: true,
                pricingModel: true,
                images: true
            }
        });

        // Transform the data to match the expected format
        const transformedService = {
            ...service,
            supplier: {
                id: service.supplier.id,
                name: service.supplier.user.name,
                company: service.supplier.companyName,
                country: service.supplier.country,
                verified: service.supplier.verified,
                rating: service.supplier.rating,
                totalOrders: service.supplier.totalOrders,
                responseTime: service.supplier.responseTime,
                phone: service.supplier.phone || service.supplier.contactPhone,
            },
            relatedServices: relatedServices.map(rs => ({
                id: rs.id,
                name: rs.name,
                price: rs.price,
                currency: rs.currency,
                pricingModel: rs.pricingModel,
                image: rs.images[0] || '/placeholder-service.jpg'
            }))
        };

        return NextResponse.json({
            success: true,
            data: transformedService
        });

    } catch (error) {
        console.error("Service fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch service",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id: serviceId } = await params;
        const body = await request.json();

        // Check if the service exists and belongs to the current supplier
        const existingService = await prisma.service.findUnique({
            where: { id: serviceId },
            include: {
                supplier: {
                    select: { userId: true }
                }
            }
        });

        if (!existingService) {
            return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
        }

        // Check if the user is the owner of the service
        if (existingService.supplier.userId !== session.user.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized to edit this service' }, { status: 403 });
        }

        // Update the service
        const updatedService = await prisma.service.update({
            where: { id: serviceId },
            data: {
                name: body.name,
                description: body.description,
                category: body.category,
                subcategory: body.subcategory,
                price: body.price,
                currency: body.currency,
                pricingModel: body.pricingModel,
                minDuration: body.minDuration,
                maxDuration: body.maxDuration,
                unit: body.unit,
                isAvailable: body.isAvailable,
                leadTime: body.leadTime,
                specifications: body.specifications,
                features: body.features,
                tags: body.tags,
                images: body.images,
                deliveryMethod: body.deliveryMethod,
                experience: body.experience,
                certifications: body.certifications,
                portfolio: body.portfolio,
                updatedAt: new Date()
            },
            include: {
                supplier: {
                    select: {
                        id: true,
                        companyName: true,
                        country: true,
                        verified: true,
                        rating: true,
                        totalOrders: true,
                        responseTime: true,
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedService,
            message: 'Service updated successfully'
        });

    } catch (error) {
        console.error("Service update error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to update service",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id: serviceId } = await params;

        // Check if the service exists and belongs to the current supplier
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            include: {
                supplier: {
                    select: { userId: true }
                }
            }
        });

        if (!service) {
            return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
        }

        // Check if the user is the owner of the service
        if (service.supplier.userId !== session.user.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized to delete this service' }, { status: 403 });
        }

        // Delete the service
        await prisma.service.delete({
            where: { id: serviceId }
        });

        return NextResponse.json({
            success: true,
            message: 'Service deleted successfully'
        });

    } catch (error) {
        console.error("Service delete error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to delete service",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
