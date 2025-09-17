"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface WhatsAppNotificationProps {
    recipient: string;
    recipientName: string;
    messageType: 'rfq' | 'quote' | 'welcome' | 'custom';
    data: {
        rfqTitle?: string;
        buyerCompany?: string;
        quoteAmount?: string;
        supplierCompany?: string;
        userName?: string;
        role?: string;
        customMessage?: string;
    };
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function WhatsAppNotification({
    recipient,
    recipientName,
    messageType,
    data,
    onSuccess,
    onError
}: WhatsAppNotificationProps) {
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const sendNotification = async () => {
        setIsSending(true);
        setStatus('sending');
        setErrorMessage('');

        try {
            let endpoint = '';
            let payload: Record<string, unknown> = {};

            switch (messageType) {
                case 'rfq':
                    endpoint = '/api/whatsapp/send-notification';
                    payload = {
                        supplierPhone: recipient,
                        rfqTitle: data.rfqTitle,
                        buyerCompany: data.buyerCompany,
                        rfqId: data.rfqTitle // Using title as ID for now
                    };
                    break;
                case 'quote':
                    endpoint = '/api/whatsapp/send-quote-notification';
                    payload = {
                        buyerPhone: recipient,
                        rfqTitle: data.rfqTitle,
                        quoteAmount: data.quoteAmount,
                        supplierCompany: data.supplierCompany,
                        quoteId: data.rfqTitle // Using title as ID for now
                    };
                    break;
                case 'welcome':
                    endpoint = '/api/whatsapp/send-welcome';
                    payload = {
                        phone: recipient,
                        userName: data.userName,
                        role: data.role
                    };
                    break;
                case 'custom':
                    endpoint = '/api/whatsapp/send-message';
                    payload = {
                        phone: recipient,
                        message: data.customMessage
                    };
                    break;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                setStatus('success');
                onSuccess?.();
            } else {
                setStatus('error');
                setErrorMessage(result.error || 'Failed to send notification');
                onError?.(result.error || 'Failed to send notification');
            }
        } catch (error) {
            setStatus('error');
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            setErrorMessage(errorMsg);
            onError?.(errorMsg);
        } finally {
            setIsSending(false);
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'sending':
                return <Loader2 className="h-4 w-4 animate-spin" />;
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'error':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <MessageSquare className="h-4 w-4" />;
        }
    };

    const getStatusBadge = () => {
        switch (status) {
            case 'sending':
                return <Badge variant="secondary">Sending...</Badge>;
            case 'success':
                return <Badge variant="default" className="bg-green-100 text-green-800">Sent</Badge>;
            case 'error':
                return <Badge variant="destructive">Failed</Badge>;
            default:
                return null;
        }
    };

    const getMessagePreview = () => {
        switch (messageType) {
            case 'rfq':
                return `New RFQ: ${data.rfqTitle} from ${data.buyerCompany}`;
            case 'quote':
                return `New quote: ${data.quoteAmount} for ${data.rfqTitle} from ${data.supplierCompany}`;
            case 'welcome':
                return `Welcome ${data.userName}! You're registered as a ${data.role}`;
            case 'custom':
                return data.customMessage;
            default:
                return 'WhatsApp notification';
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    {getStatusIcon()}
                    WhatsApp Notification
                </CardTitle>
                <CardDescription>
                    Send notification to {recipientName}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Recipient:</span>
                        <span className="text-sm text-gray-600">{recipient}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Type:</span>
                        <Badge variant="outline">{messageType.toUpperCase()}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        {getStatusBadge()}
                    </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">Message Preview:</div>
                    <div className="text-sm text-gray-600">{getMessagePreview()}</div>
                </div>

                {status === 'error' && errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                        {errorMessage}
                    </div>
                )}

                <Button
                    onClick={sendNotification}
                    disabled={isSending || status === 'success'}
                    className="w-full"
                    variant={status === 'success' ? 'outline' : 'default'}
                >
                    {isSending ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                        </>
                    ) : status === 'success' ? (
                        <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Notification Sent
                        </>
                    ) : (
                        <>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send WhatsApp Notification
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
