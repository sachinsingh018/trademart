"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Supplier {
    id: string;
    name: string;
    company: string;
    country: string;
    industry: string;
    verified: boolean;
    rating: number;
    totalOrders: number;
    responseTime: string;
    minOrderValue: number;
    currency: string;
    description: string;
    specialties: string[];
    certifications: string[];
    establishedYear: number;
    employees: string;
    website?: string;
    logo?: string;
    joinedDate: string;
    lastActive: string;
    contactInfo: {
        email: string;
        phone: string;
        address: string;
        city: string;
        postalCode: string;
    };
    businessInfo: {
        businessType: string;
        annualRevenue: string;
        exportMarkets: string[];
        mainProducts: string[];
    };
    reviews: {
        id: string;
        buyer: string;
        rating: number;
        comment: string;
        date: string;
        orderValue: number;
    }[];
}

interface Product {
    id: string;
    name: string;
    price: number;
    currency: string;
    minOrderQuantity: number;
    unit: string;
    category: string;
    images: string[];
    inStock: boolean;
}

export default function SupplierDetailPage() {
    const params = useParams();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch supplier data
    useEffect(() => {
        const fetchSupplier = async () => {
            if (!params?.id) return;

            try {
                const response = await fetch(`/api/suppliers/${params.id}`);
                const result = await response.json();

                if (result.success) {
                    setSupplier(result.data.supplier);
                    setProducts(result.data.products || []);
                } else {
                    console.error("Failed to fetch supplier:", result.error);
                    setSupplier(null);
                }
            } catch (error) {
                console.error("Error fetching supplier:", error);
                setSupplier(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSupplier();
    }, [params?.id]);


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
                    <p className="text-gray-600 font-medium">Loading supplier details...</p>
                </div>
            </div>
        );
    }

    if (!supplier) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Supplier Not Found</h3>
                    <p className="text-gray-600 mb-4">The requested supplier could not be found.</p>
                    <Link href="/suppliers">
                        <Button>Back to Suppliers</Button>
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
                                <Link href="/suppliers" className="text-blue-600 font-medium">
                                    Suppliers
                                </Link>
                                <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
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
                                <Link href="/suppliers" className="text-gray-500 hover:text-gray-700">
                                    Suppliers
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-900 font-medium">{supplier.company}</li>
                        </ol>
                    </nav>
                </div>

                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl overflow-hidden mb-8">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative px-8 py-12">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                            <div className="flex items-center space-x-6 mb-6 md:mb-0">
                                {/* Company Logo */}
                                <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                                    {supplier.logo ? (
                                        <Image
                                            src={supplier.logo}
                                            alt={`${supplier.company} logo`}
                                            width={80}
                                            height={80}
                                            className="w-16 h-16 object-contain rounded-lg"
                                        />
                                    ) : (
                                        <div className="text-white text-2xl font-bold">
                                            {supplier.company.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{supplier.company}</h1>
                                    <div className="flex items-center space-x-4 text-blue-100">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            {supplier.country}
                                        </span>
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {supplier.industry}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end space-y-3">
                                {supplier.verified && (
                                    <Badge className="bg-green-500 text-white border-green-400 px-4 py-2 text-sm font-medium">
                                        ✓ Verified Supplier
                                    </Badge>
                                )}
                                <div className="text-right">
                                    <div className={`text-3xl font-bold text-white ${getRatingColor(supplier.rating)}`}>
                                        ⭐ {supplier.rating}
                                    </div>
                                    <div className="text-blue-100 text-sm">
                                        {supplier.totalOrders.toLocaleString()} orders completed
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Company Overview */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                    </svg>
                                    Company Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 text-lg leading-relaxed mb-6">{supplier.description}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600 mb-1">{supplier.establishedYear}</div>
                                        <div className="text-sm text-gray-600">Established</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600 mb-1">{supplier.employees}</div>
                                        <div className="text-sm text-gray-600">Employees</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600 mb-1">{supplier.responseTime}</div>
                                        <div className="text-sm text-gray-600">Response Time</div>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600 mb-1">{supplier.currency} {supplier.minOrderValue.toLocaleString()}</div>
                                        <div className="text-sm text-gray-600">Min Order</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Specialties & Capabilities */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Specialties & Capabilities
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Product Specialties
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {supplier.specialties.map((specialty, index) => (
                                                <Badge key={index} variant="outline" className="text-sm px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 hover:from-green-100 hover:to-emerald-100 transition-colors">
                                                    {specialty}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Certifications & Standards
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {supplier.certifications.map((cert, index) => (
                                                <Badge key={index} variant="outline" className="text-sm px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-colors">
                                                    {cert}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Products Showcase */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Featured Products
                                </CardTitle>
                                <CardDescription>Discover our top-quality products and solutions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {products.map((product) => (
                                        <div key={product.id} className="group border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                                            {/* Product Image */}
                                            <div className="relative mb-4">
                                                {product.images && product.images.length > 0 ? (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        width={300}
                                                        height={200}
                                                        className="w-full h-48 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                                        <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                        </svg>
                                                </div>
                                                )}
                                                <div className="absolute top-3 right-3">
                                                    {product.inStock ? (
                                                        <Badge className="bg-green-500 text-white border-green-400 text-xs px-2 py-1">
                                                            ✓ In Stock
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-red-500 text-white border-red-400 text-xs px-2 py-1">
                                                            Out of Stock
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h4>
                                                        <p className="text-sm text-gray-600">{product.category}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="bg-blue-50 p-3 rounded-lg">
                                                        <div className="text-gray-600 text-xs mb-1">Price per Unit</div>
                                                        <div className="font-bold text-blue-600 text-lg">{product.currency} {product.price.toFixed(2)}</div>
                                                    </div>
                                                    <div className="bg-green-50 p-3 rounded-lg">
                                                        <div className="text-gray-600 text-xs mb-1">Min Order</div>
                                                        <div className="font-bold text-green-600">{product.minOrderQuantity} {product.unit}</div>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-2 pt-2">
                                                    <Link href={`/products/${product.id}`} className="flex-1">
                                                        <Button variant="outline" className="w-full border-gray-300 hover:border-blue-400 hover:text-blue-600 transition-colors">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
                                                        Request Quote
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {products.length === 0 && (
                                    <div className="text-center py-12">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Available</h3>
                                        <p className="text-gray-600">This supplier hasn&apos;t added any products yet.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Customer Reviews */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    Customer Reviews
                                </CardTitle>
                                <CardDescription>What buyers say about this supplier</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {supplier.reviews.map((review) => (
                                        <div key={review.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {review.buyer.charAt(0).toUpperCase()}
                                                    </div>
                                                <div>
                                                        <div className="font-semibold text-gray-900">{review.buyer}</div>
                                                    <div className="text-sm text-gray-600">
                                                        Order Value: {supplier.currency} {review.orderValue.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-xl font-bold ${getRatingColor(review.rating)} flex items-center`}>
                                                        ⭐ {review.rating}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {formatDate(review.date)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-gray-700 leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {supplier.reviews.length === 0 && (
                                        <div className="text-center py-12">
                                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                                            <p className="text-gray-600">Be the first to review this supplier!</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Information */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-5">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                        </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Email</div>
                                            <a href={`mailto:${supplier.contactInfo.email}`} className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                                {supplier.contactInfo.email}
                                            </a>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Phone</div>
                                            <a href={`tel:${supplier.contactInfo.phone}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                                {supplier.contactInfo.phone}
                                            </a>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                    </div>
                                    <div>
                                            <div className="text-sm text-gray-600 mb-1">Location</div>
                                            <div className="font-medium text-gray-900">
                                            {supplier.contactInfo.address}<br />
                                            {supplier.contactInfo.city}, {supplier.contactInfo.postalCode}<br />
                                            {supplier.country}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {supplier.website && (
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">Website</div>
                                                <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                                    Visit Website
                                            </a>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="pt-4 border-t border-gray-200 space-y-3">
                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                            Send Message
                                        </Button>
                                        <Button variant="outline" className="w-full border-gray-300 hover:border-blue-400 hover:text-blue-600 transition-colors">
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Request Quote
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Business Information */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                    </svg>
                                    Business Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-5">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Business Type</div>
                                            <div className="font-medium text-gray-900">{supplier.businessInfo.businessType}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                            </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Annual Revenue</div>
                                            <div className="font-medium text-gray-900">{supplier.businessInfo.annualRevenue}</div>
                                        </div>
                                    </div>
                                    
                                    {supplier.businessInfo.exportMarkets.length > 0 && (
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Export Markets</div>
                                        <div className="space-y-1">
                                            {supplier.businessInfo.exportMarkets.map((market, index) => (
                                                        <div key={index} className="text-sm font-medium text-gray-900">{market}</div>
                                            ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {supplier.businessInfo.mainProducts.length > 0 && (
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Main Products</div>
                                        <div className="space-y-1">
                                            {supplier.businessInfo.mainProducts.map((product, index) => (
                                                        <div key={index} className="text-sm font-medium text-gray-900">{product}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Performance Metrics */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                    </svg>
                                    Performance Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <div>
                                            <div className="text-sm text-gray-600">Overall Rating</div>
                                            <div className={`text-2xl font-bold ${getRatingColor(supplier.rating)}`}>
                                                ⭐ {supplier.rating}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">Based on</div>
                                            <div className="font-semibold">{supplier.reviews.length} reviews</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <div>
                                            <div className="text-sm text-gray-600">Orders Completed</div>
                                            <div className="text-2xl font-bold text-green-600">
                                                {supplier.totalOrders.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">Success Rate</div>
                                            <div className="font-semibold text-green-600">98%</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                        <div>
                                            <div className="text-sm text-gray-600">Response Time</div>
                                            <div className="text-2xl font-bold text-purple-600">
                                                {supplier.responseTime}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">Avg. Lead Time</div>
                                            <div className="font-semibold">7 days</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Company Timeline */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    Company Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Joined TradeMart</div>
                                            <div className="font-medium text-gray-900">{formatDate(supplier.joinedDate)}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Company Established</div>
                                            <div className="font-medium text-gray-900">{supplier.establishedYear}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Last Active</div>
                                            <div className="font-medium text-gray-900">{formatDate(supplier.lastActive)}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Industry Experience</div>
                                            <div className="font-medium text-gray-900">{new Date().getFullYear() - supplier.establishedYear} years</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
