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
    company?: string;
    country?: string;
    rating?: number;
    verified?: boolean;
    price?: number;
    currency?: string;
    image?: string;
}

interface SearchPopupProps {
    isOpen: boolean;
    onClose: () => void;
    searchTerm: string;
}

export default function SearchPopup({ isOpen, onClose, searchTerm }: SearchPopupProps) {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Close popup with Escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    // Search functionality
    useEffect(() => {
        if (searchTerm && isOpen) {
            performSearch(searchTerm);
        }
    }, [searchTerm, isOpen]);

    const performSearch = async (term: string) => {
        setLoading(true);
        try {
            // Search suppliers
            const suppliersResponse = await fetch(`/api/suppliers?search=${encodeURIComponent(term)}&limit=1`);
            const suppliersData = await suppliersResponse.json();

            // Search products
            const productsResponse = await fetch(`/api/products?search=${encodeURIComponent(term)}&limit=1`);
            const productsData = await productsResponse.json();

            const searchResults: SearchResult[] = [];

            // Add supplier results
            if (suppliersData.success && suppliersData.data.suppliers.length > 0) {
                suppliersData.data.suppliers.forEach((supplier: any) => {
                    searchResults.push({
                        id: supplier.id,
                        type: "supplier",
                        title: supplier.companyName,
                        description: supplier.description || "Verified supplier",
                        category: supplier.industry,
                        company: supplier.companyName,
                        country: supplier.country,
                        rating: parseFloat(supplier.rating.toString()),
                        verified: supplier.verified,
                    });
                });
            }

            // Add product results
            if (productsData.success && productsData.data.products.length > 0) {
                productsData.data.products.forEach((product: any) => {
                    searchResults.push({
                        id: product.id,
                        type: "product",
                        title: product.name,
                        description: product.description || "Quality product",
                        category: product.category,
                        price: product.price ? parseFloat(product.price.toString()) : 0,
                        currency: product.currency || "USD",
                        image: product.images?.[0]?.url,
                    });
                });
            }

            setResults(searchResults.slice(0, 2)); // Limit to 2 results as requested
        } catch (error) {
            console.error("Search error:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20">
            <div
                ref={popupRef}
                className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                        <Search className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Search Results for "{searchTerm}"
                        </h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="hover:bg-gray-100 rounded-full p-2"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <span className="ml-3 text-gray-600">Searching...</span>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-8">
                            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-gray-900 mb-2">No results found</h4>
                            <p className="text-gray-600">
                                Try searching for different keywords or browse our categories
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {results.map((result) => (
                                <Card key={`${result.type}-${result.id}`} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${result.type === "supplier"
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "bg-green-100 text-green-600"
                                                    }`}>
                                                    {result.type === "supplier" ? (
                                                        <Building2 className="w-5 h-5" />
                                                    ) : (
                                                        <Package className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg mb-1">{result.title}</CardTitle>
                                                    <CardDescription className="text-sm">
                                                        {result.type === "supplier" ? (
                                                            <>
                                                                {result.company} • {result.country}
                                                            </>
                                                        ) : (
                                                            result.category
                                                        )}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-1">
                                                {result.type === "supplier" && result.verified && (
                                                    <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                                        ✓ Verified
                                                    </Badge>
                                                )}
                                                {result.rating && (
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                                        {result.rating}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {result.description}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-sm">
                                                    {result.type === "supplier" ? (
                                                        <>
                                                            <div className="flex items-center text-gray-600">
                                                                <MapPin className="w-3 h-3 mr-1" />
                                                                {result.country}
                                                            </div>
                                                            <Badge variant="outline" className="text-xs">
                                                                {result.category}
                                                            </Badge>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="text-gray-600">
                                                                Category: <span className="font-medium">{result.category}</span>
                                                            </div>
                                                            {result.price && (
                                                                <div className="text-gray-600">
                                                                    Price: <span className="font-medium text-green-600">
                                                                        {result.currency} {result.price.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-gray-200 flex justify-end">
                                                <Link
                                                    href={result.type === "supplier" ? `/suppliers/${result.id}` : `/products/${result.id}`}
                                                    onClick={onClose}
                                                >
                                                    <Button
                                                        size="sm"
                                                        className={`${result.type === "supplier"
                                                                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                                                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                                            } text-white`}
                                                    >
                                                        View {result.type === "supplier" ? "Profile" : "Product"}
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing {results.length} result{results.length !== 1 ? 's' : ''} for "{searchTerm}"
                        </p>
                        <div className="flex gap-2">
                            <Link href={`/suppliers?search=${encodeURIComponent(searchTerm)}`} onClick={onClose}>
                                <Button variant="outline" size="sm">
                                    View All Suppliers
                                </Button>
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
