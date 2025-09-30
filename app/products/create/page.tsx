"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload, { UploadedFile } from "@/components/ui/image-upload";
import { Package, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface Supplier {
    id: string;
    companyName: string;
}

export default function CreateProductPage() {
    const router = useRouter();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        minOrderQuantity: "",
        unit: "",
        specifications: "",
        certifications: "",
        leadTime: "",
        origin: "",
        packaging: ""
    });

    const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);

    useEffect(() => {
        fetchSupplierData();
    }, []);

    const fetchSupplierData = async () => {
        try {
            const response = await fetch("/api/suppliers/profile");
            if (response.ok) {
                const data = await response.json();
                setSupplier(data.data);
            } else if (response.status === 401) {
                setError("Please sign in to create products");
            } else if (response.status === 403) {
                setError("Supplier account required to create products");
            } else if (response.status === 404) {
                setError("Please complete your supplier profile first");
            } else {
                setError("Failed to load supplier data");
            }
        } catch {
            setError("Error loading supplier data");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUpload = (files: UploadedFile[]) => {
        setUploadedImages(files);
    };

    const handleImageRemove = (fileKey: string) => {
        setUploadedImages(prev => prev.filter(file => file.fileKey !== fileKey));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!supplier) {
            setError("Supplier data not loaded");
            return;
        }

        if (!formData.name || !formData.description || !formData.category || !formData.price) {
            setError("Please fill in all required fields");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                price: parseFloat(formData.price),
                minOrderQuantity: formData.minOrderQuantity ? parseInt(formData.minOrderQuantity) : 1,
                unit: formData.unit || "pieces",
                specifications: formData.specifications,
                certifications: formData.certifications,
                leadTime: formData.leadTime,
                origin: formData.origin,
                packaging: formData.packaging,
                images: uploadedImages.map(img => img.fileKey),
                supplierId: supplier.id
            };

            const response = await fetch("/api/products/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                router.push("/dashboard");
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to create product");
            }
        } catch {
            setError("Error creating product");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!supplier) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-600 text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Required</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <Link href="/dashboard" className="block">
                            <Button className="w-full">Back to Dashboard</Button>
                        </Link>
                        {error.includes("sign in") && (
                            <Link href="/auth/signin" className="block">
                                <Button variant="outline" className="w-full">Sign In</Button>
                            </Link>
                        )}
                        {error.includes("supplier profile") && (
                            <Link href="/auth/signup" className="block">
                                <Button variant="outline" className="w-full">Sign Up as Supplier</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

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
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Create New Product</h1>
                            <p className="text-xs sm:text-base text-gray-600">Add a new product to your catalog</p>
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
                                Provide the essential details about your product
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="name" className="text-xs sm:text-sm">Product Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        placeholder="Enter product name"
                                        required
                                        className="h-9 sm:h-10 text-sm sm:text-base"
                                    />
                                </div>

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
                            </div>

                            <div className="space-y-1 sm:space-y-2">
                                <Label htmlFor="description" className="text-xs sm:text-sm">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder="Describe your product in detail"
                                    rows={3}
                                    required
                                    className="text-sm sm:text-base"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="price" className="text-xs sm:text-sm">Price (USD) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange("price", e.target.value)}
                                        placeholder="0.00"
                                        required
                                        className="h-9 sm:h-10 text-sm sm:text-base"
                                    />
                                </div>

                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="minOrderQuantity" className="text-xs sm:text-sm">Min Order Qty</Label>
                                    <Input
                                        id="minOrderQuantity"
                                        type="number"
                                        value={formData.minOrderQuantity}
                                        onChange={(e) => handleInputChange("minOrderQuantity", e.target.value)}
                                        placeholder="1"
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
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Images */}
                    <Card>
                        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                            <CardTitle className="text-base sm:text-lg">Product Images</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Upload high-quality images
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6">
                            <ImageUpload
                                onUpload={handleImageUpload}
                                onRemove={handleImageRemove}
                                uploadedFiles={uploadedImages}
                                maxFiles={5}
                                maxSize={5}
                                prefix="products"
                                title="Product Images"
                                description="Upload images that showcase your product from different angles"
                                showPreview={true}
                            />
                        </CardContent>
                    </Card>

                    {/* Additional Details */}
                    <Card>
                        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                            <CardTitle className="text-base sm:text-lg">Additional Details</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Provide additional information (optional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="specifications" className="text-xs sm:text-sm">Specifications</Label>
                                    <Textarea
                                        id="specifications"
                                        value={formData.specifications}
                                        onChange={(e) => handleInputChange("specifications", e.target.value)}
                                        placeholder="Technical specifications, dimensions, etc."
                                        rows={2}
                                        className="text-sm sm:text-base"
                                    />
                                </div>

                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="certifications" className="text-xs sm:text-sm">Certifications</Label>
                                    <Textarea
                                        id="certifications"
                                        value={formData.certifications}
                                        onChange={(e) => handleInputChange("certifications", e.target.value)}
                                        placeholder="ISO, CE, FDA, etc."
                                        rows={2}
                                        className="text-sm sm:text-base"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="leadTime" className="text-xs sm:text-sm">Lead Time</Label>
                                    <Input
                                        id="leadTime"
                                        value={formData.leadTime}
                                        onChange={(e) => handleInputChange("leadTime", e.target.value)}
                                        placeholder="e.g., 7-14 days"
                                        className="h-9 sm:h-10 text-sm sm:text-base"
                                    />
                                </div>

                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="origin" className="text-xs sm:text-sm">Origin Country</Label>
                                    <Input
                                        id="origin"
                                        value={formData.origin}
                                        onChange={(e) => handleInputChange("origin", e.target.value)}
                                        placeholder="e.g., China, India, USA"
                                        className="h-9 sm:h-10 text-sm sm:text-base"
                                    />
                                </div>

                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="packaging" className="text-xs sm:text-sm">Packaging</Label>
                                    <Input
                                        id="packaging"
                                        value={formData.packaging}
                                        onChange={(e) => handleInputChange("packaging", e.target.value)}
                                        placeholder="e.g., Carton, Pallet, Bulk"
                                        className="h-9 sm:h-10 text-sm sm:text-base"
                                    />
                                </div>
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
                                    <span className="hidden sm:inline">Creating Product...</span>
                                    <span className="sm:hidden">Creating...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Create Product
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
