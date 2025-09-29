"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface NavbarProps {
    isPopupActive?: boolean;
}

export default function Navbar({ isPopupActive = false }: NavbarProps) {
    const pathname = usePathname();

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

                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-4">
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
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
