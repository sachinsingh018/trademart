"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="flex items-center justify-center mb-6">
                        <Image
                            src="/logofinal.png"
                            alt="TradeMart Logo"
                            width={120}
                            height={120}
                            className="w-24 h-24 hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                        />
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
                    <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <Card className="shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl text-center">TradeMart Terms of Service</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    By accessing and using TradeMart (&quot;the Platform&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
                                <p className="text-gray-700 leading-relaxed mb-3">
                                    TradeMart is a B2B trading platform that connects buyers and suppliers worldwide. Our services include:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Product and service listings</li>
                                    <li>Secure messaging between parties</li>
                                    <li>Escrow payment processing</li>
                                    <li>Order management and tracking</li>
                                    <li>Dispute resolution services</li>
                                    <li>Verification and certification services</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
                                <p className="text-gray-700 leading-relaxed mb-3">
                                    To access certain features of the Platform, you must register for an account. You agree to:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Provide accurate, current, and complete information</li>
                                    <li>Maintain and update your account information</li>
                                    <li>Keep your password secure and confidential</li>
                                    <li>Accept responsibility for all activities under your account</li>
                                    <li>Notify us immediately of any unauthorized use</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. User Responsibilities</h2>
                                <p className="text-gray-700 leading-relaxed mb-3">
                                    As a user of TradeMart, you agree to:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Comply with all applicable laws and regulations</li>
                                    <li>Provide accurate product descriptions and pricing</li>
                                    <li>Honor all commitments and agreements made through the Platform</li>
                                    <li>Maintain professional conduct in all communications</li>
                                    <li>Respect intellectual property rights of others</li>
                                    <li>Not engage in fraudulent, deceptive, or illegal activities</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Payment and Escrow Services</h2>
                                <p className="text-gray-700 leading-relaxed mb-3">
                                    TradeMart provides secure payment processing through our escrow system:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>All payments are held in escrow until order completion</li>
                                    <li>Transaction fees are clearly disclosed before payment</li>
                                    <li>Refunds are processed according to our refund policy</li>
                                    <li>We reserve the right to hold funds for security purposes</li>
                                    <li>Chargebacks and disputes are handled according to our dispute resolution process</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Prohibited Activities</h2>
                                <p className="text-gray-700 leading-relaxed mb-3">
                                    The following activities are strictly prohibited on TradeMart:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Listing counterfeit or illegal products</li>
                                    <li>Engaging in money laundering or fraud</li>
                                    <li>Violating intellectual property rights</li>
                                    <li>Spamming or unsolicited communications</li>
                                    <li>Attempting to circumvent our security measures</li>
                                    <li>Creating multiple accounts to avoid restrictions</li>
                                    <li>Sharing false or misleading information</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    All content on TradeMart, including but not limited to text, graphics, logos, images, and software, is the property of TradeMart or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or create derivative works without express written permission.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Dispute Resolution</h2>
                                <p className="text-gray-700 leading-relaxed mb-3">
                                    TradeMart provides a comprehensive dispute resolution process:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Initial mediation through our support team</li>
                                    <li>Escalation to our dispute resolution specialists</li>
                                    <li>Binding arbitration for unresolved disputes</li>
                                    <li>Compliance with applicable consumer protection laws</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    TradeMart shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Platform.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Account Termination</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    We reserve the right to terminate or suspend your account at any time for violations of these terms, fraudulent activity, or any other reason at our sole discretion. Upon termination, your right to use the Platform will cease immediately.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to Terms</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the Platform. Continued use of the Platform after changes constitutes acceptance of the new terms.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Information</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    If you have any questions about these Terms of Service, please contact us at:
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                                    <p className="text-gray-700">
                                        <strong>Email:</strong> legal@trademart.com<br />
                                        <strong>Address:</strong> TradeMart Legal Department<br />
                                        <strong>Phone:</strong> +1 (555) 123-4567
                                    </p>
                                </div>
                            </div>

                            <div className="border-t pt-6 mt-8">
                                <div className="flex justify-center space-x-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => window.close()}
                                    >
                                        Close & Return to Signup
                                    </Button>
                                    <Link href="/">
                                        <Button>Go to Homepage</Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
