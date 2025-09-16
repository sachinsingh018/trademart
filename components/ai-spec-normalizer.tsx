"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Wand2, 
    FileText, 
    CheckCircle, 
    AlertTriangle,
    Lightbulb,
    Globe,
    Package,
    Calculator,
    Shield,
    Clock
} from "lucide-react";

interface NormalizedRFQ {
    title: string;
    description: string;
    category: string;
    subcategory: string;
    quantity: number;
    unit: string;
    budget: number;
    currency: string;
    requirements: string[];
    specifications: Record<string, any>;
    incoterms: string;
    paymentTerms: string;
    deliveryTerms: string;
    qualityStandards: string[];
    certifications: string[];
    moq: number;
    hsCode: string;
    landedCost: number;
    riskScore: number;
    suggestions: string[];
}

interface AISpecNormalizerProps {
    onNormalizedRFQ: (rfq: NormalizedRFQ) => void;
}

export default function AISpecNormalizer({ onNormalizedRFQ }: AISpecNormalizerProps) {
    const [rawRFQ, setRawRFQ] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [normalizedRFQ, setNormalizedRFQ] = useState<NormalizedRFQ | null>(null);
    const [processingStep, setProcessingStep] = useState("");

    const processRFQ = async () => {
        if (!rawRFQ.trim()) return;

        setIsProcessing(true);
        setProcessingStep("Analyzing RFQ content...");

        try {
            // Simulate AI processing steps
            await new Promise(resolve => setTimeout(resolve, 1000));
            setProcessingStep("Extracting product specifications...");

            await new Promise(resolve => setTimeout(resolve, 1000));
            setProcessingStep("Standardizing requirements...");

            await new Promise(resolve => setTimeout(resolve, 1000));
            setProcessingStep("Calculating MOQ and pricing...");

            await new Promise(resolve => setTimeout(resolve, 1000));
            setProcessingStep("Generating HS codes and compliance...");

            await new Promise(resolve => setTimeout(resolve, 1000));
            setProcessingStep("Finalizing normalized RFQ...");

            // Generate normalized RFQ based on input
            const normalized = generateNormalizedRFQ(rawRFQ);
            setNormalizedRFQ(normalized);
            setProcessingStep("Complete!");
        } catch (error) {
            console.error('Error processing RFQ:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const generateNormalizedRFQ = (rawText: string): NormalizedRFQ => {
        // AI-powered RFQ normalization logic
        const text = rawText.toLowerCase();
        
        // Extract category
        let category = "General";
        if (text.includes("electronic") || text.includes("circuit") || text.includes("chip")) {
            category = "Electronics";
        } else if (text.includes("textile") || text.includes("fabric") || text.includes("cloth")) {
            category = "Textiles & Apparel";
        } else if (text.includes("machine") || text.includes("equipment") || text.includes("tool")) {
            category = "Machinery";
        } else if (text.includes("food") || text.includes("beverage") || text.includes("packaging")) {
            category = "Food & Beverage";
        }

        // Extract quantity
        const quantityMatch = rawText.match(/(\d+)\s*(pcs|pieces|units|kg|tons|meters|yards)/i);
        const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1000;
        const unit = quantityMatch ? quantityMatch[2] : "pcs";

        // Extract budget
        const budgetMatch = rawText.match(/₹?(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:per|each|unit)?/i);
        const unitPrice = budgetMatch ? parseFloat(budgetMatch[1].replace(/,/g, '')) : 100;
        const budget = unitPrice * quantity;

        // Generate specifications
        const specifications = {
            material: extractMaterial(rawText),
            dimensions: extractDimensions(rawText),
            color: extractColor(rawText),
            finish: extractFinish(rawText),
            packaging: extractPackaging(rawText)
        };

        // Generate requirements
        const requirements = [
            "ISO 9001:2015 certification",
            "Quality control documentation",
            "Sample approval required",
            "Third-party inspection available"
        ];

        // Generate quality standards
        const qualityStandards = [
            "AQL 2.5 for visual inspection",
            "Dimensional tolerance ±2%",
            "Material certificate required"
        ];

        // Generate certifications
        const certifications = [
            "ISO 9001:2015",
            "CE Marking (if applicable)",
            "RoHS Compliance (if applicable)"
        ];

        // Calculate MOQ
        const moq = Math.max(100, Math.floor(quantity * 0.1));

        // Generate HS code
        const hsCode = generateHSCode(category);

        // Calculate landed cost
        const landedCost = budget * 1.25; // 25% markup for shipping, duties, etc.

        // Calculate risk score
        const riskScore = calculateRiskScore(category, quantity, budget);

        // Generate suggestions
        const suggestions = generateSuggestions(category, quantity, budget);

        return {
            title: generateTitle(rawText),
            description: rawRFQ,
            category,
            subcategory: generateSubcategory(category, rawText),
            quantity,
            unit,
            budget,
            currency: "INR",
            requirements,
            specifications,
            incoterms: "FOB",
            paymentTerms: "30% advance, 70% against documents",
            deliveryTerms: "30-45 days from order confirmation",
            qualityStandards,
            certifications,
            moq,
            hsCode,
            landedCost,
            riskScore,
            suggestions
        };
    };

    const extractMaterial = (text: string): string => {
        if (text.includes("steel") || text.includes("metal")) return "Steel";
        if (text.includes("plastic") || text.includes("polymer")) return "Plastic";
        if (text.includes("wood") || text.includes("timber")) return "Wood";
        if (text.includes("fabric") || text.includes("cotton")) return "Fabric";
        return "As per specification";
    };

    const extractDimensions = (text: string): string => {
        const dimensionMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:x|×)\s*(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(\d+(?:\.\d+)?)?\s*(mm|cm|m|inch|inches)/i);
        if (dimensionMatch) {
            return `${dimensionMatch[1]} x ${dimensionMatch[2]}${dimensionMatch[3] ? ` x ${dimensionMatch[3]}` : ''} ${dimensionMatch[4]}`;
        }
        return "As per specification";
    };

    const extractColor = (text: string): string => {
        const colors = ["red", "blue", "green", "yellow", "black", "white", "gray", "brown"];
        const foundColor = colors.find(color => text.includes(color));
        return foundColor || "As per specification";
    };

    const extractFinish = (text: string): string => {
        if (text.includes("polished") || text.includes("shine")) return "Polished";
        if (text.includes("matt") || text.includes("matte")) return "Matte";
        if (text.includes("coated") || text.includes("coating")) return "Coated";
        return "Standard";
    };

    const extractPackaging = (text: string): string => {
        if (text.includes("export") || text.includes("international")) return "Export standard packaging";
        if (text.includes("bulk") || text.includes("loose")) return "Bulk packaging";
        return "Standard packaging";
    };

    const generateTitle = (text: string): string => {
        const words = text.split(' ').slice(0, 8);
        return words.join(' ') + (text.split(' ').length > 8 ? '...' : '');
    };

    const generateSubcategory = (category: string, text: string): string => {
        switch (category) {
            case "Electronics":
                return "Electronic Components";
            case "Textiles & Apparel":
                return "Fabric & Textiles";
            case "Machinery":
                return "Industrial Equipment";
            case "Food & Beverage":
                return "Food Packaging";
            default:
                return "General";
        }
    };

    const generateHSCode = (category: string): string => {
        const hsCodes = {
            "Electronics": "8541.40.00",
            "Textiles & Apparel": "6203.42.00",
            "Machinery": "8479.89.00",
            "Food & Beverage": "4819.10.00",
            "General": "9999.99.00"
        };
        return hsCodes[category] || "9999.99.00";
    };

    const calculateRiskScore = (category: string, quantity: number, budget: number): number => {
        let score = 50; // Base score
        
        // Category risk
        if (category === "Electronics") score += 10;
        if (category === "Food & Beverage") score += 15;
        
        // Quantity risk
        if (quantity > 10000) score += 10;
        if (quantity < 100) score += 5;
        
        // Budget risk
        if (budget > 1000000) score += 10;
        if (budget < 10000) score += 5;
        
        return Math.min(100, Math.max(0, score));
    };

    const generateSuggestions = (category: string, quantity: number, budget: number): string[] => {
        const suggestions = [];
        
        if (quantity < 100) {
            suggestions.push("Consider increasing quantity to meet MOQ requirements");
        }
        
        if (budget < 50000) {
            suggestions.push("Budget might be too low for quality suppliers");
        }
        
        if (category === "Electronics") {
            suggestions.push("Specify RoHS compliance requirements");
            suggestions.push("Include CE marking requirements");
        }
        
        suggestions.push("Consider FOB terms for better cost control");
        suggestions.push("Request samples before bulk order");
        
        return suggestions;
    };

    const getRiskColor = (score: number) => {
        if (score < 30) return "text-green-600";
        if (score < 60) return "text-yellow-600";
        return "text-red-600";
    };

    const getRiskLevel = (score: number) => {
        if (score < 30) return "Low";
        if (score < 60) return "Medium";
        return "High";
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5" />
                        AI Spec Normalizer
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Upload your rough RFQ and let AI standardize it with proper specifications, MOQs, HS codes, and Incoterms
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Raw RFQ Description
                        </label>
                        <Textarea
                            value={rawRFQ}
                            onChange={(e) => setRawRFQ(e.target.value)}
                            placeholder="Paste your rough RFQ here... e.g., 'Need 1000 pieces of electronic components, good quality, budget around 50k, need delivery in 30 days'"
                            rows={6}
                            className="w-full"
                        />
                    </div>

                    <Button
                        onClick={processRFQ}
                        disabled={!rawRFQ.trim() || isProcessing}
                        className="w-full"
                    >
                        {isProcessing ? (
                            <>
                                <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                                {processingStep}
                            </>
                        ) : (
                            <>
                                <Wand2 className="h-4 w-4 mr-2" />
                                Normalize RFQ with AI
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {normalizedRFQ && (
                <div className="space-y-6">
                    {/* Normalized RFQ Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Normalized RFQ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Title</label>
                                    <p className="text-lg font-semibold">{normalizedRFQ.title}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Category</label>
                                    <Badge variant="outline">{normalizedRFQ.category}</Badge>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Quantity</label>
                                    <p className="text-lg">{normalizedRFQ.quantity.toLocaleString()} {normalizedRFQ.unit}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Budget</label>
                                    <p className="text-lg font-semibold text-green-600">₹{normalizedRFQ.budget.toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">MOQ</label>
                                    <p className="text-lg">{normalizedRFQ.moq.toLocaleString()} {normalizedRFQ.unit}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">HS Code</label>
                                    <p className="text-lg font-mono">{normalizedRFQ.hsCode}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Specifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Product Specifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(normalizedRFQ.specifications).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="text-sm font-medium text-gray-600 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </label>
                                        <p className="text-lg">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trade Terms */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Trade Terms & Compliance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Incoterms</label>
                                    <p className="text-lg font-semibold">{normalizedRFQ.incoterms}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Payment Terms</label>
                                    <p className="text-lg">{normalizedRFQ.paymentTerms}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Delivery Terms</label>
                                    <p className="text-lg">{normalizedRFQ.deliveryTerms}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Quality Standards</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {normalizedRFQ.qualityStandards.map((standard, index) => (
                                        <Badge key={index} variant="secondary">{standard}</Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Certifications Required</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {normalizedRFQ.certifications.map((cert, index) => (
                                        <Badge key={index} variant="outline">{cert}</Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Risk Assessment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Risk Assessment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Risk Score</p>
                                    <p className={`text-2xl font-bold ${getRiskColor(normalizedRFQ.riskScore)}`}>
                                        {normalizedRFQ.riskScore}/100
                                    </p>
                                    <p className="text-sm text-gray-600">Risk Level: {getRiskLevel(normalizedRFQ.riskScore)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Landed Cost</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        ₹{normalizedRFQ.landedCost.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-600">Including shipping & duties</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Suggestions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5" />
                                AI Suggestions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {normalizedRFQ.suggestions.map((suggestion, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-700">{suggestion}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button
                            onClick={() => onNormalizedRFQ(normalizedRFQ)}
                            className="flex-1"
                        >
                            Use This Normalized RFQ
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setNormalizedRFQ(null);
                                setRawRFQ("");
                            }}
                        >
                            Start Over
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
