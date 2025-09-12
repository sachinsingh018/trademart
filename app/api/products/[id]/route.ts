import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get single product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                supplier: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Product fetch error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
    }
}

// PUT - Update product
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'supplier') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const {
            name,
            description,
            category,
            subcategory,
            price,
            currency,
            minOrderQuantity,
            unit,
            specifications,
            features,
            tags,
            images,
            inStock,
            stockQuantity,
            leadTime,
        } = body;

        // Get supplier to verify ownership
        const supplier = await prisma.supplier.findUnique({
            where: { userId: session.user.id }
        });

        if (!supplier) {
            return NextResponse.json({ success: false, error: 'Supplier profile not found' }, { status: 404 });
        }

        // Verify product belongs to this supplier
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });

        if (!existingProduct || existingProduct.supplierId !== supplier.id) {
            return NextResponse.json({ success: false, error: 'Product not found or unauthorized' }, { status: 404 });
        }

        // Parse specifications if provided
        let parsedSpecifications = null;
        if (specifications) {
            try {
                parsedSpecifications = JSON.parse(specifications);
            } catch {
                return NextResponse.json({ success: false, error: 'Invalid specifications JSON format' }, { status: 400 });
            }
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                category,
                subcategory,
                price: parseFloat(price),
                currency,
                minOrderQuantity: parseInt(minOrderQuantity),
                unit,
                specifications: parsedSpecifications,
                features: features ? features.split(',').map((f: string) => f.trim()) : [],
                tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
                images: images ? images.split(',').map((i: string) => i.trim()) : [],
                inStock,
                stockQuantity: stockQuantity ? parseInt(stockQuantity) : null,
                leadTime,
            },
            include: {
                supplier: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: updatedProduct
        });

    } catch (error) {
        console.error('Product update error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
    }
}

// DELETE - Delete product
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'supplier') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        // Get supplier to verify ownership
        const supplier = await prisma.supplier.findUnique({
            where: { userId: session.user.id }
        });

        if (!supplier) {
            return NextResponse.json({ success: false, error: 'Supplier profile not found' }, { status: 404 });
        }

        // Verify product belongs to this supplier
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });

        if (!existingProduct || existingProduct.supplierId !== supplier.id) {
            return NextResponse.json({ success: false, error: 'Product not found or unauthorized' }, { status: 404 });
        }

        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Product delete error:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
    }
}
