"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                    <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <Card className="shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl text-center">TradeMart Privacy Policy</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
                                <p className="text-gray-700 leading-relaxed mb-3">
                                    We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li><strong>Account Information:</strong> Name, email address, phone number, company details</li>
                                    <li><strong>Business Information:</strong> Company name, industry, business type, website</li>
                                    <li><strong>Location Data:</strong> Country, city, address, postal code</li>
                                    <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely)</li>
                                    <li><strong>Communication Data:</strong> Messages, support tickets, feedback</li>
                                    <li><strong>Usage Data:</strong> How you interact with our platform, features used, time spent</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
                                <p className="text-gray-700 leading-relaxed mb-3">
                                    We use the information we collect to:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Provide, maintain, and improve our services</li>
                                    <li>Process transactions and send related information</li>
                                    <li>Send technical notices, updates, and support messages</li>
                                    <li>Respond to your comments and questions</li>
                                    <li>Verify your identity and prevent fraud</li>
                                    <li>Comply with legal obligations</li>
                                    <li>Personalize your experience on our platform</li>
                                    <li>Send marketing communications (with your consent)</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Information Sharing</h2>
                                <p className="text-gray-700 leading-relaxed mb-3">
                                    We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li><strong>With Other Users:</strong> Basic profile information visible to other platform users</li>
                                    <li><strong>Service Providers:</strong> Trusted third parties who assist in platform operations</li>
                                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                                    <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                                    <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Security</h2>
                                <p className="text-gray-700 leading-relaxed mb-3">
                                    We implement appropriate security measures to protect your personal information:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>SSL encryption for data transmission</li>
                                    <li>Secure data storage with encryption at rest</li>
                                    <li>Regular security audits and assessments</li>
                                    <li>Access controls and authentication protocols</li>
                                    <li>Employee training on data protection</li>
                                    <li>Incident response procedures</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies and Tracking</h2>
                                <p className="text-gray-700 leading-relaxed mb-3">
                                    We use cookies and similar technologies to:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Remember your preferences and settings</li>
                                    <li>Analyze platform usage and performance</li>
                                    <li>Provide personalized content and features</li>
                                    <li>Improve user experience and functionality</li>
                                    <li>Ensure platform security and prevent fraud</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed mt-3">
                                    You can control cookie settings through your browser, but disabling cookies may affect platform functionality.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Retention</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Account information is typically retained for the duration of your account plus a reasonable period after account closure.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
                                <p className="text-gray-700 leading-relaxed mb-3">
                                    Depending on your location, you may have the following rights regarding your personal information:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li><strong>Access:</strong> Request a copy of your personal information</li>
                                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                                    <li><strong>Deletion:</strong> Request deletion of your information</li>
                                    <li><strong>Portability:</strong> Receive your data in a structured format</li>
                                    <li><strong>Restriction:</strong> Limit how we process your information</li>
                                    <li><strong>Objection:</strong> Object to certain processing activities</li>
                                    <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. International Data Transfers</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Children&apos;s Privacy</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16, we will take steps to delete such information.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Third-Party Services</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to This Policy</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Us</h2>
                                <p className="text-gray-700 leading-relaxed mb-3">
                                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700">
                                        <strong>Email:</strong> privacy@trademart.com<br />
                                        <strong>Data Protection Officer:</strong> dpo@trademart.com<br />
                                        <strong>Address:</strong> TradeMart Privacy Team<br />
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
