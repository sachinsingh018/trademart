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
import { useSession } from "next-auth/react";
import { useViewTracker } from "@/hooks/useViewTracker";

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
        phone?: string;
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
    const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

    // Track page views
    useViewTracker({ type: 'product', id: params?.id as string });
    const [quoteMessage, setQuoteMessage] = useState("");
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const { data: session, status } = useSession();

    const handleContactSupplier = () => {
        console.log('Product supplier phone:', product?.supplier?.phone); // Debug log
        if (!product?.supplier?.phone) {
            alert("Supplier phone number not available");
            return;
        }

        const message = `Hi! I'm interested in your product "${product.name}" (${product.currency} ${product.price} per ${product.unit}). Could you please provide more details about availability and pricing?`;

        // Clean phone number but preserve + for international numbers
        let cleanPhone = product.supplier.phone.replace(/[^0-9+]/g, '');
        if (!cleanPhone.startsWith('+')) {
            cleanPhone = '+' + cleanPhone;
        }

        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        console.log('WhatsApp URL:', whatsappUrl); // Debug log
        window.open(whatsappUrl, '_blank');
    };

    const fetchProduct = async (retryAttempt = 0) => {
        if (!params?.id) {
            console.log("No product ID in params");
            return;
        }

        try {
            console.log(`Fetching product with ID: ${params.id} (attempt ${retryAttempt + 1})`);
            setLoading(true);
            setFetchError(null);

            const response = await fetch(`/api/products/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-cache'
            });

            console.log("Response status:", response.status);
            console.log("Response ok:", response.ok);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Product API response:", data);

            if (data.success) {
                setProduct(data.data);
                setFetchError(null);
                setRetryCount(0);
                console.log("Product loaded successfully:", data.data);
            } else {
                console.error("API returned error:", data.error);
                setFetchError(data.error || "Failed to fetch product");
                setProduct(null);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            console.error("Error details:", {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                name: error instanceof Error ? error.name : 'Unknown'
            });

            const errorMessage = error instanceof Error ? error.message : "Failed to fetch product";
            setFetchError(errorMessage);
            setProduct(null);

            // Retry logic - retry up to 2 times with exponential backoff
            if (retryAttempt < 2) {
                console.log(`Retrying in ${Math.pow(2, retryAttempt) * 1000}ms...`);
                setTimeout(() => {
                    setRetryCount(retryAttempt + 1);
                    fetchProduct(retryAttempt + 1);
                }, Math.pow(2, retryAttempt) * 1000);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params?.id) {
            fetchProduct();
        }
    }, [params?.id]);

    const handleQuoteRequest = async () => {
        console.log("Quote request clicked. Session status:", status, "Session:", session);

        if (status === "loading") {
            setQuoteMessage("Please wait...");
            return;
        }

        if (!session) {
            console.log("No session found, redirecting to login");
            window.location.href = "/auth/signin";
            return;
        }

        if (!quantity || parseInt(quantity) < product!.minOrderQuantity) {
            setQuoteMessage(`Minimum order quantity is ${product!.minOrderQuantity} ${product!.unit}`);
            return;
        }

        setIsSubmittingQuote(true);
        setQuoteMessage("");

        try {
            console.log("Submitting quote request with data:", {
                productId: product?.id,
                supplierId: product?.supplier.id,
                quantity: parseInt(quantity),
                specifications: selectedSpecs,
                notes: `Quote request for ${quantity} ${product?.unit} of ${product?.name}`,
            });

            const response = await fetch("/api/products/quote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: product?.id,
                    supplierId: product?.supplier.id,
                    quantity: parseInt(quantity),
                    specifications: selectedSpecs,
                    notes: `Quote request for ${quantity} ${product?.unit} of ${product?.name}`,
                }),
            });

            const responseData = await response.json();
            console.log("Quote submission response:", responseData);

            if (response.ok) {
                setQuoteMessage("Quote request submitted successfully!");
                setTimeout(() => {
                    setQuoteMessage("");
                }, 3000);
            } else {
                setQuoteMessage(`Failed to submit quote request: ${responseData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error submitting quote:", error);
            setQuoteMessage("An error occurred. Please try again.");
        } finally {
            setIsSubmittingQuote(false);
        }
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
                    {retryCount > 0 && (
                        <p className="text-sm text-gray-500 mt-2">Retry attempt {retryCount}/3</p>
                    )}
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {fetchError ? "Failed to Load Product" : "Product Not Found"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {fetchError || "The requested product could not be found."}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button
                            onClick={() => fetchProduct()}
                            variant="outline"
                            disabled={loading}
                        >
                            {loading ? "Retrying..." : "Try Again"}
                        </Button>
                        <Link href="/products">
                            <Button>Back to Products</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
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
                                        <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                            {product.images && product.images.length > 0 ? (
                                                <Image
                                                    src={product.images[selectedImage] || product.images[0]}
                                                    alt={product.name}
                                                    width={400}
                                                    height={400}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-gray-400 text-6xl">📱</div>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            {product.images && product.images.map((image, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedImage(index)}
                                                    className={`w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden ${selectedImage === index ? 'ring-2 ring-blue-500' : ''
                                                        }`}
                                                >
                                                    <Image
                                                        src={image}
                                                        alt={`${product.name} ${index + 1}`}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full object-cover"
                                                    />
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
                                        <Button
                                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                            onClick={handleContactSupplier}
                                        >
                                            📱 Contact via WhatsApp
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
                                        <p className="text-sm text-gray-600 mt-1">
                                            Minimum order quantity: {product.minOrderQuantity} {product.unit}
                                        </p>
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
                                        {quoteMessage && (
                                            <div className={`p-3 rounded-lg mb-3 ${quoteMessage.includes("successfully")
                                                ? "bg-green-50 border border-green-200 text-green-700"
                                                : "bg-red-50 border border-red-200 text-red-700"
                                                }`}>
                                                {quoteMessage}
                                            </div>
                                        )}
                                        <Button
                                            onClick={handleQuoteRequest}
                                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                            disabled={!quantity || parseInt(quantity) < product.minOrderQuantity || isSubmittingQuote}
                                        >
                                            {isSubmittingQuote ? "Submitting..." :
                                                !quantity ? "Enter Quantity" :
                                                    parseInt(quantity) < product.minOrderQuantity ? `Min: ${product.minOrderQuantity} ${product.unit}` :
                                                        "Request Quote"}
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
