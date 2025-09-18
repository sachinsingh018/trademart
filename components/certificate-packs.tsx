// COMMENTED OUT - Certificate Packs Component
/*
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
    FileText, 
    CheckCircle, 
    XCircle, 
    AlertTriangle,
    Download,
    Upload,
    Shield,
    Globe,
    Factory,
    Award,
    Clock,
    Calendar,
    MapPin,
    Users,
    Package,
    DollarSign
} from "lucide-react";

interface Certificate {
    id: string;
    name: string;
    description: string;
    category: 'quality' | 'environmental' | 'safety' | 'trade' | 'custom';
    required: boolean;
    status: 'not_started' | 'in_progress' | 'completed' | 'expired' | 'pending_renewal';
    validityPeriod: number; // months
    expiryDate?: string;
    issuedBy: string;
    cost: number;
    currency: string;
    documents: string[];
    requirements: string[];
    benefits: string[];
    countries: string[];
    industries: string[];
}

interface CertificatePack {
    id: string;
    name: string;
    description: string;
    targetMarket: string;
    industry: string;
    certificates: Certificate[];
    totalCost: number;
    estimatedTime: number; // days
    benefits: string[];
}

interface CertificatePacksProps {
    userRole: 'buyer' | 'supplier';
    industry?: string;
    targetMarkets?: string[];
}

export default function CertificatePacks({ userRole, industry, targetMarkets }: CertificatePacksProps) {
    const [certificatePacks, setCertificatePacks] = useState<CertificatePack[]>([]);
    const [selectedPack, setSelectedPack] = useState<CertificatePack | null>(null);
    const [userCertificates, setUserCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'packs' | 'my_certificates'>('packs');

    useEffect(() => {
        fetchCertificatePacks();
        fetchUserCertificates();
    }, []);

    const fetchCertificatePacks = async () => {
        try {
            const response = await fetch('/api/certificates/packs');
            const data = await response.json();
            if (data.success) {
                setCertificatePacks(data.data);
            }
        } catch (error) {
            console.error('Error fetching certificate packs:', error);
        }
    };

    const fetchUserCertificates = async () => {
        try {
            const response = await fetch('/api/certificates/my-certificates');
            const data = await response.json();
            if (data.success) {
                setUserCertificates(data.data);
            }
        } catch (error) {
            console.error('Error fetching user certificates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'quality': return <Award className="h-5 w-5" />;
            case 'environmental': return <Globe className="h-5 w-5" />;
            case 'safety': return <Shield className="h-5 w-5" />;
            case 'trade': return <Package className="h-5 w-5" />;
            default: return <FileText className="h-5 w-5" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'quality': return 'text-blue-600 bg-blue-100';
            case 'environmental': return 'text-green-600 bg-green-100';
            case 'safety': return 'text-red-600 bg-red-100';
            case 'trade': return 'text-purple-600 bg-purple-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'in_progress': return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'expired': return <XCircle className="h-4 w-4 text-red-500" />;
            case 'pending_renewal': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
            default: return <XCircle className="h-4 w-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100';
            case 'in_progress': return 'text-yellow-600 bg-yellow-100';
            case 'expired': return 'text-red-600 bg-red-100';
            case 'pending_renewal': return 'text-orange-600 bg-orange-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const calculatePackProgress = (pack: CertificatePack) => {
        const userCertIds = userCertificates.map(cert => cert.id);
        const completedCerts = pack.certificates.filter(cert => userCertIds.includes(cert.id));
        return (completedCerts.length / pack.certificates.length) * 100;
    };

    const getRecommendedPacks = () => {
        return certificatePacks.filter(pack => 
            !industry || pack.industry === industry ||
            !targetMarkets || targetMarkets.some(market => pack.targetMarket.includes(market))
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading Certificate Packs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
<div className="flex justify-between items-center">
    <div>
        <h2 className="text-2xl font-bold text-gray-900">Certificate Packs</h2>
        <p className="text-gray-600">Streamlined compliance for international trade</p>
    </div>
    <div className="flex gap-2">
        <Button
            variant={activeTab === 'packs' ? 'default' : 'outline'}
            onClick={() => setActiveTab('packs')}
        >
            Certificate Packs
        </Button>
        <Button
            variant={activeTab === 'my_certificates' ? 'default' : 'outline'}
            onClick={() => setActiveTab('my_certificates')}
        >
            My Certificates
        </Button>
    </div>
</div>

{
    activeTab === 'packs' && (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getRecommendedPacks().map((pack) => {
                        const progress = calculatePackProgress(pack);

                        return (
                            <Card key={pack.id} className="relative">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{pack.name}</CardTitle>
                                            <p className="text-sm text-gray-600">{pack.description}</p>
                                        </div>
                                        <Badge variant="outline">
                                            {pack.targetMarket}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Progress</span>
                                            <span>{progress.toFixed(0)}%</span>
                                        </div>
                                        <Progress value={progress} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Certificates</p>
                                            <p className="font-medium">{pack.certificates.length}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Total Cost</p>
                                            <p className="font-medium">₹{pack.totalCost.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Time Required</p>
                                            <p className="font-medium">{pack.estimatedTime} days</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Industry</p>
                                            <p className="font-medium">{pack.industry}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Key Benefits</p>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            {pack.benefits.slice(0, 3).map((benefit, index) => (
                                                <li key={index} className="flex items-start gap-1">
                                                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => setSelectedPack(pack)}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={progress === 100}
                                        >
                                            {progress === 100 ? 'Completed' : 'Start Pack'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Certificate Packs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificatePacks.map((pack) => {
                        const progress = calculatePackProgress(pack);

                        return (
                            <Card key={pack.id} className="relative">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{pack.name}</CardTitle>
                                            <p className="text-sm text-gray-600">{pack.description}</p>
                                        </div>
                                        <Badge variant="outline">
                                            {pack.targetMarket}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Progress</span>
                                            <span>{progress.toFixed(0)}%</span>
                                        </div>
                                        <Progress value={progress} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Certificates</p>
                                            <p className="font-medium">{pack.certificates.length}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Total Cost</p>
                                            <p className="font-medium">₹{pack.totalCost.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Time Required</p>
                                            <p className="font-medium">{pack.estimatedTime} days</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Industry</p>
                                            <p className="font-medium">{pack.industry}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => setSelectedPack(pack)}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={progress === 100}
                                        >
                                            {progress === 100 ? 'Completed' : 'Start Pack'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

{
    activeTab === 'my_certificates' && (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">
                            {userCertificates.filter(cert => cert.status === 'completed').length}
                        </p>
                        <p className="text-sm text-gray-600">Completed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-yellow-600">
                            {userCertificates.filter(cert => cert.status === 'in_progress').length}
                        </p>
                        <p className="text-sm text-gray-600">In Progress</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-orange-600">
                            {userCertificates.filter(cert => cert.status === 'pending_renewal').length}
                        </p>
                        <p className="text-sm text-gray-600">Pending Renewal</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-red-600">
                            {userCertificates.filter(cert => cert.status === 'expired').length}
                        </p>
                        <p className="text-sm text-gray-600">Expired</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>My Certificates</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {userCertificates.map((certificate) => (
                            <div key={certificate.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${getCategoryColor(certificate.category)}`}>
                                            {getCategoryIcon(certificate.category)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{certificate.name}</h3>
                                            <p className="text-gray-600 text-sm">{certificate.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(certificate.status)}
                                        <Badge className={getStatusColor(certificate.status)}>
                                            {certificate.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Issued By</p>
                                        <p className="font-medium">{certificate.issuedBy}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Cost</p>
                                        <p className="font-medium">₹{certificate.cost.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Validity</p>
                                        <p className="font-medium">{certificate.validityPeriod} months</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Expiry</p>
                                        <p className="font-medium">
                                            {certificate.expiryDate ? new Date(certificate.expiryDate).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <span className="text-sm text-gray-600">Valid in:</span>
                                        {certificate.countries.map((country, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {country}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-sm text-gray-600">Industries:</span>
                                        {certificate.industries.map((industry, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {industry}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {certificate.status === 'completed' && (
                                        <Button size="sm" variant="outline">
                                            <Download className="h-4 w-4 mr-1" />
                                            Download
                                        </Button>
                                    )}
                                    {certificate.status === 'in_progress' && (
                                        <Button size="sm" variant="outline">
                                            <Upload className="h-4 w-4 mr-1" />
                                            Upload Documents
                                        </Button>
                                    )}
                                    {certificate.status === 'pending_renewal' && (
                                        <Button size="sm">
                                            Renew Certificate
                                        </Button>
                                    )}
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
    )
}

{
    selectedPack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl">{selectedPack.name}</CardTitle>
                            <p className="text-gray-600">{selectedPack.description}</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedPack(null)}
                        >
                            ✕
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <Package className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-blue-600">{selectedPack.certificates.length}</p>
                            <p className="text-sm text-gray-600">Certificates</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-green-600">₹{selectedPack.totalCost.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Total Cost</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-purple-600">{selectedPack.estimatedTime}</p>
                            <p className="text-sm text-gray-600">Days Required</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h3>
                        <ul className="space-y-2">
                            {selectedPack.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Certificates Included</h3>
                        <div className="space-y-3">
                            {selectedPack.certificates.map((certificate) => (
                                <div key={certificate.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${getCategoryColor(certificate.category)}`}>
                                                {getCategoryIcon(certificate.category)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{certificate.name}</h4>
                                                <p className="text-sm text-gray-600">{certificate.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">₹{certificate.cost.toLocaleString()}</p>
                                            <p className="text-sm text-gray-600">{certificate.validityPeriod} months</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {certificate.countries.map((country, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {country}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button className="flex-1">
                            Start Certificate Pack
                        </Button>
                        <Button variant="outline">
                            Download Checklist
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
        </div >
    );
}
*/

export default function CertificatePacks() {
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Certificate Packs</h2>
            <p className="text-gray-600">This component is currently disabled</p>
        </div>
    );
}
