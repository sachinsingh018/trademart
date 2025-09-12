"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600 font-medium">
                                Welcome, {session.user.name}
                            </span>
                            <Badge
                                variant={isBuyer ? "default" : "secondary"}
                                className={isBuyer ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-green-100 text-green-800 border-green-200"}
                            >
                                {session.user.role}
                            </Badge>
                            <Button
                                variant="outline"
                                className="border-gray-200 hover:border-red-300 hover:text-red-600 transition-colors"
                                onClick={() => {
                                    window.location.href = "/api/auth/signout";
                                }}
                            >
                                Sign Out
                            </Button>
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
                                <Link href="/rfq/create">
                                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                                        Create RFQ
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
