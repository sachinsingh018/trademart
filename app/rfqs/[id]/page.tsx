"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface RFQ {
    id: string;
    title: string;
    description: string;
    category: string;
    quantity: number;
    unit: string;
    budget: number;
    currency: string;
    status: "open" | "quoted" | "closed";
    buyer: {
        name: string;
        company: string;
        country: string;
        verified: boolean;
        email: string;
        phone: string;
    };
    quotesCount: number;
    createdAt: string;
    expiresAt: string;
    requirements: string[];
    specifications: {
        material?: string;
        color?: string;
        size?: string;
        certification?: string;
    };
    attachments?: string[];
    additionalInfo?: string;
}

interface Quote {
    id: string;
    supplierId: string;
    supplier: {
        name: string;
        company: string;
        country: string;
        verified: boolean;
        rating: number;
    };
    price: number;
    currency: string;
    leadTimeDays: number;
    notes: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    whatsappSent: boolean;
}

export default function RFQDetailPage() {
    const params = useParams();
    const [rfq, setRfq] = useState<RFQ | null>(null);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [showQuoteForm, setShowQuoteForm] = useState(false);
    const [quoteForm, setQuoteForm] = useState({
        price: "",
        currency: "USD",
        leadTimeDays: "",
        notes: "",
    });
    const [whatsappStatus, setWhatsappStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [whatsappError, setWhatsappError] = useState('');

    // Mock data - replace with actual API call
    useEffect(() => {
        const mockRFQ: RFQ = {
            id: params.id as string,
            title: "Custom Logo T-Shirts - Bulk Order",
            description: "Looking for high-quality cotton t-shirts with custom logo printing for our company event. Need professional printing with color matching and quality control. The t-shirts will be used for our annual company conference and should represent our brand professionally.",
            category: "Textiles",
            quantity: 500,
            unit: "pieces",
            budget: 2500,
            currency: "USD",
            status: "open",
            buyer: {
                name: "Sarah Johnson",
                company: "TechCorp Solutions",
                country: "United States",
                verified: true,
                email: "sarah.johnson@techcorp.com",
                phone: "+1-555-0123",
            },
            quotesCount: 8,
            createdAt: "2024-01-15T10:30:00Z",
            expiresAt: "2024-01-25T23:59:59Z",
            requirements: ["100% Cotton", "Screen Printing", "Color Matching", "Quality Control", "Custom Logo", "Bulk Pricing"],
            specifications: {
                material: "100% Cotton",
                color: "White, Navy Blue",
                size: "S, M, L, XL, XXL",
                certification: "OEKO-TEX Standard 100",
            },
            attachments: ["logo-design.ai", "brand-guidelines.pdf"],
            additionalInfo: "Please provide samples before final order. Need delivery by March 15th, 2024.",
        };

        const mockQuotes: Quote[] = [
            {
                id: "quote-001",
                supplierId: "supplier-001",
                supplier: {
                    name: "Mike Chen",
                    company: "Premium Textiles Ltd",
                    country: "China",
                    verified: true,
                    rating: 4.8,
                },
                price: 2.2,
                currency: "USD",
                leadTimeDays: 15,
                notes: "We can provide samples within 3 days. Our printing quality is excellent with color matching guarantee.",
                status: "pending",
                createdAt: "2024-01-16T09:15:00Z",
                whatsappSent: true,
            },
            {
                id: "quote-002",
                supplierId: "supplier-002",
                supplier: {
                    name: "Lisa Wang",
                    company: "EcoWear Co",
                    country: "Bangladesh",
                    verified: true,
                    rating: 4.6,
                },
                price: 1.8,
                currency: "USD",
                leadTimeDays: 20,
                notes: "Organic cotton options available. Sustainable packaging included. Can provide GOTS certification.",
                status: "pending",
                createdAt: "2024-01-16T14:30:00Z",
                whatsappSent: false,
            },
            {
                id: "quote-003",
                supplierId: "supplier-003",
                supplier: {
                    name: "David Rodriguez",
                    company: "Textile Solutions Inc",
                    country: "Mexico",
                    verified: false,
                    rating: 4.2,
                },
                price: 2.5,
                currency: "USD",
                leadTimeDays: 12,
                notes: "Fast delivery guaranteed. Premium quality materials. Can accommodate rush orders.",
                status: "pending",
                createdAt: "2024-01-17T11:45:00Z",
                whatsappSent: true,
            },
        ];

        setTimeout(() => {
            setRfq(mockRFQ);
            setQuotes(mockQuotes);
            setLoading(false);
        }, 1000);
    }, [params.id]);

    const handleQuoteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Submit quote via API
        console.log("Submitting quote:", quoteForm);
        setShowQuoteForm(false);
        // Reset form
        setQuoteForm({
            price: "",
            currency: "USD",
            leadTimeDays: "",
            notes: "",
        });
    };

    const sendWhatsAppNotification = async (quoteId: string) => {
        setWhatsappStatus('sending');
        setWhatsappError('');

        try {
            const response = await fetch('/api/whatsapp/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quoteId,
                    supplierPhone: '+1234567890', // This should come from the quote data
                    rfqTitle: rfq?.title,
                    buyerCompany: rfq?.buyer.name,
                    rfqId: rfq?.id
                }),
            });

            const result = await response.json();

            if (result.success) {
                setWhatsappStatus('success');
                console.log('WhatsApp notification sent successfully');
            } else {
                setWhatsappStatus('error');
                setWhatsappError(result.error || 'Failed to send notification');
            }
        } catch (error) {
            setWhatsappStatus('error');
            setWhatsappError('Failed to send WhatsApp notification');
            console.error('WhatsApp notification error:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTimeRemaining = (expiresAt: string) => {
        const now = new Date().getTime();
        const expiry = new Date(expiresAt).getTime();
        const diff = expiry - now;

        if (diff <= 0) return "Expired";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days} days ${hours} hours left`;
        return `${hours} hours left`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading RFQ details...</p>
                </div>
            </div>
        );
    }

    if (!rfq) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">RFQ Not Found</h3>
                    <p className="text-gray-600 mb-4">The requested RFQ could not be found.</p>
                    <Link href="/rfqs">
                        <Button>Back to RFQs</Button>
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
                                <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                    Products
                                </Link>
                                <Link href="/rfqs" className="text-blue-600 font-medium">
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
                                <Link href="/rfqs" className="text-gray-500 hover:text-gray-700">
                                    RFQs
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-900 font-medium">{rfq.title}</li>
                        </ol>
                    </nav>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* RFQ Header */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl mb-2">{rfq.title}</CardTitle>
                                        <CardDescription className="text-gray-600 text-lg">
                                            {rfq.description}
                                        </CardDescription>
                                    </div>
                                    <Badge className={`${rfq.status === "open" ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"} border`}>
                                        {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Category</div>
                                        <div className="font-semibold">{rfq.category}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Quantity</div>
                                        <div className="font-semibold">{rfq.quantity.toLocaleString()} {rfq.unit}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Budget</div>
                                        <div className="font-semibold">{rfq.currency} {rfq.budget.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Time Left</div>
                                        <div className={`font-semibold ${getTimeRemaining(rfq.expiresAt).includes('Expired') ? 'text-red-600' : 'text-green-600'}`}>
                                            {getTimeRemaining(rfq.expiresAt)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Requirements */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Requirements & Specifications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Key Requirements</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {rfq.requirements.map((req, index) => (
                                                <Badge key={index} variant="outline" className="text-sm">
                                                    {req}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Specifications</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(rfq.specifications).map(([key, value]) => (
                                                value && (
                                                    <div key={key} className="flex justify-between">
                                                        <span className="text-gray-600 capitalize">{key}:</span>
                                                        <span className="font-medium">{value}</span>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>

                                    {rfq.additionalInfo && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Additional Information</h4>
                                            <p className="text-gray-600">{rfq.additionalInfo}</p>
                                        </div>
                                    )}

                                    {rfq.attachments && rfq.attachments.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Attachments</h4>
                                            <div className="space-y-2">
                                                {rfq.attachments.map((attachment, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <span className="text-blue-600">📎</span>
                                                        <span className="text-sm text-gray-600">{attachment}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quotes */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Quotes Received ({quotes.length})</CardTitle>
                                    {rfq.status === "open" && (
                                        <Button
                                            onClick={() => setShowQuoteForm(true)}
                                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                        >
                                            Submit Quote
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {quotes.map((quote) => (
                                        <div key={quote.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="font-semibold">{quote.supplier.company}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {quote.supplier.name} • {quote.supplier.country}
                                                        {quote.supplier.verified && <span className="text-green-600 ml-2">✓ Verified</span>}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-green-600">
                                                        {quote.currency} {quote.price.toFixed(2)} per {rfq.unit}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Total: {quote.currency} {(quote.price * rfq.quantity).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Lead Time:</span>
                                                    <span className="font-medium ml-2">{quote.leadTimeDays} days</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Rating:</span>
                                                    <span className="font-medium ml-2">⭐ {quote.supplier.rating}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Submitted:</span>
                                                    <span className="font-medium ml-2">{formatDate(quote.createdAt)}</span>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="text-sm text-gray-600 mb-1">Notes:</div>
                                                <p className="text-sm">{quote.notes}</p>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="outline" className={quote.status === "pending" ? "border-yellow-200 text-yellow-800" : ""}>
                                                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                                                    </Badge>
                                                    {quote.whatsappSent && (
                                                        <Badge variant="outline" className="border-green-200 text-green-800">
                                                            📱 WhatsApp Sent
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="sm">
                                                        Contact Supplier
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => sendWhatsAppNotification(quote.id)}
                                                        disabled={quote.whatsappSent}
                                                    >
                                                        {quote.whatsappSent ? "Sent" : "Send WhatsApp"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Buyer Information */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Buyer Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="font-semibold">{rfq.buyer.company}</div>
                                        <div className="text-sm text-gray-600">{rfq.buyer.name}</div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Country:</span>
                                            <span className="font-medium">{rfq.buyer.country}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium">{rfq.buyer.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="font-medium">{rfq.buyer.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Verified:</span>
                                            <span className={`font-medium ${rfq.buyer.verified ? 'text-green-600' : 'text-gray-500'}`}>
                                                {rfq.buyer.verified ? '✓ Verified' : 'Not Verified'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200">
                                        <Button className="w-full" variant="outline">
                                            Contact Buyer
                                        </Button>
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
                                        <span className="text-gray-600">Posted:</span>
                                        <span className="font-medium">{formatDate(rfq.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Expires:</span>
                                        <span className="font-medium">{formatDate(rfq.expiresAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="font-medium">{rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Quote Form Modal */}
            {showQuoteForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>Submit Quote</CardTitle>
                            <CardDescription>Provide your quote details for this RFQ</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleQuoteSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="price">Price per {rfq.unit}</Label>
                                        <div className="flex">
                                            <Select value={quoteForm.currency} onValueChange={(value) => setQuoteForm({ ...quoteForm, currency: value })}>
                                                <SelectTrigger className="w-20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="USD">USD</SelectItem>
                                                    <SelectItem value="EUR">EUR</SelectItem>
                                                    <SelectItem value="GBP">GBP</SelectItem>
                                                    <SelectItem value="CAD">CAD</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                value={quoteForm.price}
                                                onChange={(e) => setQuoteForm({ ...quoteForm, price: e.target.value })}
                                                placeholder="0.00"
                                                className="ml-2"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="leadTime">Lead Time (days)</Label>
                                        <Input
                                            id="leadTime"
                                            type="number"
                                            value={quoteForm.leadTimeDays}
                                            onChange={(e) => setQuoteForm({ ...quoteForm, leadTimeDays: e.target.value })}
                                            placeholder="15"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={quoteForm.notes}
                                        onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                                        placeholder="Add any additional information about your quote..."
                                        rows={4}
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setShowQuoteForm(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                                        Submit Quote
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
