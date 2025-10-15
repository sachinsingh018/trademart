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
import PageTitle from "@/components/ui/page-title";
import { usePopup } from "@/contexts/PopupContext";
import { useToast, ToastContainer } from "@/components/ui/toast";

interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    subcategory: string;
    price: number;
    currency: string;
    minOrderQuantity: number;
    unit: string;
    supplier: {
        id: string;
        name: string;
        company: string;
        country: string;
        verified: boolean;
        rating: number;
        phone?: string;
    };
    images: string[];
    specifications: {
        material?: string;
        color?: string;
        size?: string;
        weight?: string;
        certification?: string;
    };
    features: string[];
    tags: string[];
    inStock: boolean;
    stockQuantity?: number;
    leadTime: string;
    createdAt: string;
    updatedAt: string;
    views: number;
    orders: number;
}

// Product Card Component with expand/collapse functionality
function ProductCard({ product }: { product: Product }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const imageUrl = product.images?.[0] || "/placeholder-product.jpg";

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
            {/* Product Image */}
            <div className="relative h-40 sm:h-48 bg-gray-50 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Top right badges */}
                <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                    <span className="bg-white/90 text-gray-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-gray-200">
                        {product.category}
                    </span>
                    <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${product.inStock
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-red-50 text-red-700 border-red-100"
                            }`}
                    >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-col flex-1 p-4 sm:p-5">
                {/* Product Name */}
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>

                {/* Price & Supplier */}
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <div className="text-lg font-bold text-green-600">
                            {product.currency} {Number(product.price).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                            Min: {product.minOrderQuantity} {product.unit}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{product.supplier.company}</p>
                        <p className="text-xs text-gray-500">
                            {product.supplier.country}
                            {product.supplier.verified && <span className="text-green-600 ml-1">✓</span>}
                        </p>
                    </div>
                </div>

                {/* Quick Info */}
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Lead Time: <span className="font-medium text-gray-700">{product.leadTime}</span></span>
                    <span>{product.orders} orders</span>
                </div>

                {/* Expandable Section */}
                {isExpanded && (
                    <div className="mt-2 pt-3 border-t border-gray-100 space-y-2 text-sm">
                        {/* Features */}
                        {product.features.length > 0 && (
                            <div>
                                <span className="block text-gray-500 text-xs mb-1">Key Features</span>
                                <div className="flex flex-wrap gap-1">
                                    {product.features.slice(0, 3).map((feature, i) => (
                                        <Badge key={i} variant="outline" className="text-[11px]">
                                            {feature}
                                        </Badge>
                                    ))}
                                    {product.features.length > 3 && (
                                        <Badge variant="outline" className="text-[11px]">
                                            +{product.features.length - 3} more
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Specifications */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {product.specifications.material && (
                                <div>
                                    <span className="text-gray-500">Material:</span>
                                    <div className="font-medium text-gray-800">{product.specifications.material}</div>
                                </div>
                            )}
                            {product.specifications.color && (
                                <div>
                                    <span className="text-gray-500">Color:</span>
                                    <div className="font-medium text-gray-800">{product.specifications.color}</div>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-500">Views:</span>
                                <div className="font-medium text-gray-800">{product.views.toLocaleString()}</div>
                            </div>
                            <div>
                                <span className="text-gray-500">Orders:</span>
                                <div className="font-medium text-gray-800">{product.orders.toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Tags */}
                        {product.tags.length > 0 && (
                            <div>
                                <span className="block text-gray-500 text-xs mb-1">Tags</span>
                                <div className="flex flex-wrap gap-1">
                                    {product.tags.slice(0, 4).map((tag, i) => (
                                        <Badge key={i} variant="outline" className="text-[11px] bg-gray-50 text-gray-700">
                                            #{tag}
                                        </Badge>
                                    ))}
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
                        <Link href={`/products/${product.id}`}>
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
                            onClick={() => {
                                if (product.supplier.phone) {
                                    window.open(`https://wa.me/${product.supplier.phone.replace(/\D/g, "")}`, "_blank");
                                } else {
                                    warning(
                                        "This supplier hasn't provided their contact information yet.",
                                        "Contact Information Unavailable"
                                    );
                                }
                            }}
                        >
                            Contact
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function ProductsPage() {
    const { data: session } = useSession();
    const { setIsPopupActive } = usePopup();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { toasts, removeToast, warning } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSubcategory, setSelectedSubcategory] = useState("all");
    const [sortBy, setSortBy] = useState("popular");
    const [showOverlay, setShowOverlay] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(10);

    // Fetch products from database
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = new URLSearchParams({
                    page: "1",
                    limit: "50",
                    ...(searchTerm && { search: searchTerm }),
                    ...(selectedCategory !== "all" && { category: selectedCategory }),
                    ...(selectedSubcategory !== "all" && { subcategory: selectedSubcategory }),
                    sortBy,
                });

                const response = await fetch(`/api/products?${params}`);
                const result = await response.json();

                if (result.success) {
                    // Transform database data to match component interface
                    const transformedProducts = result.data.products.map((product: {
                        id: string;
                        name: string;
                        description: string;
                        category: string;
                        subcategory: string;
                        price: number;
                        currency: string;
                        minOrderQuantity: number;
                        unit: string;
                        features: string[];
                        tags: string[];
                        images: string[];
                        specifications: Record<string, unknown>;
                        inStock: boolean;
                        stockQuantity: number;
                        leadTime: string;
                        views: number;
                        orders: number;
                        createdAt: string;
                        updatedAt: string;
                        supplier: {
                            id: string;
                            companyName: string;
                            country: string;
                            verified: boolean;
                            rating: number;
                            totalOrders: number;
                            responseTime: string;
                            user: { name: string };
                        };
                    }) => ({
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        category: product.category,
                        subcategory: product.subcategory,
                        price: parseFloat(product.price.toString()),
                        currency: product.currency,
                        minOrderQuantity: product.minOrderQuantity,
                        unit: product.unit,
                        supplier: {
                            id: product.supplier.id,
                            name: product.supplier.user?.name || "N/A",
                            company: product.supplier.companyName,
                            country: product.supplier.country,
                            verified: product.supplier.verified,
                            rating: parseFloat(product.supplier.rating.toString()),
                        },
                        images: product.images || [],
                        specifications: product.specifications || {},
                        features: product.features || [],
                        tags: product.tags || [],
                        inStock: product.inStock,
                        stockQuantity: product.stockQuantity,
                        leadTime: product.leadTime || "N/A",
                        createdAt: product.createdAt,
                        updatedAt: product.updatedAt,
                        views: product.views,
                        orders: product.orders,
                    }));

                    setProducts(transformedProducts);
                    setFilteredProducts(transformedProducts);
                } else {
                    console.error("Failed to fetch products:", result.error);
                    setProducts([]);
                    setFilteredProducts([]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchTerm, selectedCategory, selectedSubcategory, sortBy]);

    // Filter and search functionality
    useEffect(() => {
        let filtered = products;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (product) =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Category filter
        if (selectedCategory !== "all") {
            filtered = filtered.filter((product) => product.category === selectedCategory);
        }

        // Subcategory filter
        if (selectedSubcategory !== "all") {
            filtered = filtered.filter((product) => product.subcategory === selectedSubcategory);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "popular":
                    return b.views - a.views;
                case "orders":
                    return b.orders - a.orders;
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                case "newest":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                default:
                    return 0;
            }
        });

        setFilteredProducts(filtered);
    }, [products, searchTerm, selectedCategory, selectedSubcategory, sortBy]);

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

    const getSubcategories = (category: string) => {
        const subcategories = {
            "Electronics": ["Audio", "Lighting", "Components", "Accessories"],
            "Textiles": ["Clothing", "Home Textiles", "Industrial Textiles", "Accessories"],
            "Manufacturing": ["Tools", "Containers", "Machinery", "Components"],
            "Automotive": ["Brake Systems", "Engine Parts", "Accessories", "Tools"],
            "Chemicals": ["Solvents", "Adhesives", "Coatings", "Additives"],
            "Food & Beverage": ["Packaging", "Ingredients", "Equipment", "Supplies"],
            "Construction": ["Materials", "Tools", "Equipment", "Safety"],
            "Healthcare": ["Equipment", "Supplies", "Devices", "Consumables"],
        };
        return subcategories[category as keyof typeof subcategories] || [];
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative">
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <PageTitle
                title="Products | TradeMart - Browse Global Product Catalog"
                description="Discover products from verified suppliers worldwide. Browse our extensive catalog of electronics, textiles, manufacturing, and more."
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
                                Sign in to view detailed product information and contact suppliers.
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
                            Product Catalog
                        </h1>

                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
                            Explore premium products from verified suppliers worldwide.
                            Compare, connect, and trade smarter with trusted B2B partners across industries.
                        </p>

                        {/* Timer badge for guest users */}
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

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md p-5 sm:p-6">
                                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                                    {products.length}
                                </div>
                                <div className="text-xs sm:text-sm font-medium text-gray-500">
                                    Total Products
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md p-5 sm:p-6">
                                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                                    {products.filter((p) => p.inStock).length}
                                </div>
                                <div className="text-xs sm:text-sm font-medium text-gray-500">
                                    In Stock
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md p-5 sm:p-6">
                                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
                                    {products.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                                </div>
                                <div className="text-xs sm:text-sm font-medium text-gray-500">
                                    Total Views
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md p-5 sm:p-6">
                                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">
                                    {products.reduce((sum, p) => sum + p.orders, 0).toLocaleString()}
                                </div>
                                <div className="text-xs sm:text-sm font-medium text-gray-500">
                                    Total Orders
                                </div>
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
                                placeholder="Search products by name, description, category, or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Select value={selectedCategory} onValueChange={(value) => {
                                setSelectedCategory(value);
                                setSelectedSubcategory("all");
                            }}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Electronics">Electronics</SelectItem>
                                    <SelectItem value="Textiles">Textiles</SelectItem>
                                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                    <SelectItem value="Automotive">Automotive</SelectItem>
                                    <SelectItem value="Chemicals">Chemicals</SelectItem>
                                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                                    <SelectItem value="Construction">Construction</SelectItem>
                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Subcategory" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Subcategories</SelectItem>
                                    {getSubcategories(selectedCategory).map((subcategory) => (
                                        <SelectItem key={subcategory} value={subcategory}>
                                            {subcategory}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="popular">Most Popular</SelectItem>
                                    <SelectItem value="orders">Most Ordered</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products List */}
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 transition-all duration-500 ${!session && showOverlay ? 'blur-sm opacity-50' : ''}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
