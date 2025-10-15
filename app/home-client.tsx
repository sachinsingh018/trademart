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
import { FaTwitter, FaLinkedinIn, FaFacebookF } from "react-icons/fa";

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

  // Generate random discount from 0.1 to 5, ensuring it's less than actual price
  const getDiscountPrice = (productId: string, actualPrice: number) => {
    // Use product ID to generate consistent "random" discount
    const hash = productId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    // Generate random number between 0.1 and 5
    const randomFactor = (Math.abs(hash) % 1000) / 1000; // 0 to 1
    const maxDiscount = Math.min(5, actualPrice - 0.01); // Ensure discount is less than actual price
    const minDiscount = Math.min(0.1, maxDiscount);

    const discountPrice = minDiscount + (randomFactor * (maxDiscount - minDiscount));
    return Math.max(0.1, Math.min(discountPrice, maxDiscount));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Full-Width Hero Banner */}

      {/* Full-Width Hero Banner (Mobile Optimized) */}
      <section className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <Image
          src="https://drive.google.com/uc?export=view&id=1EulWYKHUaZymToAg9Q6uE1KkXL3gYuYa"
          alt="Global B2B Marketplace Background"
          fill
          className="object-cover brightness-80"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center text-white">
          <h1 className="text-3xl sm:text-6xl font-bold leading-snug mb-4 sm:mb-6">
            Global B2B Marketplace
          </h1>
          <p className="text-base sm:text-xl max-w-4xl mx-auto mb-8 sm:mb-10 leading-relaxed text-gray-200">
            Connect with verified suppliers worldwide. Find products, submit RFQs, and grow your business with secure transactions and trusted partnerships.
          </p>

          {/* Search Bar */}
          <div className="max-w-5xl mx-auto mb-8 sm:mb-10 px-3 sm:px-4">
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/30 p-2 hover:shadow-2xl transition-all duration-500">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="flex-1 relative flex items-center w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search products, suppliers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-6 py-2 sm:py-3 text-sm sm:text-lg border-0 bg-transparent text-gray-900 focus:outline-none placeholder:text-gray-400"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full sm:w-auto mt-2 sm:mt-0 px-5 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
            {session ? (
              <>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm sm:text-lg px-6 py-2 sm:py-3 font-semibold rounded-xl shadow-md hover:shadow-xl transition-all">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/auth/signout" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-sm sm:text-lg px-6 py-2 sm:py-3 font-semibold transition-all">
                    Sign Out
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup?role=buyer" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm sm:text-lg px-6 py-2 sm:py-3 font-semibold rounded-xl shadow-md hover:shadow-xl transition-all">
                    Start Buying
                  </Button>
                </Link>
                <Link href="/auth/signup?role=supplier" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white text-sm sm:text-lg px-6 py-2 sm:py-3 font-semibold transition-all">
                    Start Selling
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats (smaller grid on mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto text-center">
            {[
              { value: stats.totalSuppliers, color: "text-blue-300", label: "Suppliers" },
              { value: stats.totalProducts, color: "text-green-300", label: "Products" },
              { value: stats.totalOrders, color: "text-purple-300", label: "Orders" },
              { value: "100+", color: "text-orange-300", label: "Countries" },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
                <div className={`text-xl sm:text-3xl font-bold ${s.color} mb-1`}>
                  {loading ? "..." : s.value.toLocaleString?.() || s.value}+
                </div>
                <div className="text-xs sm:text-base text-gray-200">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Country Flags Bar */}
      <CountryFlagsBar />

      {/* Government Initiatives Section */}
      {/* Government Initiatives Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Soft background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-green-50 opacity-70 blur-xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 tracking-wide mb-2">
              Supported by
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Government & global initiatives empowering Indian businesses
            </p>
            <div className="mx-auto mt-2 w-20 h-1 bg-gradient-to-r from-blue-600 to-green-500 rounded-full"></div>
          </div>

          {/* Mobile: auto-scrolling ticker */}
          <div className="relative md:hidden overflow-hidden">
            <div className="flex whitespace-nowrap animate-marquee gap-5">
              {[
                "https://upload.wikimedia.org/wikipedia/en/4/46/Make_In_India.png",
                "/brics-logo.png",
                "/sme-chamber-logo.svg",
                "https://www.cccme.cn/templates/CCCME/images/logo.png",
                "https://upload.wikimedia.org/wikipedia/commons/f/fa/Sberbank_Logo.jpg",
              ].map((src, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300 min-w-[160px] flex items-center justify-center"
                >
                  <Image
                    src={src}
                    alt={`Supported ${i}`}
                    width={130}
                    height={65}
                    className="h-12 w-auto object-contain mx-auto saturate-150 hover:saturate-200 transition duration-300"
                  />
                </div>
              ))}
            </div>

            {/* Fading edges for ticker */}
            <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>

          {/* Desktop: static grid */}
          <div className="hidden md:flex justify-center items-center gap-10 relative">
            {[
              {
                src: "https://upload.wikimedia.org/wikipedia/en/4/46/Make_In_India.png",
                alt: "Make in India",
              },
              { src: "/brics-logo.png", alt: "BRICS" },
              { src: "/sme-chamber-logo.svg", alt: "SME Chamber of India" },
              {
                src: "https://www.cccme.cn/templates/CCCME/images/logo.png",
                alt: "CCCME",
              },
              {
                src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Sberbank_Logo.jpg",
                alt: "Sberbank",
              },
            ].map((logo, i) => (
              <div
                key={i}
                className="group bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-500"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={80}
                  className="h-14 w-auto object-contain mx-auto saturate-150 group-hover:saturate-200 transition-all duration-300"
                />
                <p className="text-center text-xs text-gray-500 mt-2 group-hover:text-gray-700 transition-all">
                  {logo.alt}
                </p>
              </div>
            ))}
          </div>

          {/* CTA below (unchanged) */}
          {!session && (
            <div className="text-center mt-12 relative z-10">
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
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-4 text-lg font-semibold transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"></div>

        <style jsx>{`
    @keyframes marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    .animate-marquee {
      animation: marquee 40s linear infinite;
    }
  `}</style>
      </section>


      {/* Hero Section */}

      {/* Featured Products Section */}
      {/* Featured Products Section — Compact on Mobile */}
      <section className="py-12 sm:py-20 px-4 sm:px-10 lg:px-16 relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-blue-50">
        {/* background blobs */}
        <div className="absolute top-0 left-0 w-64 sm:w-80 h-64 sm:h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob hidden sm:block"></div>
        <div className="absolute bottom-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 hidden sm:block"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-20">
            <h2 className="text-2xl sm:text-5xl font-extrabold text-gray-900 mb-3">
              Featured Products
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover verified, top-quality products from trusted global suppliers.
            </p>
            <div className="mx-auto mt-4 sm:mt-5 w-16 sm:w-24 h-1.5 bg-gradient-to-r from-blue-600 via-teal-400 to-green-500 rounded-full"></div>
          </div>

          {/* Cards */}
          {loading ? (
            <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 gap-5 sm:gap-10 no-scrollbar snap-x snap-mandatory pb-3 sm:pb-0">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="snap-center shrink-0 h-60 sm:h-72 w-48 sm:w-80 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 gap-5 sm:gap-10 no-scrollbar snap-x snap-mandatory pb-3 sm:pb-0">
              {featuredProducts.slice(0, 3).map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="snap-center shrink-0 w-48 sm:w-96">
                  {/* Desktop Card (Full) */}
                  <Card className="hidden sm:flex flex-col overflow-hidden border border-gray-100 bg-white/70 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl hover:-translate-y-1 hover:border-blue-200/70">
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-t-2xl">
                      {product.images?.length ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={400}
                          height={250}
                          className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-52 bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                      {/* Stock badge */}
                      <div className="absolute top-3 right-3">
                        {product.inStock ? (
                          <Badge className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">In Stock</Badge>
                        ) : (
                          <Badge className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">Out of Stock</Badge>
                        )}
                      </div>
                    </div>

                    {/* Details (full view) */}
                    <CardHeader className="p-5 border-b border-gray-100">
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500 mt-1">
                        {product.category}
                      </CardDescription>
                    </CardHeader>

                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                              {formatPrice(getDiscountPrice(product.id, product.price), product.currency)}
                            </div>
                            <div className="text-sm text-gray-400 line-through">
                              {formatPrice(product.price, product.currency)}
                            </div>
                          </div>
                          <span className="text-sm text-gray-600">
                            Min: {product.minOrderQuantity} {product.unit}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <span>Supplier:</span>
                            <span className="font-medium text-gray-800">{product.supplier.companyName}</span>
                          </div>
                          <div className="flex items-center text-yellow-500">
                            ⭐<span className="ml-1 text-gray-700 font-medium">{product.supplier.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-600">{product.supplier.country}</span>
                          {product.supplier.verified && (
                            <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0.5 rounded-full">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                          View →
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Mobile Card (Compact) */}
                  <Card className="sm:hidden flex flex-col overflow-hidden border border-gray-200 bg-white shadow-sm rounded-2xl hover:shadow-lg transition-all duration-300">
                    <div className="relative w-full h-36 overflow-hidden">
                      <Image
                        src={product.images?.[0] || "https://via.placeholder.com/150"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{product.supplier.companyName}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-blue-600">
                            {formatPrice(getDiscountPrice(product.id, product.price), product.currency)}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(product.price, product.currency)}
                          </span>
                        </div>
                        {product.supplier.verified && (
                          <Badge className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-10 sm:mt-16">
            <Link href="/products">
              <Button className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:shadow-lg text-sm sm:text-base font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white transition-all duration-300">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* Top Suppliers Section */}
      <section className="py-16 px-5 sm:px-10 lg:px-16 relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-blue-50">
        {/* soft background blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4">
              Verified Suppliers
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with globally trusted suppliers backed by quality and reliability.
            </p>
            <div className="mx-auto mt-5 w-20 sm:w-24 h-1.5 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 rounded-full"></div>
          </div>

          {/* Two-column layout (equal height) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Left: Supplier Cards */}
            <div className="flex flex-col justify-between space-y-8">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-52 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
                  ></div>
                ))
              ) : (
                topSuppliers.slice(0, 3).map((supplier) => (
                  <Card
                    key={supplier.id}
                    className="group relative overflow-hidden border border-gray-200/50 bg-white/60 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl hover:-translate-y-1"
                  >
                    <CardHeader className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                            {supplier.companyName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {supplier.companyName}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-600">
                              {supplier.industry} • {supplier.country}
                            </CardDescription>
                          </div>
                        </div>
                        {supplier.verified && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full border border-green-200">
                            <span>✅</span> Verified
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                              ⭐ {supplier.rating}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Rating</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                              {supplier.totalOrders}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Orders</div>
                          </div>
                        </div>

                        <Link href={`/suppliers/${supplier.id}`}>
                          <button className="px-4 py-1.5 sm:px-5 sm:py-2 text-sm font-medium text-blue-600 rounded-full border border-blue-300 bg-white/60 hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
                            View
                          </button>
                        </Link>
                      </div>
                    </CardHeader>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-teal-400 to-green-400 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  </Card>
                ))
              )}
            </div>

            {/* Right: Scrollable Image Viewer (hidden on mobile) */}
            <div className="hidden lg:flex relative overflow-x-auto rounded-2xl shadow-lg border border-gray-200/40 scroll-smooth snap-x snap-mandatory bg-transparent h-full min-h-[480px]">
              <div className="flex space-x-6 px-6 py-2 w-full">
                {[
                  "https://drive.google.com/thumbnail?id=1fYBQF00JYL_Tay4u1Q7Onc7En_Rq7DFG&sz=w1080",
                  "https://drive.google.com/thumbnail?id=1JOUCkZkpBY8OSzaVcX5dpuHTlklmmjcu&sz=w1080",
                  "https://drive.google.com/thumbnail?id=1U2ZihNC2okp7t5MkwIOtHi56qDKpcDWM&sz=w1080",
                  "https://drive.google.com/thumbnail?id=17BnEBdb0resnTuV8stJJpkKOATOEoggL&sz=w1080",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="shrink-0 snap-center w-full h-full flex justify-center items-center rounded-2xl overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={`carousel-${i}`}
                      draggable={false}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-2xl"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1080&auto=format&fit=crop';
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Fade masks */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-14 sm:mt-20">
            <Link href="/suppliers">
              <button className="relative inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-semibold text-base sm:text-lg border border-blue-400 text-blue-600 bg-white/50 backdrop-blur-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg">
                View All Suppliers
              </button>
            </Link>
          </div>
        </div>
      </section>
      {/* Features Section */}
      {/* Why Choose Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-blue-50">
        {/* background blobs */}
        <div className="absolute top-0 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Why Choose TradeMart for Your B2B Trading?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-md sm:max-w-2xl mx-auto">
              The all-in-one global B2B hub connecting verified suppliers with secure, AI-driven trade opportunities.
            </p>
            <div className="mx-auto mt-6 w-20 sm:w-24 h-1.5 bg-gradient-to-r from-blue-600 via-green-500 to-teal-400 rounded-full"></div>
          </div>

          {/* Cards */}
          {/* Cards */}
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1 sm:px-0 pb-4">
            {[
              {
                iconBg: "from-blue-500 to-blue-700",
                hover: "text-blue-600",
                title: "Verified Suppliers",
                desc: "Every supplier is verified and certified — trade with absolute confidence.",
                path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                iconBg: "from-green-500 to-emerald-600",
                hover: "text-green-600",
                title: "Secure Payments",
                desc: "Escrow-protected transactions keep your funds safe until you receive your goods.",
                path: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
              },
              {
                iconBg: "from-purple-500 to-indigo-600",
                hover: "text-purple-600",
                title: "Fast Matching",
                desc: "Our AI instantly connects you with the best suppliers — faster deals, better margins.",
                path: "M13 10V3L4 14h7v7l9-11h-7z",
              },
            ].map((card, i) => (
              <Card
                key={i}
                className="group min-w-[85%] sm:min-w-0 snap-center text-center p-6 sm:p-10 border border-gray-100/70 bg-white/90 backdrop-blur-lg rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${card.iconBg} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-md`}
                  >
                    <svg
                      className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={card.path}
                      />
                    </svg>
                  </div>
                  <CardTitle
                    className={`text-lg sm:text-xl font-semibold mb-2 text-gray-900 group-hover:${card.hover} transition-colors`}
                  >
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
                    {card.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      {/* Steps */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1 sm:px-0">
        {[
          { step: 1, title: "Sign Up", desc: "Create your account as a buyer or supplier in just a few clicks." },
          { step: 2, title: "Browse & Connect", desc: "Find products or suppliers that match your business goals." },
          { step: 3, title: "Negotiate", desc: "Chat directly and finalize terms with clarity and trust." },
          { step: 4, title: "Trade Safely", desc: "Complete your order through our secure, protected payment system." },
        ].map((item) => (
          <div
            key={item.step}
            className="text-center group min-w-[80%] sm:min-w-0 snap-center bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm px-3 py-6 sm:px-4 hover:shadow-md transition-all duration-300"
          >
            <div className="relative w-12 sm:w-20 h-12 sm:h-20 mx-auto mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-green-500 rounded-full blur-sm opacity-70 group-hover:opacity-90 transition-all duration-500"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-blue-600 to-green-500 text-white rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold shadow-lg group-hover:scale-105 transition-transform">
                {item.step}
              </div>
            </div>
            <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-gray-600 text-xs sm:text-base max-w-xs mx-auto leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>


      {/* CTA Section */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-8 lg:px-16 overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700">
        {/* background accents */}
        <div className="absolute inset-0">
          <div className="absolute -top-16 sm:-top-20 -left-16 sm:-left-20 w-72 sm:w-96 h-72 sm:h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-72 sm:w-[28rem] h-72 sm:h-[28rem] bg-green-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08),_transparent_60%)]"></div>
        </div>

        <div className="relative max-w-3xl sm:max-w-4xl mx-auto text-center text-white px-2">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-5 sm:mb-6 tracking-tight">
            Ready to Start Trading?
          </h2>
          <p className="text-base sm:text-xl text-blue-100 mb-8 sm:mb-10 leading-relaxed px-2">
            Join thousands of businesses already growing with verified partners on TradeMart.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            {session ? (
              <>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold bg-white text-blue-700 hover:bg-blue-50 hover:scale-105 transition-all duration-300 rounded-full shadow-md hover:shadow-lg"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/auth/signout" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 hover:scale-105 transition-all duration-300 rounded-full shadow-md hover:shadow-lg"
                  >
                    Sign Out
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup?role=buyer" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold bg-white text-blue-700 hover:bg-blue-50 hover:scale-105 transition-all duration-300 rounded-full shadow-md hover:shadow-lg"
                  >
                    Start Buying
                  </Button>
                </Link>
                <Link href="/auth/signup?role=supplier" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 hover:scale-105 transition-all duration-300 rounded-full shadow-md hover:shadow-lg"
                  >
                    Start Selling
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>


      {/* import {FaTwitter, FaLinkedinIn, FaFacebookF} from "react-icons/fa"; */}

      <footer className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-blue-950 text-white py-16 px-6 sm:px-8 lg:px-16 overflow-hidden">
        {/* Animated gradient accents */}
        <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-[28rem] sm:h-[28rem] bg-green-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.05),_transparent_70%)]"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Main Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="md:col-span-2 sm:col-span-2">
              <div className="flex items-center mb-6">

                <span className="ml-3 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
                  TradeMart
                </span>
              </div>

              <p className="text-gray-400 mb-8 leading-relaxed text-sm sm:text-base">
                The world’s most trusted B2B marketplace — connecting verified suppliers and global buyers through secure, AI-powered trade.
              </p>

              {/* Social Icons using React Icons */}
              <div className="flex space-x-4">
                {[
                  { href: "https://twitter.com/trademart", icon: <FaTwitter /> },
                  { href: "https://linkedin.com/company/trademart", icon: <FaLinkedinIn /> },
                  { href: "https://facebook.com/trademart", icon: <FaFacebookF /> },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 text-gray-400 hover:text-white text-xl sm:text-2xl flex items-center justify-center"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Buyers */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-5 text-blue-300">For Buyers</h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
                <li><Link href="/products" className="hover:text-blue-300 transition-colors">Browse Products</Link></li>
                <li><Link href="/suppliers" className="hover:text-blue-300 transition-colors">Find Suppliers</Link></li>
                <li><Link href="/rfqs" className="hover:text-blue-300 transition-colors">Submit RFQ</Link></li>
                <li><Link href="/auth/signup?role=buyer" className="hover:text-blue-300 transition-colors">Join as Buyer</Link></li>
              </ul>
            </div>

            {/* Suppliers */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-5 text-green-300">For Suppliers</h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
                <li><Link href="/products/create" className="hover:text-green-300 transition-colors">List Products</Link></li>
                <li><Link href="/suppliers" className="hover:text-green-300 transition-colors">Supplier Dashboard</Link></li>
                <li><Link href="/rfqs" className="hover:text-green-300 transition-colors">Respond to RFQs</Link></li>
                <li><Link href="/auth/signup?role=supplier" className="hover:text-green-300 transition-colors">Join as Supplier</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-5 text-purple-300">Support</h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
                <li><Link href="/help" className="hover:text-purple-300 transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-purple-300 transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-purple-300 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-purple-300 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Stats Section */}
          <div className="border-t border-gray-800 mt-14 pt-10">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">
                  {loading ? "..." : stats.totalSuppliers.toLocaleString()}+
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">Verified Suppliers</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-green-400 mb-1">
                  {loading ? "..." : stats.totalProducts.toLocaleString()}+
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">Products Listed</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-purple-400 mb-1">
                  {loading ? "..." : stats.totalOrders.toLocaleString()}+
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">Orders Completed</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-amber-400 mb-1">100+</div>
                <div className="text-gray-400 text-xs sm:text-sm">Countries</div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-xs sm:text-sm leading-relaxed">
              <p>
                &copy; 2024 <span className="text-blue-400 font-semibold">TradeMart</span> — Global B2B Marketplace.
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
}
