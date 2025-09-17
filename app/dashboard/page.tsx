"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [rfqs, setRfqs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    useEffect(() => {
        if (session) {
            fetchRfqs();
        }
    }, [session]);

    const fetchRfqs = async () => {
        try {
            const response = await fetch("/api/rfqs");
            const data = await response.json();
            setRfqs(data.rfqs || []);
        } catch (error) {
            console.error("Error fetching RFQs:", error);
        } finally {
            setLoading(false);
        }
    };


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

                <div className="grid gap-6">
                    <Card className="p-6 shadow-lg border-0">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">📋</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {isBuyer ? "Your RFQs" : "Open RFQs"}
                                </h2>
                                <p className="text-gray-600">
                                    {isBuyer
                                        ? "Track the status of your requests for quotation"
                                        : "Browse and quote on open requests"
                                    }
                                </p>
                            </div>
                        </div>

                        {rfqs.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-gray-400 text-2xl">📋</span>
                                </div>
                                <p className="text-gray-500 text-lg">
                                    {isBuyer
                                        ? "No RFQs found. Create your first RFQ to get started."
                                        : "No open RFQs available at the moment."
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {rfqs.slice(0, 5).map((rfq: { id: string; title: string; description: string; category: string; status: string; createdAt: string; _count: { quotes: number } }) => (
                                    <div key={rfq.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 text-lg mb-2">{rfq.title}</h3>
                                                <p className="text-gray-600 mb-4 line-clamp-2">
                                                    {rfq.description}
                                                </p>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <Badge variant="outline" className="text-xs">
                                                        {rfq.category}
                                                    </Badge>
                                                    <Badge
                                                        variant={rfq.status === "open" ? "default" : "secondary"}
                                                        className={rfq.status === "open" ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}
                                                    >
                                                        {rfq.status}
                                                    </Badge>
                                                    {isBuyer && (
                                                        <span className="text-sm text-gray-500">
                                                            {rfq._count.quotes} quotes
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right ml-6">
                                                <p className="text-sm text-gray-500 mb-3">
                                                    {new Date(rfq.createdAt).toLocaleDateString()}
                                                </p>
                                                <Link href={`/rfq/${rfq.id}`}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                                                    >
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
