"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
    CreditCard, 
    Smartphone, 
    Building, 
    Shield,
    CheckCircle,
    Clock,
    AlertTriangle,
    DollarSign,
    QrCode,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Lock,
    Eye,
    EyeOff
} from "lucide-react";

interface PaymentMethod {
    id: string;
    name: string;
    type: 'upi' | 'netbanking' | 'wallet' | 'card';
    icon: string;
    description: string;
    processingFee: number;
    settlementTime: string;
    supportedBanks?: string[];
    upiApps?: string[];
}

interface EscrowAccount {
    id: string;
    orderId: string;
    accountNumber: string;
    amount: number;
    currency: string;
    status: 'pending' | 'funded' | 'released' | 'refunded' | 'disputed';
    paymentMethod: string;
    transactionId?: string;
    fundedAt?: string;
    releasedAt?: string;
    refundedAt?: string;
    refundReason?: string;
    qcPassed?: boolean;
    createdAt: string;
    expiresAt: string;
}

interface UPIEscrowProps {
    orderId?: string;
    amount?: number;
    onPaymentComplete?: (result: any) => void;
}

export default function UPIEscrow({ orderId, amount, onPaymentComplete }: UPIEscrowProps) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [paymentAmount, setPaymentAmount] = useState(amount?.toString() || "");
    const [upiId, setUpiId] = useState("");
    const [selectedBank, setSelectedBank] = useState("");
    const [selectedUpiApp, setSelectedUpiApp] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
    const [showQRCode, setShowQRCode] = useState(false);
    const [qrCodeData, setQrCodeData] = useState("");
    const [escrowAccount, setEscrowAccount] = useState<EscrowAccount | null>(null);

    const paymentMethods: PaymentMethod[] = [
        {
            id: 'upi',
            name: 'UPI Payment',
            type: 'upi',
            icon: 'Smartphone',
            description: 'Pay using UPI apps like PhonePe, Google Pay, Paytm',
            processingFee: 0.5,
            settlementTime: 'Instant',
            upiApps: ['PhonePe', 'Google Pay', 'Paytm', 'BHIM', 'Amazon Pay']
        },
        {
            id: 'netbanking',
            name: 'Net Banking',
            type: 'netbanking',
            icon: 'Building',
            description: 'Direct bank transfer using internet banking',
            processingFee: 1.0,
            settlementTime: '2-4 hours',
            supportedBanks: [
                'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
                'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda',
                'Canara Bank', 'Union Bank of India', 'Indian Bank'
            ]
        },
        {
            id: 'wallet',
            name: 'Digital Wallet',
            type: 'wallet',
            icon: 'CreditCard',
            description: 'Pay using digital wallets',
            processingFee: 0.8,
            settlementTime: 'Instant',
            upiApps: ['Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay Wallet']
        }
    ];

    const banks = [
        'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
        'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda',
        'Canara Bank', 'Union Bank of India', 'Indian Bank'
    ];

    const upiApps = ['PhonePe', 'Google Pay', 'Paytm', 'BHIM', 'Amazon Pay'];

    const initiatePayment = async () => {
        if (!selectedPaymentMethod || !paymentAmount) {
            alert("Please select payment method and enter amount");
            return;
        }

        setIsProcessing(true);
        setPaymentStatus('processing');

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate QR code for UPI
            if (selectedPaymentMethod.type === 'upi') {
                const qrData = `upi://pay?pa=trademart@paytm&pn=TradeMart&am=${paymentAmount}&cu=INR&tn=Order Payment`;
                setQrCodeData(qrData);
                setShowQRCode(true);
            }

            // Create escrow account
            const escrowData = {
                orderId: orderId || `ORD-${Date.now()}`,
                amount: parseFloat(paymentAmount),
                paymentMethod: selectedPaymentMethod.name,
                currency: 'INR'
            };

            const response = await fetch('/api/escrow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(escrowData),
            });

            if (response.ok) {
                const result = await response.json();
                setEscrowAccount(result.data);
                setPaymentStatus('success');
                onPaymentComplete?.(result);
            } else {
                setPaymentStatus('failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            setPaymentStatus('failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const getPaymentIcon = (iconName: string) => {
        switch (iconName) {
            case 'Smartphone': return <Smartphone className="h-6 w-6" />;
            case 'Building': return <Building className="h-6 w-6" />;
            case 'CreditCard': return <CreditCard className="h-6 w-6" />;
            default: return <CreditCard className="h-6 w-6" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'funded': return 'text-blue-600 bg-blue-100';
            case 'released': return 'text-green-600 bg-green-100';
            case 'refunded': return 'text-red-600 bg-red-100';
            case 'disputed': return 'text-orange-600 bg-orange-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Secure Escrow Payment</h2>
                <p className="text-gray-600 mb-4">
                    Your funds are protected until delivery confirmation
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span>100% Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Lock className="h-4 w-4 text-blue-500" />
                        <span>Escrow Protected</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                        <span>QC Verified</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Methods */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Choose Payment Method
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                    selectedPaymentMethod?.id === method.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setSelectedPaymentMethod(method)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${
                                            selectedPaymentMethod?.id === method.id
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {getPaymentIcon(method.icon)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{method.name}</h3>
                                            <p className="text-sm text-gray-600">{method.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{method.processingFee}% fee</p>
                                        <p className="text-xs text-gray-500">{method.settlementTime}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Payment Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Payment Amount (₹)
                            </label>
                            <Input
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                placeholder="Enter amount"
                                disabled={isProcessing}
                            />
                        </div>

                        {/* UPI Details */}
                        {selectedPaymentMethod?.type === 'upi' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        UPI ID
                                    </label>
                                    <Input
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="yourname@bank"
                                        disabled={isProcessing}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        UPI App
                                    </label>
                                    <Select value={selectedUpiApp} onValueChange={setSelectedUpiApp}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select UPI app" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {upiApps.map((app) => (
                                                <SelectItem key={app} value={app}>
                                                    {app}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {/* Net Banking Details */}
                        {selectedPaymentMethod?.type === 'netbanking' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Bank
                                </label>
                                <Select value={selectedBank} onValueChange={setSelectedBank}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your bank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {banks.map((bank) => (
                                            <SelectItem key={bank} value={bank}>
                                                {bank}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Payment Button */}
                        <Button
                            onClick={initiatePayment}
                            disabled={isProcessing || !selectedPaymentMethod || !paymentAmount}
                            className="w-full"
                        >
                            {isProcessing ? (
                                <>
                                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    <Shield className="h-4 w-4 mr-2" />
                                    Pay Securely with Escrow
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Payment Status & QR Code */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="h-5 w-5" />
                            Payment Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {paymentStatus === 'idle' && (
                            <div className="text-center py-12">
                                <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Pay</h3>
                                <p className="text-gray-600">
                                    Select a payment method and enter amount to proceed
                                </p>
                            </div>
                        )}

                        {paymentStatus === 'processing' && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payment</h3>
                                <p className="text-gray-600">
                                    Please wait while we process your payment...
                                </p>
                            </div>
                        )}

                        {paymentStatus === 'success' && showQRCode && (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-green-600 mb-2">Payment Initiated</h3>
                                    <p className="text-gray-600 mb-4">
                                        Scan QR code with your UPI app to complete payment
                                    </p>
                                </div>
                                
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="w-48 h-48 bg-white mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                                        <QrCode className="h-32 w-32 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">Amount: ₹{paymentAmount}</p>
                                    <p className="text-xs text-gray-500">UPI ID: {upiId}</p>
                                </div>

                                <div className="space-y-2">
                                    <Button className="w-full" disabled>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Payment Pending
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Escrow Details
                                    </Button>
                                </div>
                            </div>
                        )}

                        {paymentStatus === 'success' && !showQRCode && (
                            <div className="text-center py-12">
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-green-600 mb-2">Payment Successful!</h3>
                                <p className="text-gray-600 mb-4">
                                    Your payment has been processed and funds are held in escrow
                                </p>
                                {escrowAccount && (
                                    <div className="text-left bg-green-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-green-800 mb-2">Escrow Account Details</h4>
                                        <div className="space-y-1 text-sm text-green-700">
                                            <p>Account: {escrowAccount.accountNumber}</p>
                                            <p>Amount: ₹{escrowAccount.amount.toLocaleString()}</p>
                                            <p>Status: <Badge className={getStatusColor(escrowAccount.status)}>{escrowAccount.status}</Badge></p>
                                            <p>Expires: {new Date(escrowAccount.expiresAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {paymentStatus === 'failed' && (
                            <div className="text-center py-12">
                                <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-red-600 mb-2">Payment Failed</h3>
                                <p className="text-gray-600 mb-4">
                                    There was an error processing your payment. Please try again.
                                </p>
                                <Button onClick={() => setPaymentStatus('idle')}>
                                    Try Again
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Escrow Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        How Escrow Protection Works
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">1. Secure Payment</h3>
                            <p className="text-sm text-gray-600">
                                Your payment is held securely in our escrow account until delivery confirmation
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">2. Quality Check</h3>
                            <p className="text-sm text-gray-600">
                                Products undergo quality inspection before funds are released to supplier
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">3. Safe Release</h3>
                            <p className="text-sm text-gray-600">
                                Funds are only released after successful delivery and quality confirmation
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Methods Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Supported Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {paymentMethods.map((method) => (
                            <div key={method.id} className="border rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        {getPaymentIcon(method.icon)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{method.name}</h3>
                                        <p className="text-sm text-gray-600">{method.description}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p>Processing Fee: {method.processingFee}%</p>
                                    <p>Settlement: {method.settlementTime}</p>
                                    {method.supportedBanks && (
                                        <p>Banks: {method.supportedBanks.length}+ supported</p>
                                    )}
                                    {method.upiApps && (
                                        <p>Apps: {method.upiApps.length} supported</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
