"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import PageTitle from "@/components/ui/page-title";
import {
    Building2,
    Package,//dadad
    TrendingUp,
    Edit,
    Trash2,
    Eye,
    Plus,
    FileText,
    MessageSquare,
    Calendar,
    DollarSign,
    Users,
    Star,
    Clock,
    Target,
    BarChart3,
    PieChart,
    Activity
} from "lucide-react";

interface Supplier {
    id: string;
    companyName: string;
    industry: string;
    businessType: string;
    website: string;
    description: string;
    country: string;
    city: string;
    address: string;
    postalCode: string;
    phone: string;
    verified: boolean;
    rating: number;
    totalOrders: number;
    responseTime: string;
    minOrderValue: number;
    currency: string;
    establishedYear: number;
    employees: string;
    specialties: string[];
    certifications: string[];
    contactEmail: string;
    contactPhone: string;
    businessInfo: Record<string, unknown> | null;
    lastActive?: string | Date;
    createdAt: string | Date;
    updatedAt: string | Date;
}

interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    subcategory: string;
    price: number;
    currency: string;
    minOrderQuantity: number;
    unit: string;
    specifications: Record<string, unknown> | null;
    features: string[];
    tags: string[];
    images: string[];
    inStock: boolean;
    stockQuantity: number;
    leadTime: string;
    views: number;
    orders: number;
    createdAt: string;
    updatedAt: string;
}

interface Rfq {
    id: string;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    quantity: number;
    unit: string;
    budget: number;
    currency: string;
    requirements: string[];
    specifications: Record<string, unknown> | null;
    expiresAt: string;
    status: string;
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
    quantity: number;
    unit: string;
    leadTime: string;
    validity: string;
    notes: string;
    status: string;
    createdAt: string;
    rfq: Rfq;
}

export default function SupplierDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [rfqs, setRfqs] = useState<Rfq[]>([]);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    // Form states
    const [supplierForm, setSupplierForm] = useState({
        companyName: "",
        industry: "",
        businessType: "",
        website: "",
        description: "",
        country: "",
        city: "",
        address: "",
        postalCode: "",
        phone: "",
        responseTime: "",
        minOrderValue: "",
        currency: "USD",
        establishedYear: "",
        employees: "",
        specialties: "",
        certifications: "",
        contactEmail: "",
        contactPhone: "",
    });

    const [productForm, setProductForm] = useState({
        name: "",
        description: "",
        category: "",
        subcategory: "",
        price: "",
        currency: "USD",
        minOrderQuantity: "",
        unit: "",
        specifications: "",
        features: "",
        tags: "",
        images: "",
        inStock: true,
        stockQuantity: "",
        leadTime: "",
    });

    const [quoteForm, setQuoteForm] = useState({
        rfqId: "",
        price: "",
        currency: "USD",
        quantity: "",
        unit: "",
        leadTime: "",
        validity: "",
        notes: "",
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
            return;
        }

        if (status === "authenticated" && session?.user?.role !== "supplier") {
            router.push("/dashboard");
            return;
        }

        // Fetch supplier data from database
        const fetchSupplierData = async () => {
            try {
                // Fetch supplier profile
                const supplierResponse = await fetch('/api/suppliers/profile');
                const supplierResult = await supplierResponse.json();

                if (supplierResult.success && supplierResult.data) {
                    const supplierData = supplierResult.data;
                    setSupplier(supplierData);

                    // Populate form with existing data
                    setSupplierForm({
                        companyName: supplierData.companyName || "",
                        industry: supplierData.industry || "",
                        businessType: supplierData.businessType || "",
                        website: supplierData.website || "",
                        description: supplierData.description || "",
                        country: supplierData.country || "",
                        city: supplierData.city || "",
                        address: supplierData.address || "",
                        postalCode: supplierData.postalCode || "",
                        phone: supplierData.phone || "",
                        responseTime: supplierData.responseTime || "",
                        minOrderValue: supplierData.minOrderValue?.toString() || "",
                        currency: supplierData.currency || "USD",
                        establishedYear: supplierData.establishedYear?.toString() || "",
                        employees: supplierData.employees || "",
                        specialties: supplierData.specialties?.join(", ") || "",
                        certifications: supplierData.certifications?.join(", ") || "",
                        contactEmail: supplierData.contactEmail || "",
                        contactPhone: supplierData.contactPhone || "",
                    });
                }

                // Fetch supplier's products
                const productsResponse = await fetch('/api/suppliers/products');
                const productsResult = await productsResponse.json();

                if (productsResult.success) {
                    setProducts(productsResult.data);
                }

                // Fetch relevant RFQs
                const rfqsResponse = await fetch('/api/rfqs?supplier=true');
                const rfqsResult = await rfqsResponse.json();

                if (rfqsResult.success) {
                    setRfqs(rfqsResult.data.rfqs);
                }

                // Fetch supplier's quotes
                const quotesResponse = await fetch('/api/suppliers/quotes');
                const quotesResult = await quotesResponse.json();

                if (quotesResult.success) {
                    setQuotes(quotesResult.data);
                }
            } catch (error) {
                console.error("Error fetching supplier data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSupplierData();
    }, [status, session, router]);

    const handleSupplierUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/suppliers/upsert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(supplierForm),
            });

            const result = await response.json();

            if (result.success) {
                // Update local state with new data
                setSupplier(result.data);
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile: ' + result.error);
            }
        } catch (error) {
            console.error('Error updating supplier:', error);
            alert('Error updating profile. Please try again.');
        }
    };

    const handleProductCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/products/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productForm),
            });

            const result = await response.json();

            if (result.success) {
                // Add new product to local state
                setProducts(prev => [...prev, result.data]);
                alert('Product created successfully!');
                setActiveTab("products");
                resetProductForm();
            } else {
                alert('Failed to create product: ' + result.error);
            }
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Error creating product. Please try again.');
        }
    };

    const handleProductUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        try {
            const response = await fetch(`/api/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productForm),
            });

            const result = await response.json();

            if (result.success) {
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? result.data : p));
                alert('Product updated successfully!');
                setEditingProduct(null);
                setActiveTab("products");
                resetProductForm();
            } else {
                alert('Failed to update product: ' + result.error);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product. Please try again.');
        }
    };

    const handleProductDelete = async (productId: string) => {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                setProducts(prev => prev.filter(p => p.id !== productId));
                alert('Product deleted successfully!');
                setShowDeleteConfirm(null);
            } else {
                alert('Failed to delete product: ' + result.error);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product. Please try again.');
        }
    };

    const handleQuoteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/quotes/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quoteForm),
            });

            const result = await response.json();

            if (result.success) {
                setQuotes(prev => [...prev, result.data]);
                alert('Quote submitted successfully!');
                setActiveTab("quotes");
                resetQuoteForm();
            } else {
                alert('Failed to submit quote: ' + result.error);
            }
        } catch (error) {
            console.error('Error submitting quote:', error);
            alert('Error submitting quote. Please try again.');
        }
    };

    const resetProductForm = () => {
        setProductForm({
            name: "",
            description: "",
            category: "",
            subcategory: "",
            price: "",
            currency: "USD",
            minOrderQuantity: "",
            unit: "",
            specifications: "",
            features: "",
            tags: "",
            images: "",
            inStock: true,
            stockQuantity: "",
            leadTime: "",
        });
    };

    const resetQuoteForm = () => {
        setQuoteForm({
            rfqId: "",
            price: "",
            currency: "USD",
            quantity: "",
            unit: "",
            leadTime: "",
            validity: "",
            notes: "",
        });
    };

    const startEditingProduct = (product: Product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            description: product.description,
            category: product.category,
            subcategory: product.subcategory || "",
            price: product.price.toString(),
            currency: product.currency,
            minOrderQuantity: product.minOrderQuantity.toString(),
            unit: product.unit,
            specifications: JSON.stringify(product.specifications || {}, null, 2),
            features: product.features.join(", "),
            tags: product.tags.join(", "),
            images: product.images.join(", "),
            inStock: product.inStock,
            stockQuantity: product.stockQuantity?.toString() || "",
            leadTime: product.leadTime || "",
        });
        setActiveTab("edit-product");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <PageTitle
                title="Supplier Dashboard | TradeMart"
                description="Manage your supplier profile, products, RFQs, and quotes on TradeMart"
            />
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
                                <Link href="/rfqs" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                    RFQs
                                </Link>
                                <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                    Pricing
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link href="/supplier-dashboard">
                                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">Dashboard</Button>
                                </Link>
                                <Button variant="outline" className="border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors">Sign Out</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome back, {supplier?.companyName || session?.user?.name || 'Supplier'}! 👋
                            </h1>
                            <p className="text-gray-600">Manage your profile, products, and grow your business</p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Last active</div>
                                <div className="font-medium">{supplier?.lastActive ? new Date(supplier.lastActive).toLocaleDateString() : 'Today'}</div>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {supplier?.companyName?.charAt(0) || session?.user?.name?.charAt(0) || 'S'}
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="products" className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Products
                        </TabsTrigger>
                        <TabsTrigger value="rfqs" className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            RFQs
                        </TabsTrigger>
                        <TabsTrigger value="quotes" className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Quotes
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-3xl font-bold text-blue-600 mb-2">{products.length}</div>
                                            <div className="text-gray-600">Total Products</div>
                                            {products.length === 0 && (
                                                <div className="text-xs text-blue-500 mt-1">Add your first product!</div>
                                            )}
                                        </div>
                                        <Package className="w-8 h-8 text-blue-600" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-3xl font-bold text-green-600 mb-2">{supplier?.totalOrders || 0}</div>
                                            <div className="text-gray-600">Total Orders</div>
                                            {supplier?.totalOrders === 0 && (
                                                <div className="text-xs text-green-500 mt-1">Start getting orders!</div>
                                            )}
                                        </div>
                                        <Target className="w-8 h-8 text-green-600" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-3xl font-bold text-purple-600 mb-2">{supplier?.rating || 0}</div>
                                            <div className="text-gray-600">Average Rating</div>
                                            {supplier?.rating === 0 && (
                                                <div className="text-xs text-purple-500 mt-1">Build your reputation!</div>
                                            )}
                                        </div>
                                        <Star className="w-8 h-8 text-purple-600" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-3xl font-bold text-orange-600 mb-2">{quotes.length}</div>
                                            <div className="text-gray-600">Active Quotes</div>
                                            {quotes.length === 0 && (
                                                <div className="text-xs text-orange-500 mt-1">Submit your first quote!</div>
                                            )}
                                        </div>
                                        <MessageSquare className="w-8 h-8 text-orange-600" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Getting Started Section */}
                        {products.length === 0 && (
                            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                                <CardContent className="p-8">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Package className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to TradeMart! 🎉</h3>
                                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                            You&apos;re all set up! Now let&apos;s get your business rolling. Start by adding your first product to showcase your offerings to buyers worldwide.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Button
                                                onClick={() => setActiveTab("add-product")}
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                                            >
                                                <Plus className="w-5 h-5 mr-2" />
                                                Add Your First Product
                                            </Button>
                                            <Button
                                                onClick={() => setActiveTab("profile")}
                                                variant="outline"
                                                className="px-8 py-3 text-lg"
                                            >
                                                <Building2 className="w-5 h-5 mr-2" />
                                                Complete Your Profile
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="w-5 h-5" />
                                        Recent Products
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {products.slice(0, 3).map((product) => (
                                            <div key={product.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div>
                                                    <div className="font-medium">{product.name}</div>
                                                    <div className="text-sm text-gray-600">{product.category}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold">{product.currency} {product.price}</div>
                                                    <div className="text-sm text-gray-600">{product.views} views</div>
                                                </div>
                                            </div>
                                        ))}
                                        {products.length === 0 && (
                                            <div className="text-center py-8">
                                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <div className="text-gray-500 mb-2">No products yet</div>
                                                <Button
                                                    variant="link"
                                                    onClick={() => setActiveTab("add-product")}
                                                    className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
                                                >
                                                    Add your first product →
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Recent RFQs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {rfqs.slice(0, 3).map((rfq) => (
                                            <div key={rfq.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div>
                                                    <div className="font-medium">{rfq.title}</div>
                                                    <div className="text-sm text-gray-600">{rfq.category}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold">{rfq.currency} {rfq.budget}</div>
                                                    <div className="text-sm text-gray-600">{rfq.quantity} {rfq.unit}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {rfqs.length === 0 && (
                                            <div className="text-center py-8">
                                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <div className="text-gray-500 mb-2">No relevant RFQs yet</div>
                                                <div className="text-sm text-gray-400">RFQs matching your industry will appear here</div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5" />
                                        Profile Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Verification:</span>
                                            <Badge className={supplier?.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                                {supplier?.verified ? "Verified" : "Pending"}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Company:</span>
                                            <span className="font-medium">{supplier?.companyName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Industry:</span>
                                            <span className="font-medium">{supplier?.industry}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Country:</span>
                                            <span className="font-medium">{supplier?.country}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Response Time:</span>
                                            <span className="font-medium">{supplier?.responseTime || "N/A"}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Company Information</CardTitle>
                                <CardDescription>Update your company profile and business details</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSupplierUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="companyName">Company Name</Label>
                                            <Input
                                                id="companyName"
                                                value={supplierForm.companyName}
                                                onChange={(e) => setSupplierForm({ ...supplierForm, companyName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="industry">Industry</Label>
                                            <Select value={supplierForm.industry} onValueChange={(value) => setSupplierForm({ ...supplierForm, industry: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select industry" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Electronics">Electronics</SelectItem>
                                                    <SelectItem value="Textiles">Textiles</SelectItem>
                                                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                                    <SelectItem value="Automotive">Automotive</SelectItem>
                                                    <SelectItem value="Chemicals">Chemicals</SelectItem>
                                                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                                                    <SelectItem value="Construction">Construction</SelectItem>
                                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="businessType">Business Type</Label>
                                            <Select value={supplierForm.businessType} onValueChange={(value) => setSupplierForm({ ...supplierForm, businessType: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select business type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                                                    <SelectItem value="Wholesaler">Wholesaler</SelectItem>
                                                    <SelectItem value="Distributor">Distributor</SelectItem>
                                                    <SelectItem value="Service Provider">Service Provider</SelectItem>
                                                    <SelectItem value="Trader">Trader</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="website">Website</Label>
                                            <Input
                                                id="website"
                                                type="url"
                                                value={supplierForm.website}
                                                onChange={(e) => setSupplierForm({ ...supplierForm, website: e.target.value })}
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="country">Country</Label>
                                            <Input
                                                id="country"
                                                value={supplierForm.country}
                                                onChange={(e) => setSupplierForm({ ...supplierForm, country: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={supplierForm.city}
                                                onChange={(e) => setSupplierForm({ ...supplierForm, city: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="establishedYear">Established Year</Label>
                                            <Input
                                                id="establishedYear"
                                                type="number"
                                                value={supplierForm.establishedYear}
                                                onChange={(e) => setSupplierForm({ ...supplierForm, establishedYear: e.target.value })}
                                                min="1900"
                                                max={new Date().getFullYear()}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="employees">Number of Employees</Label>
                                            <Select value={supplierForm.employees} onValueChange={(value) => setSupplierForm({ ...supplierForm, employees: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select range" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1-10">1-10</SelectItem>
                                                    <SelectItem value="11-50">11-50</SelectItem>
                                                    <SelectItem value="51-200">51-200</SelectItem>
                                                    <SelectItem value="201-500">201-500</SelectItem>
                                                    <SelectItem value="501-1000">501-1000</SelectItem>
                                                    <SelectItem value="1000+">1000+</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Company Description</Label>
                                        <Textarea
                                            id="description"
                                            value={supplierForm.description}
                                            onChange={(e) => setSupplierForm({ ...supplierForm, description: e.target.value })}
                                            rows={4}
                                            placeholder="Describe your company, products, and services..."
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                                        <Input
                                            id="specialties"
                                            value={supplierForm.specialties}
                                            onChange={(e) => setSupplierForm({ ...supplierForm, specialties: e.target.value })}
                                            placeholder="Smartphones, Tablets, IoT Devices"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                                        <Input
                                            id="certifications"
                                            value={supplierForm.certifications}
                                            onChange={(e) => setSupplierForm({ ...supplierForm, certifications: e.target.value })}
                                            placeholder="ISO 9001, CE, FCC, RoHS"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="contactEmail">Contact Email</Label>
                                            <Input
                                                id="contactEmail"
                                                type="email"
                                                value={supplierForm.contactEmail}
                                                onChange={(e) => setSupplierForm({ ...supplierForm, contactEmail: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="contactPhone">Contact Phone</Label>
                                            <Input
                                                id="contactPhone"
                                                value={supplierForm.contactPhone}
                                                onChange={(e) => setSupplierForm({ ...supplierForm, contactPhone: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="responseTime">Response Time</Label>
                                            <Input
                                                id="responseTime"
                                                value={supplierForm.responseTime}
                                                onChange={(e) => setSupplierForm({ ...supplierForm, responseTime: e.target.value })}
                                                placeholder="< 2 hours"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="minOrderValue">Minimum Order Value</Label>
                                            <div className="flex">
                                                <Select value={supplierForm.currency} onValueChange={(value) => setSupplierForm({ ...supplierForm, currency: value })}>
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
                                                    id="minOrderValue"
                                                    type="number"
                                                    value={supplierForm.minOrderValue}
                                                    onChange={(e) => setSupplierForm({ ...supplierForm, minOrderValue: e.target.value })}
                                                    className="ml-2"
                                                    placeholder="500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                        Update Profile
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Products Tab */}
                    <TabsContent value="products" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Package className="w-6 h-6" />
                                Your Products
                            </h2>
                            <Button
                                onClick={() => setActiveTab("add-product")}
                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add New Product
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <Card key={product.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{product.name}</CardTitle>
                                        <CardDescription>{product.category} • {product.subcategory}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Price:</span>
                                                <span className="font-semibold">{product.currency} {product.price}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Min Order:</span>
                                                <span className="font-medium">{product.minOrderQuantity} {product.unit}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Views:</span>
                                                <span className="font-medium">{product.views}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Orders:</span>
                                                <span className="font-medium">{product.orders}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Stock:</span>
                                                <Badge className={product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                                    {product.inStock ? "In Stock" : "Out of Stock"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-gray-200 flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 flex items-center gap-1"
                                                onClick={() => startEditingProduct(product)}
                                            >
                                                <Edit className="w-3 h-3" />
                                                Edit
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1 flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                View
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                                                onClick={() => setShowDeleteConfirm(product.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {products.length === 0 && (
                                <div className="col-span-full">
                                    <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
                                        <CardContent className="p-8 text-center">
                                            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Package className="w-10 h-10 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to showcase your products? 🚀</h3>
                                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                                Add your first product to start attracting buyers and growing your business on TradeMart.
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <Button
                                                    onClick={() => setActiveTab("add-product")}
                                                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
                                                >
                                                    <Plus className="w-5 h-5 mr-2" />
                                                    Add Your First Product
                                                </Button>
                                                <Button
                                                    onClick={() => setActiveTab("profile")}
                                                    variant="outline"
                                                    className="px-8 py-3 text-lg"
                                                >
                                                    <Building2 className="w-5 h-5 mr-2" />
                                                    Complete Profile First
                                                </Button>
                                            </div>
                                            <div className="mt-6 text-sm text-gray-500">
                                                💡 Tip: Complete your profile first to get better RFQ matches!
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Add Product Tab */}
                    <TabsContent value="add-product" className="space-y-6">
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    Add New Product
                                </CardTitle>
                                <CardDescription>Create a new product listing for your catalog</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProductCreate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="productName">Product Name</Label>
                                            <Input
                                                id="productName"
                                                value={productForm.name}
                                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="productCategory">Category</Label>
                                            <Select value={productForm.category} onValueChange={(value) => setProductForm({ ...productForm, category: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Electronics">Electronics</SelectItem>
                                                    <SelectItem value="Textiles">Textiles</SelectItem>
                                                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                                    <SelectItem value="Automotive">Automotive</SelectItem>
                                                    <SelectItem value="Chemicals">Chemicals</SelectItem>
                                                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                                                    <SelectItem value="Construction">Construction</SelectItem>
                                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="productSubcategory">Subcategory</Label>
                                            <Input
                                                id="productSubcategory"
                                                value={productForm.subcategory}
                                                onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                                                placeholder="e.g., Audio, Lighting, Components"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="productPrice">Price</Label>
                                            <div className="flex">
                                                <Select value={productForm.currency} onValueChange={(value) => setProductForm({ ...productForm, currency: value })}>
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
                                                    id="productPrice"
                                                    type="number"
                                                    step="0.01"
                                                    value={productForm.price}
                                                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                                    className="ml-2"
                                                    placeholder="45.00"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="minOrderQuantity">Minimum Order Quantity</Label>
                                            <Input
                                                id="minOrderQuantity"
                                                type="number"
                                                value={productForm.minOrderQuantity}
                                                onChange={(e) => setProductForm({ ...productForm, minOrderQuantity: e.target.value })}
                                                placeholder="100"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="unit">Unit</Label>
                                            <Input
                                                id="unit"
                                                value={productForm.unit}
                                                onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                                                placeholder="pieces, kg, meters, etc."
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="stockQuantity">Stock Quantity</Label>
                                            <Input
                                                id="stockQuantity"
                                                type="number"
                                                value={productForm.stockQuantity}
                                                onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                                                placeholder="5000"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="leadTime">Lead Time</Label>
                                            <Input
                                                id="leadTime"
                                                value={productForm.leadTime}
                                                onChange={(e) => setProductForm({ ...productForm, leadTime: e.target.value })}
                                                placeholder="7-14 days"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="productDescription">Product Description</Label>
                                        <Textarea
                                            id="productDescription"
                                            value={productForm.description}
                                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                            rows={4}
                                            placeholder="Describe your product, its features, and benefits..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="productFeatures">Key Features (comma-separated)</Label>
                                        <Input
                                            id="productFeatures"
                                            value={productForm.features}
                                            onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                                            placeholder="Noise Cancellation, 30h Battery, Quick Charge"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="productTags">Tags (comma-separated)</Label>
                                        <Input
                                            id="productTags"
                                            value={productForm.tags}
                                            onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                                            placeholder="wireless, bluetooth, premium, audio"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="productSpecifications">Specifications (JSON format)</Label>
                                        <Textarea
                                            id="productSpecifications"
                                            value={productForm.specifications}
                                            onChange={(e) => setProductForm({ ...productForm, specifications: e.target.value })}
                                            rows={3}
                                            placeholder='{"material": "Plastic, Metal", "color": "Black, White", "size": "20cm x 15cm"}'
                                        />
                                    </div>

                                    <div className="flex space-x-4">
                                        <Button type="submit" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                                            Create Product
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => setActiveTab("products")}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Edit Product Tab */}
                    <TabsContent value="edit-product" className="space-y-6">
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Edit className="w-5 h-5" />
                                    Edit Product: {editingProduct?.name}
                                </CardTitle>
                                <CardDescription>Update your product information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProductUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="productName">Product Name</Label>
                                            <Input
                                                id="productName"
                                                value={productForm.name}
                                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="productCategory">Category</Label>
                                            <Select value={productForm.category} onValueChange={(value) => setProductForm({ ...productForm, category: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Electronics">Electronics</SelectItem>
                                                    <SelectItem value="Textiles">Textiles</SelectItem>
                                                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                                    <SelectItem value="Automotive">Automotive</SelectItem>
                                                    <SelectItem value="Chemicals">Chemicals</SelectItem>
                                                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                                                    <SelectItem value="Construction">Construction</SelectItem>
                                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="productSubcategory">Subcategory</Label>
                                            <Input
                                                id="productSubcategory"
                                                value={productForm.subcategory}
                                                onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                                                placeholder="e.g., Audio, Lighting, Components"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="productPrice">Price</Label>
                                            <div className="flex">
                                                <Select value={productForm.currency} onValueChange={(value) => setProductForm({ ...productForm, currency: value })}>
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
                                                    id="productPrice"
                                                    type="number"
                                                    step="0.01"
                                                    value={productForm.price}
                                                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                                    className="ml-2"
                                                    placeholder="45.00"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="minOrderQuantity">Minimum Order Quantity</Label>
                                            <Input
                                                id="minOrderQuantity"
                                                type="number"
                                                value={productForm.minOrderQuantity}
                                                onChange={(e) => setProductForm({ ...productForm, minOrderQuantity: e.target.value })}
                                                placeholder="100"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="unit">Unit</Label>
                                            <Input
                                                id="unit"
                                                value={productForm.unit}
                                                onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                                                placeholder="pieces, kg, meters, etc."
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="stockQuantity">Stock Quantity</Label>
                                            <Input
                                                id="stockQuantity"
                                                type="number"
                                                value={productForm.stockQuantity}
                                                onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                                                placeholder="5000"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="leadTime">Lead Time</Label>
                                            <Input
                                                id="leadTime"
                                                value={productForm.leadTime}
                                                onChange={(e) => setProductForm({ ...productForm, leadTime: e.target.value })}
                                                placeholder="7-14 days"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="productDescription">Product Description</Label>
                                        <Textarea
                                            id="productDescription"
                                            value={productForm.description}
                                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                            rows={4}
                                            placeholder="Describe your product, its features, and benefits..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="productFeatures">Key Features (comma-separated)</Label>
                                        <Input
                                            id="productFeatures"
                                            value={productForm.features}
                                            onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                                            placeholder="Noise Cancellation, 30h Battery, Quick Charge"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="productTags">Tags (comma-separated)</Label>
                                        <Input
                                            id="productTags"
                                            value={productForm.tags}
                                            onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                                            placeholder="wireless, bluetooth, premium, audio"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="productSpecifications">Specifications (JSON format)</Label>
                                        <Textarea
                                            id="productSpecifications"
                                            value={productForm.specifications}
                                            onChange={(e) => setProductForm({ ...productForm, specifications: e.target.value })}
                                            rows={3}
                                            placeholder='{"material": "Plastic, Metal", "color": "Black, White", "size": "20cm x 15cm"}'
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="inStock"
                                            checked={productForm.inStock}
                                            onCheckedChange={(checked) => setProductForm({ ...productForm, inStock: checked as boolean })}
                                        />
                                        <Label htmlFor="inStock">Product is in stock</Label>
                                    </div>

                                    <div className="flex space-x-4">
                                        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                            Update Product
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => {
                                            setEditingProduct(null);
                                            setActiveTab("products");
                                            resetProductForm();
                                        }}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* RFQs Tab */}
                    <TabsContent value="rfqs" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="w-6 h-6" />
                                Relevant RFQs
                            </h2>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Activity className="w-4 h-4" />
                                Refresh
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {rfqs.map((rfq) => (
                                <Card key={rfq.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{rfq.title}</CardTitle>
                                                <CardDescription className="mt-2">{rfq.description}</CardDescription>
                                            </div>
                                            <Badge className="bg-blue-100 text-blue-800">
                                                {rfq.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <div className="text-sm text-gray-600">Category</div>
                                                    <div className="font-medium">{rfq.category}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Target className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <div className="text-sm text-gray-600">Quantity</div>
                                                    <div className="font-medium">{rfq.quantity} {rfq.unit}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <div className="text-sm text-gray-600">Budget</div>
                                                    <div className="font-medium">{rfq.currency} {rfq.budget}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <div className="text-sm text-gray-600">Expires</div>
                                                    <div className="font-medium">{new Date(rfq.expiresAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Users className="w-4 h-4 text-gray-500" />
                                            <div>
                                                <div className="text-sm text-gray-600">Buyer</div>
                                                <div className="font-medium">{rfq.buyer.name} - {rfq.buyer.company}</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                onClick={() => {
                                                    setQuoteForm({ ...quoteForm, rfqId: rfq.id });
                                                    setActiveTab("submit-quote");
                                                }}
                                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex items-center gap-2"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                Submit Quote
                                            </Button>
                                            <Button variant="outline" className="flex items-center gap-2">
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {rfqs.length === 0 && (
                                <div className="text-center py-12">
                                    <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50 max-w-md mx-auto">
                                        <CardContent className="p-8">
                                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FileText className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">No RFQs yet 📋</h3>
                                            <p className="text-gray-600 mb-4">
                                                RFQs matching your industry and specialties will appear here when buyers post them.
                                            </p>
                                            <div className="text-sm text-gray-500">
                                                💡 Complete your profile to get better RFQ matches!
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Submit Quote Tab */}
                    <TabsContent value="submit-quote" className="space-y-6">
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Submit Quote
                                </CardTitle>
                                <CardDescription>Provide your quote for the selected RFQ</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleQuoteSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="quotePrice">Quote Price</Label>
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
                                                    id="quotePrice"
                                                    type="number"
                                                    step="0.01"
                                                    value={quoteForm.price}
                                                    onChange={(e) => setQuoteForm({ ...quoteForm, price: e.target.value })}
                                                    className="ml-2"
                                                    placeholder="1000.00"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="quoteQuantity">Quantity</Label>
                                            <Input
                                                id="quoteQuantity"
                                                type="number"
                                                value={quoteForm.quantity}
                                                onChange={(e) => setQuoteForm({ ...quoteForm, quantity: e.target.value })}
                                                placeholder="100"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="quoteUnit">Unit</Label>
                                            <Input
                                                id="quoteUnit"
                                                value={quoteForm.unit}
                                                onChange={(e) => setQuoteForm({ ...quoteForm, unit: e.target.value })}
                                                placeholder="pieces"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="quoteLeadTime">Lead Time</Label>
                                            <Input
                                                id="quoteLeadTime"
                                                value={quoteForm.leadTime}
                                                onChange={(e) => setQuoteForm({ ...quoteForm, leadTime: e.target.value })}
                                                placeholder="7-14 days"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="quoteValidity">Quote Validity</Label>
                                            <Input
                                                id="quoteValidity"
                                                value={quoteForm.validity}
                                                onChange={(e) => setQuoteForm({ ...quoteForm, validity: e.target.value })}
                                                placeholder="30 days"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="quoteNotes">Additional Notes</Label>
                                        <Textarea
                                            id="quoteNotes"
                                            value={quoteForm.notes}
                                            onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                                            rows={4}
                                            placeholder="Any additional information, terms, or conditions..."
                                        />
                                    </div>

                                    <div className="flex space-x-4">
                                        <Button type="submit" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                                            Submit Quote
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => {
                                            setActiveTab("rfqs");
                                            resetQuoteForm();
                                        }}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Quotes Tab */}
                    <TabsContent value="quotes" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <MessageSquare className="w-6 h-6" />
                                Your Quotes
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {quotes.map((quote) => (
                                <Card key={quote.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">Quote for: {quote.rfq.title}</CardTitle>
                                                <CardDescription className="mt-2">{quote.rfq.description}</CardDescription>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800">
                                                {quote.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <div className="text-sm text-gray-600">Price</div>
                                                    <div className="font-medium">{quote.currency} {quote.price}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Target className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <div className="text-sm text-gray-600">Quantity</div>
                                                    <div className="font-medium">{quote.quantity} {quote.unit}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <div className="text-sm text-gray-600">Lead Time</div>
                                                    <div className="font-medium">{quote.leadTime}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <div className="text-sm text-gray-600">Valid Until</div>
                                                    <div className="font-medium">{quote.validity}</div>
                                                </div>
                                            </div>
                                        </div>
                                        {quote.notes && (
                                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Notes:</div>
                                                <div className="text-sm">{quote.notes}</div>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-600">
                                                Submitted: {new Date(quote.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm">
                                                    Edit Quote
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    View RFQ
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {quotes.length === 0 && (
                                <div className="text-center py-12">
                                    <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 max-w-md mx-auto">
                                        <CardContent className="p-8">
                                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <MessageSquare className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">No quotes yet 💬</h3>
                                            <p className="text-gray-600 mb-4">
                                                Your submitted quotes will appear here. Start by responding to RFQs!
                                            </p>
                                            <Button
                                                onClick={() => setActiveTab("rfqs")}
                                                variant="outline"
                                                className="mt-2"
                                            >
                                                View Available RFQs
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PieChart className="w-5 h-5" />
                                        Product Performance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Views:</span>
                                            <span className="font-semibold">{products.reduce((sum, p) => sum + p.views, 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Orders:</span>
                                            <span className="font-semibold">{products.reduce((sum, p) => sum + p.orders, 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Conversion Rate:</span>
                                            <span className="font-semibold">
                                                {products.length > 0 ?
                                                    ((products.reduce((sum, p) => sum + p.orders, 0) / products.reduce((sum, p) => sum + p.views, 1)) * 100).toFixed(2) + '%' :
                                                    '0%'
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Active Products:</span>
                                            <span className="font-semibold">{products.filter(p => p.inStock).length}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5" />
                                        Business Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Company Rating:</span>
                                            <span className="font-semibold flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                {supplier?.rating || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Orders:</span>
                                            <span className="font-semibold">{supplier?.totalOrders || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Response Time:</span>
                                            <span className="font-semibold">{supplier?.responseTime || "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Min Order Value:</span>
                                            <span className="font-semibold">{supplier?.currency} {supplier?.minOrderValue || 0}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="w-5 h-5" />
                                        Quote Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Quotes:</span>
                                            <span className="font-semibold">{quotes.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Pending RFQs:</span>
                                            <span className="font-semibold">{rfqs.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Active RFQs:</span>
                                            <span className="font-semibold">{rfqs.filter(r => r.status === 'active').length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Quote Success Rate:</span>
                                            <span className="font-semibold">
                                                {quotes.length > 0 ? '85%' : '0%'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Top Performing Products</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {products
                                            .sort((a, b) => b.views - a.views)
                                            .slice(0, 5)
                                            .map((product, index) => (
                                                <div key={product.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{product.name}</div>
                                                            <div className="text-sm text-gray-600">{product.category}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold">{product.views} views</div>
                                                        <div className="text-sm text-gray-600">{product.orders} orders</div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {quotes.slice(0, 5).map((quote) => (
                                            <div key={quote.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                                <div>
                                                    <div className="font-medium">Quote submitted</div>
                                                    <div className="text-sm text-gray-600">{quote.rfq.title}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold">{quote.currency} {quote.price}</div>
                                                    <div className="text-sm text-gray-600">{new Date(quote.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {quotes.length === 0 && (
                                            <div className="text-center py-4 text-gray-500">
                                                No recent activity
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <Card className="w-96 border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-red-600 flex items-center gap-2">
                                    <Trash2 className="w-5 h-5" />
                                    Confirm Deletion
                                </CardTitle>
                                <CardDescription>
                                    Are you sure you want to delete this product? This action cannot be undone.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-3">
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleProductDelete(showDeleteConfirm)}
                                        className="flex-1"
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowDeleteConfirm(null)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
