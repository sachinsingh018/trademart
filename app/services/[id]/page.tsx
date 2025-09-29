"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useViewTracker } from "@/hooks/useViewTracker";

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
        totalOrders: number;
        responseTime: string;
        phone?: string;
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

export default function ServiceDetailPage() {
    const params = useParams();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showQuoteForm, setShowQuoteForm] = useState(false);

    // Track page views
    useViewTracker({ type: 'service', id: params?.id as string });
    const [quoteData, setQuoteData] = useState({
        budget: "",
        timeline: "",
        requirements: "",
        contactInfo: "",
    });
    const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
    const [quoteMessage, setQuoteMessage] = useState("");
    const { data: session, status } = useSession();

    const formatPrice = (price: number | null, currency: string, pricingModel: string) => {
        if (price === null) return "Contact for pricing";
        if (pricingModel === "hourly") return `${currency} ${price}/hour`;
        if (pricingModel === "project") return `${currency} ${price}/project`;
        return `${currency} ${price}`;
    };

    useEffect(() => {
        const fetchService = async () => {
            if (!params?.id) return;

            try {
                setLoading(true);
                const response = await fetch(`/api/services/${params.id}`);
                const data = await response.json();

                if (data.success) {
                    setService(data.data);
                } else {
                    console.error("Failed to fetch service:", data.error);
                    setService(null);
                }
            } catch (error) {
                console.error("Error fetching service:", error);
                setService(null);
            } finally {
                setLoading(false);
            }
        };

        if (params?.id) {
            fetchService();
        }
    }, [params?.id]);

    const handleQuoteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (status === "loading") {
            setQuoteMessage("Please wait...");
            return;
        }

        if (!session) {
            window.location.href = "/auth/signin";
            return;
        }

        if (!quoteData.budget || !quoteData.timeline || !quoteData.requirements) {
            setQuoteMessage("Please fill in all required fields");
            return;
        }

        setIsSubmittingQuote(true);
        setQuoteMessage("");

        try {
            const response = await fetch("/api/services/quote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    serviceId: service?.id,
                    supplierId: service?.supplier.id,
                    budget: quoteData.budget,
                    timeline: quoteData.timeline,
                    requirements: quoteData.requirements,
                    contactInfo: quoteData.contactInfo,
                }),
            });

            if (response.ok) {
                setQuoteMessage("Quote request submitted successfully!");
                setQuoteData({
                    budget: "",
                    timeline: "",
                    requirements: "",
                    contactInfo: "",
                });
                setTimeout(() => {
                    setShowQuoteForm(false);
                    setQuoteMessage("");
                }, 2000);
            } else {
                setQuoteMessage("Failed to submit quote request. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting quote:", error);
            setQuoteMessage("An error occurred. Please try again.");
        } finally {
            setIsSubmittingQuote(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading service details...</p>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h1>
                    <p className="text-gray-600 mb-4">The service you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                    <Link href="/services">
                        <Button>Browse All Services</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link href="/services" className="text-gray-500 hover:text-gray-700">
                                    Services
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li>
                                <Link href={`/services?category=${service.category}`} className="text-gray-500 hover:text-gray-700">
                                    {service.category}
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-900 font-medium">{service.name}</li>
                        </ol>
                    </nav>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Service Images */}
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                            {service.images && service.images.length > 0 ? (
                                                <Image
                                                    src={service.images[selectedImage] || service.images[0]}
                                                    alt={service.name}
                                                    width={400}
                                                    height={400}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-gray-400 text-6xl">🔧</div>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            {service.images && service.images.map((image, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedImage(index)}
                                                    className={`w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden ${selectedImage === index ? 'ring-2 ring-blue-500' : ''
                                                        }`}
                                                >
                                                    <Image
                                                        src={image}
                                                        alt={`${service.name} ${index + 1}`}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h1>
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className="text-3xl font-bold text-green-600">
                                                {formatPrice(service.price, service.currency, service.pricingModel)}
                                            </div>
                                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                                {service.pricingModel}
                                            </Badge>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-gray-600">Category:</span>
                                                <span className="text-sm">{service.category} • {service.subcategory}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-gray-600">Delivery:</span>
                                                <span className="text-sm">{service.deliveryMethod}</span>
                                            </div>
                                            {service.experience && (
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium text-gray-600">Experience:</span>
                                                    <span className="text-sm">{service.experience}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-gray-600">Lead Time:</span>
                                                <span className="text-sm">{service.leadTime}</span>
                                            </div>
                                        </div>

                                        <div className="flex space-x-3">
                                            <Button
                                                className="bg-blue-600 hover:bg-blue-700 flex-1"
                                                onClick={() => {
                                                    if (status === "loading") {
                                                        setQuoteMessage("Please wait...");
                                                        return;
                                                    }

                                                    if (!session) {
                                                        window.location.href = "/auth/signin";
                                                        return;
                                                    }

                                                    setShowQuoteForm(true);
                                                }}
                                            >
                                                Request Quote
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="border-gray-300"
                                                onClick={() => {
                                                    if (service?.supplier.phone) {
                                                        window.open(`https://wa.me/${service.supplier.phone.replace(/\D/g, '')}`, '_blank');
                                                    } else {
                                                        alert("Supplier contact information not available");
                                                    }
                                                }}
                                            >
                                                Contact Supplier
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Service Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">{service.description}</p>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        {service.features && service.features.length > 0 && (
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Key Features</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {service.features.map((feature, index) => (
                                            <li key={index} className="flex items-center space-x-2">
                                                <span className="text-green-500">✓</span>
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Certifications */}
                        {service.certifications && service.certifications.length > 0 && (
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Certifications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {service.certifications.map((cert, index) => (
                                            <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200">
                                                {cert}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Portfolio */}
                        {service.portfolio && service.portfolio.length > 0 && (
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Portfolio</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {service.portfolio.map((item, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <h4 className="font-medium text-gray-900 mb-2">Project {index + 1}</h4>
                                                <p className="text-sm text-gray-600">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Supplier Info */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Service Provider</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-bold text-lg">
                                            {service.supplier.company.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{service.supplier.company}</h3>
                                        <p className="text-sm text-gray-600">{service.supplier.name}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Rating:</span>
                                        <div className="flex items-center space-x-1">
                                            <span className="text-yellow-500">⭐</span>
                                            <span className="text-sm font-medium">{service.rating || service.supplier.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Orders:</span>
                                        <span className="text-sm font-medium">{service.orders}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Response Time:</span>
                                        <span className="text-sm font-medium">{service.supplier.responseTime}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Location:</span>
                                        <span className="text-sm font-medium">{service.supplier.country}</span>
                                    </div>
                                </div>

                                {service.supplier.verified && (
                                    <Badge className="bg-green-100 text-green-800 border-green-200 w-full justify-center">
                                        ✓ Verified Supplier
                                    </Badge>
                                )}

                                <div className="flex space-x-2">
                                    <Button variant="outline" className="flex-1">
                                        View Profile
                                    </Button>
                                    <Button variant="outline" className="flex-1">
                                        Contact
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Service Stats */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Service Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Views:</span>
                                    <span className="text-sm font-medium">{service.views}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Orders:</span>
                                    <span className="text-sm font-medium">{service.orders}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Reviews:</span>
                                    <span className="text-sm font-medium">{service.reviews}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Created:</span>
                                    <span className="text-sm font-medium">
                                        {new Date(service.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Quote Form Modal */}
            {showQuoteForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Request Quote</h3>
                        <form onSubmit={handleQuoteSubmit} className="space-y-4">
                            {quoteMessage && (
                                <div className={`p-4 rounded-lg ${quoteMessage.includes("successfully")
                                    ? "bg-green-50 border border-green-200 text-green-700"
                                    : "bg-red-50 border border-red-200 text-red-700"
                                    }`}>
                                    {quoteMessage}
                                </div>
                            )}
                            <div>
                                <Label htmlFor="budget">Budget Range *</Label>
                                <Select value={quoteData.budget} onValueChange={(value) => setQuoteData({ ...quoteData, budget: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select budget range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="under-1k">Under $1,000</SelectItem>
                                        <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                                        <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                                        <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                                        <SelectItem value="25k-plus">$25,000+</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="timeline">Timeline</Label>
                                <Select value={quoteData.timeline} onValueChange={(value) => setQuoteData({ ...quoteData, timeline: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select timeline" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="asap">ASAP</SelectItem>
                                        <SelectItem value="1-month">Within 1 month</SelectItem>
                                        <SelectItem value="3-months">Within 3 months</SelectItem>
                                        <SelectItem value="6-months">Within 6 months</SelectItem>
                                        <SelectItem value="flexible">Flexible</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="requirements">Requirements</Label>
                                <Textarea
                                    id="requirements"
                                    placeholder="Describe your specific requirements..."
                                    value={quoteData.requirements}
                                    onChange={(e) => setQuoteData({ ...quoteData, requirements: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="contactInfo">Contact Information</Label>
                                <Input
                                    id="contactInfo"
                                    placeholder="Your email or phone number"
                                    value={quoteData.contactInfo}
                                    onChange={(e) => setQuoteData({ ...quoteData, contactInfo: e.target.value })}
                                />
                            </div>
                            <div className="flex space-x-3">
                                <Button type="button" variant="outline" onClick={() => setShowQuoteForm(false)} className="flex-1" disabled={isSubmittingQuote}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1" disabled={isSubmittingQuote}>
                                    {isSubmittingQuote ? "Submitting..." : "Submit Quote Request"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
