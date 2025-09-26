import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: productId } = await params;
        console.log("API: Fetching product with ID:", productId);

        // Get the product with supplier information
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: {
                id: true,
                name: true,
                description: true,
                category: true,
                subcategory: true,
                price: true,
                currency: true,
                minOrderQuantity: true,
                unit: true,
                specifications: true,
                features: true,
                tags: true,
                images: true,
                inStock: true,
                stockQuantity: true,
                leadTime: true,
                views: true,
                orders: true,
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

        if (!product) {
            console.log("API: Product not found for ID:", productId);
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        // Increment view count
        await prisma.product.update({
            where: { id: productId },
            data: { views: { increment: 1 } }
        });

        // Get related products (same category, different product)
        const relatedProducts = await prisma.product.findMany({
            where: {
                category: product.category,
                id: { not: productId },
                inStock: true
            },
            take: 3,
            select: {
                id: true,
                name: true,
                price: true,
                currency: true,
                images: true
            }
        });

        // Transform the data to match the expected format
        const transformedProduct = {
            ...product,
            supplier: {
                id: product.supplier.id,
                name: product.supplier.user.name,
                company: product.supplier.companyName,
                country: product.supplier.country,
                verified: product.supplier.verified,
                rating: product.supplier.rating,
                totalOrders: product.supplier.totalOrders,
                responseTime: product.supplier.responseTime,
                phone: product.supplier.phone || product.supplier.contactPhone,
            },
            relatedProducts: relatedProducts.map(rp => ({
                id: rp.id,
                name: rp.name,
                price: rp.price,
                currency: rp.currency,
                image: rp.images[0] || '/placeholder-product.jpg'
            }))
        };

        return NextResponse.json({
            success: true,
            data: transformedProduct
        });

    } catch (error) {
        console.error("Product fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch product",
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

        const { id: productId } = await params;
        const body = await request.json();

        // Check if the product exists and belongs to the current supplier
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                supplier: {
                    select: { userId: true }
                }
            }
        });

        if (!existingProduct) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        // Check if the user is the owner of the product
        if (existingProduct.supplier.userId !== session.user.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized to edit this product' }, { status: 403 });
        }

        // Update the product
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name: body.name,
                description: body.description,
                category: body.category,
                price: body.price,
                currency: body.currency,
                minOrderQuantity: body.minOrderQuantity,
                unit: body.unit,
                inStock: body.inStock,
                stockQuantity: body.stockQuantity,
                specifications: body.specifications,
                leadTime: body.leadTime,
                images: body.images,
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
            data: updatedProduct,
            message: 'Product updated successfully'
        });

    } catch (error) {
        console.error("Product update error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to update product",
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

        const { id: productId } = await params;

        // Check if the product exists and belongs to the current supplier
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                supplier: {
                    select: { userId: true }
                }
            }
        });

        if (!product) {
            console.log("API: Product not found for ID:", productId);
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        // Check if the user is the owner of the product
        if (product.supplier.userId !== session.user.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized to delete this product' }, { status: 403 });
        }

        // Delete the product
        await prisma.product.delete({
            where: { id: productId }
        });

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error("Product delete error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to delete product",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}