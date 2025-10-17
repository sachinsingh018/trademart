"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import PageTitle from "@/components/ui/page-title";
import { usePopup } from "@/contexts/PopupContext";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { Building2, MapPin, Globe, ExternalLink, Search, Filter, Download } from "lucide-react";

interface BusinessLead {
    id: string;
    name: string;
    description: string;
    primaryIndustry: string;
    location: string;
    country: string;
    domain: string;
    linkedinUrl: string;
}

export default function BusinessLeadsPage() {
    const { data: session } = useSession();
    const { setIsPopupActive } = usePopup();
    const [businessLeads, setBusinessLeads] = useState<BusinessLead[]>([]);
    const [filteredLeads, setFilteredLeads] = useState<BusinessLead[]>([]);
    const [loading, setLoading] = useState(true);
    const { toasts, removeToast, warning } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIndustry, setSelectedIndustry] = useState("all");
    const [selectedCountry, setSelectedCountry] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [showOverlay, setShowOverlay] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

    // Parse CSV data
    useEffect(() => {
        const parseCSVData = async () => {
            try {
                const response = await fetch('/Companies.csv');
                if (!response.ok) {
                    throw new Error('Failed to fetch CSV data');
                }
                const csvText = await response.text();

                // Parse CSV with proper handling of multi-line fields
                const parseCSV = (csvText: string): string[][] => {
                    const rows: string[][] = [];
                    let currentRow: string[] = [];
                    let currentField = '';
                    let inQuotes = false;
                    let i = 0;

                    while (i < csvText.length) {
                        const char = csvText[i];
                        const nextChar = csvText[i + 1];

                        if (char === '"') {
                            if (inQuotes && nextChar === '"') {
                                // Escaped quote
                                currentField += '"';
                                i += 2;
                                continue;
                            } else {
                                // Toggle quote state
                                inQuotes = !inQuotes;
                            }
                        } else if (char === ',' && !inQuotes) {
                            // End of field
                            currentRow.push(currentField.trim());
                            currentField = '';
                        } else if ((char === '\n' || char === '\r') && !inQuotes) {
                            // End of row
                            if (currentField !== '' || currentRow.length > 0) {
                                currentRow.push(currentField.trim());
                                if (currentRow.length > 0) {
                                    rows.push(currentRow);
                                }
                                currentRow = [];
                                currentField = '';
                            }
                            // Skip \r\n
                            if (char === '\r' && nextChar === '\n') {
                                i++;
                            }
                        } else {
                            currentField += char;
                        }
                        i++;
                    }

                    // Add the last field and row if they exist
                    if (currentField !== '' || currentRow.length > 0) {
                        currentRow.push(currentField.trim());
                        if (currentRow.length > 0) {
                            rows.push(currentRow);
                        }
                    }

                    return rows;
                };

                const rows = parseCSV(csvText);

                // Find the header row (contains "Name,Description,Primary Industry...")
                let headerIndex = -1;
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].length >= 7 &&
                        rows[i][0].toLowerCase().includes('name') &&
                        rows[i][1].toLowerCase().includes('description')) {
                        headerIndex = i;
                        break;
                    }
                }

                if (headerIndex === -1) {
                    throw new Error('Could not find header row in CSV');
                }

                // Get data rows after the header
                const dataRows = rows.slice(headerIndex + 1);

                const leads: BusinessLead[] = [];

                dataRows.forEach((row, index) => {
                    if (row.length >= 7 && row[0] && row[0].trim()) {
                        leads.push({
                            id: `lead-${index}`,
                            name: row[0]?.trim() || 'Unknown Company',
                            description: row[1]?.trim() || '',
                            primaryIndustry: row[2]?.trim() || 'Not Specified',
                            location: row[3]?.trim() || 'Unknown',
                            country: row[4]?.trim() || 'Unknown',
                            domain: row[5]?.trim() || '',
                            linkedinUrl: row[6]?.trim() || ''
                        });
                    }
                });

                setBusinessLeads(leads);
                setFilteredLeads(leads);
                console.log('Loaded business leads:', leads.length);
            } catch (error) {
                console.error('Error parsing CSV data:', error);
                setBusinessLeads([]);
                setFilteredLeads([]);
            } finally {
                setLoading(false);
            }
        };

        parseCSVData();
    }, []);

    // Filter and search functionality
    useEffect(() => {
        let filtered = businessLeads;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (lead) =>
                    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lead.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lead.primaryIndustry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lead.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lead.country.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Industry filter
        if (selectedIndustry !== "all") {
            filtered = filtered.filter((lead) => lead.primaryIndustry === selectedIndustry);
        }

        // Country filter
        if (selectedCountry !== "all") {
            filtered = filtered.filter((lead) => lead.country === selectedCountry);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "country":
                    return a.country.localeCompare(b.country);
                case "industry":
                    return a.primaryIndustry.localeCompare(b.primaryIndustry);
                default:
                    return 0;
            }
        });

        setFilteredLeads(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [businessLeads, searchTerm, selectedIndustry, selectedCountry, sortBy]);

    // Timer effect for overlay - only for non-logged-in users
    useEffect(() => {
        if (session) {
            setShowOverlay(false);
            setIsPopupActive(false);
            setTimeRemaining(10);
            return;
        }

        setTimeRemaining(10);
        setShowOverlay(false);

        const timer = setTimeout(() => {
            setShowOverlay(true);
            setIsPopupActive(true);
            setTimeRemaining(0);
        }, 10000);

        const countdownTimer = setInterval(() => {
            setTimeRemaining(prev => {
                const newValue = prev - 1;
                if (newValue <= 0) {
                    clearInterval(countdownTimer);
                }
                return newValue;
            });
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(countdownTimer);
        };
    }, [session, setIsPopupActive]);

    // Get unique industries and countries for filters
    const uniqueIndustries = Array.from(new Set(businessLeads.map(lead => lead.primaryIndustry).filter(Boolean)));
    const uniqueCountries = Array.from(new Set(businessLeads.map(lead => lead.country).filter(Boolean)));

    // Pagination
    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentLeads = filteredLeads.slice(startIndex, endIndex);

    const handleExportCSV = () => {
        const csvContent = [
            ['Name', 'Description', 'Primary Industry', 'Location', 'Country', 'Domain', 'LinkedIn URL'],
            ...filteredLeads.map(lead => [
                lead.name,
                lead.description,
                lead.primaryIndustry,
                lead.location,
                lead.country,
                lead.domain,
                lead.linkedinUrl
            ])
        ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'business-leads.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading business leads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative">
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <PageTitle
                title="Business Leads | TradeMart - Discover Global Business Opportunities"
                description="Explore verified business leads and companies on TradeMart. Connect with potential partners and discover new opportunities."
            />

            {/* Auth overlay - only for non-logged-in users */}
            {!session && showOverlay && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" style={{ backdropFilter: 'blur(4px)' }}></div>
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Sign In Required</h2>
                            <p className="text-gray-600 text-sm">
                                Sign in to view detailed business lead information and contact companies.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <a href="/auth/signin" className="block">
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
                                    Sign In
                                </Button>
                            </a>
                            <a href="/auth/signup" className="block">
                                <Button variant="outline" className="w-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 font-semibold transition-all duration-300 rounded-lg">
                                    Create Account
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className={`relative bg-white border-b border-gray-100 transition-all duration-500 ${!session && showOverlay ? "blur-sm opacity-50" : ""}`}>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-green-500 to-blue-700 bg-clip-text text-transparent mb-2">
                                Business Leads Database
                            </h1>
                            <p className="text-gray-600">
                                Discover and connect with verified business opportunities worldwide
                            </p>
                        </div>

                        <div className="mt-4 lg:mt-0 flex items-center gap-4">
                            {/* Stats */}
                            <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500">
                                <span>{filteredLeads.length} leads</span>
                                <span>•</span>
                                <span>{uniqueIndustries.length} industries</span>
                                <span>•</span>
                                <span>{uniqueCountries.length} countries</span>
                            </div>

                            {/* Export Button */}
                            <Button
                                onClick={handleExportCSV}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export CSV
                            </Button>
                        </div>
                    </div>

                    {/* Timer display for guest users */}
                    {!session && !showOverlay && timeRemaining > 0 && (
                        <div className="mt-4 inline-flex items-center bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-full text-sm font-medium">
                            <svg
                                className="w-4 h-4 mr-2 text-blue-600 animate-spin-slow"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Free preview ends in {timeRemaining}s
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className={`bg-white border-b border-gray-200 sticky top-16 z-40 transition-all duration-500 ${!session && showOverlay ? 'blur-sm opacity-50' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search companies, industries, locations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                                <SelectTrigger className="w-48">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Industries</SelectItem>
                                    {uniqueIndustries.map((industry) => (
                                        <SelectItem key={industry} value={industry}>
                                            {industry}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Countries</SelectItem>
                                    {uniqueCountries.map((country) => (
                                        <SelectItem key={country} value={country}>
                                            {country}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name A-Z</SelectItem>
                                    <SelectItem value="country">Country</SelectItem>
                                    <SelectItem value="industry">Industry</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Grid */}
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-500 ${!session && showOverlay ? 'blur-sm opacity-50' : ''}`}>
                {filteredLeads.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Business Leads Found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Company
                                            </th>
                                            <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Industry
                                            </th>
                                            <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="w-2/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Links
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentLeads.map((lead) => (
                                            <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {lead.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className="text-xs">
                                                        {lead.primaryIndustry}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {lead.location}, {lead.country}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-md">
                                                        <div className={expandedDescriptions.has(lead.id) ? 'line-clamp-none' : 'line-clamp-3'}>
                                                            {lead.description || 'No description available'}
                                                        </div>
                                                        {lead.description && lead.description.length > 150 && (
                                                            <button
                                                                className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                                                                onClick={() => {
                                                                    const newExpanded = new Set(expandedDescriptions);
                                                                    if (expandedDescriptions.has(lead.id)) {
                                                                        newExpanded.delete(lead.id);
                                                                    } else {
                                                                        newExpanded.add(lead.id);
                                                                    }
                                                                    setExpandedDescriptions(newExpanded);
                                                                }}
                                                            >
                                                                {expandedDescriptions.has(lead.id) ? 'Show less' : 'Show more'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        {lead.domain && (
                                                            <a
                                                                href={`https://${lead.domain}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs"
                                                            >
                                                                <Globe className="w-3 h-3 mr-1" />
                                                                Website
                                                            </a>
                                                        )}
                                                        {lead.linkedinUrl && (
                                                            <a
                                                                href={lead.linkedinUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs"
                                                            >
                                                                <ExternalLink className="w-3 h-3 mr-1" />
                                                                LinkedIn
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden space-y-4">
                            {currentLeads.map((lead) => (
                                <div key={lead.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                                        <Badge variant="outline" className="text-xs">
                                            {lead.primaryIndustry}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {lead.location}, {lead.country}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {lead.description || 'No description available'}
                                    </p>
                                    <div className="flex gap-2">
                                        {lead.domain && (
                                            <a
                                                href={`https://${lead.domain}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                <Globe className="w-4 h-4 mr-1" />
                                                Website
                                            </a>
                                        )}
                                        {lead.linkedinUrl && (
                                            <a
                                                href={lead.linkedinUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-1" />
                                                LinkedIn
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredLeads.length)} of {filteredLeads.length} results
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="flex items-center px-3 text-sm">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}