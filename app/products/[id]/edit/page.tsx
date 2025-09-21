"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
// import Link from "next/link"; // COMMENTED OUT - not used
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Plus,
    X,
    Package,
    CheckCircle
} from "lucide-react";

const CATEGORIES = [
    "Electronics",
    "Textiles & Apparel",
    "Manufacturing",
    "Food & Beverage",
    "Automotive",
    "Construction",
    "Healthcare",
    "Agriculture",
    "Chemicals",
    "Machinery",
    "Other"
];

const UNITS = [
    "pieces",
    "kg",
    "tons",
    "meters",
    "liters",
    "boxes",
    "pallets",
    "containers",
    "units",
    "sets"
];

const CURRENCIES = [
    "USD",
    "EUR",
    "GBP",
    "INR",
    "CNY",
    "JPY",
    "CAD",
    "AUD"
];

interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    subcategory?: string;
    price: number;
    currency: string;
    minOrderQuantity: number;
    unit: string;
    inStock: boolean;
    stockQuantity?: number;
    leadTime?: string;
    features: string[];
    tags: string[];
    images: string[];
    specifications: Record<string, string>;
}

export default function EditProduct() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        subcategory: "",
        price: "",
        currency: "USD",
        minOrderQuantity: "",
        unit: "",
        features: [] as string[],
        tags: [] as string[],
        images: [] as string[],
        specifications: {} as Record<string, string>,
        inStock: true,
        stockQuantity: "",
        leadTime: ""
    });

    const [newFeature, setNewFeature] = useState("");
    const [newTag, setNewTag] = useState("");
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newSpecKey, setNewSpecKey] = useState("");
    const [newSpecValue, setNewSpecValue] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        } else if (session?.user?.role !== "supplier") {
            router.push("/dashboard");
        }
    }, [status, session, router]);

    const fetchProduct = useCallback(async () => {
        try {
            const response = await fetch(`/api/products/${params?.id}`);
            const data = await response.json();

            if (data.success) {
                const productData = data.data;
                setProduct(productData);
                setFormData({
                    name: productData.name,
                    description: productData.description,
                    category: productData.category,
                    subcategory: productData.subcategory || "",
                    price: productData.price.toString(),
                    currency: productData.currency,
                    minOrderQuantity: productData.minOrderQuantity.toString(),
                    unit: productData.unit,
                    features: productData.features || [],
                    tags: productData.tags || [],
                    images: productData.images || [],
                    specifications: productData.specifications || {},
                    inStock: productData.inStock,
                    stockQuantity: productData.stockQuantity?.toString() || "",
                    leadTime: productData.leadTime || ""
                });
            } else {
                setError("Product not found");
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            setError("Failed to load product");
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        if (params.id && session?.user?.role === "supplier") {
            fetchProduct();
        }
    }, [params.id, session, fetchProduct]);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError("");
    };

    const addFeature = () => {
        if (newFeature.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, newFeature.trim()]
            }));
            setNewFeature("");
        }
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const addTag = () => {
        if (newTag.trim()) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag("");
        }
    };

    const removeTag = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index)
        }));
    };

    const addImage = () => {
        if (newImageUrl.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, newImageUrl.trim()]
            }));
            setNewImageUrl("");
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const addSpecification = () => {
        if (newSpecKey.trim() && newSpecValue.trim()) {
            setFormData(prev => ({
                ...prev,
                specifications: {
                    ...prev.specifications,
                    [newSpecKey.trim()]: newSpecValue.trim()
                }
            }));
            setNewSpecKey("");
            setNewSpecValue("");
        }
    };

    const removeSpecification = (key: string) => {
        setFormData(prev => {
            const newSpecs = { ...prev.specifications };
            delete newSpecs[key];
            return { ...prev, specifications: newSpecs };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        // Validate required fields
        if (!formData.name || !formData.description || !formData.category || !formData.price || !formData.minOrderQuantity || !formData.unit) {
            setError("Please fill in all required fields");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`/api/products/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    specifications: JSON.stringify(formData.specifications),
                    features: formData.features.join(","),
                    tags: formData.tags.join(","),
                    images: formData.images.join(",")
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/products/manage");
                }, 2000);
            } else {
                setError(data.error || "Failed to update product");
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== "supplier") {
        return null;
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                            <p className="text-gray-600 mb-4">The requested product could not be found.</p>
                            <Button onClick={() => router.push("/products/manage")} className="w-full">
                                Back to Products
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Updated Successfully!</h2>
                            <p className="text-gray-600 mb-4">Your product has been updated and changes are now live.</p>
                            <Button onClick={() => router.push("/products/manage")} className="w-full">
                                View Products
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.back()}
                            className="mr-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                    </div>
                    <p className="text-gray-600">Update your product information</p>
                </div>

                {/* Form */}
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Package className="h-5 w-5 mr-2" />
                            Product Information
                        </CardTitle>
                        <CardDescription>Update the details for your product</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            {/* Basic Information */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold">Basic Information</h3>

                                <div>
                                    <Label htmlFor="name">Product Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        placeholder="e.g., Premium Cotton T-Shirt"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        placeholder="Provide detailed information about your product..."
                                        rows={4}
                                        className="mt-1"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="category">Category *</Label>
                                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="subcategory">Subcategory</Label>
                                        <Input
                                            id="subcategory"
                                            value={formData.subcategory}
                                            onChange={(e) => handleInputChange("subcategory", e.target.value)}
                                            placeholder="e.g., Cotton T-shirts"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pricing & Quantity */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold">Pricing & Quantity</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <Label htmlFor="price">Price *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => handleInputChange("price", e.target.value)}
                                            placeholder="25.00"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CURRENCIES.map((currency) => (
                                                    <SelectItem key={currency} value={currency}>
                                                        {currency}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="minOrderQuantity">Min Order Quantity *</Label>
                                        <Input
                                            id="minOrderQuantity"
                                            type="number"
                                            value={formData.minOrderQuantity}
                                            onChange={(e) => handleInputChange("minOrderQuantity", e.target.value)}
                                            placeholder="100"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="unit">Unit *</Label>
                                        <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {UNITS.map((unit) => (
                                                    <SelectItem key={unit} value={unit}>
                                                        {unit}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="leadTime">Lead Time</Label>
                                        <Input
                                            id="leadTime"
                                            value={formData.leadTime}
                                            onChange={(e) => handleInputChange("leadTime", e.target.value)}
                                            placeholder="e.g., 7-14 days"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Inventory */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold">Inventory</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="inStock"
                                            checked={formData.inStock}
                                            onChange={(e) => handleInputChange("inStock", e.target.checked)}
                                            className="rounded"
                                        />
                                        <Label htmlFor="inStock">Product is in stock</Label>
                                    </div>
                                    <div>
                                        <Label htmlFor="stockQuantity">Stock Quantity</Label>
                                        <Input
                                            id="stockQuantity"
                                            type="number"
                                            value={formData.stockQuantity}
                                            onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                                            placeholder="1000"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold">Features</h3>

                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Input
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            placeholder="Add a feature..."
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                                        />
                                        <Button type="button" onClick={addFeature} size="sm">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.features.map((feature, index) => (
                                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                {feature}
                                                <X
                                                    className="h-3 w-3 cursor-pointer"
                                                    onClick={() => removeFeature(index)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold">Tags</h3>

                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Input
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            placeholder="Add a tag..."
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                        />
                                        <Button type="button" onClick={addTag} size="sm">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag, index) => (
                                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                                                {tag}
                                                <X
                                                    className="h-3 w-3 cursor-pointer"
                                                    onClick={() => removeTag(index)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Images */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold">Product Images</h3>

                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Input
                                            value={newImageUrl}
                                            onChange={(e) => setNewImageUrl(e.target.value)}
                                            placeholder="Image URL..."
                                        />
                                        <Button type="button" onClick={addImage} size="sm">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.images.map((image, index) => (
                                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                Image {index + 1}
                                                <X
                                                    className="h-3 w-3 cursor-pointer"
                                                    onClick={() => removeImage(index)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Specifications */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold">Specifications</h3>

                                <div className="space-y-2">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <Input
                                            value={newSpecKey}
                                            onChange={(e) => setNewSpecKey(e.target.value)}
                                            placeholder="Specification name"
                                        />
                                        <Input
                                            value={newSpecValue}
                                            onChange={(e) => setNewSpecValue(e.target.value)}
                                            placeholder="Specification value"
                                        />
                                        <Button type="button" onClick={addSpecification} size="sm">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {Object.entries(formData.specifications).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                <span className="font-medium">{key}:</span>
                                                <span className="text-gray-600">{value}</span>
                                                <X
                                                    className="h-4 w-4 cursor-pointer text-red-500"
                                                    onClick={() => removeSpecification(key)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end pt-6 border-t">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {isSubmitting ? "Updating..." : "Update Product"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
