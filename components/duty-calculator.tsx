"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
    Calculator, 
    Globe, 
    Package, 
    DollarSign,
    TrendingUp,
    Info,
    Download,
    RefreshCw,
    MapPin,
    Truck,
    Shield,
    FileText
} from "lucide-react";

interface Country {
    code: string;
    name: string;
    currency: string;
    dutyRate: number;
    vatRate: number;
    additionalFees: number;
}

interface Product {
    name: string;
    hsCode: string;
    category: string;
    dutyRate: number;
    vatRate: number;
    restrictions: string[];
}

interface CalculationResult {
    productValue: number;
    dutyAmount: number;
    vatAmount: number;
    shippingCost: number;
    insuranceCost: number;
    handlingFees: number;
    totalLandedCost: number;
    breakdown: {
        item: string;
        amount: number;
        percentage: number;
    }[];
}

interface DutyCalculatorProps {
    onCalculationComplete?: (result: CalculationResult) => void;
}

export default function DutyCalculator({ onCalculationComplete }: DutyCalculatorProps) {
    const [originCountry, setOriginCountry] = useState("IN");
    const [destinationCountry, setDestinationCountry] = useState("US");
    const [productValue, setProductValue] = useState("");
    const [currency, setCurrency] = useState("INR");
    const [hsCode, setHsCode] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [shippingMethod, setShippingMethod] = useState("sea");
    const [shippingCost, setShippingCost] = useState("");
    const [insuranceCost, setInsuranceCost] = useState("");
    const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const countries: Country[] = [
        { code: "IN", name: "India", currency: "INR", dutyRate: 0, vatRate: 0, additionalFees: 0 },
        { code: "US", name: "United States", currency: "USD", dutyRate: 3.5, vatRate: 0, additionalFees: 0.5 },
        { code: "GB", name: "United Kingdom", currency: "GBP", dutyRate: 2.5, vatRate: 20, additionalFees: 0.3 },
        { code: "DE", name: "Germany", currency: "EUR", dutyRate: 2.0, vatRate: 19, additionalFees: 0.2 },
        { code: "FR", name: "France", currency: "EUR", dutyRate: 2.0, vatRate: 20, additionalFees: 0.2 },
        { code: "CA", name: "Canada", currency: "CAD", dutyRate: 4.0, vatRate: 13, additionalFees: 0.4 },
        { code: "AU", name: "Australia", currency: "AUD", dutyRate: 5.0, vatRate: 10, additionalFees: 0.5 },
        { code: "JP", name: "Japan", currency: "JPY", dutyRate: 3.0, vatRate: 10, additionalFees: 0.3 },
        { code: "CN", name: "China", currency: "CNY", dutyRate: 6.0, vatRate: 13, additionalFees: 0.6 },
        { code: "BR", name: "Brazil", currency: "BRL", dutyRate: 8.0, vatRate: 18, additionalFees: 0.8 },
        { code: "MX", name: "Mexico", currency: "MXN", dutyRate: 7.0, vatRate: 16, additionalFees: 0.7 },
        { code: "AE", name: "UAE", currency: "AED", dutyRate: 5.0, vatRate: 5, additionalFees: 0.5 }
    ];

    const productCategories = [
        "Electronics",
        "Textiles & Apparel",
        "Machinery",
        "Food & Beverage",
        "Chemicals",
        "Automotive",
        "Construction",
        "Healthcare",
        "Agriculture",
        "Other"
    ];

    const shippingMethods = [
        { value: "sea", label: "Sea Freight", multiplier: 1.0 },
        { value: "air", label: "Air Freight", multiplier: 3.0 },
        { value: "road", label: "Road Transport", multiplier: 0.5 },
        { value: "rail", label: "Rail Transport", multiplier: 0.3 }
    ];

    const calculateDuty = async () => {
        if (!productValue || !hsCode) {
            alert("Please enter product value and HS code");
            return;
        }

        setIsCalculating(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const origin = countries.find(c => c.code === originCountry);
            const destination = countries.find(c => c.code === destinationCountry);
            const shipping = shippingMethods.find(s => s.value === shippingMethod);

            if (!origin || !destination || !shipping) return;

            const baseValue = parseFloat(productValue);
            const baseShipping = parseFloat(shippingCost) || 0;
            const baseInsurance = parseFloat(insuranceCost) || 0;

            // Calculate duty based on HS code and product category
            const dutyRate = getDutyRate(hsCode, productCategory, destination.code);
            const dutyAmount = baseValue * (dutyRate / 100);

            // Calculate VAT/GST
            const vatAmount = (baseValue + dutyAmount) * (destination.vatRate / 100);

            // Calculate shipping cost with method multiplier
            const adjustedShippingCost = baseShipping * shipping.multiplier;

            // Calculate insurance (typically 0.1% of product value)
            const calculatedInsurance = baseInsurance || (baseValue * 0.001);

            // Calculate handling fees (typically 0.5% of total value)
            const handlingFees = (baseValue + dutyAmount + vatAmount) * 0.005;

            // Calculate total landed cost
            const totalLandedCost = baseValue + dutyAmount + vatAmount + adjustedShippingCost + calculatedInsurance + handlingFees;

            const result: CalculationResult = {
                productValue: baseValue,
                dutyAmount,
                vatAmount,
                shippingCost: adjustedShippingCost,
                insuranceCost: calculatedInsurance,
                handlingFees,
                totalLandedCost,
                breakdown: [
                    { item: "Product Value", amount: baseValue, percentage: (baseValue / totalLandedCost) * 100 },
                    { item: "Duty", amount: dutyAmount, percentage: (dutyAmount / totalLandedCost) * 100 },
                    { item: "VAT/GST", amount: vatAmount, percentage: (vatAmount / totalLandedCost) * 100 },
                    { item: "Shipping", amount: adjustedShippingCost, percentage: (adjustedShippingCost / totalLandedCost) * 100 },
                    { item: "Insurance", amount: calculatedInsurance, percentage: (calculatedInsurance / totalLandedCost) * 100 },
                    { item: "Handling Fees", amount: handlingFees, percentage: (handlingFees / totalLandedCost) * 100 }
                ]
            };

            setCalculationResult(result);
            onCalculationComplete?.(result);
        } catch (error) {
            console.error('Error calculating duty:', error);
        } finally {
            setIsCalculating(false);
        }
    };

    const getDutyRate = (hsCode: string, category: string, countryCode: string): number => {
        // Mock duty rate calculation based on HS code and category
        const baseRates: Record<string, number> = {
            "Electronics": 3.0,
            "Textiles & Apparel": 12.0,
            "Machinery": 5.0,
            "Food & Beverage": 15.0,
            "Chemicals": 8.0,
            "Automotive": 6.0,
            "Construction": 4.0,
            "Healthcare": 2.0,
            "Agriculture": 10.0,
            "Other": 5.0
        };

        let rate = baseRates[category] || 5.0;

        // Adjust based on HS code
        if (hsCode.startsWith("85")) rate *= 0.8; // Electronics
        if (hsCode.startsWith("62") || hsCode.startsWith("61")) rate *= 1.5; // Textiles
        if (hsCode.startsWith("84") || hsCode.startsWith("87")) rate *= 1.2; // Machinery

        // Adjust based on destination country
        const countryMultipliers: Record<string, number> = {
            "US": 1.0,
            "GB": 0.8,
            "DE": 0.7,
            "FR": 0.7,
            "CA": 1.1,
            "AU": 1.2,
            "JP": 0.9,
            "CN": 1.3,
            "BR": 1.5,
            "MX": 1.4,
            "AE": 1.0
        };

        rate *= (countryMultipliers[countryCode] || 1.0);

        return Math.min(rate, 25); // Cap at 25%
    };

    const exportCalculation = () => {
        if (!calculationResult) return;

        const data = {
            origin: countries.find(c => c.code === originCountry)?.name,
            destination: countries.find(c => c.code === destinationCountry)?.name,
            productValue: calculationResult.productValue,
            hsCode,
            productCategory,
            shippingMethod: shippingMethods.find(s => s.value === shippingMethod)?.label,
            breakdown: calculationResult.breakdown,
            totalLandedCost: calculationResult.totalLandedCost,
            calculatedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `duty-calculation-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const resetCalculation = () => {
        setProductValue("");
        setHsCode("");
        setProductCategory("");
        setShippingCost("");
        setInsuranceCost("");
        setCalculationResult(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Duty & Tax Calculator</h2>
                    <p className="text-gray-600">Calculate landed cost for international trade</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={resetCalculation}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                    {calculationResult && (
                        <Button variant="outline" onClick={exportCalculation}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5" />
                            Calculation Inputs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Origin and Destination */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Origin Country
                                </label>
                                <Select value={originCountry} onValueChange={setOriginCountry}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country.code} value={country.code}>
                                                <div className="flex items-center gap-2">
                                                    <span>{country.name}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {country.code}
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Destination Country
                                </label>
                                <Select value={destinationCountry} onValueChange={setDestinationCountry}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country.code} value={country.code}>
                                                <div className="flex items-center gap-2">
                                                    <span>{country.name}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {country.code}
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Product Information */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Value
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    value={productValue}
                                    onChange={(e) => setProductValue(e.target.value)}
                                    placeholder="Enter product value"
                                />
                                <Select value={currency} onValueChange={setCurrency}>
                                    <SelectTrigger className="w-24">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INR">INR</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                        <SelectItem value="GBP">GBP</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                HS Code
                            </label>
                            <Input
                                value={hsCode}
                                onChange={(e) => setHsCode(e.target.value)}
                                placeholder="e.g., 8517.12.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Category
                            </label>
                            <Select value={productCategory} onValueChange={setProductCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {productCategories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Shipping Information */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Shipping Method
                            </label>
                            <Select value={shippingMethod} onValueChange={setShippingMethod}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {shippingMethods.map((method) => (
                                        <SelectItem key={method.value} value={method.value}>
                                            {method.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Shipping Cost
                                </label>
                                <Input
                                    type="number"
                                    value={shippingCost}
                                    onChange={(e) => setShippingCost(e.target.value)}
                                    placeholder="Enter shipping cost"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Insurance Cost
                                </label>
                                <Input
                                    type="number"
                                    value={insuranceCost}
                                    onChange={(e) => setInsuranceCost(e.target.value)}
                                    placeholder="Enter insurance cost"
                                />
                            </div>
                        </div>

                        <Button 
                            onClick={calculateDuty}
                            disabled={isCalculating || !productValue || !hsCode}
                            className="w-full"
                        >
                            {isCalculating ? (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Calculating...
                                </>
                            ) : (
                                <>
                                    <Calculator className="h-4 w-4 mr-2" />
                                    Calculate Landed Cost
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Calculation Results
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {calculationResult ? (
                            <div className="space-y-6">
                                {/* Total Landed Cost */}
                                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Landed Cost</h3>
                                    <p className="text-4xl font-bold text-blue-600">
                                        ₹{calculationResult.totalLandedCost.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {((calculationResult.totalLandedCost / calculationResult.productValue - 1) * 100).toFixed(1)}% above product value
                                    </p>
                                </div>

                                {/* Cost Breakdown */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                                    <div className="space-y-3">
                                        {calculationResult.breakdown.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                    <span className="font-medium">{item.item}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">₹{item.amount.toLocaleString()}</p>
                                                    <p className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="space-y-4">
                                    <div className="p-4 bg-yellow-50 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-yellow-800">Important Notes</h4>
                                                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                                                    <li>• Duty rates may vary based on trade agreements</li>
                                                    <li>• Additional fees may apply for certain products</li>
                                                    <li>• Exchange rates fluctuate daily</li>
                                                    <li>• Consult with customs broker for final calculation</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-green-800">Trade Agreements</h4>
                                                <p className="text-sm text-green-700 mt-1">
                                                    Check if your products qualify for preferential duty rates under existing trade agreements.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Calculation Yet</h3>
                                <p className="text-gray-600">
                                    Enter your product details and click &quot;Calculate Landed Cost&quot; to see the breakdown.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Country Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Country Duty Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {countries.map((country) => (
                            <div key={country.code} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold">{country.name}</h3>
                                    <Badge variant="outline">{country.code}</Badge>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p>Currency: {country.currency}</p>
                                    <p>Avg Duty Rate: {country.dutyRate}%</p>
                                    <p>VAT/GST: {country.vatRate}%</p>
                                    <p>Additional Fees: {country.additionalFees}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
