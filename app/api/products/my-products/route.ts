import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get supplier's own products
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user || session.user.role !== 'supplier') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const sortBy = searchParams.get('sortBy') || 'newest';

        const skip = (page - 1) * limit;

        // Get supplier
        const supplier = await prisma.supplier.findUnique({
            where: { userId: session.user.id }
        });

        if (!supplier) {
            return NextResponse.json({ 
                success: false, 
                error: 'Supplier profile not found' 
            }, { status: 404 });
        }

        // Build where clause
        const where: any = {
            supplierId: supplier.id
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (category && category !== 'all') {
            where.category = category;
        }

        // Build orderBy clause
        let orderBy: any = {};
        switch (sortBy) {
            case 'newest':
                orderBy = { createdAt: 'desc' };
                break;
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'name':
                orderBy = { name: 'asc' };
                break;
            case 'price-high':
                orderBy = { price: 'desc' };
                break;
            case 'price-low':
                orderBy = { price: 'asc' };
                break;
            case 'views':
                orderBy = { views: 'desc' };
                break;
            case 'orders':
                orderBy = { orders: 'desc' };
                break;
            default:
                orderBy = { createdAt: 'desc' };
        }

        // Get products
        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy,
                skip,
                take: limit,
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
                    inStock: true,
                    stockQuantity: true,
                    leadTime: true,
                    views: true,
                    orders: true,
                    createdAt: true,
                    updatedAt: true,
                    images: true,
                    features: true,
                    tags: true
                }
            }),
            prisma.product.count({ where })
        ]);

        return NextResponse.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total: totalCount,
                pages: Math.ceil(totalCount / limit)
            }
        });

    } catch (error) {
        console.error('My products fetch error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to fetch products' 
        }, { status: 500 });
    }
}
