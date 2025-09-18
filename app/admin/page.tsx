"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Users,
    Building2,
    Package,
    FileText,
    CheckCircle,
    XCircle,
    Eye,
    MoreHorizontal
} from "lucide-react";

interface DashboardStats {
    totalUsers: number;
    totalSuppliers: number;
    totalProducts: number;
    totalRfqs: number;
    totalQuotes: number;
    totalTransactions: number;
    pendingVerifications: number;
    recentUsers: Record<string, unknown>[];
    recentRfqs: Record<string, unknown>[];
    topSuppliers: Record<string, unknown>[];
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        } else if (session?.user?.role !== "admin") {
            router.push("/dashboard");
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session?.user?.role === "admin") {
            fetchDashboardData();
        }
    }, [session]);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch("/api/admin/dashboard");
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error("Error fetching admin dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifySupplier = async (supplierId: string, verified: boolean) => {
        try {
            const response = await fetch(`/api/admin/suppliers/${supplierId}/verify`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ verified }),
            });

            if (response.ok) {
                fetchDashboardData(); // Refresh data
            }
        } catch (error) {
            console.error("Error updating supplier verification:", error);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== "admin") {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage your TradeMart platform</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                +12% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalSuppliers || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats?.pendingVerifications || 0} pending verification
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                +8% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">RFQs</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalRfqs || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats?.totalQuotes || 0} quotes submitted
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
                        <TabsTrigger value="rfqs">RFQs</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Users */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Users</CardTitle>
                                    <CardDescription>Latest registered users</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {stats?.recentUsers?.map((user, index) => (
                                            <div key={user.id as string || index} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Users className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{String(user.name || 'Unknown')}</p>
                                                        <p className="text-sm text-gray-500">{String(user.email || 'No email')}</p>
                                                    </div>
                                                </div>
                                                <Badge variant={String(user.role || 'user') === "admin" ? "default" : "secondary"}>
                                                    {String(user.role || 'user')}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent RFQs */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent RFQs</CardTitle>
                                    <CardDescription>Latest requests for quotations</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {stats?.recentRfqs?.map((rfq, index) => (
                                            <div key={rfq.id as string || index} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{String(rfq.title || 'Untitled')}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {String((rfq.buyer as Record<string, unknown>)?.name || 'Unknown Buyer')} • {String(rfq.category || 'Uncategorized')}
                                                    </p>
                                                </div>
                                                <Badge variant={
                                                    String(rfq.status || 'unknown') === "open" ? "default" :
                                                        String(rfq.status || 'unknown') === "quoted" ? "secondary" : "outline"
                                                }>
                                                    {String(rfq.status || 'unknown')}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Top Suppliers */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Performing Suppliers</CardTitle>
                                <CardDescription>Suppliers with highest ratings and orders</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Company</TableHead>
                                            <TableHead>Industry</TableHead>
                                            <TableHead>Rating</TableHead>
                                            <TableHead>Orders</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stats?.topSuppliers?.map((supplier, index) => (
                                            <TableRow key={supplier.id as string || index}>
                                                <TableCell className="font-medium">
                                                    {String(supplier.companyName || 'Unknown Company')}
                                                </TableCell>
                                                <TableCell>{String(supplier.industry || 'Unknown Industry')}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <span className="text-yellow-500">★</span>
                                                        <span className="ml-1">{Number(supplier.rating || 0).toFixed(1)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{Number(supplier.totalOrders || 0)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={Boolean(supplier.verified) ? "default" : "secondary"}>
                                                        {Boolean(supplier.verified) ? "Verified" : "Pending"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleVerifySupplier(supplier.id, !supplier.verified)}
                                                        >
                                                            {supplier.verified ? (
                                                                <XCircle className="h-4 w-4" />
                                                            ) : (
                                                                <CheckCircle className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>Manage all platform users</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stats?.recentUsers?.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{String(user.name || 'Unknown')}</TableCell>
                                                <TableCell>{String(user.email || 'No email')}</TableCell>
                                                <TableCell>
                                                    <Badge variant={String(user.role || 'user') === "admin" ? "default" : "secondary"}>
                                                        {String(user.role || 'user')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="default">Active</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button size="sm" variant="outline">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Suppliers Tab */}
                    <TabsContent value="suppliers" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Supplier Verification</CardTitle>
                                <CardDescription>Review and verify supplier applications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Company</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Industry</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stats?.topSuppliers?.map((supplier) => (
                                            <TableRow key={supplier.id}>
                                                <TableCell className="font-medium">
                                                    {supplier.companyName}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="text-sm">{supplier.contactEmail}</p>
                                                        <p className="text-xs text-gray-500">{supplier.contactPhone}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{supplier.industry}</TableCell>
                                                <TableCell>
                                                    {supplier.city}, {supplier.country}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={(supplier.verified as boolean) ? "default" : "secondary"}>
                                                        {(supplier.verified as boolean) ? "Verified" : "Pending"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant={supplier.verified ? "outline" : "default"}
                                                            onClick={() => handleVerifySupplier(supplier.id, !supplier.verified)}
                                                        >
                                                            {supplier.verified ? "Unverify" : "Verify"}
                                                        </Button>
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* RFQs Tab */}
                    <TabsContent value="rfqs" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>RFQ Management</CardTitle>
                                <CardDescription>Monitor and manage all RFQs</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Buyer</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Budget</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stats?.recentRfqs?.map((rfq) => (
                                            <TableRow key={rfq.id}>
                                                <TableCell className="font-medium">{String(rfq.title || 'Untitled')}</TableCell>
                                                <TableCell>{String((rfq.buyer as Record<string, unknown>)?.name || 'Unknown Buyer')}</TableCell>
                                                <TableCell>{String(rfq.category || 'Uncategorized')}</TableCell>
                                                <TableCell>
                                                    {rfq.budget ? `$${rfq.budget}` : "Not specified"}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        String(rfq.status || 'unknown') === "open" ? "default" :
                                                            String(rfq.status || 'unknown') === "quoted" ? "secondary" : "outline"
                                                    }>
                                                        {String(rfq.status || 'unknown')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(rfq.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
