"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { usePopup } from "@/contexts/PopupContext";

interface RFQ {
    id: string;
    title: string;
    description: string;
    category: string;
    quantity: number;
    unit: string;
    budget: number;
    currency: string;
    status: "open" | "quoted" | "closed";
    viewCount: number;
    buyer: {
        name: string;
        company: string;
        country: string;
        verified: boolean;
    };//sad
    quotesCount: number;
    createdAt: string;
    expiresAt: string;
    requirements: string[];
    specifications: {
        material?: string;
        color?: string;
        size?: string;
        certification?: string;
    };
}

export default function RFQsPage() {
    const { data: session } = useSession();
    const { setIsPopupActive } = usePopup();
    const [rfqs, setRfqs] = useState<RFQ[]>([]);
    const [filteredRfqs, setFilteredRfqs] = useState<RFQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [showOverlay, setShowOverlay] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(10);

    // Fetch RFQs from database
    useEffect(() => {
        const fetchRFQs = async () => {
            try {
                const params = new URLSearchParams({
                    page: "1",
                    limit: "50",
                    ...(searchTerm && { search: searchTerm }),//asaasasds
                    ...(selectedCategory !== "all" && { category: selectedCategory }),
                    ...(selectedStatus !== "all" && { status: selectedStatus }),
                    sortBy,
                });

                const response = await fetch(`/api/rfqs?${params}`);
                const result = await response.json();

                if (result.success) {
                    // Transform database data to match component interface
                    const transformedRFQs = result.data.rfqs.map((rfq: {
                        id: string;
                        title: string;
                        description: string;
                        category: string;
                        quantity: number;
                        unit: string;
                        budget: number;
                        currency: string;
                        status: string;
                        viewCount?: number;
                        requirements: string[];
                        createdAt: string;
                        expiresAt: string;
                        specifications: Record<string, unknown>;
                        buyer: { name: string; email: string };
                        quotes: { id: string }[];
                    }) => ({
                        id: rfq.id,
                        title: rfq.title,
                        description: rfq.description,
                        category: rfq.category || "General",
                        quantity: rfq.quantity || 0,
                        unit: rfq.unit || "pieces",
                        budget: rfq.budget ? parseFloat(rfq.budget.toString()) : 0,
                        currency: rfq.currency || "USD",
                        status: rfq.status,
                        buyer: {
                            name: rfq.buyer?.name || "Anonymous Buyer",
                            company: "Company Name", // This would need to be added to the database
                            country: "Unknown", // This would need to be added to the database
                            verified: true, // This would need to be added to the database
                        },
                        viewCount: rfq.viewCount || 0,
                        quotesCount: rfq.quotes?.length || 0,
                        createdAt: rfq.createdAt,
                        expiresAt: rfq.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default 30 days
                        requirements: rfq.requirements || [],
                        specifications: rfq.specifications || {},
                    }));

                    setRfqs(transformedRFQs);
                    setFilteredRfqs(transformedRFQs);
                } else {
                    console.error("Failed to fetch RFQs:", result.error);
                    setRfqs([]);
                    setFilteredRfqs([]);
                }
            } catch (error) {
                console.error("Error fetching RFQs:", error);
                setRfqs([]);
                setFilteredRfqs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRFQs();
    }, [searchTerm, selectedCategory, selectedStatus, sortBy]);

    // Filter and search functionality
    useEffect(() => {
        let filtered = rfqs;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (rfq) =>
                    rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    rfq.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    rfq.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== "all") {
            filtered = filtered.filter((rfq) => rfq.category === selectedCategory);
        }

        // Status filter
        if (selectedStatus !== "all") {
            filtered = filtered.filter((rfq) => rfq.status === selectedStatus);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "budget-high":
                    return b.budget - a.budget;
                case "budget-low":
                    return a.budget - b.budget;
                case "quotes":
                    return b.quotesCount - a.quotesCount;
                default:
                    return 0;
            }
        });

        setFilteredRfqs(filtered);
    }, [rfqs, searchTerm, selectedCategory, selectedStatus, sortBy]);

    // Timer effect for overlay - only for non-logged-in users
    useEffect(() => {
        if (session) {
            setShowOverlay(false);
            setIsPopupActive(false);
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    // Defer state updates to avoid setState during render
                    setTimeout(() => {
                        setShowOverlay(true);
                        setIsPopupActive(true);
                    }, 0);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [session, setIsPopupActive]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "open":
                return "bg-green-100 text-green-800 border-green-200";
            case "quoted":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "closed":
                return "bg-gray-100 text-gray-800 border-gray-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getTimeRemaining = (expiresAt: string) => {
        const now = new Date().getTime();
        const expiry = new Date(expiresAt).getTime();
        const diff = expiry - now;

        if (diff <= 0) return "Expired";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days}d ${hours}h left`;
        return `${hours}h left`;
    };

    const categories = ["all", "Electronics", "Textiles", "Manufacturing", "Automotive", "Chemicals", "Food & Beverage", "Construction", "Healthcare"];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading RFQs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative">

            {/* Auth overlay - only for non-logged-in users */}
            {!session && showOverlay && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Sign In Required</h2>
                            <p className="text-gray-600 text-sm">
                                Sign in to view detailed RFQ information and submit quotes.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Link href="/auth/signin" className="block">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/auth/signup" className="block">
                                <Button variant="outline" className="w-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 font-semibold transition-all duration-300 rounded-lg">
                                    Create Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className={`bg-white border-b border-gray-200 transition-all duration-500 ${!session && showOverlay ? 'blur-sm opacity-50' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Request for Quotations
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Discover business opportunities and connect with buyers worldwide.
                            Submit competitive quotes and grow your business.
                        </p>

                        {/* Timer display - only for non-logged-in users */}
                        {!session && !showOverlay && timeRemaining > 0 && (
                            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Free preview ends in {timeRemaining} seconds
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            <div className="bg-blue-50 rounded-lg p-6">
                                <div className="text-3xl font-bold text-blue-600 mb-2">{rfqs.length}</div>
                                <div className="text-gray-600">Active RFQs</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-6">
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {rfqs.filter(rfq => rfq.status === "open").length}
                                </div>
                                <div className="text-gray-600">Open for Quotes</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-6">
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    {rfqs.reduce((sum, rfq) => sum + rfq.quotesCount, 0)}
                                </div>
                                <div className="text-gray-600">Total Quotes</div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">
                                    ${rfqs.reduce((sum, rfq) => sum + Number(rfq.budget || 0), 0)}
                                </div>
                                <div className="text-gray-600">Total Budget</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={`bg-white border-b border-gray-200 sticky top-16 z-40 transition-all duration-500 ${!session && showOverlay ? 'blur-sm opacity-50' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search RFQs by title, description, or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category === "all" ? "All Categories" : category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="quoted">Quoted</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                    <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                                    <SelectItem value="budget-low">Budget: Low to High</SelectItem>
                                    <SelectItem value="quotes">Most Quotes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* RFQs List */}
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-500 ${!session && showOverlay ? 'blur-sm opacity-50' : ''}`}>
                <div className="space-y-6">
                    {filteredRfqs.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No RFQs Found</h3>
                            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                        </div>
                    ) : (
                        filteredRfqs.map((rfq) => (
                            <Card key={rfq.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl mb-2">{rfq.title}</CardTitle>
                                            <CardDescription className="text-gray-600 mb-4">
                                                {rfq.description}
                                            </CardDescription>
                                        </div>
                                        <Badge className={`${getStatusColor(rfq.status)} border`}>
                                            {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* RFQ Details */}
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-900">RFQ Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Category:</span>
                                                    <span className="font-medium">{rfq.category}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Quantity:</span>
                                                    <span className="font-medium">{rfq.quantity.toLocaleString()} {rfq.unit}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Budget:</span>
                                                    <span className="font-medium">{rfq.currency} {rfq.budget}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Views:</span>
                                                    <span className="font-medium">{rfq.viewCount || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Quotes:</span>
                                                    <span className="font-medium">{rfq.quotesCount} received</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Buyer Information */}
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-900">Buyer Information</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Company:</span>
                                                    <span className="font-medium">{rfq.buyer.company}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Contact:</span>
                                                    <span className="font-medium">{rfq.buyer.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Country:</span>
                                                    <span className="font-medium">{rfq.buyer.country}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Verified:</span>
                                                    <span className={`font-medium ${rfq.buyer.verified ? 'text-green-600' : 'text-gray-500'}`}>
                                                        {rfq.buyer.verified ? '✓ Verified' : 'Not Verified'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Timeline */}
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-900">Timeline</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Posted:</span>
                                                    <span className="font-medium">{formatDate(rfq.createdAt)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Expires:</span>
                                                    <span className="font-medium">{formatDate(rfq.expiresAt)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Time Left:</span>
                                                    <span className={`font-medium ${getTimeRemaining(rfq.expiresAt).includes('Expired') ? 'text-red-600' : 'text-green-600'}`}>
                                                        {getTimeRemaining(rfq.expiresAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Requirements */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h4 className="font-semibold text-gray-900 mb-3">Key Requirements</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {rfq.requirements.map((req, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {req}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">Specifications:</span> {Object.entries(rfq.specifications)
                                                .filter(([, value]) => value)
                                                .map(([key, value]) => `${key}: ${value}`)
                                                .join(", ")}
                                        </div>
                                        <div className="flex gap-3">
                                            <Link href={`/rfqs/${rfq.id}`}>
                                                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
