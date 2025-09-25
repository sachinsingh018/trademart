"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    currency: string;
    minOrderQuantity: number;
    unit: string;
    stockQuantity?: number;
    inStock: boolean;
    views?: number;
    features: string[];
    tags: string[];
    supplier?: {
        company: string;
        verified: boolean;
    };
    createdAt: string;
    updatedAt: string;
}

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
    quotes?: Array<{
        id: string;
        price: number;
        leadTime: number;
        notes: string;
    }>;
    requirements: string[];
    specifications: Record<string, string>;
    createdAt: string;
    expiresAt?: string;
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [rfqs, setRfqs] = useState<RFQ[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Product | RFQ | null>(null);
    const [viewMode, setViewMode] = useState<'rfqs' | 'products'>('rfqs');
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);


    const fetchRfqs = useCallback(async () => {
        try {
            // For buyers, fetch their own RFQs; for suppliers, fetch all RFQs
            const isBuyer = session?.user?.role === "buyer";
            const url = isBuyer ? "/api/rfqs/my-rfqs" : "/api/rfqs";
            console.log("Fetching RFQs from:", url, "for user:", session?.user?.id, "role:", session?.user?.role);
            const response = await fetch(url);
            const data = await response.json();
            console.log("RFQs response:", data);
            setRfqs(data.data?.rfqs || data.rfqs || []);
        } catch (error) {
            console.error("Error fetching RFQs:", error);
        } finally {
            setLoading(false);
        }
    }, [session]);

    const handleDeleteClick = (item: Product | RFQ) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;

        try {
            setDeleting(itemToDelete.id);

            // Determine the correct API endpoint based on the item type
            const isProduct = !isBuyer && viewMode === 'products';
            const apiUrl = isProduct ? `/api/products/${itemToDelete.id}` : `/api/rfqs/${itemToDelete.id}`;

            console.log('Deleting item:', itemToDelete.id, 'Type:', isProduct ? 'product' : 'RFQ', 'API:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'DELETE',
            });

            const data = await response.json();
            console.log('Delete response:', data);

            if (data.success) {
                // Remove the deleted item from the appropriate list
                if (isProduct) {
                    setProducts(prevProducts => prevProducts.filter((product: Product) => product.id !== itemToDelete.id));
                } else {
                    setRfqs(prevRfqs => prevRfqs.filter((rfq: RFQ) => rfq.id !== itemToDelete.id));
                }
                setShowDeleteModal(false);
                setItemToDelete(null);
            } else {
                alert(`Failed to delete ${isProduct ? 'product' : 'RFQ'}: ` + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error(`Error deleting ${!isBuyer && viewMode === 'products' ? 'product' : 'RFQ'}:`, error);
            alert(`Failed to delete ${!isBuyer && viewMode === 'products' ? 'product' : 'RFQ'}. Please try again.`);
        } finally {
            setDeleting(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const handleStatusToggle = async (rfqId: string, currentStatus: string) => {
        try {
            setUpdatingStatus(rfqId);
            const newStatus = currentStatus === "open" ? "closed" : "open";

            const response = await fetch(`/api/rfqs/${rfqId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: newStatus
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Update the RFQ status in the local state
                setRfqs(prevRfqs =>
                    prevRfqs.map(rfq =>
                        rfq.id === rfqId
                            ? { ...rfq, status: newStatus }
                            : rfq
                    )
                );
            } else {
                alert(`Failed to update RFQ status: ${data.error}`);
            }
        } catch (error) {
            console.error("Error updating RFQ status:", error);
            alert("Failed to update RFQ status. Please try again.");
        } finally {
            setUpdatingStatus(null);
        }
    };

    const fetchProducts = useCallback(async () => {
        try {
            console.log("Fetching products for supplier:", session?.user?.id);
            const response = await fetch("/api/products/my-products");
            const data = await response.json();
            console.log("Products response:", data);
            setProducts(data.data?.products || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        if (session) {
            if (session.user.role === 'buyer') {
                // Buyers only see RFQs for now (Browse Products section is hidden)
                fetchRfqs();
            } else if (session.user.role === 'supplier') {
                if (viewMode === 'rfqs') {
                    fetchRfqs();
                } else {
                    fetchProducts();
                }
            }
        }
    }, [session, viewMode, fetchRfqs, fetchProducts]);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const isBuyer = session.user.role === "buyer";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-lg shadow-gray-900/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo Section */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center group">
                                <div className="relative">
                                    <Image
                                        src="/logofinal.png"
                                        alt="TradeMart Logo"
                                        width={160}
                                        height={160}
                                        className="w-12 h-12 group-hover:scale-105 transition-all duration-300 drop-shadow-sm"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="ml-3 hidden sm:block">
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                        TradeMart
                                    </h1>
                                    <p className="text-xs text-gray-500 font-medium">B2B Marketplace</p>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/suppliers" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                Suppliers
                            </Link>
                            <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                Products
                            </Link>
                            <Link href="/rfqs" className="text-blue-600 font-medium">
                                RFQs
                            </Link>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="md:hidden flex items-center space-x-4">
                            <Link href="/suppliers" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                                Suppliers
                            </Link>
                            <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                                Products
                            </Link>
                            <Link href="/rfqs" className="text-blue-600 text-sm font-medium">
                                RFQs
                            </Link>
                        </div>

                        {/* User Section */}
                        <div className="flex items-center space-x-6">
                            {/* Welcome Message */}
                            <div className="hidden md:flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">
                                        Welcome back, {session.user.name?.split(' ')[0]}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {isBuyer ? 'Buyer Dashboard' : 'Supplier Dashboard'}
                                    </p>
                                </div>
                            </div>

                            {/* Role Badge */}
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${isBuyer ? 'bg-blue-500' : 'bg-green-500'} animate-pulse`}></div>
                                <Badge
                                    variant="outline"
                                    className={`px-3 py-1 text-xs font-semibold border-2 ${isBuyer
                                        ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                        : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                        } transition-colors duration-200`}
                                >
                                    {isBuyer ? '👤 Buyer' : '🏭 Supplier'}
                                </Badge>
                            </div>

                            {/* Sign Out Button */}
                            <Link href="/auth/signout">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="group border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium"
                                >
                                    <span className="group-hover:scale-110 transition-transform duration-200">🚪</span>
                                    <span className="ml-2 hidden sm:inline">Sign Out</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                {isBuyer ? "B" : "S"}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {isBuyer ? "Buyer Dashboard" : "Supplier Dashboard"}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Welcome back, {session.user.name}
                            </p>
                        </div>
                    </div>
                    <p className="text-gray-600 text-lg">
                        {isBuyer
                            ? "Manage your RFQs and review quotes from suppliers"
                            : "Browse open RFQs and submit competitive quotes"
                        }
                    </p>
                </div>

                {/* Toggle for Suppliers */}
                {!isBuyer && (
                    <div className="mb-8">
                        <div className="flex items-center justify-center">
                            <div className="bg-gray-100 rounded-lg p-1 flex">
                                <button
                                    onClick={() => setViewMode('rfqs')}
                                    className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${viewMode === 'rfqs'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    📋 RFQs
                                </button>
                                <button
                                    onClick={() => setViewMode('products')}
                                    className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${viewMode === 'products'
                                        ? 'bg-white text-green-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    🏭 My Products
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toggle for Buyers - COMMENTED OUT */}
                {/* {isBuyer && (
                    <div className="mb-8">
                        <div className="flex items-center justify-center">
                            <div className="bg-gray-100 rounded-lg p-1 flex">
                                <button
                                    onClick={() => setViewMode('rfqs')}
                                    className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${viewMode === 'rfqs'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    📋 My RFQs
                                </button>
                                <button
                                    onClick={() => setViewMode('products')}
                                    className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${viewMode === 'products'
                                        ? 'bg-white text-green-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    🛍️ Browse Products
                                </button>
                            </div>
                        </div>
                    </div>
                )} */}

                {isBuyer && (
                    <div className="mb-8">
                        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">+</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Create New RFQ</h3>
                                        <p className="text-gray-600">
                                            Post a new request for quotation to get competitive quotes from suppliers
                                        </p>
                                    </div>
                                </div>
                                <Link href="/rfqs/create">
                                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                                        Create RFQ
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                )}

                {!isBuyer && (
                    <div className="mb-8">
                        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Create New Product</h3>
                                        <p className="text-gray-600">
                                            Add a new product to your catalog and start attracting buyers worldwide
                                        </p>
                                    </div>
                                </div>
                                <Link href="/products/create">
                                    <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                                        Add Product
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Stats for Buyers - RFQs */}
                {isBuyer && rfqs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-blue-50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-blue-600 mb-2">{rfqs.length}</div>
                            <div className="text-gray-600">Your RFQs</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {rfqs.filter((rfq: RFQ) => rfq.status === "open").length}
                            </div>
                            <div className="text-gray-600">Open for Quotes</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                {rfqs.reduce((sum: number, rfq: RFQ) => sum + (rfq.quotes?.length || 0), 0)}
                            </div>
                            <div className="text-gray-600">Total Quotes</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-orange-600 mb-2">
                                ${rfqs.reduce((sum: number, rfq: RFQ) => sum + Number(rfq.budget || 0), 0)}
                            </div>
                            <div className="text-gray-600">Total Budget</div>
                        </div>
                    </div>
                )}

                {/* Stats for Buyers - Products - COMMENTED OUT */}
                {/* {isBuyer && viewMode === 'products' && products.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-green-50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-green-600 mb-2">{products.length}</div>
                            <div className="text-gray-600">Available Products</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {products.filter((product: Product) => product.inStock).length}
                            </div>
                            <div className="text-gray-600">In Stock</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                {products.filter((product: any) => product.supplier?.verified).length}
                            </div>
                            <div className="text-gray-600">Verified Suppliers</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-orange-600 mb-2">
                                ${products.reduce((sum: number, product: Product) => sum + Number(product.price || 0), 0)}
                            </div>
                            <div className="text-gray-600">Total Value</div>
                        </div>
                    </div>
                )} */}

                {/* Stats for Suppliers - Products */}
                {!isBuyer && viewMode === 'products' && products.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-green-50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-green-600 mb-2">{products.length}</div>
                            <div className="text-gray-600">Your Products</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {products.filter((product: Product) => product.inStock).length}
                            </div>
                            <div className="text-gray-600">In Stock</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-orange-600 mb-2">
                                {products.filter((product: Product) => !product.inStock).length}
                            </div>
                            <div className="text-gray-600">Out of Stock</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                ${products.reduce((sum: number, product: Product) => sum + Number(product.price || 0), 0)}
                            </div>
                            <div className="text-gray-600">Total Value</div>
                        </div>
                    </div>
                )}

                <div className="grid gap-6">
                    <Card className="p-6 shadow-lg border-0">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    {!isBuyer && viewMode === 'products' ? '🏭' : '📋'}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {isBuyer ? "Your RFQs" : (viewMode === 'products' ? "Your Products" : "Open RFQs")}
                                </h2>
                                <p className="text-gray-600">
                                    {isBuyer
                                        ? "Track the status of your requests for quotation"
                                        : viewMode === 'products'
                                            ? "Manage your product catalog"
                                            : "Browse and quote on open requests"
                                    }
                                </p>
                            </div>
                        </div>

                        {((!isBuyer && viewMode === 'products' && products.length === 0) || (isBuyer && rfqs.length === 0) || (!isBuyer && viewMode === 'rfqs' && rfqs.length === 0)) ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-gray-400 text-2xl">
                                        {!isBuyer && viewMode === 'products' ? '🏭' : '📋'}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-lg">
                                    {isBuyer
                                        ? "No RFQs found. Create your first RFQ to get started."
                                        : !isBuyer && viewMode === 'products'
                                            ? "No products found. Add your first product to get started."
                                            : "No open RFQs available at the moment."
                                    }
                                </p>
                                {isBuyer && (
                                    <div className="mt-4">
                                        <Link href="/rfqs/create">
                                            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                                                Create Your First RFQ
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                                {!isBuyer && viewMode === 'products' && (
                                    <div className="mt-4">
                                        <Link href="/products/create">
                                            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                                                Add Your First Product
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {!isBuyer && viewMode === 'products' ? (
                                    products.map((item: Product) => (
                                        <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 text-xl mb-2">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={item.inStock ? "default" : "secondary"}
                                                    className={`${item.inStock ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"} border`}
                                                >
                                                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                                {/* Product/RFQ Details */}
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold text-gray-900">
                                                        Product Details
                                                    </h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Category:</span>
                                                            <span className="font-medium">{item.category}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Price:</span>
                                                            <span className="font-medium">{item.currency} {item.price}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Min Order:</span>
                                                            <span className="font-medium">{item.minOrderQuantity} {item.unit}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Stock:</span>
                                                            <span className="font-medium">{item.stockQuantity || 'N/A'}</span>
                                                        </div>
                                                        {item.supplier && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Supplier:</span>
                                                                <span className="font-medium">{item.supplier.company || 'N/A'}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Timeline */}
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold text-gray-900">Timeline</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Added:</span>
                                                            <span className="font-medium">{new Date(item.createdAt).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Updated:</span>
                                                            <span className="font-medium">{new Date(item.updatedAt).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Status & Actions */}
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold text-gray-900">Status & Actions</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Status:</span>
                                                            <span className={`font-medium ${item.inStock ? "text-green-600" : "text-gray-600"}`}>
                                                                {item.inStock ? 'In Stock' : 'Out of Stock'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Views:</span>
                                                            <span className="font-medium">{item.views || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Features */}
                                            {item.features && item.features.length > 0 && (
                                                <div className="mb-6 pt-6 border-t border-gray-200">
                                                    <h4 className="font-semibold text-gray-900 mb-3">
                                                        Key Features
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.features.map((feature: string, index: number) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {feature}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-medium">Product ID:</span> {item.id}
                                                </div>
                                                <div className="flex gap-3">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.push(`/products/${item.id}`)}
                                                        className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                                                    >
                                                        👁️ View Details
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.push(`/products/${item.id}/edit`)}
                                                        className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300"
                                                    >
                                                        ✏️ Edit Product
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                                                        disabled={deleting === item.id}
                                                        onClick={() => handleDeleteClick(item)}
                                                    >
                                                        {deleting === item.id ? (
                                                            <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                                                        ) : (
                                                            '🗑️ Delete'
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    rfqs.map((item: RFQ) => (
                                        <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 text-xl mb-2">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={item.status === "open" ? "default" : "secondary"}
                                                    className={`${item.status === "open" ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"} border`}
                                                >
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                                {/* RFQ Details */}
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold text-gray-900">
                                                        RFQ Details
                                                    </h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Category:</span>
                                                            <span className="font-medium">{item.category}</span>
                                                        </div>
                                                        {item.quantity && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Quantity:</span>
                                                                <span className="font-medium">{item.quantity} {item.unit || 'units'}</span>
                                                            </div>
                                                        )}
                                                        {item.budget && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Budget:</span>
                                                                <span className="font-medium">{item.currency || '$'} {item.budget}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Quotes:</span>
                                                            <span className="font-medium">{item.quotes?.length || 0} received</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Timeline */}
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold text-gray-900">Timeline</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Created:</span>
                                                            <span className="font-medium">{new Date(item.createdAt).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}</span>
                                                        </div>
                                                        {item.expiresAt && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Expires:</span>
                                                                <span className="font-medium">{new Date(item.expiresAt).toLocaleDateString("en-US", {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status & Actions */}
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold text-gray-900">Status & Actions</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Status:</span>
                                                            <span className={`font-medium ${item.status === "open" ? "text-green-600" : "text-gray-600"}`}>
                                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Quotes:</span>
                                                            <span className="font-medium">{item.quotes?.length || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Requirements */}
                                            {item.requirements && item.requirements.length > 0 && (
                                                <div className="mb-6 pt-6 border-t border-gray-200">
                                                    <h4 className="font-semibold text-gray-900 mb-3">
                                                        Requirements
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {item.requirements.map((requirement: string, index: number) => (
                                                            <div key={index} className="flex items-start gap-2">
                                                                <span className="text-blue-500 mt-1">•</span>
                                                                <span className="text-sm text-gray-700">{requirement}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Specifications */}
                                            {item.specifications && Object.keys(item.specifications).length > 0 && (
                                                <div className="mb-6 pt-6 border-t border-gray-200">
                                                    <h4 className="font-semibold text-gray-900 mb-3">
                                                        Specifications
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {Object.entries(item.specifications).map(([key, value]) => (
                                                            <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                                                                <span className="text-gray-600 font-medium">{key}:</span>
                                                                <span className="text-gray-900">{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Quotes Preview */}
                                            {item.quotes && item.quotes.length > 0 && (
                                                <div className="mb-6 pt-6 border-t border-gray-200">
                                                    <h4 className="font-semibold text-gray-900 mb-3">
                                                        Recent Quotes ({item.quotes.length})
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {item.quotes.slice(0, 3).map((quote, index) => (
                                                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <span className="font-medium text-gray-900">
                                                                        {item.currency || '$'} {quote.price}
                                                                    </span>
                                                                    <span className="text-sm text-gray-600">
                                                                        {quote.leadTime} days lead time
                                                                    </span>
                                                                </div>
                                                                {quote.notes && (
                                                                    <p className="text-sm text-gray-600">{quote.notes}</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {item.quotes.length > 3 && (
                                                            <p className="text-sm text-gray-500 text-center">
                                                                +{item.quotes.length - 3} more quotes
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-medium">RFQ ID:</span> {item.id}
                                                </div>
                                                <div className="flex gap-3">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.push(`/rfqs/${item.id}`)}
                                                        className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                                                    >
                                                        👁️ View Details
                                                    </Button>
                                                    {isBuyer && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => router.push(`/rfqs/${item.id}/edit`)}
                                                                className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300"
                                                            >
                                                                ✏️ Edit RFQ
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className={`${item.status === "open"
                                                                    ? "border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                                                                    : "border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300"
                                                                    } disabled:opacity-50`}
                                                                disabled={updatingStatus === item.id}
                                                                onClick={() => handleStatusToggle(item.id, item.status)}
                                                            >
                                                                {updatingStatus === item.id ? (
                                                                    <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
                                                                ) : (
                                                                    item.status === "open" ? "🔒 Close RFQ" : "🔓 Reopen RFQ"
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                                                                disabled={deleting === item.id}
                                                                onClick={() => handleDeleteClick(item)}
                                                            >
                                                                {deleting === item.id ? (
                                                                    <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                                                                ) : (
                                                                    '🗑️ Delete'
                                                                )}
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 text-xl">⚠️</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Delete {!isBuyer && viewMode === 'products' ? 'Product' : 'RFQ'}
                                </h3>
                                <p className="text-gray-600">This action cannot be undone</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700 mb-2">
                                Are you sure you want to delete this {!isBuyer && viewMode === 'products' ? 'product' : 'RFQ'}?
                            </p>
                            {itemToDelete && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-1">
                                        {'name' in itemToDelete ? itemToDelete.name : itemToDelete.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">{itemToDelete.description}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="text-xs">
                                            {itemToDelete.category}
                                        </Badge>
                                        <Badge
                                            variant={('inStock' in itemToDelete ? itemToDelete.inStock : itemToDelete.status === "open") ? "default" : "secondary"}
                                            className={`text-xs ${('inStock' in itemToDelete ? itemToDelete.inStock : itemToDelete.status === "open") ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}`}
                                        >
                                            {'inStock' in itemToDelete
                                                ? (itemToDelete.inStock ? 'In Stock' : 'Out of Stock')
                                                : itemToDelete.status
                                            }
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={handleDeleteCancel}
                                disabled={deleting === itemToDelete?.id}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteConfirm}
                                disabled={deleting === itemToDelete?.id}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {deleting === itemToDelete?.id ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Deleting...
                                    </div>
                                ) : (
                                    `Delete ${!isBuyer && viewMode === 'products' ? 'Product' : 'RFQ'}`
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
