"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLoanForm } from "@/contexts/LoanFormContext";
import {
    CheckCircle,
    CreditCard,
    ArrowLeft,
    Building2
} from "lucide-react";

export default function DashboardLoanApplicationPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { formData, updateFormData, clearFormData } = useLoanForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Form data will be automatically loaded by the context provider

    // Redirect if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    const handleInputChange = (field: string, value: string) => {
        updateFormData({ [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/loans/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                setSubmitStatus('success');
                // Clear form data after successful submission
                clearFormData();
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting loan application:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Link href="/dashboard">
                                    <Button variant="outline" size="sm">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Dashboard
                                    </Button>
                                </Link>
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                    <Building2 className="w-4 h-4 mr-1" />
                                    Loan Application
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Complete Your Loan Application
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Your form data has been saved. Please complete and submit your loan application.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                        <CardTitle className="flex items-center">
                            <CreditCard className="w-6 h-6 mr-2" />
                            Loan Application Form
                        </CardTitle>
                        <CardDescription className="text-green-100">
                            All information is secure and will only be shared with our banking partners
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        {submitStatus === 'success' && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                    <span className="text-green-800 font-medium">Application submitted successfully! Our partners will contact you within 24 hours.</span>
                                </div>
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <span className="text-red-800 font-medium">There was an error submitting your application. Please try again.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="fullName">Full Name *</Label>
                                    <Input
                                        id="fullName"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        required
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="company">Company Name *</Label>
                                    <Input
                                        id="company"
                                        value={formData.company}
                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                        required
                                        placeholder="Enter your company name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="businessType">Business Type *</Label>
                                    <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select business type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                            <SelectItem value="retail">Retail</SelectItem>
                                            <SelectItem value="wholesale">Wholesale</SelectItem>
                                            <SelectItem value="services">Services</SelectItem>
                                            <SelectItem value="technology">Technology</SelectItem>
                                            <SelectItem value="agriculture">Agriculture</SelectItem>
                                            <SelectItem value="construction">Construction</SelectItem>
                                            <SelectItem value="healthcare">Healthcare</SelectItem>
                                            <SelectItem value="education">Education</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="loanAmount">Loan Amount Required *</Label>
                                    <Select value={formData.loanAmount} onValueChange={(value) => handleInputChange('loanAmount', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select loan amount" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10000-50000">$10,000 - $50,000</SelectItem>
                                            <SelectItem value="50000-100000">$50,000 - $100,000</SelectItem>
                                            <SelectItem value="100000-250000">$100,000 - $250,000</SelectItem>
                                            <SelectItem value="250000-500000">$250,000 - $500,000</SelectItem>
                                            <SelectItem value="500000-1000000">$500,000 - $1,000,000</SelectItem>
                                            <SelectItem value="1000000+">$1,000,000+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="currency">Preferred Currency *</Label>
                                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">🇺🇸 USD - US Dollar</SelectItem>
                                        <SelectItem value="EUR">🇪🇺 EUR - Euro</SelectItem>
                                        <SelectItem value="GBP">🇬🇧 GBP - British Pound</SelectItem>
                                        <SelectItem value="JPY">🇯🇵 JPY - Japanese Yen</SelectItem>
                                        <SelectItem value="CAD">🇨🇦 CAD - Canadian Dollar</SelectItem>
                                        <SelectItem value="AUD">🇦🇺 AUD - Australian Dollar</SelectItem>
                                        <SelectItem value="CHF">🇨🇭 CHF - Swiss Franc</SelectItem>
                                        <SelectItem value="CNY">🇨🇳 CNY - Chinese Yuan</SelectItem>
                                        <SelectItem value="AED">🇦🇪 AED - UAE Dirham</SelectItem>
                                        <SelectItem value="SAR">🇸🇦 SAR - Saudi Riyal</SelectItem>
                                        <SelectItem value="QAR">🇶🇦 QAR - Qatari Riyal</SelectItem>
                                        <SelectItem value="KWD">🇰🇼 KWD - Kuwaiti Dinar</SelectItem>
                                        <SelectItem value="BHD">🇧🇭 BHD - Bahraini Dinar</SelectItem>
                                        <SelectItem value="OMR">🇴🇲 OMR - Omani Rial</SelectItem>
                                        <SelectItem value="JOD">🇯🇴 JOD - Jordanian Dinar</SelectItem>
                                        <SelectItem value="LBP">🇱🇧 LBP - Lebanese Pound</SelectItem>
                                        <SelectItem value="EGP">🇪🇬 EGP - Egyptian Pound</SelectItem>
                                        <SelectItem value="MAD">🇲🇦 MAD - Moroccan Dirham</SelectItem>
                                        <SelectItem value="TND">🇹🇳 TND - Tunisian Dinar</SelectItem>
                                        <SelectItem value="DZD">🇩🇿 DZD - Algerian Dinar</SelectItem>
                                        <SelectItem value="LYD">🇱🇾 LYD - Libyan Dinar</SelectItem>
                                        <SelectItem value="SDG">🇸🇩 SDG - Sudanese Pound</SelectItem>
                                        <SelectItem value="INR">🇮🇳 INR - Indian Rupee</SelectItem>
                                        <SelectItem value="PKR">🇵🇰 PKR - Pakistani Rupee</SelectItem>
                                        <SelectItem value="BDT">🇧🇩 BDT - Bangladeshi Taka</SelectItem>
                                        <SelectItem value="LKR">🇱🇰 LKR - Sri Lankan Rupee</SelectItem>
                                        <SelectItem value="NPR">🇳🇵 NPR - Nepalese Rupee</SelectItem>
                                        <SelectItem value="BRL">🇧🇷 BRL - Brazilian Real</SelectItem>
                                        <SelectItem value="ARS">🇦🇷 ARS - Argentine Peso</SelectItem>
                                        <SelectItem value="MXN">🇲🇽 MXN - Mexican Peso</SelectItem>
                                        <SelectItem value="RUB">🇷🇺 RUB - Russian Ruble</SelectItem>
                                        <SelectItem value="ZAR">🇿🇦 ZAR - South African Rand</SelectItem>
                                        <SelectItem value="NGN">🇳🇬 NGN - Nigerian Naira</SelectItem>
                                        <SelectItem value="KES">🇰🇪 KES - Kenyan Shilling</SelectItem>
                                        <SelectItem value="GHS">🇬🇭 GHS - Ghanaian Cedi</SelectItem>
                                        <SelectItem value="ETB">🇪🇹 ETB - Ethiopian Birr</SelectItem>
                                        <SelectItem value="UGX">🇺🇬 UGX - Ugandan Shilling</SelectItem>
                                        <SelectItem value="TZS">🇹🇿 TZS - Tanzanian Shilling</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="loanPurpose">Purpose of Loan *</Label>
                                <Select value={formData.loanPurpose} onValueChange={(value) => handleInputChange('loanPurpose', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select loan purpose" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="working-capital">Working Capital</SelectItem>
                                        <SelectItem value="equipment-purchase">Equipment Purchase</SelectItem>
                                        <SelectItem value="expansion">Business Expansion</SelectItem>
                                        <SelectItem value="inventory">Inventory Purchase</SelectItem>
                                        <SelectItem value="refinancing">Debt Refinancing</SelectItem>
                                        <SelectItem value="real-estate">Real Estate</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="monthlyRevenue">Monthly Revenue *</Label>
                                    <Select value={formData.monthlyRevenue} onValueChange={(value) => handleInputChange('monthlyRevenue', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select monthly revenue" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0-5000">$0 - $5,000</SelectItem>
                                            <SelectItem value="5000-15000">$5,000 - $15,000</SelectItem>
                                            <SelectItem value="15000-50000">$15,000 - $50,000</SelectItem>
                                            <SelectItem value="50000-100000">$50,000 - $100,000</SelectItem>
                                            <SelectItem value="100000-250000">$100,000 - $250,000</SelectItem>
                                            <SelectItem value="250000+">$250,000+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="businessAge">Business Age *</Label>
                                    <Select value={formData.businessAge} onValueChange={(value) => handleInputChange('businessAge', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select business age" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0-1">Less than 1 year</SelectItem>
                                            <SelectItem value="1-2">1-2 years</SelectItem>
                                            <SelectItem value="2-5">2-5 years</SelectItem>
                                            <SelectItem value="5-10">5-10 years</SelectItem>
                                            <SelectItem value="10+">10+ years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="country">Country *</Label>
                                    <Input
                                        id="country"
                                        value={formData.country}
                                        onChange={(e) => handleInputChange('country', e.target.value)}
                                        required
                                        placeholder="Enter your country"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        required
                                        placeholder="Enter your city"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="additionalInfo">Additional Information</Label>
                                <Textarea
                                    id="additionalInfo"
                                    value={formData.additionalInfo}
                                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                                    placeholder="Tell us more about your business and loan requirements..."
                                    rows={4}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 text-lg font-semibold"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Submitting Application...
                                    </div>
                                ) : (
                                    'Submit Loan Application'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
