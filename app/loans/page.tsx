"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
    Clock,
    DollarSign,
    Shield,
    Users,
    TrendingUp,
    Building2,
    FileText,
    CreditCard,
    LogIn,
    UserPlus
} from "lucide-react";

export default function LoansPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { formData, updateFormData, saveFormDataToStorage } = useLoanForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showAllBanks, setShowAllBanks] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        updateFormData({ [field]: value });
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Validation functions
    const validateEmail = (email: string): string => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const validatePhone = (phone: string): string => {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phone.trim()) return 'Phone number is required';
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'Please enter a valid 10-digit Indian mobile number';
        return '';
    };

    const validateName = (name: string, fieldName: string): string => {
        if (!name.trim()) return `${fieldName} is required`;
        if (name.trim().length < 2) return `${fieldName} must be at least 2 characters long`;
        if (name.trim().length > 100) return `${fieldName} must be less than 100 characters`;
        const nameRegex = /^[a-zA-Z\s\u0900-\u097F]+$/;
        if (!nameRegex.test(name.trim())) return `${fieldName} can only contain letters and spaces`;
        return '';
    };

    const validateRequired = (value: string, fieldName: string): string => {
        if (!value.trim()) return `${fieldName} is required`;
        return '';
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Required field validations
        newErrors.fullName = validateName(formData.fullName, 'Full Name');
        newErrors.email = validateEmail(formData.email);
        newErrors.phone = validatePhone(formData.phone);
        newErrors.company = validateName(formData.company, 'Company Name');
        newErrors.businessType = validateRequired(formData.businessType, 'Business Type');
        newErrors.loanAmount = validateRequired(formData.loanAmount, 'Loan Amount');
        newErrors.currency = validateRequired(formData.currency, 'Currency');
        newErrors.loanPurpose = validateRequired(formData.loanPurpose, 'Loan Purpose');
        newErrors.monthlyRevenue = validateRequired(formData.monthlyRevenue, 'Monthly Revenue');
        newErrors.businessAge = validateRequired(formData.businessAge, 'Business Age');
        newErrors.country = validateRequired(formData.country, 'Country');
        newErrors.city = validateRequired(formData.city, 'City');

        // Additional validations
        if (formData.country.trim().length < 2) {
            newErrors.country = 'Please enter a valid country name';
        }
        if (formData.city.trim().length < 2) {
            newErrors.city = 'Please enter a valid city name';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };

    const handleLoginRedirect = () => {
        saveFormDataToStorage();
        router.push('/auth/signin?callbackUrl=/dashboard/loan-application');
    };

    const handleSignupRedirect = () => {
        saveFormDataToStorage();
        router.push('/auth/signup?callbackUrl=/dashboard/loan-application');
    };

    // Helper function to get input styling based on user login status
    const getInputClassName = () => {
        return !session ? "bg-gray-50 cursor-not-allowed" : "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if user is authenticated
        if (!session) {
            saveFormDataToStorage();
            router.push('/auth/signin?callbackUrl=/dashboard/loan-application');
            return;
        }

        // Validate form before submission
        if (!validateForm()) {
            setSubmitStatus('error');
            return;
        }

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
                updateFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    company: '',
                    businessType: '',
                    loanAmount: '',
                    currency: 'INR',
                    loanPurpose: '',
                    monthlyRevenue: '',
                    businessAge: '',
                    country: '',
                    city: '',
                    additionalInfo: ''
                });
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
                    <div className="text-center">
                        <Badge className="bg-white/20 text-white border-white/30 mb-3 sm:mb-4 text-xs sm:text-sm">
                            <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Partnered with Leading Banks
                        </Badge>
                        <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
                            Get Approved for Business Loans
                            <span className="block text-green-200">Easily & Quickly</span>
                        </h1>
                        <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-3xl mx-auto">
                            Access funding for your business growth with our trusted banking partners.
                            Fast approval, competitive rates, and dedicated support.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                            <div className="flex items-center bg-white/10 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base">
                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                                <span>Quick Approval</span>
                            </div>
                            <div className="flex items-center bg-white/10 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base">
                                <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                                <span>Secure Process</span>
                            </div>
                            <div className="flex items-center bg-white/10 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base">
                                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                                <span>Expert Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Partners Section */}
            <div className="py-8 sm:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-6 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Trusted by Leading Financial Partners</h2>
                        <p className="text-sm sm:text-xl text-gray-600">We&apos;ve partnered with India&apos;s top banks and financial institutions to bring you the best loan options</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-6 items-center">
                        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20">
                            <Image
                                src="https://www.rhomboidfinguru.com/images/kotak.jpg"
                                alt="Kotak Mahindra Bank"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20">
                            <Image
                                src="https://www.rhomboidfinguru.com/images/axis.jpg"
                                alt="Axis Bank"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20">
                            <Image
                                src="https://www.rhomboidfinguru.com/images/induslnd.jpg"
                                alt="IndusInd Bank"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20">
                            <Image
                                src="https://www.rhomboidfinguru.com/images/copri.jpg"
                                alt="Co-operative Bank"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20">
                            <Image
                                src="https://www.rhomboidfinguru.com/images/PNB-logo.jpg"
                                alt="Punjab National Bank"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20">
                            <Image
                                src="https://www.rhomboidfinguru.com/images/logo-Alliances/icici-bank.jpg"
                                alt="ICICI Bank"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20">
                            <Image
                                src="https://www.rhomboidfinguru.com/images/logo-Alliances/standard.jpg"
                                alt="Standard Chartered Bank"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20">
                            <Image
                                src="https://www.rhomboidfinguru.com/images/logo-Alliances/yes-bank.jpg"
                                alt="YES Bank"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        {/* Hidden banks on mobile - shown when expanded */}
                        <div className={`${showAllBanks ? '' : 'hidden'} md:block bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20`}>
                            <Image
                                src="https://www.rhomboidfinguru.com/images/logo-Alliances/icici-bank-loan.jpg"
                                alt="ICICI Bank Loans"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        <div className={`${showAllBanks ? '' : 'hidden'} md:block bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20`}>
                            <Image
                                src="https://www.rhomboidfinguru.com/images/logo-Alliances/tata.jpg"
                                alt="Tata Capital"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        <div className={`${showAllBanks ? '' : 'hidden'} md:block bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20`}>
                            <Image
                                src="https://www.rhomboidfinguru.com/images/logo-Alliances/Au-small-finance-bank.jpg"
                                alt="AU Small Finance Bank"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        <div className={`${showAllBanks ? '' : 'hidden'} md:block bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20`}>
                            <Image
                                src="https://www.rhomboidfinguru.com/images/logo-Alliances/DCB.jpg"
                                alt="DCB Bank"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        <div className={`${showAllBanks ? '' : 'hidden'} md:block bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20`}>
                            <Image
                                src="https://www.rhomboidfinguru.com/images/logo-Alliances/Pheonix-ARC.jpg"
                                alt="Phoenix ARC"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        <div className={`${showAllBanks ? '' : 'hidden'} md:block bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20`}>
                            <Image
                                src="https://www.rhomboidfinguru.com/images/logo-Alliances/SNGC-Bank.jpg"
                                alt="SNGC Bank"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        <div className={`${showAllBanks ? '' : 'hidden'} md:block bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20`}>
                            <Image
                                src="https://www.rhomboidfinguru.com/images/logo-Alliances/Encore-ARC.jpg"
                                alt="Encore ARC"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        <div className={`${showAllBanks ? '' : 'hidden'} md:block bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20`}>
                            <Image
                                src="https://www.rhomboidfinguru.com/images/logo-Alliances/State-Bank-of-India.jpg"
                                alt="State Bank of India"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                        <div className={`${showAllBanks ? '' : 'hidden'} md:block bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-16 sm:h-20`}>
                            <Image
                                src="https://www.rhomboidfinguru.com/images/logo-Alliances/LIC.jpg"
                                alt="Life Insurance Corporation"
                                width={120}
                                height={60}
                                className="object-contain max-h-12"
                            />
                        </div>
                    </div>

                    {/* Show More Button - Mobile Only */}
                    <div className="text-center mt-6 md:hidden">
                        <Button
                            onClick={() => setShowAllBanks(!showAllBanks)}
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            {showAllBanks ? 'Show Less Partners' : 'Show All Partners (10 more)'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-8 sm:py-16 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-6 sm:mb-12 px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Why Choose Our Loan Partners?</h2>
                        <p className="text-sm sm:text-xl text-gray-600">We&apos;ve partnered with leading financial institutions to bring you the best loan options</p>
                    </div>

                    {/* Horizontal Scrollable on Mobile, Grid on Desktop */}
                    <div className="flex overflow-x-auto gap-4 px-4 pb-4 md:hidden scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[280px] snap-center">
                            <CardContent className="p-4">
                                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Clock className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-base font-semibold mb-1">Fast Approval</h3>
                                <p className="text-gray-600 text-sm">Get approved in as little as 24 hours with our streamlined process</p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[280px] snap-center">
                            <CardContent className="p-4">
                                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <DollarSign className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-base font-semibold mb-1">Competitive Rates</h3>
                                <p className="text-gray-600 text-sm">Access competitive interest rates from our trusted banking partners</p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[280px] snap-center">
                            <CardContent className="p-4">
                                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-base font-semibold mb-1">Minimal Documentation</h3>
                                <p className="text-gray-600 text-sm">Simple application process with minimal paperwork required</p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[280px] snap-center">
                            <CardContent className="p-4">
                                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <TrendingUp className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-base font-semibold mb-1">Business Growth</h3>
                                <p className="text-gray-600 text-sm">Fuel your business expansion with flexible loan terms</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Desktop Grid */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 px-4 sm:px-6 lg:px-8">
                        <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-4 sm:p-6">
                                <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                                </div>
                                <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2">Fast Approval</h3>
                                <p className="text-gray-600 text-sm sm:text-base">Get approved in as little as 24 hours with our streamlined process</p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-4 sm:p-6">
                                <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                                </div>
                                <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2">Competitive Rates</h3>
                                <p className="text-gray-600 text-sm sm:text-base">Access competitive interest rates from our trusted banking partners</p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-4 sm:p-6">
                                <div className="bg-purple-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                                </div>
                                <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2">Minimal Documentation</h3>
                                <p className="text-gray-600 text-sm sm:text-base">Simple application process with minimal paperwork required</p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-4 sm:p-6">
                                <div className="bg-orange-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                                </div>
                                <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2">Business Growth</h3>
                                <p className="text-gray-600 text-sm sm:text-base">Fuel your business expansion with flexible loan terms</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Loan Application Form */}
            <div className="py-8 sm:py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-6 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Apply for Your Business Loan</h2>
                        <p className="text-sm sm:text-xl text-gray-600">Fill out the form below and our partners will contact you within 24 hours</p>
                    </div>

                    <Card className="border-0 shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 sm:px-6 py-4 sm:py-6">
                            <CardTitle className="flex items-center text-base sm:text-lg">
                                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                                Loan Application Form
                            </CardTitle>
                            <CardDescription className="text-green-100 text-xs sm:text-sm">
                                All information is secure and will only be shared with our banking partners
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-8 relative">
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
                                    <span className="text-red-800 font-medium">
                                        {Object.keys(errors).length > 0
                                            ? "Please fix the errors below before submitting."
                                            : "There was an error submitting your application. Please try again."
                                        }
                                    </span>
                                </div>
                            )}

                            {session && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                        <span className="text-green-800 font-medium">
                                            Welcome back, {session.user?.name}! You can now submit your loan application.
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Blurred Overlay for Unauthenticated Users */}
                            {!session && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                                    <div className="text-center p-8 max-w-md">
                                        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                                            <div className="mb-6">
                                                <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Almost There!</h3>
                                                <p className="text-gray-600 mb-6">
                                                    Just need you to sign in or create a free account to submit your loan request.
                                                    Don&apos;t worry - we&apos;ll save everything you&apos;ve filled out so far!
                                                </p>
                                            </div>
                                            <div className="space-y-3">
                                                <Button
                                                    onClick={handleLoginRedirect}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                                                >
                                                    <LogIn className="w-5 h-5 mr-2" />
                                                    I Already Have an Account
                                                </Button>
                                                <Button
                                                    onClick={handleSignupRedirect}
                                                    variant="outline"
                                                    className="w-full border-2 border-blue-300 text-blue-700 hover:bg-blue-50 py-3 text-lg font-semibold"
                                                >
                                                    <UserPlus className="w-5 h-5 mr-2" />
                                                    Create Free Account
                                                </Button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-4">
                                                Secure • Fast • Trusted by thousands of businesses
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <Label className="text-xs sm:text-sm" htmlFor="fullName">Full Name *</Label>
                                        <Input
                                            id="fullName"
                                            value={formData.fullName}
                                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                                            required
                                            placeholder="Enter your full name"
                                            disabled={!session}
                                            className={`${getInputClassName()} ${errors.fullName ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                        {errors.fullName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-xs sm:text-sm" htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            required
                                            placeholder="Enter your email"
                                            disabled={!session}
                                            className={`${getInputClassName()} ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <Label className="text-xs sm:text-sm" htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            required
                                            placeholder="Enter your phone number"
                                            disabled={!session}
                                            className={`${getInputClassName()} ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-xs sm:text-sm" htmlFor="company">Company Name *</Label>
                                        <Input
                                            id="company"
                                            value={formData.company}
                                            onChange={(e) => handleInputChange('company', e.target.value)}
                                            required
                                            placeholder="Enter your company name"
                                            disabled={!session}
                                            className={`${getInputClassName()} ${errors.company ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                        {errors.company && (
                                            <p className="text-red-500 text-sm mt-1">{errors.company}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <Label className="text-xs sm:text-sm" htmlFor="businessType">Business Type *</Label>
                                        <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)} disabled={!session}>
                                            <SelectTrigger className={`${getInputClassName()} ${errors.businessType ? 'border-red-500 focus:border-red-500' : ''}`}>
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
                                        {errors.businessType && (
                                            <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-xs sm:text-sm" htmlFor="loanAmount">Loan Amount Required *</Label>
                                        <Select value={formData.loanAmount} onValueChange={(value) => handleInputChange('loanAmount', value)} disabled={!session}>
                                            <SelectTrigger className={`${getInputClassName()} ${errors.loanAmount ? 'border-red-500 focus:border-red-500' : ''}`}>
                                                <SelectValue placeholder="Select loan amount" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="50000-200000">₹50,000 - ₹2,00,000</SelectItem>
                                                <SelectItem value="200000-500000">₹2,00,000 - ₹5,00,000</SelectItem>
                                                <SelectItem value="500000-2000000">₹5,00,000 - ₹20,00,000</SelectItem>
                                                <SelectItem value="2000000-5000000">₹20,00,000 - ₹50,00,000</SelectItem>
                                                <SelectItem value="5000000-10000000">₹50,00,000 - ₹1,00,00,000</SelectItem>
                                                <SelectItem value="10000000-25000000">₹1,00,00,000 - ₹2,50,00,000</SelectItem>
                                                <SelectItem value="25000000-50000000">₹2,50,00,000 - ₹5,00,00,000</SelectItem>
                                                <SelectItem value="50000000+">₹5,00,00,000+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.loanAmount && (
                                            <p className="text-red-500 text-sm mt-1">{errors.loanAmount}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="currency">Preferred Currency *</Label>
                                    <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)} disabled={!session}>
                                        <SelectTrigger className={`${getInputClassName()} ${errors.currency ? 'border-red-500 focus:border-red-500' : ''}`}>
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INR">🇮🇳 INR - Indian Rupee</SelectItem>
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
                                    {errors.currency && (
                                        <p className="text-red-500 text-sm mt-1">{errors.currency}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="loanPurpose">Purpose of Loan *</Label>
                                    <Select value={formData.loanPurpose} onValueChange={(value) => handleInputChange('loanPurpose', value)} disabled={!session}>
                                        <SelectTrigger className={`${getInputClassName()} ${errors.loanPurpose ? 'border-red-500 focus:border-red-500' : ''}`}>
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
                                    {errors.loanPurpose && (
                                        <p className="text-red-500 text-sm mt-1">{errors.loanPurpose}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <Label className="text-xs sm:text-sm" htmlFor="monthlyRevenue">Monthly Revenue *</Label>
                                        <Select value={formData.monthlyRevenue} onValueChange={(value) => handleInputChange('monthlyRevenue', value)} disabled={!session}>
                                            <SelectTrigger className={getInputClassName()}>
                                                <SelectValue placeholder="Select monthly revenue" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0-100000">₹0 - ₹1,00,000</SelectItem>
                                                <SelectItem value="100000-500000">₹1,00,000 - ₹5,00,000</SelectItem>
                                                <SelectItem value="500000-1000000">₹5,00,000 - ₹10,00,000</SelectItem>
                                                <SelectItem value="1000000-2500000">₹10,00,000 - ₹25,00,000</SelectItem>
                                                <SelectItem value="2500000-5000000">₹25,00,000 - ₹50,00,000</SelectItem>
                                                <SelectItem value="5000000+">₹50,00,000+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-xs sm:text-sm" htmlFor="businessAge">Business Age *</Label>
                                        <Select value={formData.businessAge} onValueChange={(value) => handleInputChange('businessAge', value)} disabled={!session}>
                                            <SelectTrigger className={getInputClassName()}>
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <Label className="text-xs sm:text-sm" htmlFor="country">Country *</Label>
                                        <Input
                                            id="country"
                                            value={formData.country}
                                            onChange={(e) => handleInputChange('country', e.target.value)}
                                            required
                                            placeholder="Enter your country"
                                            disabled={!session}
                                            className={`${getInputClassName()} ${errors.country ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                        {errors.country && (
                                            <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-xs sm:text-sm" htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            required
                                            placeholder="Enter your city"
                                            disabled={!session}
                                            className={`${getInputClassName()} ${errors.city ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                        {errors.city && (
                                            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                        )}
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
                                        disabled={!session}
                                        className={getInputClassName()}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !session}
                                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-2.5 sm:py-3 text-base sm:text-lg font-semibold disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span className="hidden sm:inline">Submitting Application...</span>
                                            <span className="sm:hidden">Submitting...</span>
                                        </div>
                                    ) : !session ? (
                                        <div className="flex items-center gap-2">
                                            <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="hidden sm:inline">Sign In to Continue</span>
                                            <span className="sm:hidden">Sign In</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="hidden sm:inline">Submit Loan Application</span>
                                            <span className="sm:hidden">Submit Application</span>
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-gray-400 text-sm sm:text-base">&copy; 2024 TradeMart. All rights reserved. | Global B2B Marketplace</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
