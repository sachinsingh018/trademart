"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Star, 
    Clock, 
    Shield, 
    Truck, 
    CheckCircle, 
    XCircle, 
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Minus,
    Calculator,
    MapPin,
    Calendar,
    Award,
    Users
} from "lucide-react";

interface Quote {
    id: string;
    supplierId: string;
    price: number;
    currency: string;
    leadTimeDays: number;
    notes: string;
    status: string;
    createdAt: string;
    supplier: {
        id: string;
        companyName: string;
        industry: string;
        country: string;
        city: string;
        verified: boolean;
        rating: number;
        totalOrders: number;
        responseTime: string;
        specialties: string[];
        certifications: string[];
    };
}

interface QuoteComparisonProps {
    rfqId: string;
    quotes: Quote[];
    onSelectQuote: (quoteId: string) => void;
}

export default function QuoteComparison({ rfqId, quotes, onSelectQuote }: QuoteComparisonProps) {
    const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'price' | 'rating' | 'leadTime' | 'trustScore'>('price');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showDetails, setShowDetails] = useState<string | null>(null);

    // Calculate trust score for each quote
    const calculateTrustScore = (quote: Quote): number => {
        const { supplier } = quote;
        let score = 0;

        // Rating weight (40%)
        score += (supplier.rating / 5) * 40;

        // Order volume weight (30%)
        score += Math.min(30, (supplier.totalOrders / 100) * 30);

        // Verification bonus (20%)
        if (supplier.verified) score += 20;

        // Response time weight (10%)
        const responseHours = parseFloat(supplier.responseTime) || 72;
        score += Math.max(0, (72 - responseHours) / 72) * 10;

        return Math.min(100, score);
    };

    // Calculate landed cost (price + estimated shipping + duties)
    const calculateLandedCost = (quote: Quote): number => {
        const basePrice = quote.price;
        const shippingCost = basePrice * 0.1; // 10% of product cost
        const dutyCost = basePrice * 0.15; // 15% duty
        return basePrice + shippingCost + dutyCost;
    };

    // Sort quotes based on selected criteria
    const sortedQuotes = [...quotes].sort((a, b) => {
        let aValue: number, bValue: number;

        switch (sortBy) {
            case 'price':
                aValue = calculateLandedCost(a);
                bValue = calculateLandedCost(b);
                break;
            case 'rating':
                aValue = a.supplier.rating;
                bValue = b.supplier.rating;
                break;
            case 'leadTime':
                aValue = a.leadTimeDays;
                bValue = b.leadTimeDays;
                break;
            case 'trustScore':
                aValue = calculateTrustScore(a);
                bValue = calculateTrustScore(b);
                break;
            default:
                return 0;
        }

        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    const toggleQuoteSelection = (quoteId: string) => {
        setSelectedQuotes(prev => 
            prev.includes(quoteId) 
                ? prev.filter(id => id !== quoteId)
                : [...prev, quoteId]
        );
    };

    const getPriceTrend = (quote: Quote): 'up' | 'down' | 'stable' => {
        // Mock price trend calculation
        const random = Math.random();
        if (random < 0.3) return 'up';
        if (random < 0.6) return 'down';
        return 'stable';
    };

    const getRiskScore = (quote: Quote): { score: number; level: 'low' | 'medium' | 'high' } => {
        const trustScore = calculateTrustScore(quote);
        const riskScore = 100 - trustScore;
        
        if (riskScore < 30) return { score: riskScore, level: 'low' };
        if (riskScore < 60) return { score: riskScore, level: 'medium' };
        return { score: riskScore, level: 'high' };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quote Comparison</h2>
                    <p className="text-gray-600">Compare {quotes.length} quotes side by side</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                        <option value="price">Sort by Price</option>
                        <option value="rating">Sort by Rating</option>
                        <option value="leadTime">Sort by Lead Time</option>
                        <option value="trustScore">Sort by Trust Score</option>
                    </select>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </Button>
                </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedQuotes.map((quote) => {
                    const trustScore = calculateTrustScore(quote);
                    const landedCost = calculateLandedCost(quote);
                    const priceTrend = getPriceTrend(quote);
                    const riskScore = getRiskScore(quote);
                    const isSelected = selectedQuotes.includes(quote.id);

                    return (
                        <Card 
                            key={quote.id} 
                            className={`relative transition-all duration-200 ${
                                isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                            }`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg font-semibold">
                                            {quote.supplier.companyName}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant={quote.supplier.verified ? "default" : "secondary"}>
                                                {quote.supplier.verified ? "Verified" : "Unverified"}
                                            </Badge>
                                            <Badge variant="outline">
                                                {quote.supplier.country}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        <span className="text-sm font-medium">{quote.supplier.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Price Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Unit Price</span>
                                        <span className="text-lg font-bold text-green-600">
                                            ₹{quote.price.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Landed Cost</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-blue-600">
                                                ₹{landedCost.toLocaleString()}
                                            </span>
                                            <Calculator className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Price Trend</span>
                                        <div className="flex items-center gap-1">
                                            {priceTrend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                                            {priceTrend === 'down' && <TrendingDown className="h-4 w-4 text-green-500" />}
                                            {priceTrend === 'stable' && <Minus className="h-4 w-4 text-gray-500" />}
                                            <span className="text-sm capitalize">{priceTrend}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Lead Time */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-600">Lead Time</span>
                                    </div>
                                    <span className="text-sm font-medium">{quote.leadTimeDays} days</span>
                                </div>

                                {/* Trust Score */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-600">Trust Score</span>
                                        </div>
                                        <span className="text-sm font-medium">{trustScore.toFixed(0)}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                trustScore >= 80 ? 'bg-green-500' :
                                                trustScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${trustScore}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Risk Assessment */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600">Risk Level</span>
                                    <div className="flex items-center gap-1">
                                        {riskScore.level === 'low' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                        {riskScore.level === 'medium' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                                        {riskScore.level === 'high' && <XCircle className="h-4 w-4 text-red-500" />}
                                        <span className={`text-sm font-medium capitalize ${
                                            riskScore.level === 'low' ? 'text-green-600' :
                                            riskScore.level === 'medium' ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                            {riskScore.level}
                                        </span>
                                    </div>
                                </div>

                                {/* Supplier Stats */}
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3 text-gray-400" />
                                        <span className="text-gray-600">{quote.supplier.totalOrders} orders</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Award className="h-3 w-3 text-gray-400" />
                                        <span className="text-gray-600">{quote.supplier.certifications.length} certs</span>
                                    </div>
                                </div>

                                {/* Notes */}
                                {quote.notes && (
                                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                        {quote.notes}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant={isSelected ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleQuoteSelection(quote.id)}
                                        className="flex-1"
                                    >
                                        {isSelected ? "Selected" : "Select"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowDetails(showDetails === quote.id ? null : quote.id)}
                                    >
                                        Details
                                    </Button>
                                </div>

                                {/* Detailed View */}
                                {showDetails === quote.id && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                                        <h4 className="font-medium text-gray-900">Supplier Details</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Industry:</span>
                                                <span>{quote.supplier.industry}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Location:</span>
                                                <span>{quote.supplier.city}, {quote.supplier.country}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Response Time:</span>
                                                <span>{quote.supplier.responseTime} hours</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Specialties:</span>
                                                <span>{quote.supplier.specialties.join(", ")}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Selection Summary */}
            {selectedQuotes.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium text-blue-900">
                                    {selectedQuotes.length} quote{selectedQuotes.length > 1 ? 's' : ''} selected
                                </h3>
                                <p className="text-sm text-blue-700">
                                    Ready to proceed with order placement
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedQuotes([])}
                                >
                                    Clear Selection
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (selectedQuotes.length === 1) {
                                            onSelectQuote(selectedQuotes[0]);
                                        }
                                    }}
                                    disabled={selectedQuotes.length !== 1}
                                >
                                    Place Order
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
