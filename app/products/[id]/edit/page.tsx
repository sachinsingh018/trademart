"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload, { UploadedFile } from "@/components/ui/image-upload";
import { Package, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    currency: string;
    minOrderQuantity: number;
    unit: string;
    inStock: boolean;
    stockQuantity?: number;
    specifications: Record<string, string>;
    certifications: string[];
    leadTime: string;
    origin: string;
    packaging: string;
    images: string[];
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        currency: "USD",
        minOrderQuantity: "",
        unit: "pieces",
        inStock: true,
        stockQuantity: "",
        specifications: "",
        certifications: "",
        leadTime: "",
        origin: "",
        packaging: ""
    });

    const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);

    useEffect(() => {
        if (params?.id) {
            fetchProductData();
        }
    }, [params?.id]);

    const fetchProductData = async () => {
        if (!params?.id) return;

        try {
            const response = await fetch(`/api/products/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                const productData = data.data;
                setProduct(productData);

                // Populate form with existing data
                setFormData({
                    name: productData.name || "",
                    description: productData.description || "",
                    category: productData.category || "",
                    price: productData.price?.toString() || "",
                    currency: productData.currency || "USD",
                    minOrderQuantity: productData.minOrderQuantity?.toString() || "",
                    unit: productData.unit || "pieces",
                    inStock: productData.inStock ?? true,
                    stockQuantity: productData.stockQuantity?.toString() || "",
                    specifications: productData.specifications ? Object.entries(productData.specifications).map(([key, value]) => `${key}: ${value}`).join('\n') : "",
                    certifications: productData.certifications ? productData.certifications.join(', ') : "",
                    leadTime: productData.leadTime || "",
                    origin: productData.origin || "",
                    packaging: productData.packaging || ""
                });

                // Set existing images
                if (productData.images && productData.images.length > 0) {
                    const existingImages = productData.images.map((url: string, index: number) => ({
                        fileKey: `existing-${index}`,
                        url: url,
                        name: `image-${index + 1}.jpg`
                    }));
                    setUploadedImages(existingImages);
                }
            } else {
                setError("Failed to load product data");
            }
        } catch {
            setError("Error loading product data");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string | boolean) => {
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

        if (!product) {
            setError("Product data not loaded");
            return;
        }

        if (!formData.name || !formData.description || !formData.category || !formData.price) {
            setError("Please fill in all required fields");
            return;
        }

        setSaving(true);
        setError("");

        if (!params?.id) return;

        try {
            const response = await fetch(`/api/products/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    price: parseFloat(formData.price),
                    currency: formData.currency,
                    minOrderQuantity: parseInt(formData.minOrderQuantity) || 1,
                    unit: formData.unit,
                    inStock: formData.inStock,
                    stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : null,
                    specifications: formData.specifications ?
                        Object.fromEntries(
                            formData.specifications.split('\n').map(line => {
                                const [key, ...valueParts] = line.split(':');
                                return [key.trim(), valueParts.join(':').trim()];
                            }).filter(([key, value]) => key && value)
                        ) : {},
                    certifications: formData.certifications ?
                        formData.certifications.split(',').map(cert => cert.trim()).filter(cert => cert) : [],
                    leadTime: formData.leadTime,
                    origin: formData.origin,
                    packaging: formData.packaging,
                    images: uploadedImages.map(img => img.url || img.fileKey)
                }),
            });

            if (response.ok) {
                router.push('/dashboard');
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to update product");
            }
        } catch {
            setError("Error updating product");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-600 text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">The requested product could not be found.</p>
                    <Link href="/dashboard" className="block">
                        <Button className="w-full">Back to Dashboard</Button>
                    </Link>
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
                            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                            <p className="text-gray-600">Update your product information</p>
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
                        </CardContent>
                    </Card>

                    {/* Pricing & Inventory */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Inventory</CardTitle>
                            <CardDescription>
                                Set your product pricing and stock information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price per Unit *</Label>
                                    <div className="flex">
                                        <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                                            <SelectTrigger className="w-20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                                <SelectItem value="GBP">GBP</SelectItem>
                                                <SelectItem value="INR">INR</SelectItem>
                                                <SelectItem value="CNY">CNY</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => handleInputChange("price", e.target.value)}
                                            placeholder="0.00"
                                            className="ml-2"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="minOrderQuantity">Minimum Order Quantity *</Label>
                                    <Input
                                        id="minOrderQuantity"
                                        type="number"
                                        value={formData.minOrderQuantity}
                                        onChange={(e) => handleInputChange("minOrderQuantity", e.target.value)}
                                        placeholder="1"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pieces">Pieces</SelectItem>
                                            <SelectItem value="kg">Kilograms</SelectItem>
                                            <SelectItem value="tons">Tons</SelectItem>
                                            <SelectItem value="meters">Meters</SelectItem>
                                            <SelectItem value="liters">Liters</SelectItem>
                                            <SelectItem value="boxes">Boxes</SelectItem>
                                            <SelectItem value="pallets">Pallets</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                                    <Input
                                        id="stockQuantity"
                                        type="number"
                                        value={formData.stockQuantity}
                                        onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                                        placeholder="Enter available quantity"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="inStock">Stock Status</Label>
                                    <Select value={formData.inStock.toString()} onValueChange={(value) => handleInputChange("inStock", value === "true")}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">In Stock</SelectItem>
                                            <SelectItem value="false">Out of Stock</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Details</CardTitle>
                            <CardDescription>
                                Additional information about your product
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="packaging">Packaging Information</Label>
                                <Input
                                    id="packaging"
                                    value={formData.packaging}
                                    onChange={(e) => handleInputChange("packaging", e.target.value)}
                                    placeholder="e.g., Standard export packaging"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specifications">Specifications</Label>
                                <Textarea
                                    id="specifications"
                                    value={formData.specifications}
                                    onChange={(e) => handleInputChange("specifications", e.target.value)}
                                    placeholder="Enter specifications (one per line, format: Key: Value)"
                                    rows={4}
                                />
                                <p className="text-sm text-gray-500">Format: Key: Value (one per line)</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="certifications">Certifications</Label>
                                <Input
                                    id="certifications"
                                    value={formData.certifications}
                                    onChange={(e) => handleInputChange("certifications", e.target.value)}
                                    placeholder="e.g., ISO 9001, CE, FDA (comma separated)"
                                />
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
                            />
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Link href="/dashboard">
                            <Button variant="outline">Cancel</Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Update Product
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}