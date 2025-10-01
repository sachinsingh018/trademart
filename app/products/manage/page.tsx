"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Package,
    TrendingUp,
    DollarSign,
    Calendar,
    MoreHorizontal
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    subcategory?: string;
    price: number;
    currency: string;
    minOrderQuantity: number;
    unit: string;
    inStock: boolean;
    stockQuantity?: number;
    leadTime?: string;
    views: number;
    orders: number;
    createdAt: string;
    updatedAt: string;
    images: string[];
    features: string[];
    tags: string[];
}

export default function ProductManagement() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        } else if (session?.user?.role !== "supplier") {
            router.push("/dashboard");
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session?.user?.role === "supplier") {
            fetchProducts();
        }
    }, [session]);

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products/my-products");
            const data = await response.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setProducts(products.filter(p => p.id !== productId));
            } else {
                alert("Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "oldest":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "name":
                return a.name.localeCompare(b.name);
            case "price-high":
                return b.price - a.price;
            case "price-low":
                return a.price - b.price;
            case "views":
                return b.views - a.views;
            case "orders":
                return b.orders - a.orders;
            default:
                return 0;
        }
    });

    const categories = Array.from(new Set(products.map(p => p.category)));

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your products...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== "supplier") {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                                <p className="text-gray-600 mt-1">Manage your product catalog</p>
                            </div>
                        </div>
                        <Link href="/products/create">
                            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                                <Plus className="h-5 w-5 mr-2" />
                                Add Product
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{products.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {products.filter(p => p.inStock).length} in stock
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {products.reduce((sum, p) => sum + p.views, 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                +12% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {products.reduce((sum, p) => sum + p.orders, 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                +8% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : 0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Across all products
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="mb-8">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="name">Name A-Z</option>
                                    <option value="price-high">Price High-Low</option>
                                    <option value="price-low">Price Low-High</option>
                                    <option value="views">Most Views</option>
                                    <option value="orders">Most Orders</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Grid */}
                {sortedProducts.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {products.length === 0 ? "No Products Yet" : "No Products Found"}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {products.length === 0
                                        ? "Start building your product catalog by adding your first product."
                                        : "Try adjusting your search or filter criteria."
                                    }
                                </p>
                                {products.length === 0 && (
                                    <Link href="/products/create">
                                        <Button className="bg-green-600 hover:bg-green-700">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Your First Product
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedProducts.map((product) => (
                            <Card key={product.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {product.category}
                                                {product.subcategory && ` • ${product.subcategory}`}
                                            </CardDescription>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/products/${product.id}`}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/products/${product.id}/edit`}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {/* Product Image */}
                                        {product.images && product.images.length > 0 ? (
                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    width={200}
                                                    height={200}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Package className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}

                                        {/* Price and Stock */}
                                        <div className="flex items-center justify-between">
                                            <div className="text-lg font-semibold text-green-600">
                                                ${product.price} {product.currency}
                                            </div>
                                            <Badge variant={product.inStock ? "default" : "secondary"}>
                                                {product.inStock ? "In Stock" : "Out of Stock"}
                                            </Badge>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {product.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-4 w-4" />
                                                    {product.views}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="h-4 w-4" />
                                                    {product.orders}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(product.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {/* Features */}
                                        {product.features && product.features.length > 0 && (
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
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
