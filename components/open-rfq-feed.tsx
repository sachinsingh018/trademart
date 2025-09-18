// COMMENTED OUT - Open RFQ Feed Component
/*
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Search, 
    Filter, 
    Globe, 
    Calendar, 
    DollarSign,
    Package,
    Users,
    MapPin,
    Clock,
    TrendingUp,
    Eye,
    Share2,
    Bookmark,
    AlertCircle
} from "lucide-react";

interface PublicRFQ {
    id: string;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    quantity: number;
    unit: string;
    budget: number;
    currency: string;
    status: string;
    expiresAt: string;
    createdAt: string;
    buyer: {
        company: string;
        country: string;
        city: string;
        verified: boolean;
    };
    requirements: string[];
    specifications: Record<string, unknown>;
    tags: string[];
    views: number;
    quotesCount: number;
}

interface OpenRFQFeedProps {
    showFilters?: boolean;
    limit?: number;
    category?: string;
    country?: string;
}

export default function OpenRFQFeed({ showFilters = true, limit = 20, category, country }: OpenRFQFeedProps) {
    const [rfqs, setRfqs] = useState<PublicRFQ[]>([]);
    const [filteredRfqs, setFilteredRfqs] = useState<PublicRFQ[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(category || "");
    const [selectedCountry, setSelectedCountry] = useState(country || "");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);

    const categories = [
        "Electronics",
        "Textiles & Apparel",
        "Machinery",
        "Food & Beverage",
        "Chemicals",
        "Automotive",
        "Construction",
        "Healthcare",
        "Agriculture",
        "Other"
    ];

    const countries = [
        "India", "United States", "United Kingdom", "Germany", "France",
        "Canada", "Australia", "Japan", "China", "Brazil", "Mexico", "UAE"
    ];

    useEffect(() => {
        fetchRFQs();
    }, []);

    useEffect(() => {
        filterRFQs();
    }, [rfqs, searchTerm, selectedCategory, selectedCountry, sortBy]);

    const fetchRFQs = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/rfqs/public');
            const data = await response.json();
            if (data.success) {
                setRfqs(data.data.slice(0, limit));
            }
        } catch (error) {
            console.error('Error fetching RFQs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterRFQs = () => {
        let filtered = [...rfqs];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(rfq => 
                rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rfq.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rfq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter(rfq => rfq.category === selectedCategory);
        }

        // Country filter
        if (selectedCountry) {
            filtered = filtered.filter(rfq => rfq.buyer.country === selectedCountry);
        }

        // Sort
        switch (sortBy) {
            case "newest":
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "oldest":
                filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case "highest_budget":
                filtered.sort((a, b) => b.budget - a.budget);
                break;
            case "lowest_budget":
                filtered.sort((a, b) => a.budget - b.budget);
                break;
            case "most_viewed":
                filtered.sort((a, b) => b.views - a.views);
                break;
            case "expiring_soon":
                filtered.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
                break;
        }

        setFilteredRfqs(filtered);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'text-green-600 bg-green-100';
            case 'closed': return 'text-red-600 bg-red-100';
            case 'awarded': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getTimeRemaining = (expiresAt: string) => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diff = expiry.getTime() - now.getTime();
        
        if (diff <= 0) return "Expired";
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) return `${days} days left`;
        if (hours > 0) return `${hours} hours left`;
        return "Less than 1 hour";
    };

    const shareRFQ = (rfq: PublicRFQ) => {
        const url = `${window.location.origin}/rfqs/${rfq.id}`;
        const text = `Check out this RFQ: ${rfq.title} - ${rfq.buyer.company} is looking for ${rfq.quantity} ${rfq.unit}`;
        
        if (navigator.share) {
            navigator.share({
                title: rfq.title,
                text: text,
                url: url
            });
        } else {
            navigator.clipboard.writeText(`${text} ${url}`);
            alert('RFQ link copied to clipboard!');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading RFQs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
<div className="text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Live RFQ Feed
    </h1>
    <p className="text-xl text-gray-600 mb-2">
        Discover {filteredRfqs.length}+ active RFQs from verified buyers
    </p>
    <p className="text-sm text-gray-500">
        Updated in real-time • Free to browse • No registration required
    </p>
</div>

{/* Filters */ }
{
    showFilters && (
        <Card>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search RFQs
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search products, companies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                        </label>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Countries" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Countries</SelectItem>
                                {countries.map((country) => (
                                    <SelectItem key={country} value={country}>
                                        {country}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sort By
                        </label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="highest_budget">Highest Budget</SelectItem>
                                <SelectItem value="lowest_budget">Lowest Budget</SelectItem>
                                <SelectItem value="most_viewed">Most Viewed</SelectItem>
                                <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("");
                                setSelectedCountry("");
                                setSortBy("newest");
                            }}
                            className="w-full"
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

{/* Stats */ }
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card>
        <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{filteredRfqs.length}</p>
            <p className="text-sm text-gray-600">Active RFQs</p>
        </CardContent>
    </Card>
    <Card>
        <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">
                ₹{filteredRfqs.reduce((sum, rfq) => sum + rfq.budget, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Budget</p>
        </CardContent>
    </Card>
    <Card>
        <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">
                {new Set(filteredRfqs.map(rfq => rfq.buyer.company)).size}
            </p>
            <p className="text-sm text-gray-600">Buyers</p>
        </CardContent>
    </Card>
    <Card>
        <CardContent className="p-4 text-center">
            <Globe className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">
                {new Set(filteredRfqs.map(rfq => rfq.buyer.country)).size}
            </p>
            <p className="text-sm text-gray-600">Countries</p>
        </CardContent>
    </Card>
</div>

{/* RFQ List */ }
<div className="space-y-4">
    {filteredRfqs.map((rfq) => (
        <Card key={rfq.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{rfq.title}</h3>
                            <Badge className={getStatusColor(rfq.status)}>
                                {rfq.status}
                            </Badge>
                            {rfq.buyer.verified && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                    Verified Buyer
                                </Badge>
                            )}
                        </div>
                        <p className="text-gray-600 mb-3">{rfq.description}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                            {rfq.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                    <div>
                        <p className="text-sm text-gray-600">Quantity</p>
                        <p className="font-semibold">{rfq.quantity.toLocaleString()} {rfq.unit}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Budget</p>
                        <p className="font-semibold text-green-600">₹{rfq.budget.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Buyer</p>
                        <p className="font-semibold">{rfq.buyer.company}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{rfq.buyer.city}, {rfq.buyer.country}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Expires</p>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{getTimeRemaining(rfq.expiresAt)}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Quotes</p>
                        <p className="font-semibold">{rfq.quotesCount} received</p>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{rfq.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Posted {new Date(rfq.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                            <Bookmark className="h-4 w-4 mr-1" />
                            Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => shareRFQ(rfq)}>
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                        </Button>
                        <Button size="sm">
                            Submit Quote
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    ))}
</div>

{/* No Results */ }
{
    filteredRfqs.length === 0 && !isLoading && (
        <Card>
            <CardContent className="p-12 text-center">
                <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No RFQs Found</h3>
                <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or check back later for new RFQs.
                </p>
                <Button
                    variant="outline"
                    onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("");
                        setSelectedCountry("");
                    }}
                >
                    Clear All Filters
                </Button>
            </CardContent>
        </Card>
    )
}

{/* SEO Content */ }
<Card>
    <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Browse Our RFQ Feed?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">For Suppliers</h3>
                <ul className="space-y-2 text-gray-600">
                    <li>• Find new business opportunities</li>
                    <li>• Connect with verified buyers</li>
                    <li>• No registration required to browse</li>
                    <li>• Real-time updates on new RFQs</li>
                    <li>• Filter by industry and location</li>
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">For Buyers</h3>
                <ul className="space-y-2 text-gray-600">
                    <li>• Reach thousands of suppliers</li>
                    <li>• Get competitive quotes</li>
                    <li>• Verified supplier network</li>
                    <li>• Escrow protection included</li>
                    <li>• Global reach with local support</li>
                </ul>
            </div>
        </div>
    </CardContent>
</Card>
        </div >
    );
}
*/

export default function OpenRFQFeed() {
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Open RFQ Feed</h2>
            <p className="text-gray-600">This component is currently disabled</p>
        </div>
    );
}
