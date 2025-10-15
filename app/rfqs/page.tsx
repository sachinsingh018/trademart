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
import { useToast, ToastContainer } from "@/components/ui/toast";

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

// RFQ Card Component with expand/collapse functionality
function RFQCard({ rfq, onInfoToast }: { rfq: RFQ, onInfoToast: (message: string, title: string) => void }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "open":
                return "bg-green-50 text-green-700 border-green-100";
            case "quoted":
                return "bg-blue-50 text-blue-700 border-blue-100";
            case "closed":
                return "bg-gray-50 text-gray-700 border-gray-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US");

    const daysUntilExpiry = () => {
        const expiry = new Date(rfq.expiresAt);
        const today = new Date();
        const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            {/* Top Accent Gradient */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-green-400 to-blue-600 opacity-60"></div>

            {/* Card Content */}
            <div className="flex flex-col flex-1 p-4 sm:p-5">
                {/* Title & Category */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                            {rfq.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{rfq.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-[11px]">
                            {rfq.category}
                        </Badge>
                        <Badge className={`text-[11px] font-medium border ${getStatusColor(rfq.status)}`}>
                            {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                        </Badge>
                    </div>
                </div>

                {/* Budget & Quantity */}
                <div className="flex justify-between items-center mb-3">
                    <div>
                        <div className="text-lg font-bold text-green-600">
                            {rfq.currency} {rfq.budget.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Budget</div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                            {rfq.quantity.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">{rfq.unit}</div>
                    </div>
                </div>

                {/* Buyer Info */}
                <div className="flex justify-between text-xs text-gray-600 mb-3">
                    <span>
                        Buyer:{" "}
                        <span className="font-medium text-gray-800">{rfq.buyer.company || "Anonymous"}</span>
                    </span>
                    <span>
                        Expires:{" "}
                        <span className="font-medium text-gray-800">
                            {daysUntilExpiry() > 0 ? `${daysUntilExpiry()} days` : "Expired"}
                        </span>
                    </span>
                </div>

                {/* Expandable Section */}
                {isExpanded && (
                    <div className="mt-2 pt-3 border-t border-gray-100 space-y-3 text-sm">
                        {/* Specifications */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {rfq.specifications.material && (
                                <div>
                                    <span className="text-gray-500">Material:</span>
                                    <div className="font-medium text-gray-800">{rfq.specifications.material}</div>
                                </div>
                            )}
                            {rfq.specifications.color && (
                                <div>
                                    <span className="text-gray-500">Color:</span>
                                    <div className="font-medium text-gray-800">{rfq.specifications.color}</div>
                                </div>
                            )}
                            {rfq.specifications.size && (
                                <div>
                                    <span className="text-gray-500">Size:</span>
                                    <div className="font-medium text-gray-800">{rfq.specifications.size}</div>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-500">Views:</span>
                                <div className="font-medium text-gray-800">{rfq.viewCount}</div>
                            </div>
                        </div>

                        {/* Requirements */}
                        {rfq.requirements.length > 0 && (
                            <div>
                                <span className="block text-gray-500 text-xs mb-1">Requirements</span>
                                <div className="flex flex-wrap gap-1">
                                    {rfq.requirements.slice(0, 3).map((req, i) => (
                                        <Badge key={i} variant="outline" className="text-[11px]">
                                            {req}
                                        </Badge>
                                    ))}
                                    {rfq.requirements.length > 3 && (
                                        <Badge variant="outline" className="text-[11px]">
                                            +{rfq.requirements.length - 3} more
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <span className="text-gray-500">Posted:</span>
                                <div className="font-medium text-gray-800">{formatDate(rfq.createdAt)}</div>
                            </div>
                            <div>
                                <span className="text-gray-500">Expires:</span>
                                <div className="font-medium text-gray-800">{formatDate(rfq.expiresAt)}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{rfq.quotesCount} quotes</span>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            {isExpanded ? "Show Less ▲" : "Show More ▼"}
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <Link href={`/rfqs/${rfq.id}`}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs sm:text-sm h-8 px-3 border-gray-300 hover:bg-gray-100"
                            >
                                View
                            </Button>
                        </Link>
                        <Button
                            size="sm"
                            className="text-xs sm:text-sm h-8 px-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-sm"
                            onClick={() => onInfoToast(
                                "Quote submission feature is coming soon! You'll be able to submit competitive quotes for RFQs.",
                                "Coming Soon"
                            )}
                        >
                            Quote
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function RFQsPage() {
    const { data: session } = useSession();
    const { setIsPopupActive } = usePopup();
    const [rfqs, setRfqs] = useState<RFQ[]>([]);
    const [filteredRfqs, setFilteredRfqs] = useState<RFQ[]>([]);
    const [loading, setLoading] = useState(true);
    const { toasts, removeToast, info } = useToast();
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
        console.log('Timer effect running, session:', !!session);

        if (session) {
            setShowOverlay(false);
            setIsPopupActive(false);
            return;
        }

        // Reset timer when component mounts
        setTimeRemaining(10);
        setShowOverlay(false);
        console.log('Starting 10-second timer...');

        // Use setTimeout instead of setInterval for more reliability
        const timer = setTimeout(() => {
            console.log('Timer completed, showing overlay');
            setShowOverlay(true);
            setIsPopupActive(true);
            setTimeRemaining(0);
        }, 10000); // Exactly 10 seconds

        // Optional: Update countdown every second for visual feedback
        const countdownTimer = setInterval(() => {
            setTimeRemaining(prev => {
                const newValue = prev - 1;
                if (newValue <= 0) {
                    clearInterval(countdownTimer);
                }
                return newValue;
            });
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(countdownTimer);
        };
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
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* Auth overlay - only for non-logged-in users */}
            {!session && showOverlay && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
                    {/* Mobile-optimized overlay with stronger blur */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" style={{ backdropFilter: 'blur(4px)' }}></div>
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
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
            <div
                className={`relative bg-white border-b border-gray-100 transition-all duration-500 ${!session && showOverlay ? "blur-sm opacity-50" : ""
                    }`}
            >
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                    <div className="text-center">
                        {/* Subtle gradient title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-green-500 to-blue-700 bg-clip-text text-transparent mb-3 sm:mb-5 tracking-tight">
                            Request for Quotations
                        </h1>

                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
                            Discover business opportunities and connect with verified buyers worldwide.
                            Submit competitive quotes and grow your trade network effortlessly.
                        </p>

                        {/* Timer display (only for guests) */}
                        {!session && !showOverlay && timeRemaining > 0 && (
                            <div className="inline-flex items-center bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-full text-sm font-medium mb-10 transition-all duration-300 hover:bg-blue-100">
                                <svg
                                    className="w-4 h-4 mr-2 text-blue-600 animate-spin-slow"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Free preview ends in {timeRemaining}s
                            </div>
                        )}

                        {/* Modern stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md p-5 sm:p-6">
                                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{rfqs.length}</div>
                                <div className="text-xs sm:text-sm font-medium text-gray-500">Active RFQs</div>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md p-5 sm:p-6">
                                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                                    {rfqs.filter((rfq) => rfq.status === "open").length}
                                </div>
                                <div className="text-xs sm:text-sm font-medium text-gray-500">Open for Quotes</div>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md p-5 sm:p-6">
                                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
                                    {rfqs.reduce((sum, rfq) => sum + rfq.quotesCount, 0)}
                                </div>
                                <div className="text-xs sm:text-sm font-medium text-gray-500">Total Quotes</div>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md p-5 sm:p-6">
                                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">
                                    $
                                    {rfqs
                                        .reduce((sum, rfq) => sum + Number(rfq.budget || 0), 0)
                                        .toLocaleString()}
                                </div>
                                <div className="text-xs sm:text-sm font-medium text-gray-500">Total Budget</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={`bg-white border-b border-gray-200 sticky top-16 z-40 transition-all duration-500 ${!session && showOverlay ? 'blur-sm opacity-50' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
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
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 transition-all duration-500 ${!session && showOverlay ? 'blur-sm opacity-50' : ''}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {filteredRfqs.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No RFQs Found</h3>
                            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                        </div>
                    ) : (
                        filteredRfqs.map((rfq) => (
                            <RFQCard key={rfq.id} rfq={rfq} onInfoToast={info} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
