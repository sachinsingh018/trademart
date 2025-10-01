"use client";

import { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function SignInForm() {
    const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Validate input
        if (loginMethod === "email" && !email.trim()) {
            setError("Please enter your email address");
            setIsLoading(false);
            return;
        }
        if (loginMethod === "phone" && !phone.trim()) {
            setError("Please enter your phone number");
            setIsLoading(false);
            return;
        }
        if (!password.trim()) {
            setError("Please enter your password");
            setIsLoading(false);
            return;
        }

        try {
            const result = await signIn("credentials", {
                email: loginMethod === "email" ? email : phone,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(`Invalid ${loginMethod} or password`);
            } else {
                // Get the updated session to check user role
                const session = await getSession();
                if (session?.user?.role === "admin") {
                    router.push("/admin");
                } else {
                    router.push(callbackUrl);
                }
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-start justify-center px-4 sm:px-6 lg:px-8">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-0 right-1/4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-md w-full space-y-0 relative">
                <div className="text-center">
                    <Link href="/" className="hidden sm:flex items-center justify-center">
                        <div className="relative w-64 h-64 lg:w-72 lg:h-72">
                            <Image
                                src="/logofinal.png"
                                alt="TradeMart Logo"
                                fill
                                className="object-contain hover:scale-105 transition-transform duration-300 drop-shadow-xl"
                            />
                        </div>
                    </Link>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Welcome back
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                        Sign in to your account to continue
                    </p>
                </div>

                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4 sm:pb-6">
                        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Sign In</CardTitle>
                        <CardDescription className="text-sm sm:text-base text-gray-600">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Login Method Toggle */}
                            <div className="space-y-2 sm:space-y-3">
                                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                    Sign in with
                                </label>
                                <div className="flex space-x-2 sm:space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLoginMethod("email");
                                            setPhone(""); // Clear phone when switching to email
                                            setError("");
                                        }}
                                        className={`flex-1 py-2 px-3 sm:px-4 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base ${loginMethod === "email"
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                                            }`}
                                    >
                                        📧 Email
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLoginMethod("phone");
                                            setEmail(""); // Clear email when switching to phone
                                            setError("");
                                        }}
                                        className={`flex-1 py-2 px-3 sm:px-4 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base ${loginMethod === "phone"
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                                            }`}
                                    >
                                        📱 Phone
                                    </button>
                                </div>
                            </div>

                            {/* Email or Phone Input */}
                            <div className="space-y-1 sm:space-y-2">
                                <label htmlFor={loginMethod} className="block text-xs sm:text-sm font-medium text-gray-700">
                                    {loginMethod === "email" ? "Email address" : "Phone number"}
                                </label>
                                {loginMethod === "email" ? (
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                ) : (
                                    <div className="space-y-1">
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter your phone number"
                                            className="h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Enter the phone number you used during registration
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1 sm:space-y-2">
                                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                    className="h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-10 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing in...
                                    </div>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <p className="text-sm sm:text-base text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function SignIn() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        }>
            <SignInForm />
        </Suspense>
    );
}
