// COMMENTED OUT - Badges Leaderboards Component
/*
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
    Trophy, 
    Star, 
    Award, 
    Crown, 
    Shield, 
    Zap,
    Target,
    TrendingUp,
    Users,
    Clock,
    CheckCircle,
    Share2,
    Download
} from "lucide-react";

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'achievement' | 'milestone' | 'special' | 'social';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    points: number;
    requirements: {
        type: string;
        value: number;
        description: string;
    };
    unlocked: boolean;
    unlockedAt?: string;
    progress?: number;
}

interface LeaderboardEntry {
    rank: number;
    supplierId: string;
    companyName: string;
    points: number;
    badges: number;
    orders: number;
    rating: number;
    verified: boolean;
    tier: string;
    change: number; // rank change from last period
}

interface BadgesLeaderboardsProps {
    userRole: 'buyer' | 'supplier';
    userId: string;
}

export default function BadgesLeaderboards({ userRole, userId }: BadgesLeaderboardsProps) {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [userRank, setUserRank] = useState<number>(0);
    const [userPoints, setUserPoints] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard'>('badges');

    useEffect(() => {
        fetchBadges();
        fetchLeaderboard();
    }, []);

    const fetchBadges = async () => {
        try {
            const response = await fetch(`/api/badges?userId=${userId}`);
            const data = await response.json();
            if (data.success) {
                setBadges(data.data);
            }
        } catch (error) {
            console.error('Error fetching badges:', error);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('/api/leaderboard');
            const data = await response.json();
            if (data.success) {
                setLeaderboard(data.data);
                const userEntry = data.data.find((entry: LeaderboardEntry) => entry.supplierId === userId);
                if (userEntry) {
                    setUserRank(userEntry.rank);
                    setUserPoints(userEntry.points);
                }
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    };

    const getBadgeIcon = (icon: string) => {
        const icons = {
            'trophy': Trophy,
            'star': Star,
            'award': Award,
            'crown': Crown,
            'shield': Shield,
            'zap': Zap,
            'target': Target,
            'trending-up': TrendingUp
        };
        const IconComponent = icons[icon] || Star;
        return <IconComponent className="h-6 w-6" />;
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'text-gray-600';
            case 'rare': return 'text-blue-600';
            case 'epic': return 'text-purple-600';
            case 'legendary': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    const getRarityBg = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'bg-gray-100';
            case 'rare': return 'bg-blue-100';
            case 'epic': return 'bg-purple-100';
            case 'legendary': return 'bg-yellow-100';
            default: return 'bg-gray-100';
        }
    };

    const getTierIcon = (tier: string) => {
        switch (tier) {
            case 'platinum': return <Crown className="h-5 w-5 text-yellow-500" />;
            case 'gold': return <Award className="h-5 w-5 text-yellow-600" />;
            case 'silver': return <Star className="h-5 w-5 text-gray-400" />;
            case 'bronze': return <Trophy className="h-5 w-5 text-orange-600" />;
            default: return <Star className="h-5 w-5 text-gray-400" />;
        }
    };

    const shareBadge = (badge: Badge) => {
        const text = `🏆 I just earned the "${badge.name}" badge on TradeMart! ${badge.description}`;
        const url = window.location.origin;
        
        if (navigator.share) {
            navigator.share({
                title: `TradeMart Badge: ${badge.name}`,
                text: text,
                url: url
            });
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(`${text} ${url}`);
            alert('Badge details copied to clipboard!');
        }
    };

    const downloadBadge = (badge: Badge) => {
        // Create a canvas to generate badge image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 400;

        if (ctx) {
            // Draw badge background
            ctx.fillStyle = getRarityBg(badge.rarity).replace('bg-', '#');
            ctx.fillRect(0, 0, 400, 400);

            // Draw badge icon (simplified)
            ctx.fillStyle = '#000';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🏆', 200, 200);

            // Draw badge name
            ctx.font = '24px Arial';
            ctx.fillText(badge.name, 200, 300);

            // Download image
            const link = document.createElement('a');
            link.download = `${badge.name.replace(/\s+/g, '_')}_badge.png`;
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    return (
        <div className="space-y-6">
<div className="flex justify-between items-center">
    <div>
        <h2 className="text-2xl font-bold text-gray-900">Badges & Leaderboards</h2>
        <p className="text-gray-600">Track your achievements and compete with other suppliers</p>
    </div>
    <div className="flex items-center gap-4">
        <div className="text-center">
            <p className="text-sm text-gray-600">Your Rank</p>
            <p className="text-2xl font-bold text-blue-600">#{userRank}</p>
        </div>
        <div className="text-center">
            <p className="text-sm text-gray-600">Points</p>
            <p className="text-2xl font-bold text-green-600">{userPoints.toLocaleString()}</p>
        </div>
    </div>
</div>

<div className="flex gap-2">
    <Button
        variant={activeTab === 'badges' ? 'default' : 'outline'}
        onClick={() => setActiveTab('badges')}
    >
        <Award className="h-4 w-4 mr-2" />
        Badges
    </Button>
    <Button
        variant={activeTab === 'leaderboard' ? 'default' : 'outline'}
        onClick={() => setActiveTab('leaderboard')}
    >
        <Trophy className="h-4 w-4 mr-2" />
        Leaderboard
    </Button>
</div>

{/* Badges Tab */ }
{
    activeTab === 'badges' && (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['achievement', 'milestone', 'special', 'social'].map((category) => {
                    const categoryBadges = badges.filter(badge => badge.category === category);
                    const unlockedCount = categoryBadges.filter(badge => badge.unlocked).length;

                    return (
                        <Card key={category}>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <h3 className="font-semibold capitalize">{category}</h3>
                                    <p className="text-2xl font-bold text-blue-600">{unlockedCount}/{categoryBadges.length}</p>
                                    <Progress
                                        value={(unlockedCount / categoryBadges.length) * 100}
                                        className="mt-2"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge) => (
                    <Card key={badge.id} className={`relative ${badge.unlocked ? 'ring-2 ring-green-500' : 'opacity-75'}`}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-full ${getRarityBg(badge.rarity)}`}>
                                    <div className={getRarityColor(badge.rarity)}>
                                        {getBadgeIcon(badge.icon)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className={getRarityColor(badge.rarity)}>
                                        {badge.rarity}
                                    </Badge>
                                    <p className="text-sm text-gray-600 mt-1">{badge.points} pts</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <h3 className="font-semibold text-lg">{badge.name}</h3>
                                <p className="text-sm text-gray-600">{badge.description}</p>
                            </div>

                            {badge.unlocked ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="h-4 w-4" />
                                        <span className="text-sm font-medium">Unlocked!</span>
                                    </div>
                                    {badge.unlockedAt && (
                                        <p className="text-xs text-gray-500">
                                            Earned on {new Date(badge.unlockedAt).toLocaleDateString()}
                                        </p>
                                    )}
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => shareBadge(badge)}
                                        >
                                            <Share2 className="h-3 w-3 mr-1" />
                                            Share
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => downloadBadge(badge)}
                                        >
                                            <Download className="h-3 w-3 mr-1" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Progress</p>
                                        <Progress value={badge.progress || 0} className="mt-1" />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {badge.progress || 0}% complete
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        {badge.requirements.description}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

{
    activeTab === 'leaderboard' && (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Top Performers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-end gap-8">
                        {leaderboard.slice(0, 3).map((entry, index) => (
                            <div key={entry.supplierId} className="text-center">
                                <div className={`p-4 rounded-full mb-4 ${index === 0 ? 'bg-yellow-100' :
                                    index === 1 ? 'bg-gray-100' : 'bg-orange-100'
                                    }`}>
                                    {index === 0 && <Crown className="h-8 w-8 text-yellow-500 mx-auto" />}
                                    {index === 1 && <Award className="h-8 w-8 text-gray-500 mx-auto" />}
                                    {index === 2 && <Trophy className="h-8 w-8 text-orange-500 mx-auto" />}
                                </div>
                                <h3 className="font-semibold">{entry.companyName}</h3>
                                <p className="text-sm text-gray-600">{entry.points.toLocaleString()} pts</p>
                                <div className="flex items-center justify-center gap-1 mt-1">
                                    {getTierIcon(entry.tier)}
                                    <span className="text-xs capitalize">{entry.tier}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Complete Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {leaderboard.map((entry) => (
                            <div
                                key={entry.supplierId}
                                className={`flex items-center justify-between p-3 rounded-lg ${entry.supplierId === userId ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <p className="text-lg font-bold">#{entry.rank}</p>
                                        {entry.change !== 0 && (
                                            <div className={`flex items-center text-xs ${entry.change > 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {entry.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
                                                {Math.abs(entry.change)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{entry.companyName}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span>{entry.orders} orders</span>
                                            <span>•</span>
                                            <span>{entry.badges} badges</span>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                                <span>{entry.rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-green-600">
                                        {entry.points.toLocaleString()}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        {getTierIcon(entry.tier)}
                                        <span className="text-sm capitalize">{entry.tier}</span>
                                        {entry.verified && <Shield className="h-4 w-4 text-blue-500" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
        </div >
    );
}
*/

export default function BadgesLeaderboards() {
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Badges & Leaderboards</h2>
            <p className="text-gray-600">This component is currently disabled</p>
        </div>
    );
}
