import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">TradeMart</h1>
            </div>
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
      </nav>

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
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            The B2B sourcing marketplace that connects buyers with verified suppliers.
            Secure transactions, competitive quotes, and trusted partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/signup?role=buyer">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Start Buying
              </Button>
            </Link>
            <Link href="/auth/signup?role=supplier">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300">
                Become a Supplier
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
              "Electronics",
              "Textiles",
              "Machinery",
              "Chemicals",
              "Food & Beverage",
              "Automotive",
              "Construction",
              "Healthcare"
            ].map((category) => (
              <Card key={category} className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-0 shadow-md bg-white">
                <CardContent className="p-8 text-center">
                  <h3 className="font-semibold text-gray-900 text-lg hover:text-blue-600 transition-colors">{category}</h3>
                </CardContent>
              </Card>
            ))}
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
    </div>
  );
}
