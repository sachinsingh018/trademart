"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        totalOrders: number;
        responseTime: string;
    };
    images: string[];
    specifications: {
        material?: string;
        color?: string;
        size?: string;
        weight?: string;
        certification?: string;
        warranty?: string;
        power?: string;
        battery?: string;
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
    relatedProducts: {
        id: string;
        name: string;
        price: number;
        currency: string;
        image: string;
    }[];
}

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState("");
    const [selectedSpecs, setSelectedSpecs] = useState({
        color: "",
        size: "",
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/products/${params.id}`);
                const data = await response.json();

                if (data.success) {
                    setProduct(data.data);
                } else {
                    console.error("Failed to fetch product:", data.error);
                    setProduct(null);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const handleQuoteRequest = () => {
        // TODO: Implement quote request functionality
        console.log("Quote request:", {
            productId: product?.id,
            quantity: quantity,
            specifications: selectedSpecs,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return "text-green-600";
        if (rating >= 4.0) return "text-blue-600";
        if (rating >= 3.5) return "text-yellow-600";
        return "text-red-600";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h3>
                    <p className="text-gray-600 mb-4">The requested product could not be found.</p>
                    <Link href="/products">
                        <Button>Back to Products</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
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
                                <Link href="/products" className="text-blue-600 font-medium">
                                    Products
                                </Link>
                                <Link href="/rfqs" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                    RFQs
                                </Link>
                                <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                    Pricing
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link href="/products" className="text-gray-500 hover:text-gray-700">
                                    Products
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li>
                                <Link href={`/products?category=${product.category}`} className="text-gray-500 hover:text-gray-700">
                                    {product.category}
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-900 font-medium">{product.name}</li>
                        </ol>
                    </nav>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Images */}
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                                            <div className="text-gray-400 text-6xl">📱</div>
                                        </div>
                                        <div className="flex space-x-2">
                                            {product.images.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedImage(index)}
                                                    className={`w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center ${selectedImage === index ? 'ring-2 ring-blue-500' : ''
                                                        }`}
                                                >
                                                    <div className="text-gray-400 text-lg">📱</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className="text-3xl font-bold text-green-600">
                                                {product.currency} {Number(product.price || 0).toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Min Order: {product.minOrderQuantity} {product.unit}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 mb-6">
                                            <Badge variant="outline" className="text-sm">
                                                {product.category}
                                            </Badge>
                                            <Badge variant="outline" className="text-sm">
                                                {product.subcategory}
                                            </Badge>
                                            {product.inStock ? (
                                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                                    In Stock
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-100 text-red-800 border-red-200">
                                                    Out of Stock
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-gray-700 mb-6">{product.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Specifications */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Specifications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        value && (
                                            <div key={key} className="flex justify-between">
                                                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                                <span className="font-medium">{value}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Key Features</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.features.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Related Products */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Related Products</CardTitle>
                                <CardDescription>You might also be interested in these products</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {product.relatedProducts.map((relatedProduct) => (
                                        <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                                            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                                                    <div className="text-gray-400 text-2xl">📱</div>
                                                </div>
                                                <h4 className="font-semibold mb-2 line-clamp-1">{relatedProduct.name}</h4>
                                                <div className="text-lg font-bold text-green-600">
                                                    {relatedProduct.currency} {Number(relatedProduct.price || 0).toFixed(2)}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Supplier Information */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Supplier Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold">{product.supplier.company}</div>
                                            <div className="text-sm text-gray-600">{product.supplier.name}</div>
                                        </div>
                                        {product.supplier.verified && (
                                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                                ✓ Verified
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Country:</span>
                                            <span className="font-medium">{product.supplier.country}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Rating:</span>
                                            <span className={`font-medium ${getRatingColor(product.supplier.rating)}`}>
                                                ⭐ {product.supplier.rating}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Orders:</span>
                                            <span className="font-medium">{product.supplier.totalOrders.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Response:</span>
                                            <span className="font-medium">{product.supplier.responseTime}</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200">
                                        <Link href={`/suppliers/${product.supplier.id}`}>
                                            <Button variant="outline" className="w-full mb-2">
                                                View Supplier Profile
                                            </Button>
                                        </Link>
                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                            Contact Supplier
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quote Request */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Request Quote</CardTitle>
                                <CardDescription>Get a custom quote for this product</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="quantity">Quantity</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            placeholder={`Min: ${product.minOrderQuantity}`}
                                            min={product.minOrderQuantity}
                                        />
                                    </div>

                                    {product.specifications.color && (
                                        <div>
                                            <Label htmlFor="color">Color</Label>
                                            <Select value={selectedSpecs.color} onValueChange={(value) => setSelectedSpecs({ ...selectedSpecs, color: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select color" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {product.specifications.color.split(', ').map((color) => (
                                                        <SelectItem key={color} value={color}>{color}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-gray-200">
                                        <Button
                                            onClick={handleQuoteRequest}
                                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                            disabled={!quantity || parseInt(quantity) < product.minOrderQuantity}
                                        >
                                            Request Quote
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Product Stats */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Product Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Views:</span>
                                        <span className="font-medium">{Number(product.views || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Orders:</span>
                                        <span className="font-medium">{Number(product.orders || 0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Lead Time:</span>
                                        <span className="font-medium">{product.leadTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Updated:</span>
                                        <span className="font-medium">{formatDate(product.updatedAt)}</span>
                                    </div>
                                    {product.stockQuantity && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Stock:</span>
                                            <span className="font-medium">{Number(product.stockQuantity || 0).toLocaleString()} units</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Product Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-700">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
