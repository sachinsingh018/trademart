import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Trust Ledger Service for TradeMart
class TrustLedgerService {
    // Calculate supplier trust score
    async calculateTrustScore(supplierId: string) {
        try {
            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierId },
                include: {
                    reviews: true,
                    quotes: {
                        where: {
                            status: 'accepted'
                        }
                    },
                    supplierTransactions: true
                }
            });

            if (!supplier) {
                return { success: false, error: 'Supplier not found' };
            }

            // Mock order data since Order model doesn't exist
            const totalOrders = supplier.totalOrders || 0;
            const completedOrders = Math.floor(totalOrders * 0.8); // 80% completion rate
            const cancelledOrders = Math.floor(totalOrders * 0.1); // 10% cancellation rate
            const disputedOrders = Math.floor(totalOrders * 0.05); // 5% dispute rate

            // Calculate metrics
            const onTimeDeliveryRate = 85; // Mock 85% on-time delivery
            const disputeRate = totalOrders > 0 ? (disputedOrders / totalOrders) * 100 : 0;
            const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
            const responseTime = this.calculateAverageResponseTime(supplier.quotes);
            const rating = supplier.rating || 0;

            // Calculate trust score (0-100)
            const trustScore = this.calculateTrustScoreValue({
                onTimeDeliveryRate,
                disputeRate,
                completionRate,
                responseTime,
                rating,
                totalOrders
            });

            // Update supplier trust metrics
            await prisma.supplier.update({
                where: { id: supplierId },
                data: {
                    rating: trustScore,
                    totalOrders,
                    responseTime: responseTime.toString()
                }
            });

            return {
                success: true,
                trustScore,
                metrics: {
                    onTimeDeliveryRate,
                    disputeRate,
                    completionRate,
                    responseTime,
                    totalOrders,
                    completedOrders,
                    cancelledOrders,
                    disputedOrders
                }
            };
        } catch (error) {
            console.error('Error calculating trust score:', error);
            return { success: false, error: 'Failed to calculate trust score' };
        }
    }

    // Get public trust ledger data
    async getPublicTrustLedger(page: number = 1, limit: number = 20, filters: Record<string, unknown> = {}) {
        try {
            const skip = (page - 1) * limit;

            const whereClause: Record<string, unknown> = {
                verified: true,
                totalOrders: { gt: 0 } // Only show suppliers with orders
            };

            if (filters.industry) {
                whereClause.industry = String(filters.industry);
            }

            if (filters.minRating) {
                whereClause.rating = { gte: parseFloat(String(filters.minRating)) };
            }

            if (filters.country) {
                whereClause.country = String(filters.country);
            }

            const suppliers = await prisma.supplier.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
                    reviews: true,
                    supplierTransactions: true
                },
                orderBy: [
                    { rating: 'desc' },
                    { totalOrders: 'desc' }
                ],
                skip,
                take: limit
            });

            // Calculate detailed metrics for each supplier
            const suppliersWithMetrics = await Promise.all(
                suppliers.map(async (supplier) => {
                    const trustMetrics = await this.calculateTrustScore(supplier.id);
                    return {
                        id: supplier.id,
                        companyName: supplier.companyName,
                        industry: supplier.industry,
                        country: supplier.country,
                        city: supplier.city,
                        verified: supplier.verified,
                        rating: supplier.rating,
                        totalOrders: supplier.totalOrders,
                        responseTime: supplier.responseTime,
                        establishedYear: supplier.establishedYear,
                        specialties: supplier.specialties,
                        certifications: supplier.certifications,
                        trustMetrics: trustMetrics.success ? trustMetrics.metrics : null,
                        lastActive: supplier.lastActive,
                        createdAt: supplier.createdAt
                    };
                })
            );

            const totalCount = await prisma.supplier.count({
                where: whereClause
            });

            return {
                success: true,
                data: suppliersWithMetrics,
                pagination: {
                    page,
                    limit,
                    total: totalCount,
                    pages: Math.ceil(totalCount / limit)
                }
            };
        } catch (error) {
            console.error('Error getting public trust ledger:', error);
            return { success: false, error: 'Failed to get trust ledger data' };
        }
    }

    // Get supplier trust profile
    async getSupplierTrustProfile(supplierId: string) {
        try {
            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierId },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
                    supplierTransactions: {
                        where: {
                            status: { in: ['released', 'refunded', 'disputed'] }
                        },
                        include: {
                            buyer: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    reviews: {
                        include: {
                            buyer: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    quotes: {
                        where: {
                            status: 'accepted'
                        }
                    }
                }
            });

            if (!supplier) {
                return { success: false, error: 'Supplier not found' };
            }

            const trustMetrics = await this.calculateTrustScore(supplierId);

            // Use actual transaction data instead of mock orders
            const recentTransactions = supplier.supplierTransactions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 10)
                .map(transaction => ({
                    id: transaction.id,
                    status: transaction.status,
                    createdAt: transaction.createdAt,
                    amount: transaction.amount
                }));

            // Get recent reviews
            const recentReviews = supplier.reviews
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5);

            return {
                success: true,
                data: {
                    supplier: {
                        id: supplier.id,
                        companyName: supplier.companyName,
                        industry: supplier.industry,
                        country: supplier.country,
                        city: supplier.city,
                        verified: supplier.verified,
                        establishedYear: supplier.establishedYear,
                        specialties: supplier.specialties,
                        certifications: supplier.certifications,
                        description: supplier.description,
                        website: supplier.website
                    },
                    trustMetrics: trustMetrics.success ? trustMetrics.metrics : null,
                    recentTransactions,
                    recentReviews,
                    trustScore: trustMetrics.success ? trustMetrics.trustScore : 0
                }
            };
        } catch (error) {
            console.error('Error getting supplier trust profile:', error);
            return { success: false, error: 'Failed to get supplier trust profile' };
        }
    }

    // Calculate on-time delivery rate
    private calculateOnTimeDeliveryRate(orders: Record<string, unknown>[]): number {
        const completedOrders = orders.filter(order => order.status === 'completed');
        if (completedOrders.length === 0) return 0;

        const onTimeOrders = completedOrders.filter(order => {
            if (!order.deliveryDate) return false;
            const deliveryDate = new Date(order.deliveryDate);
            const createdAt = new Date(order.createdAt);
            const expectedDelivery = new Date(createdAt.getTime() + (order.leadTimeDays || 30) * 24 * 60 * 60 * 1000);
            return deliveryDate <= expectedDelivery;
        });

        return (onTimeOrders.length / completedOrders.length) * 100;
    }

    // Calculate average response time
    private calculateAverageResponseTime(quotes: Record<string, unknown>[]): number {
        if (quotes.length === 0) return 0;

        const responseTimes = quotes.map(quote => {
            const quoteCreated = new Date(quote.createdAt);
            const rfqCreated = new Date(quote.rfq.createdAt);
            return (quoteCreated.getTime() - rfqCreated.getTime()) / (1000 * 60 * 60); // hours
        });

        return responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    }

    // Calculate trust score value
    private calculateTrustScoreValue(metrics: Record<string, unknown>): number {
        const {
            onTimeDeliveryRate,
            disputeRate,
            completionRate,
            responseTime,
            rating,
            totalOrders
        } = metrics;

        // Weighted scoring system
        let score = 0;

        // On-time delivery (30% weight)
        score += (onTimeDeliveryRate / 100) * 30;

        // Low dispute rate (25% weight) - lower is better
        score += Math.max(0, (100 - disputeRate) / 100) * 25;

        // Completion rate (20% weight)
        score += (completionRate / 100) * 20;

        // Response time (15% weight) - faster is better
        const responseScore = Math.max(0, (72 - responseTime) / 72) * 100; // 72 hours max
        score += (responseScore / 100) * 15;

        // Rating (10% weight)
        score += (rating / 5) * 10;

        // Order volume bonus (up to 5% bonus for high volume)
        const volumeBonus = Math.min(5, (totalOrders / 100) * 5);
        score += volumeBonus;

        return Math.min(100, Math.max(0, score));
    }
}

const trustLedgerService = new TrustLedgerService();

// API Routes for Trust Ledger
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const supplierId = searchParams.get('supplierId');

        const filters = {
            industry: searchParams.get('industry'),
            minRating: searchParams.get('minRating'),
            country: searchParams.get('country')
        };

        if (supplierId) {
            // Get specific supplier trust profile
            return NextResponse.json(await trustLedgerService.getSupplierTrustProfile(supplierId));
        } else {
            // Get public trust ledger
            return NextResponse.json(await trustLedgerService.getPublicTrustLedger(page, limit, filters));
        }
    } catch (error) {
        console.error('Trust Ledger API error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { action, supplierId } = await request.json();

        if (action === 'calculate') {
            if (!supplierId) {
                return NextResponse.json({ success: false, error: 'Supplier ID is required' }, { status: 400 });
            }
            return NextResponse.json(await trustLedgerService.calculateTrustScore(supplierId));
        }

        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Trust Ledger POST API error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
