"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
    ArrowLeft, 
    ArrowRight, 
    Plus, 
    X, 
    FileText, 
    CheckCircle
} from "lucide-react";

const CATEGORIES = [
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

const UNITS = [
    "pieces",
    "kg",
    "tons",
    "meters",
    "liters",
    "boxes",
    "pallets",
    "containers",
    "units",
    "sets"
];

const CURRENCIES = [
    "USD",
    "EUR",
    "GBP",
    "INR",
    "CNY",
    "JPY",
    "CAD",
    "AUD"
];

export default function CreateRFQ() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        subcategory: "",
        quantity: "",
        unit: "",
        budget: "",
        currency: "USD",
        requirements: [] as string[],
        specifications: {} as Record<string, string>,
        additionalInfo: "",
        expiresAt: ""
    });

    const [newRequirement, setNewRequirement] = useState("");
    const [newSpecKey, setNewSpecKey] = useState("");
    const [newSpecValue, setNewSpecValue] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        } else if (session?.user?.role !== "buyer") {
            router.push("/dashboard");
        }
    }, [status, session, router]);

    const steps = [
        { id: 1, title: "Basic Information", description: "RFQ title and description" },
        { id: 2, title: "Product Details", description: "Category, quantity, and specifications" },
        { id: 3, title: "Budget & Timeline", description: "Budget and expiration date" },
        { id: 4, title: "Review & Submit", description: "Review your RFQ before submitting" }
    ];

    const progress = (currentStep / steps.length) * 100;

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError("");
    };

    const addRequirement = () => {
        if (newRequirement.trim()) {
            setFormData(prev => ({
                ...prev,
                requirements: [...prev.requirements, newRequirement.trim()]
            }));
            setNewRequirement("");
        }
    };

    const removeRequirement = (index: number) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }));
    };

    const addSpecification = () => {
        if (newSpecKey.trim() && newSpecValue.trim()) {
            setFormData(prev => ({
                ...prev,
                specifications: {
                    ...prev.specifications,
                    [newSpecKey.trim()]: newSpecValue.trim()
                }
            }));
            setNewSpecKey("");
            setNewSpecValue("");
        }
    };

    const removeSpecification = (key: string) => {
        setFormData(prev => {
            const newSpecs = { ...prev.specifications };
            delete newSpecs[key];
            return { ...prev, specifications: newSpecs };
        });
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/rfqs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
            } else {
                setError(data.error || "Failed to create RFQ");
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== "buyer") {
        return null;
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">RFQ Created Successfully!</h2>
                            <p className="text-gray-600 mb-4">Your request for quotation has been submitted and is now visible to suppliers.</p>
                            <Button onClick={() => router.push("/dashboard")} className="w-full">
                                Go to Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.back()}
                            className="mr-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900">Create RFQ</h1>
                    </div>
                    <p className="text-gray-600">Create a new Request for Quotation to get competitive quotes from suppliers</p>
                </div>

                {/* Progress */}
                <Card className="mb-8">
                    <CardContent className="pt-6">
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Step {currentStep} of {steps.length}</span>
                                <span>{Math.round(progress)}% Complete</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                        <div className="flex justify-between">
                            {steps.map((step) => (
                                <div key={step.id} className="text-center">
                                    <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                                        step.id <= currentStep 
                                            ? "bg-blue-600 text-white" 
                                            : "bg-gray-200 text-gray-600"
                                    }`}>
                                        {step.id}
                                    </div>
                                    <div className="text-xs">
                                        <div className="font-medium">{step.title}</div>
                                        <div className="text-gray-500">{step.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Form */}
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            {steps[currentStep - 1].title}
                        </CardTitle>
                        <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="title">RFQ Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                        placeholder="e.g., Custom Printed T-Shirts for Corporate Event"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        placeholder="Provide detailed information about what you're looking for..."
                                        rows={6}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Product Details */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="category">Category *</Label>
                                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="subcategory">Subcategory</Label>
                                        <Input
                                            id="subcategory"
                                            value={formData.subcategory}
                                            onChange={(e) => handleInputChange("subcategory", e.target.value)}
                                            placeholder="e.g., Cotton T-shirts"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="quantity">Quantity</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => handleInputChange("quantity", e.target.value)}
                                            placeholder="1000"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="unit">Unit</Label>
                                        <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {UNITS.map((unit) => (
                                                    <SelectItem key={unit} value={unit}>
                                                        {unit}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Requirements */}
                                <div>
                                    <Label>Requirements</Label>
                                    <div className="mt-2 space-y-2">
                                        <div className="flex gap-2">
                                            <Input
                                                value={newRequirement}
                                                onChange={(e) => setNewRequirement(e.target.value)}
                                                placeholder="Add a requirement..."
                                                onKeyPress={(e) => e.key === "Enter" && addRequirement()}
                                            />
                                            <Button type="button" onClick={addRequirement} size="sm">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.requirements.map((req, index) => (
                                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                    {req}
                                                    <X 
                                                        className="h-3 w-3 cursor-pointer" 
                                                        onClick={() => removeRequirement(index)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Specifications */}
                                <div>
                                    <Label>Specifications</Label>
                                    <div className="mt-2 space-y-2">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                            <Input
                                                value={newSpecKey}
                                                onChange={(e) => setNewSpecKey(e.target.value)}
                                                placeholder="Specification name"
                                            />
                                            <Input
                                                value={newSpecValue}
                                                onChange={(e) => setNewSpecValue(e.target.value)}
                                                placeholder="Specification value"
                                            />
                                            <Button type="button" onClick={addSpecification} size="sm">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            {Object.entries(formData.specifications).map(([key, value]) => (
                                                <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                    <span className="font-medium">{key}:</span>
                                                    <span className="text-gray-600">{value}</span>
                                                    <X 
                                                        className="h-4 w-4 cursor-pointer text-red-500" 
                                                        onClick={() => removeSpecification(key)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Budget & Timeline */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="budget">Budget</Label>
                                        <div className="flex gap-2 mt-1">
                                            <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                                                <SelectTrigger className="w-20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {CURRENCIES.map((currency) => (
                                                        <SelectItem key={currency} value={currency}>
                                                            {currency}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                id="budget"
                                                type="number"
                                                value={formData.budget}
                                                onChange={(e) => handleInputChange("budget", e.target.value)}
                                                placeholder="10000"
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="expiresAt">Expiration Date</Label>
                                        <Input
                                            id="expiresAt"
                                            type="date"
                                            value={formData.expiresAt}
                                            onChange={(e) => handleInputChange("expiresAt", e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="additionalInfo">Additional Information</Label>
                                    <Textarea
                                        id="additionalInfo"
                                        value={formData.additionalInfo}
                                        onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                                        placeholder="Any additional information, special requirements, or notes..."
                                        rows={4}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Review & Submit */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4">RFQ Summary</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-600">Title</Label>
                                            <p className="text-lg font-semibold">{formData.title}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-600">Description</Label>
                                            <p className="text-gray-700">{formData.description}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-600">Category</Label>
                                                <p>{formData.category}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-600">Subcategory</Label>
                                                <p>{formData.subcategory || "Not specified"}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-600">Quantity</Label>
                                                <p>{formData.quantity ? `${formData.quantity} ${formData.unit}` : "Not specified"}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-600">Budget</Label>
                                                <p>{formData.budget ? `${formData.currency} ${formData.budget}` : "Not specified"}</p>
                                            </div>
                                        </div>
                                        {formData.requirements.length > 0 && (
                                            <div>
                                                <Label className="text-sm font-medium text-gray-600">Requirements</Label>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {formData.requirements.map((req, index) => (
                                                        <Badge key={index} variant="secondary">{req}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {Object.keys(formData.specifications).length > 0 && (
                                            <div>
                                                <Label className="text-sm font-medium text-gray-600">Specifications</Label>
                                                <div className="space-y-1 mt-1">
                                                    {Object.entries(formData.specifications).map(([key, value]) => (
                                                        <div key={key} className="text-sm">
                                                            <span className="font-medium">{key}:</span> {value}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Previous
                            </Button>
                            
                            {currentStep < steps.length ? (
                                <Button onClick={nextStep}>
                                    Next
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={isSubmitting}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {isSubmitting ? "Creating..." : "Create RFQ"}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
