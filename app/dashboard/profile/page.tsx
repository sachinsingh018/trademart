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
import { ArrowLeft, Save, User, Mail, Building, MapPin, Phone, Globe } from "lucide-react";
import { useToast, ToastContainer } from "@/components/ui/toast";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    company: string;
    industry: string;
    businessType: string;
    website: string;
    description: string;
    country: string;
    city: string;
    address: string;
    postalCode: string;
    contactPhone: string;
    contactEmail: string;
    verified: boolean;
    rating: number;
    totalOrders: number;
    establishedYear: number | null;
    employees: string;
    specialties: string[];
    certifications: string[];
    companyLogo: string;
    businessInfo: Record<string, unknown> | null;
    createdAt: string;
}

export default function EditProfile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toasts, removeToast, success, error } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        industry: '',
        businessType: '',
        website: '',
        description: '',
        country: '',
        city: '',
        address: '',
        postalCode: '',
        contactPhone: '',
        contactEmail: '',
        establishedYear: '',
        employees: '',
        specialties: [] as string[],
        certifications: [] as string[],
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    useEffect(() => {
        if (session) {
            fetchProfile();
        }
    }, [session]);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/user/profile');
            const data = await response.json();

            if (data.success) {
                const profileData = data.data;
                setProfile(profileData);
                setFormData({
                    name: profileData.name || '',
                    email: profileData.email || '',
                    phone: profileData.phone || '',
                    company: profileData.company || '',
                    industry: profileData.industry || '',
                    businessType: profileData.businessType || '',
                    website: profileData.website || '',
                    description: profileData.description || '',
                    country: profileData.country || '',
                    city: profileData.city || '',
                    address: profileData.address || '',
                    postalCode: profileData.postalCode || '',
                    contactPhone: profileData.contactPhone || '',
                    contactEmail: profileData.contactEmail || '',
                    establishedYear: profileData.establishedYear?.toString() || '',
                    employees: profileData.employees || '',
                    specialties: profileData.specialties || [],
                    certifications: profileData.certifications || [],
                });
            } else {
                console.error("Error fetching profile:", data.error);
                error('Failed to load profile data. Please try again.', 'Error Loading Profile');
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            error('Failed to load profile data. Please try again.', 'Error Loading Profile');
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

            // Create a copy of formData without the email field since it's not editable
            const { email, ...updateData } = formData;

            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (data.success) {
                success(
                    'Your profile has been updated successfully! All changes have been saved.',
                    'Profile Updated Successfully! 🎉'
                );
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } else {
                error(
                    `Failed to update profile: ${data.error || 'Unknown error'}`,
                    'Update Failed'
                );
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            error(
                'Failed to update profile. Please check your connection and try again.',
                'Network Error'
            );
        } finally {
            setSaving(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading profile...</p>
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
            <ToastContainer toasts={toasts} onRemove={removeToast} />
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
                                        {session.user.name?.split(' ')[0]}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {isBuyer ? 'Buyer' : 'Supplier'} Profile
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

                            {/* Back to Dashboard Button */}
                            <Link href="/dashboard">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="group border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                                    <span className="ml-2 hidden sm:inline">Dashboard</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Edit Profile
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Update your account information and preferences
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription>
                                    Update your personal details and contact information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Name and Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="bg-gray-50 cursor-not-allowed"
                                            placeholder="Email cannot be changed"
                                        />
                                    </div>
                                </div>

                                {/* Company and Industry (for suppliers) */}
                                {!isBuyer && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="company">Company Name</Label>
                                                <Input
                                                    id="company"
                                                    value={formData.company}
                                                    onChange={(e) => handleInputChange('company', e.target.value)}
                                                    placeholder="Enter company name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="industry">Industry</Label>
                                                <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                                                    <SelectTrigger>
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

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="businessType">Business Type</Label>
                                                <Input
                                                    id="businessType"
                                                    value={formData.businessType}
                                                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                                                    placeholder="e.g., Manufacturer, Distributor, Retailer"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="establishedYear">Established Year</Label>
                                                <Input
                                                    id="establishedYear"
                                                    type="number"
                                                    value={formData.establishedYear}
                                                    onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                                                    placeholder="e.g., 2020"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="employees">Number of Employees</Label>
                                            <Select value={formData.employees} onValueChange={(value) => handleInputChange('employees', value)}>
                                                <SelectTrigger>
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
                                    </>
                                )}

                                {/* Location */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            value={formData.country}
                                            onChange={(e) => handleInputChange('country', e.target.value)}
                                            placeholder="Enter your country"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            placeholder="Enter your city"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="postalCode">Postal Code</Label>
                                        <Input
                                            id="postalCode"
                                            value={formData.postalCode}
                                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                            placeholder="Enter postal code"
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        placeholder="Enter your full address"
                                    />
                                </div>

                                {/* Contact Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Personal Phone</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            value={formData.website}
                                            onChange={(e) => handleInputChange('website', e.target.value)}
                                            placeholder="https://yourwebsite.com"
                                        />
                                    </div>
                                </div>

                                {/* Business Contact (for suppliers) */}
                                {!isBuyer && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="contactPhone">Business Phone</Label>
                                            <Input
                                                id="contactPhone"
                                                value={formData.contactPhone}
                                                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                                placeholder="Enter business phone number"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contactEmail">Business Email</Label>
                                            <Input
                                                id="contactEmail"
                                                type="email"
                                                value={formData.contactEmail}
                                                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                                placeholder="Enter business email"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Bio */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        {isBuyer ? 'About You' : 'Company Description'}
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder={isBuyer
                                            ? "Tell us about your business and what you're looking for..."
                                            : "Describe your company, products, and services..."
                                        }
                                        rows={4}
                                    />
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end pt-6">
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        {saving ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Saving...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Save className="w-4 h-4" />
                                                Save Changes
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Profile Summary */}
                        <Card className="shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="text-lg">Profile Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">
                                            {formData.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{formData.name}</p>
                                        <p className="text-sm text-gray-600">{formData.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className={`px-2 py-1 text-xs ${isBuyer
                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                : 'bg-green-50 text-green-700 border-green-200'
                                                }`}
                                        >
                                            {isBuyer ? '👤 Buyer' : '🏭 Supplier'}
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
                                </div>

                                {formData.company && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Building className="w-4 h-4" />
                                        <span>{formData.company}</span>
                                    </div>
                                )}

                                {formData.industry && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Building className="w-4 h-4" />
                                        <span>{formData.industry}</span>
                                    </div>
                                )}

                                {(formData.city || formData.country) && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        <span>{formData.city}{formData.city && formData.country && ', '}{formData.country}</span>
                                    </div>
                                )}

                                {formData.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        <span>{formData.phone}</span>
                                    </div>
                                )}

                                {formData.website && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Globe className="w-4 h-4" />
                                        <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            Visit Website
                                        </a>
                                    </div>
                                )}

                                {!isBuyer && profile && (
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Rating:</span>
                                                <span className="font-medium text-yellow-600">
                                                    ⭐ {profile.rating.toFixed(1)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Total Orders:</span>
                                                <span className="font-medium">{profile.totalOrders}</span>
                                            </div>
                                            {profile.establishedYear && (
                                                <div className="flex justify-between text-sm">
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
                            <CardHeader>
                                <CardTitle className="text-lg">Account Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Member Since:</span>
                                    <span className="font-medium">
                                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Last Updated:</span>
                                    <span className="font-medium">
                                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
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
