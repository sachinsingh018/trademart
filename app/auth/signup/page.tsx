"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
    ArrowLeft, 
    ArrowRight, 
    Check, 
    Mail, 
    Phone, 
    Building, 
    MapPin, 
    Shield,
    User,
    Eye,
    EyeOff
} from "lucide-react";

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

const INDUSTRIES = [
    "Electronics",
    "Textiles & Apparel",
    "Manufacturing",
    "Food & Beverage",
    "Automotive",
    "Construction",
    "Healthcare",
    "Agriculture",
    "Chemicals",
    "Machinery",
    "Other"
];

const BUSINESS_TYPES = [
    "Manufacturer",
    "Distributor",
    "Wholesaler",
    "Retailer",
    "Service Provider",
    "Consultant",
    "Other"
];

const COUNTRIES = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "India",
    "China",
    "Japan",
    "Australia",
    "Brazil",
    "Mexico",
    "Other"
];

function SignUpForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    setError("Please enter a valid email address");
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
                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
                    setError("Password must contain at least one uppercase letter, one lowercase letter, and one number");
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
                    setError("Please verify your contact information");
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
            setError("");
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        setError("");
    };

    const sendOTP = async () => {
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/verify-otp", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    method: formData.verificationMethod,
                    email: formData.email,
                    phone: formData.phone,
                }),
            });

            if (response.ok) {
                setOtpSent(true);
                setSuccess("OTP sent successfully!");
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
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess("Account created successfully!");
                
                // Send welcome notification
                try {
                    await fetch("/api/whatsapp/send-welcome", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            phone: formData.phone,
                            userName: formData.name,
                            role: formData.role
                        }),
                    });
                } catch (error) {
                    console.error("Failed to send welcome notification:", error);
                }

                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
            } else {
                const data = await response.json();
                setError(data.error || "Registration failed");
            }
        } catch {
            setError("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getStepTitle = (step: number) => {
        switch (step) {
            case 1: return "Basic Information";
            case 2: return "Company Details";
            case 3: return "Location";
            case 4: return "Verification";
            case 5: return "Terms & Conditions";
            default: return "";
        }
    };

    const getStepIcon = (step: number) => {
        switch (step) {
            case 1: return <User className="h-5 w-5" />;
            case 2: return <Building className="h-5 w-5" />;
            case 3: return <MapPin className="h-5 w-5" />;
            case 4: return <Shield className="h-5 w-5" />;
            case 5: return <Check className="h-5 w-5" />;
            default: return null;
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Welcome to TradeMart
                            </h2>
                            <p className="text-gray-600">
                                Let&apos;s get you started with your account
                            </p>
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
                                    className="mt-1"
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
                                    placeholder="Enter your email address"
                                    className="mt-1"
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
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="role">Account Type *</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => handleSelectChange("role", value)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="buyer">
                                            <div className="flex items-center gap-2">
                                                <span>🛒</span>
                                                <div>
                                                    <div className="font-medium">Buyer</div>
                                                    <div className="text-sm text-gray-500">Post RFQs and get quotes</div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="supplier">
                                            <div className="flex items-center gap-2">
                                                <span>🏭</span>
                                                <div>
                                                    <div className="font-medium">Supplier</div>
                                                    <div className="text-sm text-gray-500">Submit quotes and grow your business</div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="password">Password *</Label>
                                <div className="relative mt-1">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Create a strong password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Must be at least 8 characters with uppercase, lowercase, and number
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                <div className="relative mt-1">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm your password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Company Information
                            </h2>
                            <p className="text-gray-600">
                                Tell us about your business
                            </p>
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
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="industry">Industry *</Label>
                                <Select
                                    value={formData.industry}
                                    onValueChange={(value) => handleSelectChange("industry", value)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select your industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {INDUSTRIES.map((industry) => (
                                            <SelectItem key={industry} value={industry}>
                                                {industry}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="businessType">Business Type *</Label>
                                <Select
                                    value={formData.businessType}
                                    onValueChange={(value) => handleSelectChange("businessType", value)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select business type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BUSINESS_TYPES.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="website">Website (Optional)</Label>
                                <Input
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    placeholder="https://yourcompany.com"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Company Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Brief description of your company and services"
                                    rows={3}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Location Information
                            </h2>
                            <p className="text-gray-600">
                                Where is your business located?
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="country">Country *</Label>
                                <Select
                                    value={formData.country}
                                    onValueChange={(value) => handleSelectChange("country", value)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select your country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COUNTRIES.map((country) => (
                                            <SelectItem key={country} value={country}>
                                                {country}
                                            </SelectItem>
                                        ))}
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
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="address">Address (Optional)</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your business address"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="postalCode">Postal Code (Optional)</Label>
                                <Input
                                    id="postalCode"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    placeholder="Enter postal code"
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Verify Your Contact
                            </h2>
                            <p className="text-gray-600">
                                We&apos;ll send you a verification code
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label>Verification Method</Label>
                                <div className="flex gap-4 mt-2">
                                    <Button
                                        type="button"
                                        variant={formData.verificationMethod === "email" ? "default" : "outline"}
                                        onClick={() => handleSelectChange("verificationMethod", "email")}
                                        className="flex items-center gap-2"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={formData.verificationMethod === "phone" ? "default" : "outline"}
                                        onClick={() => handleSelectChange("verificationMethod", "phone")}
                                        className="flex items-center gap-2"
                                    >
                                        <Phone className="h-4 w-4" />
                                        Phone
                                    </Button>
                                </div>
                            </div>

                            {!otpSent ? (
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-4">
                                        We&apos;ll send a verification code to your {formData.verificationMethod}
                                    </p>
                                    <Button
                                        onClick={sendOTP}
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        {isLoading ? "Sending..." : "Send Verification Code"}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="otpCode">Verification Code</Label>
                                        <Input
                                            id="otpCode"
                                            name="otpCode"
                                            value={formData.otpCode}
                                            onChange={handleInputChange}
                                            placeholder="Enter 6-digit code"
                                            maxLength={6}
                                            className="mt-1 text-center text-lg tracking-widest"
                                        />
                                    </div>

                                    <Button
                                        onClick={verifyOTP}
                                        disabled={isLoading || formData.otpCode.length !== 6}
                                        className="w-full"
                                    >
                                        {isLoading ? "Verifying..." : "Verify Code"}
                                    </Button>

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

                            {otpVerified && (
                                <Alert className="border-green-200 bg-green-50">
                                    <Check className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        Your contact information has been verified successfully!
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Terms & Conditions
                            </h2>
                            <p className="text-gray-600">
                                Please review and accept our terms
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onCheckedChange={(checked) => 
                                        setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                                    }
                                />
                                <div className="space-y-1">
                                    <Label htmlFor="agreeToTerms" className="text-sm font-medium">
                                        I agree to the Terms of Service and Privacy Policy *
                                    </Label>
                                    <p className="text-xs text-gray-500">
                                        By checking this box, you agree to our terms and conditions.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="agreeToMarketing"
                                    checked={formData.agreeToMarketing}
                                    onCheckedChange={(checked) => 
                                        setFormData(prev => ({ ...prev, agreeToMarketing: checked as boolean }))
                                    }
                                />
                                <div className="space-y-1">
                                    <Label htmlFor="agreeToMarketing" className="text-sm font-medium">
                                        I&apos;d like to receive marketing communications (Optional)
                                    </Label>
                                    <p className="text-xs text-gray-500">
                                        Get updates about new features, promotions, and industry insights.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Your account will be created immediately</li>
                                    <li>• You&apos;ll receive a welcome notification</li>
                                    <li>• You can start using TradeMart right away</li>
                                    <li>• {formData.role === "buyer" ? "Post your first RFQ" : "Browse available RFQs and submit quotes"}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <Image
                            src="/logofinal.png"
                            alt="TradeMart Logo"
                            width={120}
                            height={120}
                            className="mx-auto mb-4 hover:scale-105 transition-transform duration-300"
                        />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Create Your Account
                    </h1>
                    <p className="text-gray-600">
                        Join thousands of businesses already using TradeMart
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Step {currentStep} of {totalSteps}
                        </span>
                        <span className="text-sm text-gray-500">
                            {Math.round((currentStep / totalSteps) * 100)}% Complete
                        </span>
                    </div>
                    <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
                </div>

                {/* Step Indicators */}
                <div className="flex justify-between mb-8">
                    {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                        <div
                            key={step}
                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                                step <= currentStep
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "bg-white border-gray-300 text-gray-400"
                            }`}
                        >
                            {step < currentStep ? (
                                <Check className="h-5 w-5" />
                            ) : (
                                getStepIcon(step)
                            )}
                        </div>
                    ))}
                </div>

                {/* Main Form */}
                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2">
                            {getStepIcon(currentStep)}
                            {getStepTitle(currentStep)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        {error && (
                            <Alert className="mb-6 border-red-200 bg-red-50">
                                <AlertDescription className="text-red-800">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="mb-6 border-green-200 bg-green-50">
                                <Check className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    {success}
                                </AlertDescription>
                            </Alert>
                        )}

                        {renderStep()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Previous
                            </Button>

                            {currentStep < totalSteps ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center gap-2"
                                >
                                    Next
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                >
                                    {isLoading ? "Creating Account..." : "Create Account"}
                                    <Check className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function SignUpPage() {
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