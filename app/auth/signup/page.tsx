"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface FormData {
    // Basic Info
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: "buyer" | "supplier";

    // Profile Info
    companyName: string;
    industry: string;
    businessType: string;
    website: string;
    description: string;

    // Address Info
    country: string;
    city: string;
    address: string;
    postalCode: string;

    // Verification
    verificationMethod: "email" | "phone";
    otpCode: string;

    // Terms
    agreeToTerms: boolean;
    agreeToMarketing: boolean;
}

function SignUpForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const roleParam = searchParams.get("role");

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: (roleParam as "buyer" | "supplier") || "buyer",
        companyName: "",
        industry: "",
        businessType: "",
        website: "",
        description: "",
        country: "",
        city: "",
        address: "",
        postalCode: "",
        verificationMethod: "email",
        otpCode: "",
        agreeToTerms: false,
        agreeToMarketing: false,
    });

    const totalSteps = 5;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateStep = (step: number): boolean => {
        setError("");

        switch (step) {
            case 1:
                if (!formData.name.trim()) {
                    setError("Full name is required");
                    return false;
                }
                if (!formData.email.trim()) {
                    setError("Email is required");
                    return false;
                }
                if (!formData.phone.trim()) {
                    setError("Phone number is required");
                    return false;
                }
                if (formData.password.length < 8) {
                    setError("Password must be at least 8 characters long");
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords do not match");
                    return false;
                }
                return true;

            case 2:
                if (!formData.companyName.trim()) {
                    setError("Company name is required");
                    return false;
                }
                if (!formData.industry) {
                    setError("Industry is required");
                    return false;
                }
                if (!formData.businessType) {
                    setError("Business type is required");
                    return false;
                }
                return true;

            case 3:
                if (!formData.country) {
                    setError("Country is required");
                    return false;
                }
                if (!formData.city.trim()) {
                    setError("City is required");
                    return false;
                }
                return true;

            case 4:
                if (!otpVerified) {
                    setError("Please verify your contact information first");
                    return false;
                }
                return true;

            case 5:
                if (!formData.agreeToTerms) {
                    setError("You must agree to the terms and conditions");
                    return false;
                }
                return true;

            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const sendOTP = async () => {
        setIsLoading(true);
        setError("");

        try {
            // TODO: Replace with actual AWS OTP service
            const response = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    method: formData.verificationMethod,
                    email: formData.email,
                    phone: formData.phone,
                }),
            });

            if (response.ok) {
                setOtpSent(true);
                setSuccess(`OTP sent to your ${formData.verificationMethod}`);
            } else {
                const data = await response.json();
                setError(data.error || "Failed to send OTP");
            }
        } catch {
            setError("Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOTP = async () => {
        setIsLoading(true);
        setError("");

        try {
            // TODO: Replace with actual AWS OTP verification
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    method: formData.verificationMethod,
                    email: formData.email,
                    phone: formData.phone,
                    otp: formData.otpCode,
                }),
            });

            if (response.ok) {
                setOtpVerified(true);
                setSuccess("Verification successful!");
            } else {
                const data = await response.json();
                setError(data.error || "Invalid OTP");
            }
        } catch {
            setError("Verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(5)) return;

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    role: formData.role,
                    companyName: formData.companyName,
                    industry: formData.industry,
                    businessType: formData.businessType,
                    website: formData.website,
                    description: formData.description,
                    country: formData.country,
                    city: formData.city,
                    address: formData.address,
                    postalCode: formData.postalCode,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Account created successfully!");
                setTimeout(() => {
                    router.push("/auth/signin?message=Account created successfully. Please sign in.");
                }, 2000);
            } else {
                setError(data.error || "An error occurred. Please try again.");
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h3>
                            <p className="text-gray-600">Let's start with your basic details</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Create a strong password"
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-1">Must be at least 8 characters long</p>
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>

                            <div>
                                <Label className="text-base font-medium">Account Type *</Label>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <Card
                                        className={`cursor-pointer transition-all ${formData.role === "buyer"
                                            ? "ring-2 ring-blue-500 bg-blue-50"
                                            : "hover:bg-gray-50"
                                            }`}
                                        onClick={() => handleSelectChange("role", "buyer")}
                                    >
                                        <CardContent className="p-4 text-center">
                                            <div className="text-2xl mb-2">🛒</div>
                                            <h4 className="font-semibold">Buyer</h4>
                                            <p className="text-sm text-gray-600">Source products and services</p>
                                        </CardContent>
                                    </Card>
                                    <Card
                                        className={`cursor-pointer transition-all ${formData.role === "supplier"
                                            ? "ring-2 ring-green-500 bg-green-50"
                                            : "hover:bg-gray-50"
                                            }`}
                                        onClick={() => handleSelectChange("role", "supplier")}
                                    >
                                        <CardContent className="p-4 text-center">
                                            <div className="text-2xl mb-2">🏭</div>
                                            <h4 className="font-semibold">Supplier</h4>
                                            <p className="text-sm text-gray-600">Sell products and services</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Company Information</h3>
                            <p className="text-gray-600">Tell us about your business</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="companyName">Company Name *</Label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your company name"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="industry">Industry *</Label>
                                <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="electronics">Electronics</SelectItem>
                                        <SelectItem value="textiles">Textiles</SelectItem>
                                        <SelectItem value="machinery">Machinery</SelectItem>
                                        <SelectItem value="chemicals">Chemicals</SelectItem>
                                        <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                                        <SelectItem value="automotive">Automotive</SelectItem>
                                        <SelectItem value="construction">Construction</SelectItem>
                                        <SelectItem value="healthcare">Healthcare</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="businessType">Business Type *</Label>
                                <Select value={formData.businessType} onValueChange={(value) => handleSelectChange("businessType", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select business type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="manufacturer">Manufacturer</SelectItem>
                                        <SelectItem value="distributor">Distributor</SelectItem>
                                        <SelectItem value="wholesaler">Wholesaler</SelectItem>
                                        <SelectItem value="retailer">Retailer</SelectItem>
                                        <SelectItem value="service-provider">Service Provider</SelectItem>
                                        <SelectItem value="startup">Startup</SelectItem>
                                        <SelectItem value="enterprise">Enterprise</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="website">Website (Optional)</Label>
                                <Input
                                    id="website"
                                    name="website"
                                    type="url"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    placeholder="https://your-website.com"
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Business Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your business, products, or services..."
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Location Information</h3>
                            <p className="text-gray-600">Where is your business located?</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="country">Country *</Label>
                                <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="us">United States</SelectItem>
                                        <SelectItem value="uk">United Kingdom</SelectItem>
                                        <SelectItem value="ca">Canada</SelectItem>
                                        <SelectItem value="au">Australia</SelectItem>
                                        <SelectItem value="de">Germany</SelectItem>
                                        <SelectItem value="fr">France</SelectItem>
                                        <SelectItem value="jp">Japan</SelectItem>
                                        <SelectItem value="cn">China</SelectItem>
                                        <SelectItem value="in">India</SelectItem>
                                        <SelectItem value="sg">Singapore</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Enter your city"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your business address"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input
                                    id="postalCode"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    placeholder="Enter postal code"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Contact</h3>
                            <p className="text-gray-600">We'll send you a verification code</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label>Verification Method</Label>
                                <div className="flex space-x-4 mt-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="verificationMethod"
                                            value="email"
                                            checked={formData.verificationMethod === "email"}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        Email ({formData.email})
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="verificationMethod"
                                            value="phone"
                                            checked={formData.verificationMethod === "phone"}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        Phone ({formData.phone})
                                    </label>
                                </div>
                            </div>

                            {!otpSent ? (
                                <Button
                                    type="button"
                                    onClick={sendOTP}
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    {isLoading ? "Sending..." : `Send OTP to ${formData.verificationMethod}`}
                                </Button>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="otpCode">Enter Verification Code</Label>
                                        <Input
                                            id="otpCode"
                                            name="otpCode"
                                            value={formData.otpCode}
                                            onChange={handleInputChange}
                                            placeholder="Enter 6-digit code"
                                            maxLength={6}
                                        />
                                    </div>

                                    {!otpVerified ? (
                                        <Button
                                            type="button"
                                            onClick={verifyOTP}
                                            disabled={isLoading || formData.otpCode.length !== 6}
                                            className="w-full"
                                        >
                                            {isLoading ? "Verifying..." : "Verify Code"}
                                        </Button>
                                    ) : (
                                        <div className="text-center">
                                            <Badge variant="default" className="bg-green-500">
                                                ✓ Verified Successfully
                                            </Badge>
                                        </div>
                                    )}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setOtpSent(false);
                                            setOtpVerified(false);
                                            setFormData(prev => ({ ...prev, otpCode: "" }));
                                        }}
                                        className="w-full"
                                    >
                                        Resend Code
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Terms & Conditions</h3>
                            <p className="text-gray-600">Please review and accept our terms</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                                <h4 className="font-semibold mb-2">Terms of Service</h4>
                                <p className="text-sm text-gray-600 mb-4">
                                    By creating an account on TradeMart, you agree to our terms of service,
                                    privacy policy, and community guidelines. You understand that:
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>• You are responsible for the accuracy of your information</li>
                                    <li>• All transactions are subject to our escrow system</li>
                                    <li>• You will comply with all applicable laws and regulations</li>
                                    <li>• TradeMart reserves the right to suspend accounts for violations</li>
                                    <li>• Disputes will be resolved through our mediation process</li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onCheckedChange={(checked) =>
                                            setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                                        }
                                    />
                                    <label htmlFor="agreeToTerms" className="text-sm">
                                        I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> *
                                    </label>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="agreeToMarketing"
                                        checked={formData.agreeToMarketing}
                                        onCheckedChange={(checked) =>
                                            setFormData(prev => ({ ...prev, agreeToMarketing: checked as boolean }))
                                        }
                                    />
                                    <label htmlFor="agreeToMarketing" className="text-sm">
                                        I would like to receive marketing emails and updates from TradeMart
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center">
                    <Link href="/" className="flex items-center justify-center mb-8">
                        <Image
                            src="/logofinal.png"
                            alt="TradeMart Logo"
                            width={200}
                            height={200}
                            className="w-48 h-48 hover:scale-120 transition-transform duration-300 drop-shadow-2xl"
                        />
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Join TradeMart
                    </h1>
                    <p className="text-gray-600">
                        Create your {formData.role} account in just a few steps
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Step {currentStep} of {totalSteps}</span>
                        <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                    </div>
                    <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
                </div>

                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-center">
                            {currentStep === 1 && "Basic Information"}
                            {currentStep === 2 && "Company Details"}
                            {currentStep === 3 && "Location"}
                            {currentStep === 4 && "Verification"}
                            {currentStep === 5 && "Terms & Conditions"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                                {success}
                            </div>
                        )}

                        {renderStepContent()}

                        <div className="flex justify-between mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                            >
                                Previous
                            </Button>

                            {currentStep < totalSteps ? (
                                <Button onClick={nextStep}>
                                    Next Step
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading || !formData.agreeToTerms}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                >
                                    {isLoading ? "Creating Account..." : "Create Account"}
                                </Button>
                            )}
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function SignUp() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        }>
            <SignUpForm />
        </Suspense>
    );
}