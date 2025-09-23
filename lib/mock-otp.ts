// Mock OTP storage for development when database is not available
const otpStorage = new Map<string, { code: string; expires: number; method: string }>();

export class MockOTPService {
    /**
     * Store OTP in memory (for development)
     */
    static storeOTP(identifier: string, otp: string, method: string): void {
        const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
        otpStorage.set(identifier, { code: otp, expires, method });
    }

    /**
     * Get OTP from memory storage
     */
    static getOTP(identifier: string): { code: string; expires: number; method: string } | null {
        return otpStorage.get(identifier) || null;
    }

    /**
     * Remove OTP from storage
     */
    static removeOTP(identifier: string): void {
        otpStorage.delete(identifier);
    }

    /**
     * Clean up expired OTPs
     */
    static cleanupExpiredOTPs(): void {
        const now = Date.now();
        for (const [key, value] of otpStorage.entries()) {
            if (value.expires < now) {
                otpStorage.delete(key);
            }
        }
    }
}

// Clean up expired OTPs every 5 minutes
setInterval(() => {
    MockOTPService.cleanupExpiredOTPs();
}, 5 * 60 * 1000);
