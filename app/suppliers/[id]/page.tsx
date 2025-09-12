"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
    const router = useRouter();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock data - replace with actual API call
    useEffect(() => {
        const mockSupplier: Supplier = {
            id: params.id as string,
            name: "Mike Chen",
            company: "GlobalTech Solutions",
            country: "China",
            industry: "Electronics",
            verified: true,
            rating: 4.8,
            totalOrders: 1250,
            responseTime: "< 2 hours",
            minOrderValue: 500,
            currency: "USD",
            description: "Leading manufacturer of electronic components and consumer electronics with 15+ years of experience in the industry. We specialize in innovative technology solutions and have established partnerships with major brands worldwide.",
            specialties: ["Smartphones", "Tablets", "Wearables", "IoT Devices", "Audio Equipment", "LED Lighting"],
            certifications: ["ISO 9001", "CE", "FCC", "RoHS", "ISO 14001", "IATF 16949"],
            establishedYear: 2008,
            employees: "500-1000",
            website: "https://globaltech.com",
            joinedDate: "2023-01-15",
            lastActive: "2024-01-20",
            contactInfo: {
                email: "mike.chen@globaltech.com",
                phone: "+86-138-0013-8000",
                address: "123 Technology Park",
                city: "Shenzhen",
                postalCode: "518000",
            },
            businessInfo: {
                businessType: "Manufacturer",
                annualRevenue: "$50M - $100M",
                exportMarkets: ["North America", "Europe", "Asia Pacific", "Middle East"],
                mainProducts: ["Consumer Electronics", "Electronic Components", "IoT Devices", "Audio Equipment"],
            },
            reviews: [
                {
                    id: "review-001",
                    buyer: "TechCorp Solutions",
                    rating: 5,
                    comment: "Excellent quality products and fast delivery. Mike's team is very professional and responsive.",
                    date: "2024-01-15",
                    orderValue: 15000,
                },
                {
                    id: "review-002",
                    buyer: "ElectroMax Inc",
                    rating: 4,
                    comment: "Good supplier with competitive pricing. Some minor communication issues but overall satisfied.",
                    date: "2024-01-10",
                    orderValue: 8500,
                },
                {
                    id: "review-003",
                    buyer: "SmartTech Ltd",
                    rating: 5,
                    comment: "Outstanding service and product quality. Highly recommended for electronics sourcing.",
                    date: "2024-01-05",
                    orderValue: 22000,
                },
            ],
        };

        const mockProducts: Product[] = [
            {
                id: "product-001",
                name: "Wireless Bluetooth Headphones",
                price: 45.00,
                currency: "USD",
                minOrderQuantity: 100,
                unit: "pieces",
                category: "Audio",
                images: ["/products/headphones-1.jpg"],
                inStock: true,
            },
            {
                id: "product-002",
                name: "Smart LED Strip Lights",
                price: 12.00,
                currency: "USD",
                minOrderQuantity: 50,
                unit: "meters",
                category: "Lighting",
                images: ["/products/led-strip-1.jpg"],
                inStock: true,
            },
            {
                id: "product-003",
                name: "IoT Temperature Sensors",
                price: 25.00,
                currency: "USD",
                minOrderQuantity: 200,
                unit: "pieces",
                category: "IoT Devices",
                images: ["/products/sensors-1.jpg"],
                inStock: true,
            },
            {
                id: "product-004",
                name: "Wireless Charging Pads",
                price: 18.00,
                currency: "USD",
                minOrderQuantity: 150,
                unit: "pieces",
                category: "Accessories",
                images: ["/products/charging-pad-1.jpg"],
                inStock: true,
            },
        ];

        setTimeout(() => {
            setSupplier(mockSupplier);
            setProducts(mockProducts);
            setLoading(false);
        }, 1000);
    }, [params.id]);

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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Supplier Header */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl mb-2">{supplier.company}</CardTitle>
                                        <CardDescription className="text-gray-600 text-lg mb-4">
                                            {supplier.name} • {supplier.country} • {supplier.industry}
                                        </CardDescription>
                                        <p className="text-gray-700">{supplier.description}</p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        {supplier.verified && (
                                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                                ✓ Verified Supplier
                                            </Badge>
                                        )}
                                        <div className={`text-2xl font-bold ${getRatingColor(supplier.rating)}`}>
                                            ⭐ {supplier.rating}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {supplier.totalOrders.toLocaleString()} orders
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Established</div>
                                        <div className="font-semibold">{supplier.establishedYear}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Employees</div>
                                        <div className="font-semibold">{supplier.employees}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Response Time</div>
                                        <div className="font-semibold">{supplier.responseTime}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Min Order</div>
                                        <div className="font-semibold">{supplier.currency} {supplier.minOrderValue.toLocaleString()}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Specialties */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Specialties & Certifications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Product Specialties</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {supplier.specialties.map((specialty, index) => (
                                                <Badge key={index} variant="outline" className="text-sm">
                                                    {specialty}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Certifications</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {supplier.certifications.map((cert, index) => (
                                                <Badge key={index} variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
                                                    {cert}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Products */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Featured Products</CardTitle>
                                <CardDescription>Popular products from this supplier</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {products.map((product) => (
                                        <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{product.name}</h4>
                                                    <p className="text-sm text-gray-600">{product.category}</p>
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                    {product.category}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Price:</span>
                                                    <div className="font-medium">{product.currency} {product.price.toFixed(2)}</div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Min Order:</span>
                                                    <div className="font-medium">{product.minOrderQuantity} {product.unit}</div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
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
                                                <div className="flex space-x-2">
                                                    <Link href={`/products/${product.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            View Product
                                                        </Button>
                                                    </Link>
                                                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                                        Request Quote
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reviews */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Customer Reviews</CardTitle>
                                <CardDescription>What buyers say about this supplier</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {supplier.reviews.map((review) => (
                                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="font-semibold">{review.buyer}</div>
                                                    <div className="text-sm text-gray-600">
                                                        Order Value: {supplier.currency} {review.orderValue.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-lg font-bold ${getRatingColor(review.rating)}`}>
                                                        ⭐ {review.rating}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {formatDate(review.date)}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-700">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Information */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Email</div>
                                        <div className="font-medium">{supplier.contactInfo.email}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Phone</div>
                                        <div className="font-medium">{supplier.contactInfo.phone}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Address</div>
                                        <div className="font-medium">
                                            {supplier.contactInfo.address}<br />
                                            {supplier.contactInfo.city}, {supplier.contactInfo.postalCode}<br />
                                            {supplier.country}
                                        </div>
                                    </div>
                                    {supplier.website && (
                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">Website</div>
                                            <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-800">
                                                {supplier.website}
                                            </a>
                                        </div>
                                    )}
                                    <div className="pt-4 border-t border-gray-200">
                                        <Button className="w-full mb-2" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                            Send Message
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            Request Quote
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Business Information */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Business Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Business Type</div>
                                        <div className="font-medium">{supplier.businessInfo.businessType}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Annual Revenue</div>
                                        <div className="font-medium">{supplier.businessInfo.annualRevenue}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Export Markets</div>
                                        <div className="space-y-1">
                                            {supplier.businessInfo.exportMarkets.map((market, index) => (
                                                <div key={index} className="text-sm font-medium">{market}</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Main Products</div>
                                        <div className="space-y-1">
                                            {supplier.businessInfo.mainProducts.map((product, index) => (
                                                <div key={index} className="text-sm font-medium">{product}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Joined:</span>
                                        <span className="font-medium">{formatDate(supplier.joinedDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Last Active:</span>
                                        <span className="font-medium">{formatDate(supplier.lastActive)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Experience:</span>
                                        <span className="font-medium">{new Date().getFullYear() - supplier.establishedYear} years</span>
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
