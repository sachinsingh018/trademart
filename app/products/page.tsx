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

export default function ProductsPage() {
    const { data: session } = useSession();
    const { setIsPopupActive } = usePopup();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
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
        if (session) {
            setShowOverlay(false);
            setIsPopupActive(false);
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    setShowOverlay(true);
                    setIsPopupActive(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
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
            <PageTitle
                title="Products | TradeMart - Browse Global Product Catalog"
                description="Discover products from verified suppliers worldwide. Browse our extensive catalog of electronics, textiles, manufacturing, and more."
            />

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
            <div className={`bg-white border-b border-gray-200 transition-all duration-500 ${!session && showOverlay ? 'blur-sm opacity-50' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Product Catalog
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Discover high-quality products from verified suppliers worldwide.
                            Browse our extensive catalog of B2B products across various industries.
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
                                <div className="text-3xl font-bold text-blue-600 mb-2">{products.length}</div>
                                <div className="text-gray-600">Total Products</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-6">
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {products.filter(p => p.inStock).length}
                                </div>
                                <div className="text-gray-600">In Stock</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-6">
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    {products.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                                </div>
                                <div className="text-gray-600">Total Views</div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">
                                    {products.reduce((sum, p) => sum + p.orders, 0).toLocaleString()}
                                </div>
                                <div className="text-gray-600">Total Orders</div>
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
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-500 ${!session && showOverlay ? 'blur-sm opacity-50' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <Card key={product.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md flex flex-col h-full">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg mb-1 line-clamp-1">{product.name}</CardTitle>
                                            <CardDescription className="text-sm line-clamp-2">
                                                {product.description}
                                            </CardDescription>
                                        </div>
                                        <div className="flex flex-col items-end space-y-1">
                                            <Badge variant="outline" className="text-xs">
                                                {product.category}
                                            </Badge>
                                            {product.inStock ? (
                                                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                                    In Stock
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                                                    Out of Stock
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col flex-grow">
                                    <div className="space-y-4 flex-grow">
                                        {/* Price and Supplier */}
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="text-xl font-bold text-green-600">
                                                    {product.currency} {product.price.toFixed(2)}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Min Order: {product.minOrderQuantity} {product.unit}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">{product.supplier.company}</div>
                                                <div className="text-xs text-gray-600">
                                                    {product.supplier.country}
                                                    {product.supplier.verified && <span className="text-green-600 ml-1">✓</span>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div>
                                            <span className="text-sm text-gray-600 mb-2 block">Key Features:</span>
                                            <div className="flex flex-wrap gap-1">
                                                {product.features.slice(0, 3).map((feature, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                                {product.features.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{product.features.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Specifications */}
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            {product.specifications.material && (
                                                <div>
                                                    <span className="text-gray-600">Material:</span>
                                                    <div className="font-medium truncate">{product.specifications.material}</div>
                                                </div>
                                            )}
                                            {product.specifications.color && (
                                                <div>
                                                    <span className="text-gray-600">Color:</span>
                                                    <div className="font-medium truncate">{product.specifications.color}</div>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-gray-600">Lead Time:</span>
                                                <div className="font-medium">{product.leadTime}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Views:</span>
                                                <div className="font-medium">{product.views.toLocaleString()}</div>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div>
                                            <span className="text-sm text-gray-600 mb-2 block">Tags:</span>
                                            <div className="flex flex-wrap gap-1">
                                                {product.tags.slice(0, 4).map((tag, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-700">
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions - Always at bottom */}
                                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center mt-auto">
                                        <div className="text-sm text-gray-600">
                                            {product.orders} orders
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link href={`/products/${product.id}`}>
                                                <Button variant="outline" size="sm">
                                                    View Details
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                                onClick={() => {
                                                    if (product.supplier.phone) {
                                                        window.open(`https://wa.me/${product.supplier.phone.replace(/\D/g, '')}`, '_blank');
                                                    } else {
                                                        alert("Supplier contact information not available");
                                                    }
                                                }}
                                            >
                                                Contact Supplier
                                            </Button>
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
