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

            const response = await fetch("/api/products", {
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
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
                            <p className="text-gray-600">Add a new product to your catalog</p>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Provide the essential details about your product
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                                        <SelectTrigger>
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

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder="Describe your product in detail"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (USD) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange("price", e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="minOrderQuantity">Minimum Order Quantity</Label>
                                    <Input
                                        id="minOrderQuantity"
                                        type="number"
                                        value={formData.minOrderQuantity}
                                        onChange={(e) => handleInputChange("minOrderQuantity", e.target.value)}
                                        placeholder="1"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                                        <SelectTrigger>
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
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                            <CardDescription>
                                Upload high-quality images of your product
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
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
                        <CardHeader>
                            <CardTitle>Additional Details</CardTitle>
                            <CardDescription>
                                Provide additional information about your product
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="specifications">Specifications</Label>
                                    <Textarea
                                        id="specifications"
                                        value={formData.specifications}
                                        onChange={(e) => handleInputChange("specifications", e.target.value)}
                                        placeholder="Technical specifications, dimensions, etc."
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="certifications">Certifications</Label>
                                    <Textarea
                                        id="certifications"
                                        value={formData.certifications}
                                        onChange={(e) => handleInputChange("certifications", e.target.value)}
                                        placeholder="ISO, CE, FDA, etc."
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="leadTime">Lead Time</Label>
                                    <Input
                                        id="leadTime"
                                        value={formData.leadTime}
                                        onChange={(e) => handleInputChange("leadTime", e.target.value)}
                                        placeholder="e.g., 7-14 days"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="origin">Country of Origin</Label>
                                    <Input
                                        id="origin"
                                        value={formData.origin}
                                        onChange={(e) => handleInputChange("origin", e.target.value)}
                                        placeholder="e.g., China, India, USA"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="packaging">Packaging</Label>
                                    <Input
                                        id="packaging"
                                        value={formData.packaging}
                                        onChange={(e) => handleInputChange("packaging", e.target.value)}
                                        placeholder="e.g., Carton, Pallet, Bulk"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Link href="/dashboard">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={saving}>
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating Product...
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
