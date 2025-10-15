import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: supplierId } = await params;

        // Fetch the supplier with all related data
        const supplier = await prisma.supplier.findUnique({
            where: { id: supplierId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                products: {
                    where: { inStock: true },
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        currency: true,
                        minOrderQuantity: true,
                        unit: true,
                        category: true,
                        images: true,
                        inStock: true,
                    },
                    take: 6, // Limit to 6 products for performance
                },
                reviews: {
                    include: {
                        buyer: {
                            select: {
                                name: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 10, // Limit to 10 recent reviews
                }
            }
        });

        if (!supplier) {
            return NextResponse.json({ success: false, error: 'Supplier not found' }, { status: 404 });
        }

        // Transform the data to match the frontend interface
        const transformedSupplier = {
            id: supplier.id,
            name: supplier.user?.name || "Unknown",
            company: supplier.companyName,
            country: supplier.country,
            industry: supplier.industry,
            supplierCategory: supplier.supplierCategory,
            verified: supplier.verified,
            rating: supplier.rating,
            totalOrders: supplier.totalOrders,
            responseTime: supplier.responseTime || "24 hours",
            minOrderValue: supplier.minOrderValue || 0,
            currency: supplier.currency || "USD",
            description: supplier.description || "",
            specialties: supplier.specialties || [],
            certifications: supplier.certifications || [],
            establishedYear: supplier.establishedYear || new Date().getFullYear(),
            employees: supplier.employees || "1-10",
            website: supplier.website,
            logo: supplier.companyLogo,
            joinedDate: supplier.createdAt,
            lastActive: supplier.updatedAt,
            contactInfo: {
                email: supplier.user?.email || "",
                phone: supplier.phone || "",
                address: supplier.address || "",
                city: supplier.city || "",
                postalCode: supplier.postalCode || "",
            },
            businessInfo: {
                businessType: supplier.businessType || "Manufacturer",
                annualRevenue: "Not disclosed",
                exportMarkets: [],
                mainProducts: [],
            },
            reviews: supplier.reviews.map(review => ({
                id: review.id,
                buyer: review.buyer?.name || "Anonymous",
                rating: review.rating,
                comment: review.comment,
                date: review.createdAt,
                orderValue: review.orderValue || 0,
            }))
        };

        return NextResponse.json({
            success: true,
            data: {
                supplier: transformedSupplier,
                products: supplier.products
            }
        });

    } catch (error) {
        console.error("Supplier fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch supplier",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
