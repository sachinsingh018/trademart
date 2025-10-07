"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import PageTitle from "@/components/ui/page-title";
import { usePopup } from "@/contexts/PopupContext";

interface Service {
    id: string;
    name: string;
    description: string;
    category: string;
    subcategory: string;
    price: number | null;
    currency: string;
    pricingModel: string;
    minDuration: number | null;
    maxDuration: number | null;
    unit: string;
    supplier: {
        id: string;
        name: string;
        company: string;
        country: string;
        verified: boolean;
        rating: number;
    };
    images: string[];
    specifications: {
        experience?: string;
        deliveryMethod?: string;
        certifications?: string[];
    };
    features: string[];
    tags: string[];
    isAvailable: boolean;
    leadTime: string;
    rating: number | null;
    reviews: number;
    deliveryMethod: string;
    experience: string;
    certifications: string[];
    portfolio: string[];
    createdAt: string;
    updatedAt: string;
    views: number;
    orders: number;
}

// Filters Component with expand/collapse functionality
function FiltersSection({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    handleCategoryChange,
    selectedSubcategory,
    setSelectedSubcategory,
    sortBy,
    setSortBy,
    categories,
    subcategories,
    handleSearch
}: {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedCategory: string;
    handleCategoryChange: (value: string) => void;
    selectedSubcategory: string;
    setSelectedSubcategory: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    categories: string[];
    subcategories: Record<string, string[]>;
    handleSearch: (e: React.FormEvent) => void;
}) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-3 mb-1 sm:mb-2">
            <form onSubmit={handleSearch} className="space-y-2">
                {/* Always visible: Search bar + Filters button */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-8 sm:h-9 text-sm flex-1"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="h-8 sm:h-9 px-3 text-xs sm:text-sm whitespace-nowrap"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                    </Button>
                </div>

                {/* Expandable filters */}
                {showFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t">
                        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                            <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="Subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subcategories</SelectItem>
                                {selectedCategory !== "all" &&
                                    subcategories[selectedCategory as keyof typeof subcategories]?.map((subcategory: string) => (
                                        <SelectItem key={subcategory} value={subcategory}>
                                            {subcategory}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="popular">Most Popular</SelectItem>
                                <SelectItem value="rating">Highest Rated</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </form>
        </div>
    );
}

// Service Card Component with expand/collapse functionality
function ServiceCard({ service }: { service: Service }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const imageUrl = service.images?.[0] || "/placeholder-service.jpg";

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            {/* Service Image */}
            <div className="relative h-40 sm:h-48 bg-gray-50 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Top-right badges */}
                <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                    <span className="bg-white/90 text-gray-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-gray-200">
                        {service.category}
                    </span>
                    <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${service.isAvailable
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-red-50 text-red-700 border-red-100"
                            }`}
                    >
                        {service.isAvailable ? "Available" : "Unavailable"}
                    </span>
                </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-col flex-1 p-4 sm:p-5">
                {/* Title & Description */}
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                    {service.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{service.description}</p>

                {/* Price & Supplier */}
                <div className="flex justify-between items-start mb-3">
                    <div>
                        {service.price && !isNaN(Number(service.price)) ? (
                            <div className="text-lg font-bold text-green-600">
                                {service.currency} {Number(service.price).toFixed(2)}
                            </div>
                        ) : (
                            <div className="text-lg font-bold text-blue-600">Quote on Request</div>
                        )}
                        <div className="text-xs text-gray-500">{service.pricingModel}</div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{service.supplier.company}</p>
                        <p className="text-xs text-gray-500">
                            {service.supplier.country}
                            {service.supplier.verified && <span className="text-green-600 ml-1">✓</span>}
                        </p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>
                        Delivery:{" "}
                        <span className="font-medium text-gray-700">{service.deliveryMethod || "Online / On-site"}</span>
                    </span>
                    <span>{service.reviews} reviews</span>
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                    <div className="mt-2 pt-3 border-t border-gray-100 space-y-3 text-sm">
                        {/* Features */}
                        {service.features.length > 0 && (
                            <div>
                                <span className="block text-gray-500 text-xs mb-1">Key Features</span>
                                <div className="flex flex-wrap gap-1">
                                    {service.features.slice(0, 3).map((feature, i) => (
                                        <Badge key={i} variant="outline" className="text-[11px]">
                                            {feature}
                                        </Badge>
                                    ))}
                                    {service.features.length > 3 && (
                                        <Badge variant="outline" className="text-[11px]">
                                            +{service.features.length - 3} more
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Specifications */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <span className="text-gray-500">Experience:</span>
                                <div className="font-medium text-gray-800">{service.experience || "N/A"}</div>
                            </div>
                            <div>
                                <span className="text-gray-500">Duration:</span>
                                <div className="font-medium text-gray-800">
                                    {service.minDuration && service.maxDuration
                                        ? `${service.minDuration}-${service.maxDuration} ${service.unit}`
                                        : "Flexible"}
                                </div>
                            </div>
                        </div>

                        {/* Certifications */}
                        {service.certifications && service.certifications.length > 0 && (
                            <div>
                                <span className="block text-gray-500 text-xs mb-1">Certifications</span>
                                <div className="flex flex-wrap gap-1">
                                    {service.certifications.slice(0, 3).map((cert, i) => (
                                        <Badge
                                            key={i}
                                            variant="outline"
                                            className="text-[11px] bg-blue-50 text-blue-700 border-blue-100"
                                        >
                                            {cert}
                                        </Badge>
                                    ))}
                                    {service.certifications.length > 3 && (
                                        <Badge variant="outline" className="text-[11px]">
                                            +{service.certifications.length - 3} more
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer Actions */}
                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        {isExpanded ? "Show Less ▲" : "Show More ▼"}
                    </button>

                    <div className="flex gap-2">
                        <Link href={`/services/${service.id}`}>
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
                            className="text-xs sm:text-sm h-8 px-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-sm"
                            onClick={() => alert("Service quote request placeholder")}
                        >
                            Get Quote
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function ServicesPage() {
    const { data: session } = useSession();
    const { setIsPopupActive } = usePopup();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSubcategory, setSelectedSubcategory] = useState("all");
    const [sortBy, setSortBy] = useState("popular");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({
        totalServices: 0,
        totalViews: 0,
        totalOrders: 0,
        availableServices: 0,
    });
    const [showOverlay, setShowOverlay] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(10);

    const categories = [
        "Technology",
        "Finance",
        "Marketing",
        "Consulting",
        "Design",
        "Legal",
        "Healthcare",
        "Education",
        "Logistics",
        "Other"
    ];

    const subcategories = {
        "Technology": ["Web Development", "Mobile Development", "AI/ML", "Cloud Services", "Cybersecurity", "Data Analytics"],
        "Finance": ["Accounting", "Tax Services", "Financial Planning", "Investment Advisory", "Insurance", "Auditing"],
        "Marketing": ["Digital Marketing", "Content Creation", "SEO/SEM", "Social Media", "Branding", "Advertising"],
        "Consulting": ["Business Strategy", "Management Consulting", "Operations", "HR Consulting", "IT Consulting", "Financial Consulting"],
        "Design": ["Graphic Design", "UI/UX Design", "Web Design", "Product Design", "Interior Design", "Architecture"],
        "Legal": ["Corporate Law", "Contract Law", "Intellectual Property", "Employment Law", "Real Estate Law", "Litigation"],
        "Healthcare": ["Medical Services", "Telemedicine", "Health Consulting", "Medical Research", "Healthcare IT", "Wellness"],
        "Education": ["Training", "Tutoring", "Curriculum Development", "Educational Technology", "Language Learning", "Professional Development"],
        "Logistics": ["Supply Chain", "Transportation", "Warehousing", "Inventory Management", "Fulfillment", "Last Mile Delivery"],
        "Other": ["General Services", "Custom Solutions", "Specialized Services"]
    };

    const formatPrice = (price: number | null, currency: string, pricingModel: string) => {
        if (price === null) return "Contact for pricing";
        if (pricingModel === "hourly") return `${currency} ${price}/hour`;
        if (pricingModel === "project") return `${currency} ${price}/project`;
        return `${currency} ${price}`;
    };

    const fetchServices = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage.toString(),
                search: searchTerm,
                category: selectedCategory,
                subcategory: selectedSubcategory,
                sortBy: sortBy,
            });

            const response = await fetch(`/api/services?${params}`);
            const data = await response.json();

            if (data.success) {
                setServices(data.data.services);
                setTotalPages(data.data.pagination.totalPages);
                setStats(data.data.stats);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, selectedCategory, selectedSubcategory, sortBy]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    // Timer effect for overlay - only for non-logged-in users
    useEffect(() => {
        console.log('Timer effect running, session:', !!session);

        if (session) {
            setShowOverlay(false);
            setIsPopupActive(false);
            setTimeRemaining(10); // Reset timer
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchServices();
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setSelectedSubcategory("all");
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <PageTitle
                title="Professional Services"
                description="Find and connect with verified service providers across various industries"
            />

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
                                Sign in to view detailed service information and contact providers.
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
                        {/* Gradient Title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-green-500 to-blue-700 bg-clip-text text-transparent mb-3 sm:mb-5 tracking-tight">
                            Professional Services
                        </h1>

                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
                            Find and connect with verified professionals across multiple industries.
                            Explore our curated catalog of trusted service providers and get instant quotes.
                        </p>

                        {/* Timer display for guests */}
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
                    </div>
                </div>
            </div>

            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 transition-all duration-500 ${!session && showOverlay ? 'blur-sm opacity-50' : ''}`}>
                {/* Ultra-compact filters */}
                <FiltersSection
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCategory={selectedCategory}
                    handleCategoryChange={handleCategoryChange}
                    selectedSubcategory={selectedSubcategory}
                    setSelectedSubcategory={setSelectedSubcategory}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    categories={categories}
                    subcategories={subcategories}
                    handleSearch={handleSearch}
                />

                {/* Stats - Compact on mobile */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-1 sm:mb-2 lg:mb-3">
                    <Card>
                        <CardContent className="p-2 sm:p-3 lg:p-4">
                            <div className="text-center">
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">{stats.totalServices}</p>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Services</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-2 sm:p-3 lg:p-4">
                            <div className="text-center">
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mb-1">{stats.availableServices}</p>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Available</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-2 sm:p-3 lg:p-4">
                            <div className="text-center">
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-1">{stats.totalViews}</p>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Views</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-2 sm:p-3 lg:p-4">
                            <div className="text-center">
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 mb-1">{stats.totalOrders}</p>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Services Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-64 sm:h-72"></div>
                        ))}
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria or browse all services.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {services.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
