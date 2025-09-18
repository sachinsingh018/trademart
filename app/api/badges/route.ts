import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Badges and Leaderboards Service
class BadgesLeaderboardsService {
    // Get user badges
    async getUserBadges(userId: string) {
        try {
            const supplier = await prisma.supplier.findUnique({
                where: { userId },
                include: {
                    orders: true,
                    quotes: true,
                    reviews: true
                }
            });

            if (!supplier) {
                return { success: false, error: 'Supplier not found' };
            }

            // Define all possible badges
            const allBadges = this.getAllBadges();
            
            // Calculate user's progress for each badge
            const userBadges = allBadges.map(badge => {
                const progress = this.calculateBadgeProgress(badge, supplier);
                return {
                    ...badge,
                    unlocked: progress >= 100,
                    progress: Math.min(100, progress),
                    unlockedAt: progress >= 100 ? new Date().toISOString() : undefined
                };
            });

            return {
                success: true,
                data: userBadges
            };
        } catch (error) {
            console.error('Error getting user badges:', error);
            return { success: false, error: 'Failed to get user badges' };
        }
    }

    // Get leaderboard
    async getLeaderboard(limit: number = 50) {
        try {
            const suppliers = await prisma.supplier.findMany({
                where: {
                    verified: true,
                    totalOrders: { gt: 0 }
                },
                include: {
                    user: {
                        select: {
                            name: true
                        }
                    },
                    orders: true,
                    reviews: true
                },
                orderBy: [
                    { rating: 'desc' },
                    { totalOrders: 'desc' }
                ],
                take: limit
            });

            // Calculate points and rank suppliers
            const leaderboard = suppliers.map((supplier, index) => {
                const points = this.calculateSupplierPoints(supplier);
                const tier = this.getSupplierTier(points);
                
                return {
                    rank: index + 1,
                    supplierId: supplier.id,
                    companyName: supplier.companyName,
                    points,
                    badges: this.getUnlockedBadgesCount(supplier),
                    orders: supplier.totalOrders,
                    rating: supplier.rating,
                    verified: supplier.verified,
                    tier,
                    change: Math.floor(Math.random() * 10) - 5 // Mock rank change
                };
            });

            return {
                success: true,
                data: leaderboard
            };
        } catch (error) {
            console.error('Error getting leaderboard:', error);
            return { success: false, error: 'Failed to get leaderboard' };
        }
    }

    // Award badge to user
    async awardBadge(userId: string, badgeId: string) {
        try {
            const supplier = await prisma.supplier.findUnique({
                where: { userId }
            });

            if (!supplier) {
                return { success: false, error: 'Supplier not found' };
            }

            // Check if badge is already awarded
            const existingBadge = await prisma.badgeAward.findFirst({
                where: {
                    supplierId: supplier.id,
                    badgeId
                }
            });

            if (existingBadge) {
                return { success: false, error: 'Badge already awarded' };
            }

            // Award the badge
            const badgeAward = await prisma.badgeAward.create({
                data: {
                    supplierId: supplier.id,
                    badgeId,
                    awardedAt: new Date()
                }
            });

            // Update supplier points
            const badge = this.getAllBadges().find(b => b.id === badgeId);
            if (badge) {
                await prisma.supplier.update({
                    where: { id: supplier.id },
                    data: {
                        totalPoints: (supplier.totalPoints || 0) + badge.points
                    }
                });
            }

            return {
                success: true,
                data: badgeAward
            };
        } catch (error) {
            console.error('Error awarding badge:', error);
            return { success: false, error: 'Failed to award badge' };
        }
    }

    // Define all possible badges
    private getAllBadges() {
        return [
            // Achievement Badges
            {
                id: 'first_order',
                name: 'First Order',
                description: 'Complete your first order',
                icon: 'trophy',
                category: 'achievement',
                rarity: 'common',
                points: 100,
                requirements: {
                    type: 'orders',
                    value: 1,
                    description: 'Complete 1 order'
                }
            },
            {
                id: 'order_master',
                name: 'Order Master',
                description: 'Complete 100 orders',
                icon: 'crown',
                category: 'achievement',
                rarity: 'legendary',
                points: 1000,
                requirements: {
                    type: 'orders',
                    value: 100,
                    description: 'Complete 100 orders'
                }
            },
            {
                id: 'quote_champion',
                name: 'Quote Champion',
                description: 'Submit 50 quotes',
                icon: 'target',
                category: 'achievement',
                rarity: 'epic',
                points: 500,
                requirements: {
                    type: 'quotes',
                    value: 50,
                    description: 'Submit 50 quotes'
                }
            },

            // Milestone Badges
            {
                id: 'verified_supplier',
                name: 'Verified Supplier',
                description: 'Get verified by TradeMart',
                icon: 'shield',
                category: 'milestone',
                rarity: 'rare',
                points: 200,
                requirements: {
                    type: 'verification',
                    value: 1,
                    description: 'Complete verification process'
                }
            },
            {
                id: 'high_rating',
                name: 'High Rating',
                description: 'Maintain 4.5+ star rating',
                icon: 'star',
                category: 'milestone',
                rarity: 'epic',
                points: 300,
                requirements: {
                    type: 'rating',
                    value: 4.5,
                    description: 'Maintain 4.5+ star rating'
                }
            },
            {
                id: 'fast_responder',
                name: 'Fast Responder',
                description: 'Average response time under 2 hours',
                icon: 'zap',
                category: 'milestone',
                rarity: 'rare',
                points: 250,
                requirements: {
                    type: 'response_time',
                    value: 2,
                    description: 'Average response time under 2 hours'
                }
            },

            // Special Badges
            {
                id: 'early_adopter',
                name: 'Early Adopter',
                description: 'Join TradeMart in first month',
                icon: 'trending-up',
                category: 'special',
                rarity: 'legendary',
                points: 500,
                requirements: {
                    type: 'early_join',
                    value: 1,
                    description: 'Join TradeMart in first month'
                }
            },
            {
                id: 'quality_expert',
                name: 'Quality Expert',
                description: 'Zero QC failures in 10 orders',
                icon: 'award',
                category: 'special',
                rarity: 'epic',
                points: 400,
                requirements: {
                    type: 'qc_success',
                    value: 10,
                    description: 'Zero QC failures in 10 orders'
                }
            },

            // Social Badges
            {
                id: 'social_butterfly',
                name: 'Social Butterfly',
                description: 'Share 5 badges on social media',
                icon: 'share',
                category: 'social',
                rarity: 'rare',
                points: 150,
                requirements: {
                    type: 'social_shares',
                    value: 5,
                    description: 'Share 5 badges on social media'
                }
            }
        ];
    }

    // Calculate badge progress
    private calculateBadgeProgress(badge: Record<string, unknown>, supplier: Record<string, unknown>): number {
        switch (badge.requirements.type) {
            case 'orders':
                return Math.min(100, (supplier.totalOrders / badge.requirements.value) * 100);
            case 'quotes':
                return Math.min(100, (supplier.quotes.length / badge.requirements.value) * 100);
            case 'verification':
                return supplier.verified ? 100 : 0;
            case 'rating':
                return supplier.rating >= badge.requirements.value ? 100 : 0;
            case 'response_time':
                const avgResponseTime = parseFloat(supplier.responseTime) || 24;
                return avgResponseTime <= badge.requirements.value ? 100 : 0;
            case 'early_join':
                const daysSinceJoin = (Date.now() - new Date(supplier.createdAt).getTime()) / (1000 * 60 * 60 * 24);
                return daysSinceJoin <= 30 ? 100 : 0;
            case 'qc_success':
                // Mock QC success rate
                return Math.random() > 0.5 ? 100 : 0;
            case 'social_shares':
                // Mock social shares
                return Math.random() > 0.7 ? 100 : 0;
            default:
                return 0;
        }
    }

    // Calculate supplier points
    private calculateSupplierPoints(supplier: Record<string, unknown>): number {
        let points = 0;
        
        // Base points from orders
        points += supplier.totalOrders * 10;
        
        // Rating bonus
        points += supplier.rating * 20;
        
        // Verification bonus
        if (supplier.verified) points += 200;
        
        // Response time bonus
        const responseTime = parseFloat(supplier.responseTime) || 24;
        if (responseTime < 2) points += 100;
        else if (responseTime < 6) points += 50;
        
        // Badge points
        const badges = this.getAllBadges();
        const unlockedBadges = badges.filter(badge => 
            this.calculateBadgeProgress(badge, supplier) >= 100
        );
        points += unlockedBadges.reduce((sum, badge) => sum + badge.points, 0);
        
        return Math.floor(points);
    }

    // Get supplier tier
    private getSupplierTier(points: number): string {
        if (points >= 10000) return 'platinum';
        if (points >= 5000) return 'gold';
        if (points >= 2000) return 'silver';
        return 'bronze';
    }

    // Get unlocked badges count
    private getUnlockedBadgesCount(supplier: Record<string, unknown>): number {
        const badges = this.getAllBadges();
        return badges.filter(badge => 
            this.calculateBadgeProgress(badge, supplier) >= 100
        ).length;
    }
}

export const badgesLeaderboardsService = new BadgesLeaderboardsService();

// API Routes
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const type = searchParams.get('type') || 'badges';

        if (type === 'badges') {
            if (!userId) {
                return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
            }
            return NextResponse.json(await badgesLeaderboardsService.getUserBadges(userId));
        } else if (type === 'leaderboard') {
            const limit = parseInt(searchParams.get('limit') || '50');
            return NextResponse.json(await badgesLeaderboardsService.getLeaderboard(limit));
        }

        return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    } catch (error) {
        console.error('Badges/Leaderboard API error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { action, userId, badgeId } = await request.json();

        if (action === 'award_badge') {
            if (!userId || !badgeId) {
                return NextResponse.json({ success: false, error: 'User ID and Badge ID are required' }, { status: 400 });
            }
            return NextResponse.json(await badgesLeaderboardsService.awardBadge(userId, badgeId));
        }

        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Badges/Leaderboard POST API error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
