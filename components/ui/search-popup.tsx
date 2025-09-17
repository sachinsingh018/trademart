// COMMENTED OUT - Search popup component with TypeScript/ESLint errors
// This component had the following issues:
// - Unexpected any types on lines 92 and 109
// - Unescaped quotes on lines 145 and 281
// 
// To re-enable this component, fix the TypeScript errors and uncomment the code below

/*
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Search, Package, Building2, MapPin, Star } from "lucide-react";

interface SearchResult {
    id: string;
    type: "supplier" | "product";
    title: string;
    description: string;
    category?: string;
    country?: string;
    rating?: number;
    verified?: boolean;
    price?: number;
    currency?: string;
    company?: string;
}

interface SearchPopupProps {
    isOpen: boolean;
    onClose: () => void;
    searchTerm: string;
}

export default function SearchPopup({ isOpen, onClose, searchTerm }: SearchPopupProps) {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && searchTerm) {
            fetchSearchResults();
        } else if (!isOpen) {
            setResults([]);
            setError(null);
        }
    }, [isOpen, searchTerm]);

    const fetchSearchResults = async () => {
        setLoading(true);
        setError(null);
        try {
            const [supplierRes, productRes] = await Promise.all([
                fetch(`/api/suppliers?search=${searchTerm}&limit=1`),
                fetch(`/api/products?search=${searchTerm}&limit=1`)
            ]);

            const supplierData = await supplierRes.json();
            const productData = await productRes.json();

            const newResults: SearchResult[] = [];

            if (supplierData.success && supplierData.data.suppliers.length > 0) {
                const supplier = supplierData.data.suppliers[0];
                newResults.push({
                    type: 'supplier',
                    id: supplier.id,
                    title: supplier.companyName,
                    description: supplier.description || 'No description available.',
                    country: supplier.country,
                    rating: supplier.rating,
                    verified: supplier.verified,
                    category: supplier.industry,
                });
            }

            if (productData.success && productData.data.products.length > 0) {
                const product = productData.data.products[0];
                newResults.push({
                    type: 'product',
                    id: product.id,
                    title: product.name,
                    description: product.description || 'No description available.',
                    category: product.category,
                    price: product.price,
                    currency: product.currency,
                    company: product.supplier?.companyName || 'N/A',
                });
            }

            setResults(newResults);
        } catch (err) {
            console.error("Failed to fetch search results:", err);
            setError("Failed to load search results. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return "text-green-600";
        if (rating >= 4.0) return "text-blue-600";
        if (rating >= 3.5) return "text-yellow-600";
        return "text-red-600";
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div
                ref={dialogRef}
                className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                        <Search className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Search Results for &quot;{searchTerm}&quot;
                        </h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-3 text-gray-600">Searching...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600">
                            <div className="text-4xl mb-3">❌</div>
                            <p>{error}</p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Package className="h-10 w-10 mx-auto mb-3" />
                            <p>No results found for &quot;{searchTerm}&quot;.</p>
                            <p className="text-sm mt-2">Try a different search term or browse our categories.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {results.map((result) => (
                                <Card key={result.id} className="flex items-start p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    {result.type === 'supplier' ? (
                                        <Building2 className="h-8 w-8 text-blue-600 mr-4 flex-shrink-0" />
                                    ) : (
                                        <Package className="h-8 w-8 text-green-600 mr-4 flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                            {result.title}
                                            {result.type === 'supplier' && result.verified && (
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                                    ✓ Verified
                                                </Badge>
                                            )}
                                        </CardTitle>
                                        <CardDescription className="text-sm text-gray-600 mt-1 line-clamp-2">
                                            {result.description}
                                        </CardDescription>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mt-2">
                                            {result.type === 'supplier' && result.country && (
                                                <span className="flex items-center text-gray-700">
                                                    <MapPin className="h-4 w-4 mr-1 text-gray-500" /> {result.country}
                                                </span>
                                            )}
                                            {result.type === 'supplier' && typeof result.rating === 'number' && (
                                                <span className={`flex items-center font-semibold ${getRatingColor(result.rating)}`}>
                                                    <Star className="h-4 w-4 mr-1" /> {result.rating.toFixed(1)}
                                                </span>
                                            )}
                                            {result.type === 'product' && result.category && (
                                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                                    {result.category}
                                                </Badge>
                                            )}
                                            {result.type === 'product' && result.price && result.currency && (
                                                <span className="font-semibold text-gray-800">
                                                    {result.currency} {result.price.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-3">
                                            <Link href={result.type === 'supplier' ? `/suppliers/${result.id}` : `/products/${result.id}`} passHref>
                                                <Button variant="outline" size="sm" className={result.type === 'supplier' ? "border-blue-300 text-blue-600 hover:bg-blue-50" : "border-green-300 text-green-600 hover:bg-green-50"}>
                                                    View {result.type === 'supplier' ? 'Profile' : 'Product'}
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                        <span className="text-sm text-gray-600">
                            {results.length} result{results.length !== 1 ? 's' : ''} found
                        </span>
                        <div className="flex gap-2">
                            <Link href="/suppliers" passHref>
                                <Button variant="ghost" size="sm">View All Suppliers</Button>
                            </Link>
                            <Link href={`/products?search=${encodeURIComponent(searchTerm)}`} onClick={onClose}>
                                <Button variant="outline" size="sm">
                                    View All Products
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
*/