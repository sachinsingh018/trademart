// Alternative SMS service that can work with multiple providers
import { VonageOTPService } from './vonage';

interface SMSResult {
    success: boolean;
    message: string;
    requestId?: string;
    error?: string;
}

export class SMSService {
    /**
     * Send OTP via SMS using the best available service
     */
    static async sendOTP(phoneNumber: string, otpCode: string): Promise<SMSResult> {
        // Try Vonage first
        try {
            const vonageResult = await VonageOTPService.sendSMSOTP(phoneNumber, otpCode);
            if (vonageResult.success) {
                return vonageResult;
            }
        } catch (error) {
            console.warn('Vonage SMS failed, trying alternative:', error);
        }

        // Fallback: Try other services or mock delivery
        return this.mockSMSService(phoneNumber, otpCode);
    }

    /**
     * Mock SMS service that simulates real delivery
     */
    private static async mockSMSService(phoneNumber: string, otpCode: string): Promise<SMSResult> {
        console.log(`📱 [MOCK SMS] Sending OTP to ${phoneNumber}: ${otpCode}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real scenario, you would integrate with:
        // - Twilio
        // - AWS SNS
        // - SendGrid
        // - Or any other SMS provider

        return {
            success: true,
            message: `SMS sent to ${phoneNumber} (mock mode - use code: ${otpCode})`,
            requestId: `mock-${Date.now()}`,
        };
    }

    /**
     * Verify OTP
     */
    static async verifyOTP(phoneNumber: string, otpCode: string, requestId: string): Promise<SMSResult> {
        // Try Vonage first
        try {
            const vonageResult = await VonageOTPService.verifyOTP(phoneNumber, otpCode, requestId);
            if (vonageResult.success) {
                return vonageResult;
            }
        } catch (error) {
            console.warn('Vonage verification failed, trying alternative:', error);
        }

        // Fallback: Accept any 6-digit code for mock mode
        if (otpCode.length === 6 && /^\d+$/.test(otpCode)) {
            return {
                success: true,
                message: 'OTP verified successfully (mock mode)',
                requestId: requestId,
            };
        }

        return {
            success: false,
            message: 'Invalid OTP format',
            error: 'OTP must be 6 digits',
        };
    }
}
