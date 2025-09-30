"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FileUpload, { UploadedFile } from "@/components/ui/file-upload";
import { FileText, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function CreateRFQPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        quantity: "",
        unit: "",
        budget: "",
        deliveryDate: "",
        specifications: "",
        requirements: "",
        contactMethod: "",
        urgency: "medium"
    });

    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileUpload = (files: UploadedFile[]) => {
        setUploadedFiles(files);
    };

    const handleFileRemove = (fileKey: string) => {
        setUploadedFiles(prev => prev.filter(file => file.fileKey !== fileKey));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.category || !formData.quantity) {
            setError("Please fill in all required fields");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const rfqData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                quantity: parseInt(formData.quantity),
                unit: formData.unit || "pieces",
                budget: formData.budget ? parseFloat(formData.budget) : null,
                deliveryDate: formData.deliveryDate || null,
                specifications: formData.specifications,
                requirements: formData.requirements,
                contactMethod: formData.contactMethod,
                urgency: formData.urgency,
                attachments: uploadedFiles.map(file => file.fileKey)
            };

            const response = await fetch("/api/rfqs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rfqData),
            });

            if (response.ok) {
                router.push("/dashboard");
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to create RFQ");
            }
        } catch {
            setError("Error creating RFQ");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
                {/* Header */}
                <div className="mb-4 sm:mb-8">
                    <Link href="/dashboard" className="inline-block mb-3 sm:mb-4">
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Create New RFQ</h1>
                            <p className="text-xs sm:text-base text-gray-600">Post a request for quotation</p>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm sm:text-base">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-8">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                            <CardTitle className="text-base sm:text-lg">Basic Information</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Provide the essential details about your request
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                            <div className="space-y-1 sm:space-y-2">
                                <Label htmlFor="title" className="text-xs sm:text-sm">RFQ Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    placeholder="Brief title describing what you need"
                                    required
                                    className="h-9 sm:h-10 text-sm sm:text-base"
                                />
                            </div>

                            <div className="space-y-1 sm:space-y-2">
                                <Label htmlFor="description" className="text-xs sm:text-sm">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder="Detailed description of what you're looking for"
                                    rows={3}
                                    required
                                    className="text-sm sm:text-base"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="category" className="text-xs sm:text-sm">Category *</Label>
                                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                                        <SelectTrigger className="h-9 sm:h-10 text-sm sm:text-base">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="electronics">Electronics</SelectItem>
                                            <SelectItem value="clothing">Clothing & Textiles</SelectItem>
                                            <SelectItem value="food">Food & Beverages</SelectItem>
                                            <SelectItem value="machinery">Machinery & Equipment</SelectItem>
                                            <SelectItem value="chemicals">Chemicals & Materials</SelectItem>
                                            <SelectItem value="automotive">Automotive Parts</SelectItem>
                                            <SelectItem value="construction">Construction Materials</SelectItem>
                                            <SelectItem value="agriculture">Agricultural Products</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="urgency" className="text-xs sm:text-sm">Urgency</Label>
                                    <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                                        <SelectTrigger className="h-9 sm:h-10 text-sm sm:text-base">
                                            <SelectValue placeholder="Select urgency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quantity & Budget */}
                    <Card>
                        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                            <CardTitle className="text-base sm:text-lg">Quantity & Budget</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Specify the quantity you need and your budget range
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="quantity" className="text-xs sm:text-sm">Quantity *</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => handleInputChange("quantity", e.target.value)}
                                        placeholder="100"
                                        required
                                        className="h-9 sm:h-10 text-sm sm:text-base"
                                    />
                                </div>

                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="unit" className="text-xs sm:text-sm">Unit</Label>
                                    <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                                        <SelectTrigger className="h-9 sm:h-10 text-sm sm:text-base">
                                            <SelectValue placeholder="Select unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pieces">Pieces</SelectItem>
                                            <SelectItem value="kg">Kilograms</SelectItem>
                                            <SelectItem value="lbs">Pounds</SelectItem>
                                            <SelectItem value="tons">Tons</SelectItem>
                                            <SelectItem value="meters">Meters</SelectItem>
                                            <SelectItem value="feet">Feet</SelectItem>
                                            <SelectItem value="liters">Liters</SelectItem>
                                            <SelectItem value="gallons">Gallons</SelectItem>
                                            <SelectItem value="boxes">Boxes</SelectItem>
                                            <SelectItem value="pallets">Pallets</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="budget" className="text-xs sm:text-sm">Budget (USD)</Label>
                                    <Input
                                        id="budget"
                                        type="number"
                                        step="0.01"
                                        value={formData.budget}
                                        onChange={(e) => handleInputChange("budget", e.target.value)}
                                        placeholder="1000.00"
                                        className="h-9 sm:h-10 text-sm sm:text-base"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1 sm:space-y-2">
                                <Label htmlFor="deliveryDate" className="text-xs sm:text-sm">Preferred Delivery Date</Label>
                                <Input
                                    id="deliveryDate"
                                    type="date"
                                    value={formData.deliveryDate}
                                    onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                                    className="h-9 sm:h-10 text-sm sm:text-base"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attachments */}
                    <Card>
                        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                            <CardTitle className="text-base sm:text-lg">Attachments</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Upload relevant documents (optional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6">
                            <FileUpload
                                onUpload={handleFileUpload}
                                onRemove={handleFileRemove}
                                uploadedFiles={uploadedFiles}
                                maxFiles={10}
                                maxSize={10}
                                prefix="rfq-attachments"
                                title="RFQ Attachments"
                                description="Upload documents that suppliers should review"
                            />
                        </CardContent>
                    </Card>

                    {/* Additional Details */}
                    <Card>
                        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                            <CardTitle className="text-base sm:text-lg">Additional Details</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Provide any additional information (optional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                            <div className="space-y-1 sm:space-y-2">
                                <Label htmlFor="specifications" className="text-xs sm:text-sm">Technical Specifications</Label>
                                <Textarea
                                    id="specifications"
                                    value={formData.specifications}
                                    onChange={(e) => handleInputChange("specifications", e.target.value)}
                                    placeholder="Technical requirements, dimensions, materials, etc."
                                    rows={2}
                                    className="text-sm sm:text-base"
                                />
                            </div>

                            <div className="space-y-1 sm:space-y-2">
                                <Label htmlFor="requirements" className="text-xs sm:text-sm">Special Requirements</Label>
                                <Textarea
                                    id="requirements"
                                    value={formData.requirements}
                                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                                    placeholder="Certifications, quality standards, packaging requirements, etc."
                                    rows={2}
                                    className="text-sm sm:text-base"
                                />
                            </div>

                            <div className="space-y-1 sm:space-y-2">
                                <Label htmlFor="contactMethod" className="text-xs sm:text-sm">Preferred Contact Method</Label>
                                <Input
                                    id="contactMethod"
                                    value={formData.contactMethod}
                                    onChange={(e) => handleInputChange("contactMethod", e.target.value)}
                                    placeholder="Email, phone, WhatsApp, etc."
                                    className="h-9 sm:h-10 text-sm sm:text-base"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                        <Link href="/dashboard" className="w-full sm:w-auto">
                            <Button type="button" variant="outline" className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={saving} className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10">
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    <span className="hidden sm:inline">Creating RFQ...</span>
                                    <span className="sm:hidden">Creating...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Create RFQ
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
