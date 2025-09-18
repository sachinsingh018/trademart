// COMMENTED OUT - Freight Quotes Component
/*
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
    Truck, 
    Ship, 
    Plane, 
    Train,
    MapPin,
    Package,
    Clock,
    DollarSign,
    Calendar,
    CheckCircle,
    AlertTriangle,
    TrendingUp,
    Globe,
    Weight,
    Ruler,
    Calculator,
    RefreshCw
} from "lucide-react";

interface FreightQuote {
    id: string;
    provider: string;
    service: string;
    mode: 'sea' | 'air' | 'road' | 'rail';
    origin: string;
    destination: string;
    price: number;
    currency: string;
    transitTime: number; // days
    validUntil: string;
    features: string[];
    restrictions: string[];
    tracking: boolean;
    insurance: boolean;
    customs: boolean;
    pickup: boolean;
    delivery: boolean;
}

interface FreightRequest {
    origin: string;
    destination: string;
    weight: number;
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    cargoType: string;
    value: number;
    currency: string;
    pickupDate: string;
    deliveryDate?: string;
    specialRequirements: string[];
}

interface FreightQuotesProps {
    onQuoteSelect?: (quote: FreightQuote) => void;
}

export default function FreightQuotes({ onQuoteSelect }: FreightQuotesProps) {
    const [quotes, setQuotes] = useState<FreightQuote[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [request, setRequest] = useState<FreightRequest>({
        origin: "",
        destination: "",
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        cargoType: "",
        value: 0,
        currency: "INR",
        pickupDate: "",
        specialRequirements: []
    });

    const cargoTypes = [
        "General Cargo",
        "Electronics",
        "Textiles",
        "Machinery",
        "Food & Beverage",
        "Chemicals",
        "Automotive Parts",
        "Construction Materials",
        "Pharmaceuticals",
        "Dangerous Goods"
    ];

    const cities = [
        "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
        "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur",
        "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad",
        "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik",
        "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar", "Varanasi"
    ];

    const getModeIcon = (mode: string) => {
        switch (mode) {
            case 'sea': return <Ship className="h-5 w-5" />;
            case 'air': return <Plane className="h-5 w-5" />;
            case 'road': return <Truck className="h-5 w-5" />;
            case 'rail': return <Train className="h-5 w-5" />;
            default: return <Truck className="h-5 w-5" />;
        }
    };

    const getModeColor = (mode: string) => {
        switch (mode) {
            case 'sea': return 'text-blue-600 bg-blue-100';
            case 'air': return 'text-purple-600 bg-purple-100';
            case 'road': return 'text-green-600 bg-green-100';
            case 'rail': return 'text-orange-600 bg-orange-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const calculateVolume = () => {
        const { length, width, height } = request.dimensions;
        return (length * width * height) / 1000000; // Convert to cubic meters
    };

    const getQuoteQuotes = async () => {
        if (!request.origin || !request.destination || !request.weight) {
            alert("Please fill in origin, destination, and weight");
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call to freight providers
            await new Promise(resolve => setTimeout(resolve, 2000));

            const mockQuotes: FreightQuote[] = [
                {
                    id: '1',
                    provider: 'DP World CARGOES',
                    service: 'Express Sea Freight',
                    mode: 'sea',
                    origin: request.origin,
                    destination: request.destination,
                    price: request.weight * 15 + calculateVolume() * 200,
                    currency: request.currency,
                    transitTime: 15,
                    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    features: ['Door-to-door', 'Customs clearance', 'Insurance included'],
                    restrictions: ['No dangerous goods', 'Max 20kg per package'],
                    tracking: true,
                    insurance: true,
                    customs: true,
                    pickup: true,
                    delivery: true
                },
                {
                    id: '2',
                    provider: 'Shiprocket',
                    service: 'Air Express',
                    mode: 'air',
                    origin: request.origin,
                    destination: request.destination,
                    price: request.weight * 45 + calculateVolume() * 500,
                    currency: request.currency,
                    transitTime: 3,
                    validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    features: ['Next day delivery', 'Real-time tracking', 'COD available'],
                    restrictions: ['Max 30kg', 'No liquids'],
                    tracking: true,
                    insurance: true,
                    customs: false,
                    pickup: true,
                    delivery: true
                },
                {
                    id: '3',
                    provider: 'Blue Dart',
                    service: 'Road Transport',
                    mode: 'road',
                    origin: request.origin,
                    destination: request.destination,
                    price: request.weight * 8 + calculateVolume() * 100,
                    currency: request.currency,
                    transitTime: 5,
                    validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                    features: ['Same day pickup', 'Cash on delivery', 'SMS alerts'],
                    restrictions: ['Max 50kg', 'No fragile items'],
                    tracking: true,
                    insurance: false,
                    customs: false,
                    pickup: true,
                    delivery: true
                },
                {
                    id: '4',
                    provider: 'Indian Railways',
                    service: 'Rail Freight',
                    mode: 'rail',
                    origin: request.origin,
                    destination: request.destination,
                    price: request.weight * 5 + calculateVolume() * 50,
                    currency: request.currency,
                    transitTime: 7,
                    validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                    features: ['Economical', 'Bulk transport', 'Station to station'],
                    restrictions: ['Min 100kg', 'No perishables'],
                    tracking: false,
                    insurance: false,
                    customs: false,
                    pickup: false,
                    delivery: false
                }
            ];

            setQuotes(mockQuotes);
        } catch (error) {
            console.error('Error fetching freight quotes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const selectQuote = (quote: FreightQuote) => {
        onQuoteSelect?.(quote);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Instant Freight Quotes</h2>
                <p className="text-gray-600 mb-4">
                    Compare rates from top logistics providers in real-time
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Ship className="h-4 w-4 text-blue-500" />
                        <span>Sea Freight</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Plane className="h-4 w-4 text-purple-500" />
                        <span>Air Express</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Truck className="h-4 w-4 text-green-500" />
                        <span>Road Transport</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Train className="h-4 w-4 text-orange-500" />
                        <span>Rail Freight</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Request Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5" />
                            Shipment Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Origin and Destination */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Origin City
                                </label>
                                <Select value={request.origin} onValueChange={(value) => setRequest({ ...request, origin: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select origin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map((city) => (
                                            <SelectItem key={city} value={city}>
                                                {city}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Destination City
                                </label>
                                <Select value={request.destination} onValueChange={(value) => setRequest({ ...request, destination: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select destination" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map((city) => (
                                            <SelectItem key={city} value={city}>
                                                {city}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Weight and Dimensions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Weight (kg)
                            </label>
                            <Input
                                type="number"
                                value={request.weight}
                                onChange={(e) => setRequest({ ...request, weight: parseFloat(e.target.value) || 0 })}
                                placeholder="Enter weight in kg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dimensions (cm)
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <Input
                                    type="number"
                                    placeholder="Length"
                                    value={request.dimensions.length}
                                    onChange={(e) => setRequest({
                                        ...request,
                                        dimensions: { ...request.dimensions, length: parseFloat(e.target.value) || 0 }
                                    })}
                                />
                                <Input
                                    type="number"
                                    placeholder="Width"
                                    value={request.dimensions.width}
                                    onChange={(e) => setRequest({
                                        ...request,
                                        dimensions: { ...request.dimensions, width: parseFloat(e.target.value) || 0 }
                                    })}
                                />
                                <Input
                                    type="number"
                                    placeholder="Height"
                                    value={request.dimensions.height}
                                    onChange={(e) => setRequest({
                                        ...request,
                                        dimensions: { ...request.dimensions, height: parseFloat(e.target.value) || 0 }
                                    })}
                                />
                            </div>
                            {calculateVolume() > 0 && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Volume: {calculateVolume().toFixed(2)} m³
                                </p>
                            )}
                        </div>

                        {/* Cargo Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cargo Type
                            </label>
                            <Select value={request.cargoType} onValueChange={(value) => setRequest({ ...request, cargoType: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select cargo type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cargoTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Value */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Declared Value
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    value={request.value}
                                    onChange={(e) => setRequest({ ...request, value: parseFloat(e.target.value) || 0 })}
                                    placeholder="Enter value"
                                />
                                <Select value={request.currency} onValueChange={(value) => setRequest({ ...request, currency: value })}>
                                    <SelectTrigger className="w-24">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INR">INR</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Pickup Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Preferred Pickup Date
                            </label>
                            <Input
                                type="date"
                                value={request.pickupDate}
                                onChange={(e) => setRequest({ ...request, pickupDate: e.target.value })}
                            />
                        </div>

                        {/* Get Quotes Button */}
                        <Button
                            onClick={getQuoteQuotes}
                            disabled={isLoading || !request.origin || !request.destination || !request.weight}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Getting Quotes...
                                </>
                            ) : (
                                <>
                                    <Calculator className="h-4 w-4 mr-2" />
                                    Get Instant Quotes
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Quotes Results */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Available Quotes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {quotes.length === 0 && !isLoading && (
                            <div className="text-center py-12">
                                <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Quotes Yet</h3>
                                <p className="text-gray-600">
                                    Fill in your shipment details and click &quot;Get Instant Quotes&quot; to see available options.
                                </p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Getting Quotes...</h3>
                                <p className="text-gray-600">
                                    Comparing rates from multiple providers...
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {quotes.map((quote) => (
                                <div key={quote.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${getModeColor(quote.mode)}`}>
                                                {getModeIcon(quote.mode)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{quote.provider}</h3>
                                                <p className="text-sm text-gray-600">{quote.service}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-green-600">
                                                ₹{quote.price.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-600">{quote.transitTime} days</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Mode</p>
                                            <Badge className={getModeColor(quote.mode)}>
                                                {quote.mode.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Transit Time</p>
                                            <p className="font-medium">{quote.transitTime} days</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Valid Until</p>
                                            <p className="font-medium">{new Date(quote.validUntil).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Features</p>
                                            <div className="flex flex-wrap gap-1">
                                                {quote.tracking && <Badge variant="outline" className="text-xs">Tracking</Badge>}
                                                {quote.insurance && <Badge variant="outline" className="text-xs">Insurance</Badge>}
                                                {quote.customs && <Badge variant="outline" className="text-xs">Customs</Badge>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Included Features</p>
                                        <div className="flex flex-wrap gap-2">
                                            {quote.features.map((feature, index) => (
                                                <div key={index} className="flex items-center gap-1">
                                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                                    <span className="text-xs text-gray-600">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Restrictions */}
                                    {quote.restrictions.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Restrictions</p>
                                            <div className="flex flex-wrap gap-2">
                                                {quote.restrictions.map((restriction, index) => (
                                                    <div key={index} className="flex items-center gap-1">
                                                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                                                        <span className="text-xs text-gray-600">{restriction}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Button 
                                            size="sm" 
                                            className="flex-1"
                                            onClick={() => selectQuote(quote)}
                                        >
                                            Select This Quote
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

{/* Provider Information */ }
<Card>
    <CardHeader>
        <CardTitle>Integrated Logistics Providers</CardTitle>
    </CardHeader>
    <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
                <Ship className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold">DP World CARGOES</h3>
                <p className="text-sm text-gray-600">Global sea freight</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
                <Plane className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold">Shiprocket</h3>
                <p className="text-sm text-gray-600">Air express delivery</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
                <Truck className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">Blue Dart</h3>
                <p className="text-sm text-gray-600">Road transport</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
                <Train className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-semibold">Indian Railways</h3>
                <p className="text-sm text-gray-600">Rail freight</p>
            </div>
        </div>
    </CardContent>
</Card>
        </div >
    );
}
*/

export default function FreightQuotes() {
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Freight Quotes</h2>
            <p className="text-gray-600">This component is currently disabled</p>
        </div>
    );
}
