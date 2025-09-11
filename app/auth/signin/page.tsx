"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
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

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-0 right-1/4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative">
                <div className="text-center">
                    <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                            TradeMart
                        </span>
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back
                    </h2>
                    <p className="text-gray-600">
                        Sign in to your account to continue
                    </p>
                </div>

                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-2xl font-bold text-gray-900">Sign In</CardTitle>
                        <CardDescription className="text-gray-600">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-medium"
                                    onClick={handleGoogleSignIn}
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Continue with Google
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <p className="text-gray-600">
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
