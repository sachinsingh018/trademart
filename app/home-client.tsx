"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CountryFlagsBar from "@/components/ui/country-flags-bar";
import { useSession } from "next-auth/react";

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  minOrderQuantity: number;
  unit: string;
  category: string;
  images: string[];
  inStock: boolean;
  supplier: {
    companyName: string;
    country: string;
    verified: boolean;
    rating: number;
  };
}

interface Supplier {
  id: string;
  companyName: string;
  country: string;
  industry: string;
  verified: boolean;
  rating: number;
  totalOrders: number;
}

interface Stats {
  totalProducts: number;
  totalSuppliers: number;
  totalOrders: number;
  inStockProducts: number;
}

export default function HomeClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [topSuppliers, setTopSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalSuppliers: 0,
    totalOrders: 0,
    inStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const productsResponse = await fetch('/api/products?limit=8&sortBy=popular');
        const productsData = await productsResponse.json();

        if (productsData.success) {
          setFeaturedProducts(productsData.data.products);
          setStats(prev => ({
            ...prev,
            totalProducts: productsData.data.stats.totalProducts,
            totalOrders: productsData.data.stats.totalOrders,
            inStockProducts: productsData.data.stats.inStockProducts,
          }));
        }

        // Fetch top suppliers
        const suppliersResponse = await fetch('/api/suppliers?limit=6');
        const suppliersData = await suppliersResponse.json();

        if (suppliersData.success) {
          setTopSuppliers(suppliersData.data.suppliers);
          setStats(prev => ({
            ...prev,
            totalSuppliers: suppliersData.data.stats.totalSuppliers,
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* Country Flags Bar */}
      <CountryFlagsBar />

      {/* Government Initiatives Section */}
      <section className="py-8 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Supported by</h3>
            <p className="text-xs text-gray-500">Government initiatives empowering Indian businesses</p>
          </div>

          {/* Horizontal Scrollable Cards - Mobile, Centered Grid - Desktop */}
          <div className="relative">
            {/* Mobile: Horizontal scrollable layout */}
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide md:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex-shrink-0 bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:scale-105 min-w-[140px]">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/en/4/46/Make_In_India.png"
                  alt="Make in India"
                  width={120}
                  height={60}
                  className="h-12 w-auto object-contain mx-auto"
                />
              </div>
              <div className="flex-shrink-0 bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:scale-105 min-w-[140px]">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Digital_India_logo.svg/1200px-Digital_India_logo.svg.png"
                  alt="Digital India"
                  width={120}
                  height={60}
                  className="h-12 w-auto object-contain mx-auto"
                />
              </div>
              <div className="flex-shrink-0 bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:scale-105 min-w-[140px]">
                <Image
                  src="https://pbs.twimg.com/profile_images/1840626562082676736/QB8mg12l_400x400.jpg"
                  alt="Startup India"
                  width={120}
                  height={60}
                  className="h-12 w-12 object-contain rounded-full mx-auto"
                />
              </div>
              <div className="flex-shrink-0 bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:scale-105 min-w-[140px]">
                <Image
                  src="/brics-logo.png"
                  alt="BRICS"
                  width={120}
                  height={60}
                  className="h-12 w-auto object-contain mx-auto"
                />
              </div>
              <div className="flex-shrink-0 bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:scale-105 min-w-[140px]">
                <Image
                  src="/sme-chamber-logo.svg"
                  alt="SME Chamber of India"
                  width={120}
                  height={60}
                  className="h-12 w-auto object-contain mx-auto"
                />
              </div>
            </div>

            {/* Desktop: Centered grid layout */}
            <div className="hidden md:flex justify-center items-center gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:scale-105">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/en/4/46/Make_In_India.png"
                  alt="Make in India"
                  width={140}
                  height={70}
                  className="h-14 w-auto object-contain mx-auto"
                />
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:scale-105">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Digital_India_logo.svg/1200px-Digital_India_logo.svg.png"
                  alt="Digital India"
                  width={140}
                  height={70}
                  className="h-14 w-auto object-contain mx-auto"
                />
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:scale-105">
                <Image
                  src="https://pbs.twimg.com/profile_images/1840626562082676736/QB8mg12l_400x400.jpg"
                  alt="Startup India"
                  width={70}
                  height={70}
                  className="h-14 w-14 object-contain rounded-full mx-auto"
                />
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:scale-105">
                <Image
                  src="/brics-logo.png"
                  alt="BRICS"
                  width={140}
                  height={70}
                  className="h-14 w-auto object-contain mx-auto"
                />
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:scale-105">
                <Image
                  src="/sme-chamber-logo.svg"
                  alt="SME Chamber of India"
                  width={140}
                  height={70}
                  className="h-14 w-auto object-contain mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Call-to-Action Section - Only show when not logged in */}
          {!session && (
            <div className="text-center mt-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Ready to Start Trading?
              </h2>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 px-4">
                <Link href="/auth/signup" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/auth/signin" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-4 text-lg font-semibold transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero Content */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 bg-clip-text text-transparent">
                Global B2B Marketplace
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed px-4">
              Connect with verified suppliers worldwide. Find products, submit RFQs, and grow your business with secure transactions and trusted partnerships.
            </p>

            {/* Modern Levelled Search Bar */}
            <div className="max-w-5xl mx-auto mb-8 px-4">
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-2 hover:shadow-3xl transition-all duration-500">
                <div className="flex flex-col lg:flex-row items-center">
                  {/* Search Input with Icon */}
                  <div className="flex-1 relative flex items-center w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search products, suppliers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-10 sm:pl-12 pr-6 py-3 sm:py-4 text-base sm:text-lg border-0 bg-transparent focus:outline-none transition-all duration-300 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Category Filter - Hidden on mobile */}
                  <div className="hidden md:relative md:flex items-center px-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <select className="pl-10 pr-8 py-4 border-0 bg-transparent focus:outline-none transition-all duration-300 text-gray-700 font-medium appearance-none cursor-pointer min-w-[180px]">
                      <option value="">All Categories</option>
                      <option value="electronics">Electronics</option>
                      <option value="textiles">Textiles</option>
                      <option value="machinery">Machinery</option>
                      <option value="chemicals">Chemicals</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Search Button - Responsive */}
                  <button
                    onClick={handleSearch}
                    className="w-full md:w-auto mt-2 md:mt-0 px-6 py-3 sm:py-4 bg-transparent text-blue-600 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </button>
                </div>
              </div>

              {/* Modern Popular Searches */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Popular searches:
                </span>
                {['Smartphones', 'Textiles', 'Machinery', 'Electronics', 'Chemicals'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200 hover:border-blue-300 transition-all duration-200 font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-8 px-4">
              {session ? (
                <>
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/auth/signout" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300">
                      Sign Out
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/signup?role=buyer" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      Start Buying
                    </Button>
                  </Link>
                  <Link href="/auth/signup?role=supplier" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300">
                      Start Selling
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto px-4">
            <div className="text-center bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                {loading ? '...' : stats.totalSuppliers.toLocaleString()}+
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Verified Suppliers</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                {loading ? '...' : stats.totalProducts.toLocaleString()}+
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Products Listed</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                {loading ? '...' : stats.totalOrders.toLocaleString()}+
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Orders Completed</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">100+</div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover top-quality products from verified suppliers worldwide
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-80"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="block h-full">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden cursor-pointer h-full flex flex-col">
                    <div className="relative">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        {product.inStock ? (
                          <Badge className="bg-green-500 text-white border-green-400 text-xs px-2 py-1">
                            In Stock
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500 text-white border-red-400 text-xs px-2 py-1">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardHeader className="p-4 flex-shrink-0">
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {product.category}
                      </CardDescription>
                    </CardHeader>

                    <div className="px-4 pb-4 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatPrice(product.price, product.currency)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Min: {product.minOrderQuantity} {product.unit}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Supplier:</span>
                            <span className="text-sm font-medium">{product.supplier.companyName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-medium">{product.supplier.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{product.supplier.country}</span>
                          {product.supplier.verified && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-blue-600 font-medium group-hover:text-blue-700">
                          View Details →
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-4 text-lg font-semibold">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Suppliers Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Verified Suppliers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with trusted suppliers from around the world
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-48"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topSuppliers.map((supplier) => (
                <Card key={supplier.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {supplier.companyName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {supplier.companyName}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            {supplier.industry} • {supplier.country}
                          </CardDescription>
                        </div>
                      </div>
                      {supplier.verified && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">⭐ {supplier.rating}</div>
                          <div className="text-xs text-gray-600">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{supplier.totalOrders}</div>
                          <div className="text-xs text-gray-600">Orders</div>
                        </div>
                      </div>
                      <Link href={`/suppliers/${supplier.id}`}>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/suppliers">
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-4 text-lg font-semibold">
                View All Suppliers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose TradeMart for Your B2B Trading?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide the tools, security, and global network you need to grow your business worldwide with verified suppliers and secure transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl mb-2">Verified Suppliers</CardTitle>
                <CardDescription className="text-gray-600">
                  All suppliers are verified and certified. Trade with confidence knowing you&apos;re working with legitimate businesses.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <CardTitle className="text-xl mb-2">Secure Payments</CardTitle>
                <CardDescription className="text-gray-600">
                  Protected transactions with escrow services. Your money is safe until you receive your goods.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-xl mb-2">Fast Matching</CardTitle>
                <CardDescription className="text-gray-600">
                  AI-powered matching connects you with the right suppliers instantly. Save time and find better deals.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and begin trading with verified partners worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your account as a buyer or supplier in just a few clicks</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Connect</h3>
              <p className="text-gray-600">Find products or suppliers that match your business needs</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Negotiate</h3>
              <p className="text-gray-600">Communicate directly and negotiate terms that work for both parties</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Trade Safely</h3>
              <p className="text-gray-600">Complete secure transactions with our protected payment system</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses already growing on TradeMart
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/auth/signout">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                    Sign Out
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup?role=buyer">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                    Start Buying
                  </Button>
                </Link>
                <Link href="/auth/signup?role=supplier">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                    Start Selling
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <Image
                  src="/logofinal.png"
                  alt="TradeMart Logo"
                  width={50}
                  height={50}
                  className="w-12 h-12"
                />
                <span className="ml-3 text-2xl font-bold">TradeMart</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The leading global B2B marketplace connecting verified suppliers with buyers worldwide.
                Secure transactions, competitive quotes, and trusted partnerships for international trade.
              </p>
              <div className="flex space-x-4">
                <a href="https://twitter.com/trademart" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="https://linkedin.com/company/trademart" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="https://facebook.com/trademart" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* For Buyers */}
            <div>
              <h3 className="text-lg font-semibold mb-6">For Buyers</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/products" className="hover:text-white transition-colors">Browse Products</Link></li>
                <li><Link href="/suppliers" className="hover:text-white transition-colors">Find Suppliers</Link></li>
                <li><Link href="/rfqs" className="hover:text-white transition-colors">Submit RFQ</Link></li>
                <li><Link href="/auth/signup?role=buyer" className="hover:text-white transition-colors">Join as Buyer</Link></li>
              </ul>
            </div>

            {/* For Suppliers */}
            <div>
              <h3 className="text-lg font-semibold mb-6">For Suppliers</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/products/create" className="hover:text-white transition-colors">List Products</Link></li>
                <li><Link href="/suppliers" className="hover:text-white transition-colors">Supplier Dashboard</Link></li>
                <li><Link href="/rfqs" className="hover:text-white transition-colors">Respond to RFQs</Link></li>
                <li><Link href="/auth/signup?role=supplier" className="hover:text-white transition-colors">Join as Supplier</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Company Stats */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {loading ? '...' : stats.totalSuppliers.toLocaleString()}+
                </div>
                <div className="text-gray-400 text-sm">Verified Suppliers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  {loading ? '...' : stats.totalProducts.toLocaleString()}+
                </div>
                <div className="text-gray-400 text-sm">Products Listed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">
                  {loading ? '...' : stats.totalOrders.toLocaleString()}+
                </div>
                <div className="text-gray-400 text-sm">Orders Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400 mb-2">100+</div>
                <div className="text-gray-400 text-sm">Countries</div>
              </div>
            </div>
          </div>


          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TradeMart. All rights reserved. | Global B2B Marketplace</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
