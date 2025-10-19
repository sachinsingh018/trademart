"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import PageTitle from "@/components/ui/page-title";
import { usePopup } from "@/contexts/PopupContext";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { detectLocale, getMessages, useLanguageChange } from '@/lib/i18n';
import SmoothTransition from '@/components/ui/smooth-transition';
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
    phone?: string;
    joinedDate: string;
    lastActive: string;
}

// Supplier Card Component with expand/collapse functionality
function SupplierCard({ supplier, getRatingColor, warning, t }: { supplier: Supplier, getRatingColor: (rating: number) => string, warning: (message: string, title: string) => void, t: (key: string) => string }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
            {/* Top Accent Gradient */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-green-400 to-blue-600 opacity-60"></div>

            <div className="p-5 sm:p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                            {supplier.company}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                            {supplier.name} • {supplier.country}
                        </p>
                    </div>

                    <div className="text-right">
                        {supplier.verified && (
                            <span className="inline-flex items-center bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full border border-green-100">
                                ✓ Verified
                            </span>
                        )}
                        <div className={`text-xs sm:text-sm font-semibold mt-1 ${getRatingColor(supplier.rating)}`}>
                            ⭐ {supplier.rating}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {supplier.description || "No description provided."}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
                    <div className="bg-slate-50 rounded-lg p-2">
                        <span className="block text-gray-500 text-[11px] uppercase tracking-wide">
                            Industry
                        </span>
                        <span className="font-medium text-gray-800">{supplier.industry}</span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                        <span className="block text-gray-500 text-[11px] uppercase tracking-wide">
                            Orders
                        </span>
                        <span className="font-medium text-gray-800">{supplier.totalOrders.toLocaleString()}</span>
                    </div>
                </div>

                {/* Expandable Section */}
                {isExpanded && (
                    <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">{t('established')}:</span>
                            <span className="font-medium text-gray-800">{supplier.establishedYear}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">{t('response')}:</span>
                            <span className="font-medium text-gray-800">{supplier.responseTime}</span>
                        </div>

                        {supplier.website && (
                            <div className="truncate text-blue-600 hover:underline">
                                <Link href={supplier.website} target="_blank">
                                    {supplier.website}
                                </Link>
                            </div>
                        )}

                        {supplier.specialties && supplier.specialties.length > 0 && (
                            <div>
                                <span className="block text-gray-500 text-xs mb-1">{t('specialties')}</span>
                                <div className="flex flex-wrap gap-1">
                                    {supplier.specialties.slice(0, 3).map((specialty, index) => (
                                        <Badge key={index} variant="outline" className="text-[11px]">
                                            {specialty}
                                        </Badge>
                                    ))}
                                    {supplier.specialties.length > 3 && (
                                        <Badge variant="outline" className="text-[11px]">
                                            +{supplier.specialties.length - 3} {t('more')}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer Actions */}
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        {isExpanded ? t('showLess') : t('showMore')}
                    </button>

                    <div className="flex gap-2">
                        <Link href={`/suppliers/${supplier.id}`}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs sm:text-sm h-8 px-3 border-gray-300 hover:bg-gray-100"
                            >
                                View
                            </Button>
                        </Link>
                        <Button
                            size="sm"
                            className="text-xs sm:text-sm h-8 px-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-sm"
                            onClick={() => {
                                if (supplier.phone) {
                                    window.open(`https://wa.me/${supplier.phone.replace(/\D/g, "")}`, "_blank");
                                } else {
                                    warning(
                                        "This supplier hasn't provided their contact information yet.",
                                        "Contact Information Unavailable"
                                    );
                                }
                            }}
                        >
                            Contact
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SuppliersPage() {
    const { data: session } = useSession();
    const { setIsPopupActive } = usePopup();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const { toasts, removeToast, warning } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIndustry, setSelectedIndustry] = useState("all");
    const [selectedCountry, setSelectedCountry] = useState("all");
    const [sortBy, setSortBy] = useState("rating");
    const [showOverlay, setShowOverlay] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(10);

    // Translation setup
    const [locale, setLocale] = useState('en');
    const [messages, setMessages] = useState(getMessages('en'));

    useEffect(() => {
        const detectedLocale = detectLocale();
        setLocale(detectedLocale);
        setMessages(getMessages(detectedLocale));
    }, []);

    // Listen for language changes with smooth transition
    useLanguageChange((newLocale: string) => {
        setLocale(newLocale);
        setMessages(getMessages(newLocale));
    });

    // Helper functions for translations
    const t = (key: string) => messages.suppliers?.[key as keyof typeof messages.suppliers] || messages.common?.[key as keyof typeof messages.common] || key;

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
        console.log('Timer effect running, session:', !!session);

        if (session) {
            setShowOverlay(false);
            setIsPopupActive(false);
            setTimeRemaining(10); // Reset timer
            return;
        }

        // Reset timer when component mounts
        setTimeRemaining(10);
        setShowOverlay(false);
        console.log('Starting 10-second timer...');

        // Use setTimeout instead of setInterval for more reliability
        const timer = setTimeout(() => {
            console.log('Timer completed, showing overlay');
            setShowOverlay(true);
            setIsPopupActive(true);
            setTimeRemaining(0);
        }, 10000); // Exactly 10 seconds

        // Optional: Update countdown every second for visual feedback
        const countdownTimer = setInterval(() => {
            setTimeRemaining(prev => {
                const newValue = prev - 1;
                if (newValue <= 0) {
                    clearInterval(countdownTimer);
                }
                return newValue;
            });
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(countdownTimer);
        };
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
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <PageTitle
                title="Suppliers | TradeMart - Find Verified Suppliers Worldwide"
                description="Browse verified suppliers on TradeMart. Find manufacturers, wholesalers, and distributors for your business needs."
            />


            {/* Auth overlay - only for non-logged-in users */}
            {!session && showOverlay && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
                    {/* Mobile-optimized overlay with stronger blur */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" style={{ backdropFilter: 'blur(4px)' }}></div>
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('signInRequired')}</h2>
                            <p className="text-gray-600 text-sm">
                                {t('signInToViewSuppliers')}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Link href="/auth/signin" className="block">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
                                    {t('signIn')}
                                </Button>
                            </Link>
                            <Link href="/auth/signup" className="block">
                                <Button variant="outline" className="w-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 font-semibold transition-all duration-300 rounded-lg">
                                    {t('createAccount')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div
                className={`relative bg-white border-b border-gray-100 transition-all duration-500 ${!session && showOverlay ? "blur-sm opacity-50" : ""
                    }`}
            >
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                    <div className="text-center">
                        {/* Gradient Title */}
                        <SmoothTransition>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-green-500 to-blue-700 bg-clip-text text-transparent mb-3 sm:mb-5 tracking-tight">
                                {t('verifiedSuppliers')}
                            </h1>

                            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
                                {t('suppliersDescription')}
                            </p>
                        </SmoothTransition>

                        {/* Timer display for guest users */}
                        {!session && !showOverlay && timeRemaining > 0 && (
                            <div className="inline-flex items-center bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-full text-sm font-medium mb-10 transition-all duration-300 hover:bg-blue-100">
                                <svg
                                    className="w-4 h-4 mr-2 text-blue-600 animate-spin-slow"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {t('freePreviewEndsIn')} {timeRemaining}s
                            </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
                            {/* Total Suppliers */}
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md p-5 sm:p-6">
                                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                                    {suppliers.length}
                                </div>
                                <div className="text-xs sm:text-sm font-medium text-gray-500">
                                    {t('totalSuppliers')}
                                </div>
                            </div>

                            {/* Verified */}
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md p-5 sm:p-6">
                                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                                    {suppliers.filter((s) => s.verified).length}
                                </div>
                                <div className="text-xs sm:text-sm font-medium text-gray-500">
                                    {t('verified')}
                                </div>
                            </div>

                            {/* Total Orders */}
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md p-5 sm:p-6">
                                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
                                    {suppliers
                                        .reduce((sum, s) => sum + s.totalOrders, 0)
                                        .toLocaleString()}
                                </div>
                                <div className="text-xs sm:text-sm font-medium text-gray-500">
                                    {t('totalOrders')}
                                </div>
                            </div>

                            {/* Average Rating */}
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md p-5 sm:p-6">
                                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">
                                    {(
                                        suppliers.reduce((sum, s) => sum + s.rating, 0) /
                                        suppliers.length || 0
                                    ).toFixed(1)}
                                </div>
                                <div className="text-xs sm:text-sm font-medium text-gray-500">
                                    {t('avgRating')}
                                </div>
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder={t('searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder={t('industry')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('allIndustries')}</SelectItem>
                                    <SelectItem value="Electronics">{t('electronics')}</SelectItem>
                                    <SelectItem value="Textiles">{t('textiles')}</SelectItem>
                                    <SelectItem value="Manufacturing">{t('manufacturing')}</SelectItem>
                                    <SelectItem value="Automotive">{t('automotive')}</SelectItem>
                                    <SelectItem value="Chemicals">{t('chemicals')}</SelectItem>
                                    <SelectItem value="Food & Beverage">{t('foodBeverage')}</SelectItem>
                                    <SelectItem value="Construction">{t('construction')}</SelectItem>
                                    <SelectItem value="Healthcare">{t('healthcare')}</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder={t('country')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('allCountries')}</SelectItem>
                                    <SelectItem value="China">{t('china')}</SelectItem>
                                    <SelectItem value="Bangladesh">{t('bangladesh')}</SelectItem>
                                    <SelectItem value="Mexico">{t('mexico')}</SelectItem>
                                    <SelectItem value="Vietnam">{t('vietnam')}</SelectItem>
                                    <SelectItem value="United Kingdom">{t('unitedKingdom')}</SelectItem>
                                    <SelectItem value="Germany">{t('germany')}</SelectItem>
                                    <SelectItem value="Turkey">{t('turkey')}</SelectItem>
                                    <SelectItem value="Japan">{t('japan')}</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder={t('sortBy')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rating">{t('highestRating')}</SelectItem>
                                    <SelectItem value="orders">{t('mostOrders')}</SelectItem>
                                    <SelectItem value="verified">{t('verifiedFirst')}</SelectItem>
                                    <SelectItem value="newest">{t('newest')}</SelectItem>
                                    <SelectItem value="oldest">{t('oldest')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Suppliers List */}
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 transition-all duration-500 ${!session && showOverlay ? 'blur-sm opacity-50' : ''}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {filteredSuppliers.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('noSuppliersFound')}</h3>
                            <p className="text-gray-600">{t('tryAdjustingSearch')}</p>
                        </div>
                    ) : (
                        filteredSuppliers.map((supplier) => (
                            <SupplierCard key={supplier.id} supplier={supplier} getRatingColor={getRatingColor} warning={warning} t={t} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
