"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function SignUpForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "buyer"
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const roleParam = searchParams.get("role");

    // Set role from URL parameter
    if (roleParam && ["buyer", "supplier"].includes(roleParam)) {
        formData.role = roleParam;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push("/auth/signin?message=Account created successfully. Please sign in.");
            } else {
                setError(data.error || "An error occurred. Please try again.");
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Link href="/" className="text-2xl font-bold text-primary">
                        TradeMart
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold text-foreground">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Or{" "}
                        <Link href="/auth/signin" className="font-medium text-primary hover:text-primary/80">
                            sign in to your existing account
                        </Link>
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>
                            Join TradeMart as a {formData.role}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                                    Full Name
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                                    Email address
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Create a password"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                                    Confirm Password
                                </label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Confirm your password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Account Type
                                </label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="buyer"
                                            checked={formData.role === "buyer"}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        Buyer
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="supplier"
                                            checked={formData.role === "supplier"}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        Supplier
                                    </label>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Create Account"}
                            </Button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        // Handle Google sign up
                                        window.location.href = "/api/auth/signin/google";
                                    }}
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
            </div>
        </div>
    );
}

export default function SignUp() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        }>
            <SignUpForm />
        </Suspense>
    );
}
