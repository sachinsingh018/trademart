"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DollarSign,
    Clock,
    FileText,
    CheckCircle,
    XCircle,
    Calendar
} from "lucide-react";

interface Quote {
    id: string;
    price: number;
    leadTimeDays: number;
    notes: string;
    status: string;
    createdAt: string;
    supplier: {
        id: string;
        companyName: string;
        user: {
            name: string;
            email: string;
            phone: string;
        };
    };
    rfq: {
        id: string;
        title: string;
        budget: number;
        currency: string;
        status: string;
        createdAt: string;
    };
}

interface QuotesByRfq {
    [rfqId: string]: {
        rfq: {
            id: string;
            title: string;
            budget: number;
            currency: string;
            status: string;
            createdAt: string;
        };
        quotes: Quote[];
    };
}

export default function QuotesTable() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [quotesByRfq, setQuotesByRfq] = useState<QuotesByRfq>({});
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("all");

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const response = await fetch("/api/quotes/buyer");
            const data = await response.json();

            if (data.success) {
                setQuotes(data.data.quotes);
                setQuotesByRfq(data.data.quotesByRfq);
            }
        } catch (error) {
            console.error("Error fetching quotes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuoteAction = async (quoteId: string, action: "accept" | "reject") => {
        try {
            const response = await fetch(`/api/quotes/${quoteId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: action === "accept" ? "accepted" : "rejected" }),
            });

            if (response.ok) {
                // Refresh quotes after action
                fetchQuotes();
            }
        } catch (error) {
            console.error(`Error ${action}ing quote:`, error);
        }
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency || "USD",
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", text: "Pending" },
            accepted: { color: "bg-green-100 text-green-800 border-green-200", text: "Accepted" },
            rejected: { color: "bg-red-100 text-red-800 border-red-200", text: "Rejected" },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

        return (
            <Badge variant="outline" className={config.color}>
                {config.text}
            </Badge>
        );
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading quotes...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (quotes.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Quotes Received
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg">No quotes received yet</p>
                        <p className="text-gray-400 text-sm mt-2">
                            Suppliers will submit quotes for your RFQs here
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Quotes Received ({quotes.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="all">All Quotes</TabsTrigger>
                        <TabsTrigger value="by-rfq">By RFQ</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-6">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>RFQ</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Quote Price</TableHead>
                                        <TableHead>Lead Time</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {quotes.map((quote) => (
                                        <TableRow key={quote.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{quote.rfq.title}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Budget: {formatCurrency(quote.rfq.budget, quote.rfq.currency)}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{quote.supplier.companyName}</p>
                                                    <p className="text-sm text-gray-500">{quote.supplier.user.name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-4 w-4 text-green-600" />
                                                    <span className="font-medium">
                                                        {formatCurrency(quote.price, quote.rfq.currency)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4 text-blue-600" />
                                                    <span>{quote.leadTimeDays} days</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(quote.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">{formatDate(quote.createdAt)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {quote.status === "pending" && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700"
                                                            onClick={() => handleQuoteAction(quote.id, "accept")}
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-red-200 text-red-600 hover:bg-red-50"
                                                            onClick={() => handleQuoteAction(quote.id, "reject")}
                                                        >
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value="by-rfq" className="mt-6">
                        <div className="space-y-6">
                            {Object.entries(quotesByRfq).map(([rfqId, rfqData]) => (
                                <Card key={rfqId}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{rfqData.rfq.title}</CardTitle>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Budget: {formatCurrency(rfqData.rfq.budget, rfqData.rfq.currency)} •
                                                    {rfqData.quotes.length} quote{rfqData.quotes.length !== 1 ? 's' : ''} received
                                                </p>
                                            </div>
                                            <Badge variant="outline">
                                                {rfqData.rfq.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {rfqData.quotes.map((quote) => (
                                                <div key={quote.id} className="border rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <p className="font-medium">{quote.supplier.companyName}</p>
                                                            <p className="text-sm text-gray-600">{quote.supplier.user.name}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-green-600">
                                                                {formatCurrency(quote.price, quote.rfq.currency)}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {quote.leadTimeDays} days delivery
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {quote.notes && (
                                                        <div className="mb-3">
                                                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                                                <strong>Notes:</strong> {quote.notes}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-4">
                                                            {getStatusBadge(quote.status)}
                                                            <span className="text-sm text-gray-500">
                                                                Submitted {formatDate(quote.createdAt)}
                                                            </span>
                                                        </div>

                                                        {quote.status === "pending" && (
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-green-600 hover:bg-green-700"
                                                                    onClick={() => handleQuoteAction(quote.id, "accept")}
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                                    Accept
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                                                    onClick={() => handleQuoteAction(quote.id, "reject")}
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-1" />
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
