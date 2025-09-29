"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import PageTitle from "@/components/ui/page-title";
import { usePopup } from "@/contexts/PopupContext";
// import { Package } from "lucide-react"; // COMMENTED OUT - not used

interface Supplier {
    id: string;
    name: string;
    company: string;
    country: string;
    industry: string;
    verified: boolean;
    rating: number;
    totalOrders: number;
    viewCount: number;
    responseTime: string;
    minOrderValue: number;
    currency: string;
    description: string;
    specialties: string[];
    certifications: string[];
    establishedYear: number;
    employees: string;
    website?: string;
    logo?: string;
    joinedDate: string;
    lastActive: string;
}

export default function SuppliersPage() {
    const { data: session } = useSession();
    const { setIsPopupActive } = usePopup();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIndustry, setSelectedIndustry] = useState("all");
    const [selectedCountry, setSelectedCountry] = useState("all");
    const [sortBy, setSortBy] = useState("rating");
    const [showOverlay, setShowOverlay] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(10);

    // Fetch suppliers from database
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const params = new URLSearchParams({
                    page: "1",
                    limit: "50",
                    ...(searchTerm && { search: searchTerm }),
                    ...(selectedIndustry !== "all" && { industry: selectedIndustry }),
                    ...(selectedCountry !== "all" && { country: selectedCountry }),
                    sortBy,
                });

                const response = await fetch(`/api/suppliers?${params}`);
                const result = await response.json();

                if (result.success) {
                    // Transform database data to match component interface
                    const transformedSuppliers = result.data.suppliers.map((supplier: {
                        id: string;
                        companyName: string;
                        country: string;
                        industry: string;
                        specialties: string[];
                        rating: number;
                        totalOrders: number;
                        verified: boolean;
                        responseTime: string;
                        minOrderValue: number;
                        currency: string;
                        description: string;
                        certifications: string[];
                        establishedYear: number;
                        employees: string;
                        website: string;
                        createdAt: string;
                        updatedAt: string;
                        lastActive: string;
                        user: { name: string; email: string };
                    }) => ({
                        id: supplier.id,
                        name: supplier.user?.name || "N/A",
                        company: supplier.companyName,
                        country: supplier.country,
                        industry: supplier.industry,
                        verified: supplier.verified,
                        rating: parseFloat(supplier.rating.toString()),
                        totalOrders: supplier.totalOrders,
                        viewCount: 'viewCount' in supplier ? (supplier as { viewCount: number }).viewCount : 0,
                        responseTime: supplier.responseTime || "N/A",
                        minOrderValue: supplier.minOrderValue ? parseFloat(supplier.minOrderValue.toString()) : 0,
                        currency: supplier.currency || "USD",
                        description: supplier.description || "",
                        specialties: supplier.specialties || [],
                        certifications: supplier.certifications || [],
                        establishedYear: supplier.establishedYear || 0,
                        employees: supplier.employees || "N/A",
                        website: supplier.website,
                        joinedDate: supplier.createdAt,
                        lastActive: supplier.lastActive || supplier.updatedAt,
                    }));

                    setSuppliers(transformedSuppliers);
                    setFilteredSuppliers(transformedSuppliers);

                    // Show message if no data and there's a helpful message
                    if (result.message) {
                        console.log(result.message);
                    }
                } else {
                    console.error("Failed to fetch suppliers:", result.error);
                    setSuppliers([]);
                    setFilteredSuppliers([]);
                }
            } catch (error) {
                console.error("Error fetching suppliers:", error);
                setSuppliers([]);
                setFilteredSuppliers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, [searchTerm, selectedIndustry, selectedCountry, sortBy]);

    // Filter and search functionality
    useEffect(() => {
        let filtered = suppliers;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (supplier) =>
                    supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    supplier.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    supplier.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    supplier.specialties.some(specialty =>
                        specialty.toLowerCase().includes(searchTerm.toLowerCase())
                    )
            );
        }

        // Industry filter
        if (selectedIndustry !== "all") {
            filtered = filtered.filter((supplier) => supplier.industry === selectedIndustry);
        }

        // Country filter
        if (selectedCountry !== "all") {
            filtered = filtered.filter((supplier) => supplier.country === selectedCountry);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "rating":
                    return b.rating - a.rating;
                case "orders":
                    return b.totalOrders - a.totalOrders;
                case "newest":
                    return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
                case "oldest":
                    return new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
                case "verified":
                    return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
                default:
                    return 0;
            }
        });

        setFilteredSuppliers(filtered);
    }, [suppliers, searchTerm, selectedIndustry, selectedCountry, sortBy]);

    // Timer effect for overlay - only for non-logged-in users
    useEffect(() => {
        if (session) {
            setShowOverlay(false);
            setIsPopupActive(false);
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    setShowOverlay(true);
                    setIsPopupActive(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [session, setIsPopupActive]);

    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return "text-green-600";
        if (rating >= 4.0) return "text-blue-600";
        if (rating >= 3.5) return "text-yellow-600";
        return "text-red-600";
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading suppliers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative">
            <PageTitle
                title="Suppliers | TradeMart - Find Verified Suppliers Worldwide"
                description="Browse verified suppliers on TradeMart. Find manufacturers, wholesalers, and distributors for your business needs."
            />


            {/* Auth overlay - only for non-logged-in users */}
            {!session && showOverlay && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Sign In Required</h2>
                            <p className="text-gray-600 text-sm">
                                Sign in to view detailed supplier information and contact suppliers.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Link href="/auth/signin" className="block">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/auth/signup" className="block">
                                <Button variant="outline" className="w-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 font-semibold transition-all duration-300 rounded-lg">
                                    Create Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className={`bg-white border-b border-gray-200 transition-all duration-500 ${!session && showOverlay ? 'blur-sm opacity-50' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Verified Suppliers
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Connect with trusted suppliers worldwide. Find verified manufacturers,
                            wholesalers, and service providers for your business needs.
                        </p>

                        {/* Timer display - only for non-logged-in users */}
                        {!session && !showOverlay && timeRemaining > 0 && (
                            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Free preview ends in {timeRemaining} seconds
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            <div className="bg-blue-50 rounded-lg p-6">
                                <div className="text-3xl font-bold text-blue-600 mb-2">{suppliers.length}</div>
                                <div className="text-gray-600">Total Suppliers</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-6">
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {suppliers.filter(s => s.verified).length}
                                </div>
                                <div className="text-gray-600">Verified Suppliers</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-6">
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    {suppliers.reduce((sum, s) => sum + s.totalOrders, 0).toLocaleString()}
                                </div>
                                <div className="text-gray-600">Total Orders</div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">
                                    {(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)}
                                </div>
                                <div className="text-gray-600">Avg Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Creation Card - COMMENTED OUT */}
            {/* <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            </div> */}

            {/* Filters */}
            <div className={`bg-white border-b border-gray-200 sticky top-16 z-40 transition-all duration-500 ${!session && showOverlay ? 'blur-sm opacity-50' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search suppliers by company, name, industry, or specialties..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Industries</SelectItem>
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

                            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Countries</SelectItem>
                                    <SelectItem value="China">China</SelectItem>
                                    <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                                    <SelectItem value="Mexico">Mexico</SelectItem>
                                    <SelectItem value="Vietnam">Vietnam</SelectItem>
                                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                    <SelectItem value="Germany">Germany</SelectItem>
                                    <SelectItem value="Turkey">Turkey</SelectItem>
                                    <SelectItem value="Japan">Japan</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rating">Highest Rating</SelectItem>
                                    <SelectItem value="orders">Most Orders</SelectItem>
                                    <SelectItem value="verified">Verified First</SelectItem>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="oldest">Oldest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Suppliers List */}
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-500 ${!session && showOverlay ? 'blur-sm opacity-50' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSuppliers.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Suppliers Found</h3>
                            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                        </div>
                    ) : (
                        filteredSuppliers.map((supplier) => (
                            <Card key={supplier.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md flex flex-col h-full">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg mb-1">{supplier.company}</CardTitle>
                                            <CardDescription className="text-sm">
                                                {supplier.name} • {supplier.country}
                                            </CardDescription>
                                        </div>
                                        <div className="flex flex-col items-end space-y-1">
                                            {supplier.verified && (
                                                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                                    ✓ Verified
                                                </Badge>
                                            )}
                                            <div className={`text-sm font-semibold ${getRatingColor(supplier.rating)}`}>
                                                ⭐ {supplier.rating}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col flex-grow">
                                    <div className="space-y-4 flex-grow">
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {supplier.description}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Industry:</span>
                                                <div className="font-medium">{supplier.industry}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Established:</span>
                                                <div className="font-medium">{supplier.establishedYear}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Orders:</span>
                                                <div className="font-medium">{supplier.totalOrders.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Views:</span>
                                                <div className="font-medium">{supplier.viewCount.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Response:</span>
                                                <div className="font-medium">{supplier.responseTime}</div>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-sm text-gray-600 mb-2 block">Specialties:</span>
                                            <div className="flex flex-wrap gap-1">
                                                {supplier.specialties.slice(0, 3).map((specialty, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {specialty}
                                                    </Badge>
                                                ))}
                                                {supplier.specialties.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{supplier.specialties.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-sm text-gray-600 mb-2 block">Certifications:</span>
                                            <div className="flex flex-wrap gap-1">
                                                {supplier.certifications.slice(0, 2).map((cert, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                        {cert}
                                                    </Badge>
                                                ))}
                                                {supplier.certifications.length > 2 && (
                                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                        +{supplier.certifications.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200 mt-auto">
                                            <div className="text-sm text-gray-600 mb-3">
                                                Min Order: {supplier.currency} {supplier.minOrderValue.toLocaleString()}
                                            </div>
                                            <div className="flex gap-2">
                                                <Link href={`/suppliers/${supplier.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        View Profile
                                                    </Button>
                                                </Link>
                                                <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                                    Contact
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
