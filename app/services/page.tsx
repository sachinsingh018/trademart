"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import PageTitle from "@/components/ui/page-title";

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

export default function ServicesPage() {
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
        <div className="min-h-screen bg-gray-50">
            <PageTitle
                title="Professional Services"
                description="Find and connect with verified service providers across various industries"
            />
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <Image
                                    src="/logofinal.png"
                                    alt="TradeMart Logo"
                                    width={160}
                                    height={160}
                                    className="w-40 h-40 hover:scale-120 transition-transform duration-300 drop-shadow-2xl"
                                />
                            </Link>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="hidden md:flex items-center space-x-6">
                                <Link href="/suppliers" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                    Suppliers
                                </Link>
                                <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                    Products
                                </Link>
                                <Link href="/services" className="text-blue-600 font-medium">
                                    Services
                                </Link>
                                <Link href="/rfqs" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                    RFQs
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link href="/auth/signin">
                                    <Button variant="outline" className="border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors">Sign In</Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">Get Started</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Professional Services
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Find and connect with verified service providers across various industries.
                            Browse our extensive catalog of professional services and get quotes.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Services
                                </label>
                                <Input
                                    placeholder="Search services..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
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
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subcategory
                                </label>
                                <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select subcategory" />
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
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort By
                                </label>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
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
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                Search Services
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">Total Services</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">Available Services</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.availableServices}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.totalViews}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.totalOrders}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Services Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-80"></div>
                        ))}
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria or browse all services.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <Link key={service.id} href={`/services/${service.id}`} className="block h-full">
                                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden cursor-pointer h-full flex flex-col">
                                    <div className="relative">
                                        {service.images && service.images.length > 0 ? (
                                            <Image
                                                src={service.images[0]}
                                                alt={service.name}
                                                width={400}
                                                height={200}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                                <svg className="w-16 h-16 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            {service.isAvailable ? (
                                                <Badge className="bg-green-500 text-white border-green-400 text-xs px-2 py-1">
                                                    Available
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-500 text-white border-red-400 text-xs px-2 py-1">
                                                    Unavailable
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="absolute top-3 left-3">
                                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-1">
                                                {service.pricingModel}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardHeader className="p-4 flex-shrink-0">
                                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {service.name}
                                        </CardTitle>
                                        <CardDescription className="text-sm text-gray-600">
                                            {service.category} • {service.subcategory}
                                        </CardDescription>
                                    </CardHeader>

                                    <div className="px-4 pb-4 flex-grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {formatPrice(service.price, service.currency, service.pricingModel)}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {service.deliveryMethod}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-600">Provider:</span>
                                                    <span className="text-sm font-medium">{service.supplier.company}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-yellow-500">⭐</span>
                                                    <span className="text-sm font-medium">{service.rating || service.supplier.rating}</span>
                                                </div>
                                            </div>

                                            {service.experience && (
                                                <div className="text-sm text-gray-600 mb-2">
                                                    Experience: {service.experience}
                                                </div>
                                            )}

                                            {service.certifications && service.certifications.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    {service.certifications.slice(0, 2).map((cert, index) => (
                                                        <Badge key={index} className="bg-gray-100 text-gray-700 text-xs">
                                                            {cert}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-600">{service.supplier.country}</span>
                                                {service.supplier.verified && (
                                                    <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                                        Verified
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-sm text-blue-600 font-medium group-hover:text-blue-700">
                                                View Details →
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-4 py-2 text-sm text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
