"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface NavbarProps {
    isPopupActive?: boolean;
}

export default function Navbar({ isPopupActive = false }: NavbarProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session } = useSession();

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <nav className="sticky top-0 z-[60] bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
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
                            {isPopupActive ? (
                                // When popup is active, only show Business Loans as clickable
                                <>
                                    <span className="text-gray-400 cursor-not-allowed font-medium">Suppliers</span>
                                    <span className="text-gray-400 cursor-not-allowed font-medium">Products</span>
                                    <span className="text-gray-400 cursor-not-allowed font-medium">Services</span>
                                    <span className="text-gray-400 cursor-not-allowed font-medium">RFQs</span>
                                    <Link
                                        href="/loans"
                                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                    >
                                        Business Loans
                                    </Link>
                                </>
                            ) : (
                                // Normal navigation when popup is not active
                                <>
                                    <Link
                                        href="/suppliers"
                                        className={`transition-colors font-medium ${isActive('/suppliers')
                                            ? 'text-blue-600'
                                            : 'text-gray-600 hover:text-blue-600'
                                            }`}
                                    >
                                        Suppliers
                                    </Link>
                                    <Link
                                        href="/products"
                                        className={`transition-colors font-medium ${isActive('/products')
                                            ? 'text-blue-600'
                                            : 'text-gray-600 hover:text-blue-600'
                                            }`}
                                    >
                                        Products
                                    </Link>
                                    <Link
                                        href="/services"
                                        className={`transition-colors font-medium ${isActive('/services')
                                            ? 'text-blue-600'
                                            : 'text-gray-600 hover:text-blue-600'
                                            }`}
                                    >
                                        Services
                                    </Link>
                                    <Link
                                        href="/rfqs"
                                        className={`transition-colors font-medium ${isActive('/rfqs')
                                            ? 'text-blue-600'
                                            : 'text-gray-600 hover:text-blue-600'
                                            }`}
                                    >
                                        RFQs
                                    </Link>
                                    <Link
                                        href="/loans"
                                        className={`transition-colors font-medium ${isActive('/loans')
                                            ? 'text-blue-600'
                                            : 'text-gray-600 hover:text-blue-600'
                                            }`}
                                    >
                                        Business Loans
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Auth Buttons - Desktop */}
                        <div className="hidden md:flex items-center space-x-4">
                            {session ? (
                                <>
                                    <Link href="/dashboard">
                                        <Button variant="outline" className="border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link href="/auth/signout">
                                        <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300">
                                            Sign Out
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/signin">
                                        <Button variant="outline" className="border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/auth/signup">
                                        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {!isMobileMenuOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                            {/* Mobile Navigation Links */}
                            {isPopupActive ? (
                                // When popup is active, only show Business Loans as clickable
                                <>
                                    <div className="block px-3 py-2 text-base font-medium text-gray-400 cursor-not-allowed">
                                        Suppliers
                                    </div>
                                    <div className="block px-3 py-2 text-base font-medium text-gray-400 cursor-not-allowed">
                                        Products
                                    </div>
                                    <div className="block px-3 py-2 text-base font-medium text-gray-400 cursor-not-allowed">
                                        Services
                                    </div>
                                    <div className="block px-3 py-2 text-base font-medium text-gray-400 cursor-not-allowed">
                                        RFQs
                                    </div>
                                    <Link
                                        href="/loans"
                                        className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Business Loans
                                    </Link>
                                </>
                            ) : (
                                // Normal navigation when popup is not active
                                <>
                                    <Link
                                        href="/suppliers"
                                        className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${isActive('/suppliers')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Suppliers
                                    </Link>
                                    <Link
                                        href="/products"
                                        className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${isActive('/products')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Products
                                    </Link>
                                    <Link
                                        href="/services"
                                        className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${isActive('/services')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Services
                                    </Link>
                                    <Link
                                        href="/rfqs"
                                        className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${isActive('/rfqs')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        RFQs
                                    </Link>
                                    <Link
                                        href="/loans"
                                        className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${isActive('/loans')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Business Loans
                                    </Link>
                                </>
                            )}

                            {/* Mobile Auth Buttons */}
                            <div className="border-t border-gray-200 pt-3 pb-3">
                                <div className="px-2 flex gap-2">
                                    {session ? (
                                        <>
                                            <Link
                                                href="/dashboard"
                                                className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 border border-gray-200"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                href="/auth/signout"
                                                className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Sign Out
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/auth/signin"
                                                className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 border border-gray-200"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                href="/auth/signup"
                                                className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
