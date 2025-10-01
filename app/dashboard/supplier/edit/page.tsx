"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Building, MapPin, Phone, Globe, Mail, Users, Calendar, DollarSign } from "lucide-react";

interface SupplierProfile {
    id: string;
    userId: string;
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
    rating: number | string; // Can be number or string (from DB Decimal)
    totalOrders: number;
    responseTime: string;
    minOrderValue: number | string; // Can be number or string (from DB Decimal)
    currency: string;
    establishedYear: number;
    employees: string;
    specialties: string[];
    certifications: string[];
    contactEmail: string;
    contactPhone: string;
    businessInfo: Record<string, unknown> | null;
    companyLogo: string;
    createdAt: string;
    updatedAt: string;
}

export default function EditSupplier() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<SupplierProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Helper function to safely format rating
    const formatRating = (rating: any): string => {
        if (typeof rating === 'number') {
            return rating.toFixed(1);
        }
        const numRating = parseFloat(rating?.toString() || '0');
        return isNaN(numRating) ? '0.0' : numRating.toFixed(1);
    };
    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        businessType: '',
        website: '',
        description: '',
        country: '',
        city: '',
        address: '',
        postalCode: '',
        phone: '',
        responseTime: '',
        minOrderValue: '',
        currency: 'USD',
        establishedYear: '',
        employees: '',
        specialties: '',
        certifications: '',
        contactEmail: '',
        contactPhone: '',
        annualRevenue: '',
        exportMarkets: '',
        mainProducts: '',
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    useEffect(() => {
        if (session && session.user.role === "supplier") {
            fetchSupplierProfile();
        }
    }, [session]);

    const fetchSupplierProfile = async () => {
        try {
            console.log("Fetching supplier profile for user:", session?.user?.id);
            const response = await fetch('/api/suppliers/profile');
            const data = await response.json();
            console.log("Supplier profile API response:", data);

            if (data.success) {
                const supplierData = data.data;
                console.log("Setting supplier profile data:", supplierData);
                setProfile(supplierData);
                setFormData({
                    companyName: supplierData.companyName || '',
                    industry: supplierData.industry || '',
                    businessType: supplierData.businessType || '',
                    website: supplierData.website || '',
                    description: supplierData.description || '',
                    country: supplierData.country || '',
                    city: supplierData.city || '',
                    address: supplierData.address || '',
                    postalCode: supplierData.postalCode || '',
                    phone: supplierData.phone || '',
                    responseTime: supplierData.responseTime || '',
                    minOrderValue: supplierData.minOrderValue?.toString() || '',
                    currency: supplierData.currency || 'USD',
                    establishedYear: supplierData.establishedYear?.toString() || '',
                    employees: supplierData.employees || '',
                    specialties: supplierData.specialties?.join(', ') || '',
                    certifications: supplierData.certifications?.join(', ') || '',
                    contactEmail: supplierData.contactEmail || '',
                    contactPhone: supplierData.contactPhone || '',
                    annualRevenue: supplierData.businessInfo?.annualRevenue?.toString() || '',
                    exportMarkets: supplierData.businessInfo?.exportMarkets?.join(', ') || '',
                    mainProducts: supplierData.businessInfo?.mainProducts?.join(', ') || '',
                });
            } else {
                console.error("Error fetching supplier profile:", data.error);
                alert('Failed to load supplier profile data. Please try again.');
            }
        } catch (error) {
            console.error("Error fetching supplier profile:", error);
            alert('Failed to load supplier profile data. Please try again.');
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

    const handleSave = async () => {
        try {
            setSaving(true);

            const response = await fetch('/api/suppliers/upsert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Supplier profile updated successfully!');
                router.push('/dashboard');
            } else {
                alert('Failed to update supplier profile: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error("Error updating supplier profile:", error);
            alert('Failed to update supplier profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading supplier profile...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== "supplier") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 font-medium">Access denied. Supplier role required.</p>
                    <Link href="/dashboard">
                        <Button className="mt-4">Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-lg shadow-gray-900/5">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        {/* Logo Section */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center group">
                                <div className="relative">
                                    <Image
                                        src="/logofinal.png"
                                        alt="TradeMart Logo"
                                        width={160}
                                        height={160}
                                        className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-105 transition-all duration-300 drop-shadow-sm"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="ml-2 sm:ml-3 hidden sm:block">
                                    <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                        TradeMart
                                    </h1>
                                    <p className="text-xs text-gray-500 font-medium">B2B Marketplace</p>
                                </div>
                            </Link>
                        </div>

                        {/* User Section */}
                        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
                            {/* Welcome Message - Hidden on mobile */}
                            <div className="hidden lg:flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {session.user.name?.split(' ')[0]}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Supplier Profile
                                    </p>
                                </div>
                            </div>

                            {/* Role Badge - Simplified on mobile */}
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <Badge
                                    variant="outline"
                                    className="px-2 sm:px-3 py-1 text-xs font-semibold border-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors duration-200"
                                >
                                    <span className="hidden sm:inline">🏭 Supplier</span>
                                    <span className="sm:hidden">🏭</span>
                                </Badge>
                            </div>

                            {/* Back to Dashboard Button */}
                            <Link href="/dashboard">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="group border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium px-2 sm:px-3"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                                    <span className="ml-1 sm:ml-2 hidden md:inline">Dashboard</span>
                                    <span className="ml-1 sm:hidden">Back</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Building className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                Edit Supplier Profile
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1 leading-relaxed">
                                Update your company information and business details
                            </p>
                        </div>
                    </div>
                </div>

                {/* Supplier Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Company Information */}
                        <Card className="shadow-lg border-0">
                            <CardHeader className="pb-4 sm:pb-6">
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                    <Building className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Company Information
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    Update your company details and business information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName" className="text-sm font-medium">Company Name *</Label>
                                        <Input
                                            id="companyName"
                                            value={formData.companyName}
                                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                                            placeholder="Enter your company name"
                                            required
                                            className="h-10 sm:h-11 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="industry" className="text-sm font-medium">Industry *</Label>
                                        <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                                            <SelectTrigger className="h-10 sm:h-11 text-sm">
                                                <SelectValue placeholder="Select industry" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                                <SelectItem value="technology">Technology</SelectItem>
                                                <SelectItem value="textiles">Textiles</SelectItem>
                                                <SelectItem value="electronics">Electronics</SelectItem>
                                                <SelectItem value="chemicals">Chemicals</SelectItem>
                                                <SelectItem value="machinery">Machinery</SelectItem>
                                                <SelectItem value="food">Food & Beverage</SelectItem>
                                                <SelectItem value="automotive">Automotive</SelectItem>
                                                <SelectItem value="construction">Construction</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="businessType" className="text-sm font-medium">Business Type</Label>
                                        <Input
                                            id="businessType"
                                            value={formData.businessType}
                                            onChange={(e) => handleInputChange('businessType', e.target.value)}
                                            placeholder="e.g., Manufacturer, Distributor, Retailer"
                                            className="h-10 sm:h-11 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="establishedYear" className="text-sm font-medium">Established Year</Label>
                                        <Input
                                            id="establishedYear"
                                            type="number"
                                            value={formData.establishedYear}
                                            onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                                            placeholder="e.g., 2020"
                                            className="h-10 sm:h-11 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="employees" className="text-sm font-medium">Number of Employees</Label>
                                    <Select value={formData.employees} onValueChange={(value) => handleInputChange('employees', value)}>
                                        <SelectTrigger className="h-10 sm:h-11 text-sm">
                                            <SelectValue placeholder="Select employee count" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1-10">1-10 employees</SelectItem>
                                            <SelectItem value="11-50">11-50 employees</SelectItem>
                                            <SelectItem value="51-200">51-200 employees</SelectItem>
                                            <SelectItem value="201-500">201-500 employees</SelectItem>
                                            <SelectItem value="501-1000">501-1000 employees</SelectItem>
                                            <SelectItem value="1000+">1000+ employees</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-medium">Company Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Describe your company, products, and services..."
                                        rows={4}
                                        className="text-sm resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location Information */}
                        <Card className="shadow-lg border-0">
                            <CardHeader className="pb-4 sm:pb-6">
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Location Information
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    Update your business location details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="country" className="text-sm font-medium">Country *</Label>
                                        <Input
                                            id="country"
                                            value={formData.country}
                                            onChange={(e) => handleInputChange('country', e.target.value)}
                                            placeholder="Enter your country"
                                            required
                                            className="h-10 sm:h-11 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city" className="text-sm font-medium">City *</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            placeholder="Enter your city"
                                            required
                                            className="h-10 sm:h-11 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                                        <Label htmlFor="postalCode" className="text-sm font-medium">Postal Code</Label>
                                        <Input
                                            id="postalCode"
                                            value={formData.postalCode}
                                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                            placeholder="Enter postal code"
                                            className="h-10 sm:h-11 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        placeholder="Enter your full address"
                                        className="h-10 sm:h-11 text-sm"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="shadow-lg border-0">
                            <CardHeader className="pb-4 sm:pb-6">
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Contact Information
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    Update your contact details and communication preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-medium">Primary Phone</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            placeholder="Enter your phone number"
                                            className="h-10 sm:h-11 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                                        <Input
                                            id="website"
                                            value={formData.website}
                                            onChange={(e) => handleInputChange('website', e.target.value)}
                                            placeholder="https://yourwebsite.com"
                                            className="h-10 sm:h-11 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contactPhone" className="text-sm font-medium">Business Phone</Label>
                                        <Input
                                            id="contactPhone"
                                            value={formData.contactPhone}
                                            onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                            placeholder="Enter business phone number"
                                            className="h-10 sm:h-11 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contactEmail" className="text-sm font-medium">Business Email</Label>
                                        <Input
                                            id="contactEmail"
                                            type="email"
                                            value={formData.contactEmail}
                                            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                            placeholder="Enter business email"
                                            className="h-10 sm:h-11 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="responseTime" className="text-sm font-medium">Response Time</Label>
                                    <Select value={formData.responseTime} onValueChange={(value) => handleInputChange('responseTime', value)}>
                                        <SelectTrigger className="h-10 sm:h-11 text-sm">
                                            <SelectValue placeholder="Select response time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="within-1-hour">Within 1 hour</SelectItem>
                                            <SelectItem value="within-4-hours">Within 4 hours</SelectItem>
                                            <SelectItem value="within-24-hours">Within 24 hours</SelectItem>
                                            <SelectItem value="within-2-days">Within 2 days</SelectItem>
                                            <SelectItem value="within-1-week">Within 1 week</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Business Details */}
                        <Card className="shadow-lg border-0">
                            <CardHeader className="pb-4 sm:pb-6">
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Business Details
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    Set your business terms and capabilities
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="minOrderValue" className="text-sm font-medium">Minimum Order Value</Label>
                                        <Input
                                            id="minOrderValue"
                                            type="number"
                                            value={formData.minOrderValue}
                                            onChange={(e) => handleInputChange('minOrderValue', e.target.value)}
                                            placeholder="Enter minimum order value"
                                            className="h-10 sm:h-11 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currency" className="text-sm font-medium">Currency</Label>
                                        <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                                            <SelectTrigger className="h-10 sm:h-11 text-sm">
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                                <SelectItem value="GBP">GBP</SelectItem>
                                                <SelectItem value="INR">INR</SelectItem>
                                                <SelectItem value="CNY">CNY</SelectItem>
                                                <SelectItem value="JPY">JPY</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="specialties" className="text-sm font-medium">Specialties</Label>
                                    <Input
                                        id="specialties"
                                        value={formData.specialties}
                                        onChange={(e) => handleInputChange('specialties', e.target.value)}
                                        placeholder="Enter specialties separated by commas"
                                        className="h-10 sm:h-11 text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="certifications" className="text-sm font-medium">Certifications</Label>
                                    <Input
                                        id="certifications"
                                        value={formData.certifications}
                                        onChange={(e) => handleInputChange('certifications', e.target.value)}
                                        placeholder="Enter certifications separated by commas"
                                        className="h-10 sm:h-11 text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="annualRevenue" className="text-sm font-medium">Annual Revenue</Label>
                                    <Input
                                        id="annualRevenue"
                                        value={formData.annualRevenue}
                                        onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                                        placeholder="Enter annual revenue"
                                        className="h-10 sm:h-11 text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="exportMarkets" className="text-sm font-medium">Export Markets</Label>
                                    <Input
                                        id="exportMarkets"
                                        value={formData.exportMarkets}
                                        onChange={(e) => handleInputChange('exportMarkets', e.target.value)}
                                        placeholder="Enter export markets separated by commas"
                                        className="h-10 sm:h-11 text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mainProducts" className="text-sm font-medium">Main Products</Label>
                                    <Input
                                        id="mainProducts"
                                        value={formData.mainProducts}
                                        onChange={(e) => handleInputChange('mainProducts', e.target.value)}
                                        placeholder="Enter main products separated by commas"
                                        className="h-10 sm:h-11 text-sm"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save Button */}
                        <div className="flex justify-end pt-4 sm:pt-6">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 sm:px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                            >
                                {saving ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm sm:text-base">Saving...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        <span className="text-sm sm:text-base">Save Changes</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Profile Summary */}
                        <Card className="shadow-lg border-0">
                            <CardHeader className="pb-4 sm:pb-6">
                                <CardTitle className="text-base sm:text-lg">Company Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-sm sm:text-lg">
                                            {formData.companyName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{formData.companyName}</p>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">{formData.industry}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        variant="outline"
                                        className="px-2 py-1 text-xs bg-green-50 text-green-700 border-green-200"
                                    >
                                        🏭 Supplier
                                    </Badge>
                                    {profile?.verified && (
                                        <Badge
                                            variant="outline"
                                            className="px-2 py-1 text-xs bg-green-50 text-green-700 border-green-200"
                                        >
                                            ✓ Verified
                                        </Badge>
                                    )}
                                </div>

                                {formData.businessType && (
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                        <Building className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                        <span className="truncate">{formData.businessType}</span>
                                    </div>
                                )}

                                {(formData.city || formData.country) && (
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                        <span className="truncate">{formData.city}{formData.city && formData.country && ', '}{formData.country}</span>
                                    </div>
                                )}

                                {formData.phone && (
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                        <span className="truncate">{formData.phone}</span>
                                    </div>
                                )}

                                {formData.website && (
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                        <Globe className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                        <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                                            Visit Website
                                        </a>
                                    </div>
                                )}

                                {profile && (
                                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs sm:text-sm">
                                                <span className="text-gray-600">Rating:</span>
                                                <span className="font-medium text-yellow-600">
                                                    ⭐ {formatRating(profile.rating)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xs sm:text-sm">
                                                <span className="text-gray-600">Total Orders:</span>
                                                <span className="font-medium">{profile.totalOrders || 0}</span>
                                            </div>
                                            {profile.establishedYear && (
                                                <div className="flex justify-between text-xs sm:text-sm">
                                                    <span className="text-gray-600">Established:</span>
                                                    <span className="font-medium">{profile.establishedYear}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Account Information */}
                        <Card className="shadow-lg border-0">
                            <CardHeader className="pb-4 sm:pb-6">
                                <CardTitle className="text-base sm:text-lg">Account Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 px-3 sm:px-6">
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span className="text-gray-600">Member Since:</span>
                                    <span className="font-medium">
                                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span className="text-gray-600">Last Updated:</span>
                                    <span className="font-medium">
                                        {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span className="text-gray-600">Account Status:</span>
                                    <span className="font-medium text-green-600">Active</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
