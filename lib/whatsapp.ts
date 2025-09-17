import axios from 'axios';

interface WhatsAppMessage {
    to: string;
    type: 'template' | 'text';
    template?: {
        name: string;
        language: { code: string };
        components?: Array<{
            type: string;
            parameters: Array<{ type: string; text: string }>;
        }>;
    };
    text?: {
        body: string;
    };
}

interface WhatsAppResponse {
    success: boolean;
    messageId?: string;
    status?: string;
    error?: string;
}

class WhatsAppService {
    private accessToken: string;
    private phoneNumberId: string;
    private businessAccountId: string;
    private isDevelopment: boolean;

    constructor() {
        this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
        this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
        this.businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '';
        this.isDevelopment = process.env.NODE_ENV === 'development' || !this.accessToken;
    }

    async sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
        if (this.isDevelopment) {
            return this.sendMockMessage(message);
        }

        try {
            const response = await axios.post(
                `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
                {
                    messaging_product: "whatsapp",
                    ...message
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            return {
                success: true,
                messageId: response.data.messages[0].id,
                status: 'sent'
            };
        } catch (error: any) {
            console.error('WhatsApp API Error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.error?.message || 'Failed to send WhatsApp message'
            };
        }
    }

    private async sendMockMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
        console.log('📱 [MOCK] WhatsApp Message:', {
            to: message.to,
            type: message.type,
            content: message.template || message.text
        });

        return {
            success: true,
            messageId: `mock_${Date.now()}`,
            status: 'sent'
        };
    }

    async sendRFQNotification(supplierPhone: string, rfqTitle: string, buyerCompany: string, rfqId: string): Promise<WhatsAppResponse> {
        const message: WhatsAppMessage = {
            to: supplierPhone,
            type: 'template',
            template: {
                name: 'rfq_notification',
                language: { code: 'en' },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: rfqTitle },
                            { type: 'text', text: buyerCompany }
                        ]
                    },
                    {
                        type: 'button',
                        parameters: [
                            { type: 'text', text: `${process.env.NEXTAUTH_URL}/rfqs/${rfqId}` }
                        ]
                    }
                ]
            }
        };

        return this.sendMessage(message);
    }

    async sendQuoteNotification(buyerPhone: string, rfqTitle: string, quoteAmount: string, supplierCompany: string, quoteId: string): Promise<WhatsAppResponse> {
        const message: WhatsAppMessage = {
            to: buyerPhone,
            type: 'template',
            template: {
                name: 'quote_received',
                language: { code: 'en' },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: rfqTitle },
                            { type: 'text', text: quoteAmount },
                            { type: 'text', text: supplierCompany }
                        ]
                    },
                    {
                        type: 'button',
                        parameters: [
                            { type: 'text', text: `${process.env.NEXTAUTH_URL}/rfqs/${quoteId}` }
                        ]
                    }
                ]
            }
        };

        return this.sendMessage(message);
    }

    async sendOrderUpdateNotification(phone: string, orderId: string, status: string, message: string): Promise<WhatsAppResponse> {
        const whatsappMessage: WhatsAppMessage = {
            to: phone,
            type: 'template',
            template: {
                name: 'order_update',
                language: { code: 'en' },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: orderId },
                            { type: 'text', text: status },
                            { type: 'text', text: message }
                        ]
                    }
                ]
            }
        };

        return this.sendMessage(whatsappMessage);
    }

    async sendWelcomeMessage(phone: string, userName: string, role: string): Promise<WhatsAppResponse> {
        const message: WhatsAppMessage = {
            to: phone,
            type: 'template',
            template: {
                name: 'welcome_message',
                language: { code: 'en' },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: userName },
                            { type: 'text', text: role }
                        ]
                    }
                ]
            }
        };

        return this.sendMessage(message);
    }

    async sendCustomMessage(phone: string, text: string): Promise<WhatsAppResponse> {
        const message: WhatsAppMessage = {
            to: phone,
            type: 'text',
            text: {
                body: text
            }
        };

        return this.sendMessage(message);
    }

    // Validate phone number format
    validatePhoneNumber(phone: string): boolean {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        
        // Check if it's a valid international format (10-15 digits)
        return cleaned.length >= 10 && cleaned.length <= 15;
    }

    // Format phone number for WhatsApp
    formatPhoneNumber(phone: string): string {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        
        // Add country code if not present (assuming US +1 if not specified)
        if (cleaned.length === 10) {
            return `+1${cleaned}`;
        } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
            return `+${cleaned}`;
        } else if (cleaned.length > 11) {
            return `+${cleaned}`;
        }
        
        return phone; // Return original if can't format
    }
}

export const whatsappService = new WhatsAppService();
export default WhatsAppService;
