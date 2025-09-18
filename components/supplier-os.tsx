"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // COMMENTED OUT - not used
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    TrendingUp,
    Clock,
    // CheckCircle, // COMMENTED OUT - not used
    DollarSign,
    Package,
    Star,
    Target,
    BarChart3,
    Send,
    Eye,
    Edit,
    Truck,
    Shield
} from "lucide-react";

interface RFQ {
    id: string;
    title: string;
    description: string;
    category: string;
    quantity: number;
    unit: string;
    budget: number;
    currency: string;
    status: string;
    expiresAt: string;
    buyer: {
        name: string;
        company: string;
        country: string;
    };
    createdAt: string;
}

interface Quote {
    id: string;
    rfqId: string;
    price: number;
    currency: string;
    leadTimeDays: number;
    status: string;
    notes: string;
    createdAt: string;
    rfq: RFQ;
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    currency: string;
    quantity: number;
    unit: string;
    deliveryDate: string;
    buyer: {
        name: string;
        company: string;
    };
    createdAt: string;
    paymentStatus: string;
}

interface SupplierStats {
    totalQuotes: number;
    acceptedQuotes: number;
    totalOrders: number;
    completedOrders: number;
    averageResponseTime: number;
    rating: number;
    monthlyRevenue: number;
    pendingRFQs: number;
    activeOrders: number;
}

export default function SupplierOS() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [rfqs, setRfqs] = useState<RFQ[]>([]);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<SupplierStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
    const [quoteForm, setQuoteForm] = useState({
        price: "",
        leadTimeDays: "",
        notes: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);

            // Fetch RFQs, quotes, orders, and stats in parallel
            const [rfqsRes, quotesRes, ordersRes, statsRes] = await Promise.all([
                fetch('/api/rfqs?supplier=true'),
                fetch('/api/quotes/my-quotes'),
                fetch('/api/orders/my-orders'),
                fetch('/api/supplier/stats')
            ]);

            if (rfqsRes.ok) {
                const rfqsData = await rfqsRes.json();
                setRfqs(rfqsData.data || []);
            }

            if (quotesRes.ok) {
                const quotesData = await quotesRes.json();
                setQuotes(quotesData.data || []);
            }

            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                setOrders(ordersData.data || []);
            }

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const submitQuote = async (rfqId: string) => {
        try {
            const response = await fetch('/api/quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rfqId,
                    price: parseFloat(quoteForm.price),
                    leadTimeDays: parseInt(quoteForm.leadTimeDays),
                    notes: quoteForm.notes
                }),
            });

            if (response.ok) {
                setQuoteForm({ price: "", leadTimeDays: "", notes: "" });
                setSelectedRFQ(null);
                fetchData(); // Refresh data
            }
        } catch (error) {
            console.error('Error submitting quote:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'accepted': return 'text-blue-600 bg-blue-100';
            case 'rejected': return 'text-red-600 bg-red-100';
            case 'completed': return 'text-green-600 bg-green-100';
            case 'in_progress': return 'text-blue-600 bg-blue-100';
            case 'shipped': return 'text-purple-600 bg-purple-100';
            case 'delivered': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'escrowed': return 'text-blue-600 bg-blue-100';
            case 'paid': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'refunded': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading Supplier OS...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Supplier OS</h1>
                    <p className="text-gray-600">Your complete business management dashboard</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Verified Supplier
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        {stats?.rating.toFixed(1)} Rating
                    </Badge>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending RFQs</p>
                                <p className="text-2xl font-bold text-blue-600">{stats?.pendingRFQs || 0}</p>
                            </div>
                            <Target className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                                <p className="text-2xl font-bold text-green-600">{stats?.activeOrders || 0}</p>
                            </div>
                            <Package className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                                <p className="text-2xl font-bold text-purple-600">₹{(stats?.monthlyRevenue || 0).toLocaleString()}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Response Time</p>
                                <p className="text-2xl font-bold text-orange-600">{stats?.averageResponseTime || 0}h</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="rfqs">RFQs</TabsTrigger>
                    <TabsTrigger value="quotes">Quotes</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>

                {/* Dashboard Tab */}
                <TabsContent value="dashboard" className="space-y-6">
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Performance Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Quote Acceptance Rate</span>
                                        <span>{stats ? ((stats.acceptedQuotes / stats.totalQuotes) * 100).toFixed(1) : 0}%</span>
                                    </div>
                                    <Progress value={stats ? (stats.acceptedQuotes / stats.totalQuotes) * 100 : 0} />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Order Completion Rate</span>
                                        <span>{stats ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : 0}%</span>
                                    </div>
                                    <Progress value={stats ? (stats.completedOrders / stats.totalOrders) * 100 : 0} />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Response Time Score</span>
                                        <span>{stats ? (100 - (stats.averageResponseTime / 24) * 100).toFixed(0) : 0}%</span>
                                    </div>
                                    <Progress value={stats ? 100 - (stats.averageResponseTime / 24) * 100 : 0} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {quotes.slice(0, 5).map((quote) => (
                                        <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-sm">{quote.rfq.title}</p>
                                                <p className="text-xs text-gray-600">Quote: ₹{quote.price.toLocaleString()}</p>
                                            </div>
                                            <Badge className={getStatusColor(quote.status)}>
                                                {quote.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button
                                    variant="outline"
                                    className="h-20 flex flex-col gap-2"
                                    onClick={() => setActiveTab("rfqs")}
                                >
                                    <Target className="h-6 w-6" />
                                    <span>Browse RFQs</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-20 flex flex-col gap-2"
                                    onClick={() => setActiveTab("quotes")}
                                >
                                    <Send className="h-6 w-6" />
                                    <span>Manage Quotes</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-20 flex flex-col gap-2"
                                    onClick={() => setActiveTab("orders")}
                                >
                                    <Package className="h-6 w-6" />
                                    <span>Track Orders</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* RFQs Tab */}
                <TabsContent value="rfqs" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Available RFQs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {rfqs.map((rfq) => (
                                    <div key={rfq.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-semibold text-lg">{rfq.title}</h3>
                                                <p className="text-gray-600 text-sm">{rfq.description}</p>
                                            </div>
                                            <Badge className={getStatusColor(rfq.status)}>
                                                {rfq.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Quantity</p>
                                                <p className="font-medium">{rfq.quantity.toLocaleString()} {rfq.unit}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Budget</p>
                                                <p className="font-medium">₹{rfq.budget.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Buyer</p>
                                                <p className="font-medium">{rfq.buyer.company}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Expires</p>
                                                <p className="font-medium">{new Date(rfq.expiresAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => setSelectedRFQ(rfq)}
                                            >
                                                Submit Quote
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Quotes Tab */}
                <TabsContent value="quotes" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Quotes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {quotes.map((quote) => (
                                    <div key={quote.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-semibold text-lg">{quote.rfq.title}</h3>
                                                <p className="text-gray-600 text-sm">{quote.rfq.buyer.company}</p>
                                            </div>
                                            <Badge className={getStatusColor(quote.status)}>
                                                {quote.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600">My Quote</p>
                                                <p className="font-medium">₹{quote.price.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Lead Time</p>
                                                <p className="font-medium">{quote.leadTimeDays} days</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Submitted</p>
                                                <p className="font-medium">{new Date(quote.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">RFQ Budget</p>
                                                <p className="font-medium">₹{quote.rfq.budget.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {quote.notes && (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600">Notes</p>
                                                <p className="text-sm">{quote.notes}</p>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline">
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit Quote
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View RFQ
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                                                <p className="text-gray-600 text-sm">{order.buyer.company}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status}
                                                </Badge>
                                                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                                    {order.paymentStatus}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Amount</p>
                                                <p className="font-medium">₹{order.totalAmount.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Quantity</p>
                                                <p className="font-medium">{order.quantity.toLocaleString()} {order.unit}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Delivery Date</p>
                                                <p className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Order Date</p>
                                                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline">
                                                <Truck className="h-4 w-4 mr-1" />
                                                Update Status
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Quote Modal */}
            {selectedRFQ && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader>
                            <CardTitle>Submit Quote for {selectedRFQ.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price per Unit (₹)
                                </label>
                                <Input
                                    type="number"
                                    value={quoteForm.price}
                                    onChange={(e) => setQuoteForm({ ...quoteForm, price: e.target.value })}
                                    placeholder="Enter price per unit"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lead Time (Days)
                                </label>
                                <Input
                                    type="number"
                                    value={quoteForm.leadTimeDays}
                                    onChange={(e) => setQuoteForm({ ...quoteForm, leadTimeDays: e.target.value })}
                                    placeholder="Enter lead time in days"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes (Optional)
                                </label>
                                <Textarea
                                    value={quoteForm.notes}
                                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                                    placeholder="Add any additional notes or conditions"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => submitQuote(selectedRFQ.id)}
                                    disabled={!quoteForm.price || !quoteForm.leadTimeDays}
                                    className="flex-1"
                                >
                                    Submit Quote
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedRFQ(null)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
