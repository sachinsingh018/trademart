"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";

interface RFQ {
    id: string;
    title: string;
    description: string;
    category: string;
    quantity?: number;
    unit?: string;
    budget?: number;
    currency?: string;
    status: string;
    requirements: string[];
    specifications: Record<string, string>;
    createdAt: string;
    expiresAt?: string;
    additionalInfo?: string;
}

export default function EditRFQPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [rfq, setRfq] = useState<RFQ | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        quantity: "",
        unit: "pieces",
        budget: "",
        currency: "USD",
        status: "open",
        requirements: "",
        specifications: {
            material: "",
            color: "",
            size: "",
            certification: "",
        },
        additionalInfo: "",
    });

    // Fetch RFQ data
    useEffect(() => {
        const fetchRFQ = async () => {
            if (!params?.id) return;

            try {
                const response = await fetch(`/api/rfqs/${params.id}`);
                const result = await response.json();

                if (result.success) {
                    const rfqData = result.data.rfq;
                    setRfq(rfqData);

                    // Populate form with existing data
                    setFormData({
                        title: rfqData.title || "",
                        description: rfqData.description || "",
                        category: rfqData.category || "",
                        quantity: rfqData.quantity?.toString() || "",
                        unit: rfqData.unit || "pieces",
                        budget: rfqData.budget?.toString() || "",
                        currency: rfqData.currency || "USD",
                        status: rfqData.status || "open",
                        requirements: (rfqData.requirements || []).join("\n"),
                        specifications: {
                            material: rfqData.specifications?.material || "",
                            color: rfqData.specifications?.color || "",
                            size: rfqData.specifications?.size || "",
                            certification: rfqData.specifications?.certification || "",
                        },
                        additionalInfo: rfqData.additionalInfo || "",
                    });
                } else {
                    console.error("Failed to fetch RFQ:", result.error);
                    router.push("/dashboard");
                }
            } catch (error) {
                console.error("Error fetching RFQ:", error);
                router.push("/dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchRFQ();
    }, [params?.id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        if (!params?.id) {
            setError("RFQ ID not found");
            setSaving(false);
            return;
        }

        try {
            const response = await fetch(`/api/rfqs/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    quantity: formData.quantity ? parseInt(formData.quantity) : null,
                    unit: formData.unit,
                    budget: formData.budget ? parseFloat(formData.budget) : null,
                    currency: formData.currency,
                    status: formData.status,
                    requirements: formData.requirements.split('\n').filter(req => req.trim()),
                    specifications: Object.fromEntries(
                        Object.entries(formData.specifications).filter(([_, value]) => value.trim())
                    ),
                    additionalInfo: formData.additionalInfo,
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert("RFQ updated successfully!");
                router.push("/dashboard");
            } else {
                alert(`Failed to update RFQ: ${result.error}`);
            }
        } catch (error) {
            console.error("Error updating RFQ:", error);
            alert("Error updating RFQ. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading RFQ...</p>
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
                    <Link href="/dashboard">
                        <Button>Back to Dashboard</Button>
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
                            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                                    Dashboard
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li>
                                <Link href="/rfqs" className="text-gray-500 hover:text-gray-700">
                                    RFQs
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-900 font-medium">Edit RFQ</li>
                        </ol>
                    </nav>
                </div>

                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">Edit RFQ</CardTitle>
                        <CardDescription>Update your request for quotation details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

                                <div>
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter RFQ title"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe what you're looking for"
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="category">Category *</Label>
                                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Electronics">Electronics</SelectItem>
                                                <SelectItem value="Textiles">Textiles</SelectItem>
                                                <SelectItem value="Machinery">Machinery</SelectItem>
                                                <SelectItem value="Chemicals">Chemicals</SelectItem>
                                                <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                                                <SelectItem value="Automotive">Automotive</SelectItem>
                                                <SelectItem value="Construction">Construction</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="open">Open</SelectItem>
                                                <SelectItem value="closed">Closed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity & Budget */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Quantity & Budget</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="quantity">Quantity</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            placeholder="100"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="unit">Unit</Label>
                                        <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pieces">Pieces</SelectItem>
                                                <SelectItem value="kg">Kilograms</SelectItem>
                                                <SelectItem value="tons">Tons</SelectItem>
                                                <SelectItem value="meters">Meters</SelectItem>
                                                <SelectItem value="liters">Liters</SelectItem>
                                                <SelectItem value="units">Units</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="budget">Budget</Label>
                                        <div className="flex">
                                            <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
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
                                                id="budget"
                                                type="number"
                                                step="0.01"
                                                value={formData.budget}
                                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                                placeholder="0.00"
                                                className="ml-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>

                                <div>
                                    <Label htmlFor="requirements">Key Requirements (one per line)</Label>
                                    <Textarea
                                        id="requirements"
                                        value={formData.requirements}
                                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                        placeholder="Enter each requirement on a new line"
                                        rows={4}
                                    />
                                </div>
                            </div>

                            {/* Specifications */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="material">Material</Label>
                                        <Input
                                            id="material"
                                            value={formData.specifications.material}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                specifications: { ...formData.specifications, material: e.target.value }
                                            })}
                                            placeholder="e.g., Steel, Plastic, Cotton"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="color">Color</Label>
                                        <Input
                                            id="color"
                                            value={formData.specifications.color}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                specifications: { ...formData.specifications, color: e.target.value }
                                            })}
                                            placeholder="e.g., Red, Blue, White"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="size">Size</Label>
                                        <Input
                                            id="size"
                                            value={formData.specifications.size}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                specifications: { ...formData.specifications, size: e.target.value }
                                            })}
                                            placeholder="e.g., Large, Medium, Small"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="certification">Certification</Label>
                                        <Input
                                            id="certification"
                                            value={formData.specifications.certification}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                specifications: { ...formData.specifications, certification: e.target.value }
                                            })}
                                            placeholder="e.g., ISO 9001, CE, FDA"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>

                                <div>
                                    <Label htmlFor="additionalInfo">Additional Information</Label>
                                    <Textarea
                                        id="additionalInfo"
                                        value={formData.additionalInfo}
                                        onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                                        placeholder="Any additional information suppliers should know"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push("/dashboard")}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Update RFQ"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
