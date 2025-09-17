"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CountryFlagsBar from "@/components/ui/country-flags-bar";
import SearchPopup from "@/components/ui/search-popup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://trademart.com'),
  title: "TradeMart - Global B2B Marketplace | Connect Buyers & Suppliers",
  description: "Join TradeMart, the leading global B2B marketplace. Connect with buyers and suppliers worldwide. Find products, submit RFQs, and grow your business.",
  keywords: "B2B marketplace, global trade, suppliers, buyers, RFQ, business, commerce",
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearchPopupOpen(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logofinal.png"
                  alt="TradeMart Logo"
                  width={160}
                  height={160}
                  className="w-40 h-40 hover:scale-120 transition-transform duration-300 drop-shadow-2xl"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/suppliers" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Suppliers
                </Link>
                <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Products
                </Link>
                <Link href="/rfqs" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  RFQs
                </Link>
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin">
                  <Button variant="outline" className="border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Country Flags Bar */}
      <CountryFlagsBar />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
              Trade Safe.
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent">
              Grow Fast.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            The B2B sourcing marketplace that connects buyers with verified suppliers.
            Secure transactions, competitive quotes, and trusted partnerships.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, suppliers, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none shadow-lg"
              />
              <Button
                onClick={handleSearch}
                className="absolute right-2 top-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-2"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link href="/auth/signup?role=buyer">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                📝 Post RFQ
              </Button>
            </Link>
            <Link href="/suppliers">
              <Button variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 transition-all duration-300">
                🏭 Browse Suppliers
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-6 py-3 transition-all duration-300">
                📦 View Products
              </Button>
            </Link>
            <Link href="/auth/signup?role=supplier">
              <Button variant="outline" className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-6 py-3 transition-all duration-300">
                🚀 Join as Supplier
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose TradeMart?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for modern B2B commerce with security and trust at its core
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-4 text-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">1</div>
                  Secure Escrow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Your funds are held securely until delivery is confirmed.
                  No payment until you&apos;re satisfied with your order.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-4 text-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">2</div>
                  Verified Suppliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  All suppliers are verified and rated.
                  See their track record, ratings, and past performance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-4 text-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">3</div>
                  Competitive Quotes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Get multiple quotes from verified suppliers.
                  Compare prices, lead times, and terms to find the best deal.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find suppliers across various industries
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Electronics", icon: "📱", color: "from-blue-500 to-blue-600" },
              { name: "Textiles", icon: "👕", color: "from-pink-500 to-pink-600" },
              { name: "Machinery", icon: "⚙️", color: "from-gray-500 to-gray-600" },
              { name: "Chemicals", icon: "🧪", color: "from-green-500 to-green-600" },
              { name: "Food & Beverage", icon: "🍎", color: "from-orange-500 to-orange-600" },
              { name: "Automotive", icon: "🚗", color: "from-red-500 to-red-600" },
              { name: "Construction", icon: "🏗️", color: "from-yellow-500 to-yellow-600" },
              { name: "Healthcare", icon: "🏥", color: "from-purple-500 to-purple-600" }
            ].map((category) => (
              <Card key={category.name} className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border-0 shadow-md bg-white group">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{category.name}</h3>
                  <p className="text-sm text-gray-500 mt-2">Browse suppliers</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              🔥 Trending This Week
            </h2>
            <p className="text-xl text-gray-600">
              Popular products and top-rated suppliers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Trending Products */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                📈 Hot Products
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Wireless Bluetooth Headphones", supplier: "TechCorp Ltd", orders: "2.3K", price: "$45" },
                  { name: "Industrial LED Strip Lights", supplier: "LightPro Inc", orders: "1.8K", price: "$12" },
                  { name: "Organic Cotton T-Shirts", supplier: "EcoWear Co", orders: "1.5K", price: "$8" },
                  { name: "Stainless Steel Water Bottles", supplier: "AquaTech", orders: "1.2K", price: "$15" }
                ].map((product, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-500">by {product.supplier}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{product.price}</div>
                        <div className="text-sm text-gray-500">{product.orders} orders</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Top Suppliers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                ⭐ Top Suppliers
              </h3>
              <div className="space-y-4">
                {[
                  { name: "GlobalTech Solutions", rating: "4.9", orders: "15.2K", category: "Electronics" },
                  { name: "Premium Textiles", rating: "4.8", orders: "12.8K", category: "Textiles" },
                  { name: "Industrial Supply Co", rating: "4.9", orders: "18.5K", category: "Machinery" },
                  { name: "EcoChem Industries", rating: "4.7", orders: "9.3K", category: "Chemicals" }
                ].map((supplier, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                          <p className="text-sm text-gray-500">{supplier.category}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-500">⭐ {supplier.rating}</span>
                        <span className="text-gray-500">{supplier.orders} orders</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-blue-100 text-lg">
              Real metrics from our platform
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">99.2%</div>
              <div className="text-blue-100">On-time Delivery</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">0.8%</div>
              <div className="text-blue-100">Dispute Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">24h</div>
              <div className="text-blue-100">Avg. Refund Time</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Verified Suppliers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your B2B Sourcing?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of businesses already using TradeMart for secure, efficient sourcing.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/signup?role=buyer">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Start Your First RFQ
              </Button>
            </Link>
            <Link href="/auth/signup?role=supplier">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300">
                Join as Supplier
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <h3 className="text-2xl font-bold">TradeMart</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The B2B sourcing marketplace that connects buyers with verified suppliers.
                Trade safe, grow fast.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/rfqs" className="hover:text-white transition-colors">Browse RFQs</Link></li>
                <li><Link href="/suppliers" className="hover:text-white transition-colors">Suppliers</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TradeMart. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Search Popup */}
      <SearchPopup
        isOpen={isSearchPopupOpen}
        onClose={() => setIsSearchPopupOpen(false)}
        searchTerm={searchTerm}
      />
    </div>
  );
}
