// import Link from "next/link";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//     Shield,
//     Wand2,
//     Trophy,
//     Package,
//     FileText,
//     Calculator,
//     Truck,
//     CreditCard,
//     Globe,
//     Zap,
//     Brain,
//     CheckCircle,
//     Star,
//     Award
// } from "lucide-react";

// export default function FeaturesShowcase() {
//     const features = [
//         {
//             id: "escrow",
//             title: "Escrow by Default",
//             description: "Funds released only after delivery/QC confirmation",
//             icon: Shield,
//             path: "/features/escrow",
//             status: "completed",
//             category: "Trust & Assurance"
//         },
//         {
//             id: "trust-ledger",
//             title: "Public Trust Ledger",
//             description: "Supplier SLA metrics and transparent performance data",
//             icon: Star,
//             path: "/features/trust-ledger",
//             status: "completed",
//             category: "Trust & Assurance"
//         },
//         {
//             id: "verification",
//             title: "Verification Tiers",
//             description: "GST validation, trade license verification, factory checks",
//             icon: CheckCircle,
//             path: "/features/verification",
//             status: "completed",
//             category: "Trust & Assurance"
//         },
//         {
//             id: "ai-normalizer",
//             title: "AI Spec Normalizer",
//             description: "Convert rough RFQs into structured specifications",
//             icon: Wand2,
//             path: "/features/ai-normalizer",
//             status: "completed",
//             category: "Smart RFQ"
//         },
//         {
//             id: "quote-comparison",
//             title: "Quote Comparison UI",
//             description: "Side-by-side pricing with landed cost analysis",
//             icon: Package,
//             path: "/features/quote-comparison",
//             status: "completed",
//             category: "Smart RFQ"
//         },
//         {
//             id: "supplier-os",
//             title: "Supplier OS",
//             description: "Comprehensive dashboard with quote composer and order tracker",
//             icon: Award,
//             path: "/features/supplier-os",
//             status: "completed",
//             category: "Supplier Tools"
//         },
//         {
//             id: "badges",
//             title: "Badges & Leaderboards",
//             description: "Gamification system with achievements and rankings",
//             icon: Trophy,
//             path: "/features/badges",
//             status: "completed",
//             category: "Supplier Tools"
//         },
//         {
//             id: "qc-box",
//             title: "QC-in-a-Box",
//             description: "Photo/video upload with third-party inspection hooks",
//             icon: Package,
//             path: "/features/qc-box",
//             status: "completed",
//             category: "Supplier Tools"
//         },
//         {
//             id: "certificates",
//             title: "Certificate Packs",
//             description: "Compliance automation with MSDS, COO, FSSAI checklists",
//             icon: FileText,
//             path: "/features/certificates",
//             status: "completed",
//             category: "Compliance"
//         },
//         {
//             id: "freight",
//             title: "Instant Freight Quotes",
//             description: "Real-time logistics quotes from DP World, Shiprocket",
//             icon: Truck,
//             path: "/features/freight",
//             status: "completed",
//             category: "Logistics"
//         },
//         {
//             id: "duty-calculator",
//             title: "Duty/Tax Calculator",
//             description: "Calculate landed cost with HS codes and country-specific rates",
//             icon: Calculator,
//             path: "/features/duty-calculator",
//             status: "completed",
//             category: "Logistics"
//         },
//         {
//             id: "upi-escrow",
//             title: "UPI/NetBanking Escrow",
//             description: "Indian payment methods with escrow protection",
//             icon: CreditCard,
//             path: "/features/upi-escrow",
//             status: "completed",
//             category: "Payments"
//         },
//         {
//             id: "rfq-feed",
//             title: "Open RFQ Feed",
//             description: "SEO-optimized public RFQ listings for organic traffic",
//             icon: Globe,
//             path: "/features/rfq-feed",
//             status: "completed",
//             category: "Community"
//         },
//         {
//             id: "sourcing-sprints",
//             title: "Sourcing Sprints",
//             description: "48-hour intensive sourcing events with prizes",
//             icon: Zap,
//             path: "/features/sourcing-sprints",
//             status: "completed",
//             category: "Community"
//         },
//         {
//             id: "vyapar-guru",
//             title: "Vyapar Guru AI",
//             description: "Conversational AI advisor for trade education",
//             icon: Brain,
//             path: "/features/vyapar-guru",
//             status: "completed",
//             category: "Education"
//         }
//     ];

//     const categories = [
//         "Trust & Assurance",
//         "Smart RFQ",
//         "Supplier Tools",
//         "Compliance",
//         "Logistics",
//         "Payments",
//         "Community",
//         "Education"
//     ];

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
//             {/* Header */}
//             <div className="bg-white shadow-sm border-b">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                     <div className="text-center">
//                         <h1 className="text-4xl font-bold text-gray-900 mb-4">
//                             🎉 TradeMart Features Showcase
//                         </h1>
//                         <p className="text-xl text-gray-600 mb-2">
//                             All 15 Winning Features for India - Successfully Implemented!
//                         </p>
//                         <p className="text-sm text-gray-500">
//                             Click on any feature to explore it in detail
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             {/* Stats */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
//                     <Card>
//                         <CardContent className="p-6 text-center">
//                             <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
//                             <p className="text-2xl font-bold text-green-600">15</p>
//                             <p className="text-sm text-gray-600">Features Completed</p>
//                         </CardContent>
//                     </Card>
//                     <Card>
//                         <CardContent className="p-6 text-center">
//                             <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
//                             <p className="text-2xl font-bold text-blue-600">8</p>
//                             <p className="text-sm text-gray-600">Categories</p>
//                         </CardContent>
//                     </Card>
//                     <Card>
//                         <CardContent className="p-6 text-center">
//                             <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
//                             <p className="text-2xl font-bold text-purple-600">100%</p>
//                             <p className="text-sm text-gray-600">Indian Focus</p>
//                         </CardContent>
//                     </Card>
//                     <Card>
//                         <CardContent className="p-6 text-center">
//                             <Trophy className="h-8 w-8 text-orange-500 mx-auto mb-2" />
//                             <p className="text-2xl font-bold text-orange-600">Ready</p>
//                             <p className="text-sm text-gray-600">For Production</p>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* Features by Category */}
//                 {categories.map((category) => {
//                     const categoryFeatures = features.filter(f => f.category === category);
//                     return (
//                         <div key={category} className="mb-12">
//                             <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {categoryFeatures.map((feature) => {
//                                     const IconComponent = feature.icon;
//                                     return (
//                                         <Card key={feature.id} className="hover:shadow-lg transition-shadow">
//                                             <CardHeader>
//                                                 <div className="flex items-center gap-3">
//                                                     <div className="p-2 bg-blue-100 rounded-lg">
//                                                         <IconComponent className="h-6 w-6 text-blue-600" />
//                                                     </div>
//                                                     <div>
//                                                         <CardTitle className="text-lg">{feature.title}</CardTitle>
//                                                         <Badge variant="outline" className="text-green-600 border-green-600">
//                                                             {feature.status}
//                                                         </Badge>
//                                                     </div>
//                                                 </div>
//                                             </CardHeader>
//                                             <CardContent>
//                                                 <p className="text-gray-600 mb-4">{feature.description}</p>
//                                                 <Link href={feature.path}>
//                                                     <Button className="w-full">
//                                                         Explore Feature
//                                                     </Button>
//                                                 </Link>
//                                             </CardContent>
//                                         </Card>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     );
//                 })}

//                 {/* Quick Access */}
//                 <Card className="mt-12">
//                     <CardHeader>
//                         <CardTitle>Quick Access Links</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             <Link href="/dashboard">
//                                 <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
//                                     <Award className="h-6 w-6" />
//                                     <span>Main Dashboard</span>
//                                 </Button>
//                             </Link>
//                             <Link href="/admin">
//                                 <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
//                                     <Shield className="h-6 w-6" />
//                                     <span>Admin Panel</span>
//                                 </Button>
//                             </Link>
//                             <Link href="/rfq/create">
//                                 <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
//                                     <Package className="h-6 w-6" />
//                                     <span>Create RFQ</span>
//                                 </Button>
//                             </Link>
//                             <Link href="/products/manage">
//                                 <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
//                                     <Package className="h-6 w-6" />
//                                     <span>Manage Products</span>
//                                 </Button>
//                             </Link>
//                             <Link href="/auth/signup">
//                                 <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
//                                     <Star className="h-6 w-6" />
//                                     <span>Enhanced Signup</span>
//                                 </Button>
//                             </Link>
//                             <Link href="/">
//                                 <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
//                                     <Globe className="h-6 w-6" />
//                                     <span>Homepage</span>
//                                 </Button>
//                             </Link>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// }
