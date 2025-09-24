// Check if Vonage credentials are available
const hasVonageCredentials = process.env.VONAGE_API_KEY &&
    process.env.VONAGE_API_SECRET &&
    process.env.VONAGE_API_KEY !== 'your-vonage-api-key' &&
    process.env.VONAGE_API_KEY.length > 0 &&
    process.env.VONAGE_API_SECRET.length > 0;

// Initialize Vonage client only if credentials are available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let vonage: any = null;
let vonageInitialized = false;

if (hasVonageCredentials) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Vonage } = require('@vonage/server-sdk');
        vonage = new Vonage({
            apiKey: process.env.VONAGE_API_KEY!,
            apiSecret: process.env.VONAGE_API_SECRET!,
        });
        vonageInitialized = true;
    } catch (error) {
        console.error('Failed to initialize Vonage client:', error);
        vonage = null;
        vonageInitialized = false;
    }
}

// Suppress unused variable warnings for mocked service
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unusedVonage = vonage;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unusedVonageInitialized = vonageInitialized;

interface OTPResult {
    success: boolean;
    message: string;
    requestId?: string;
    error?: string;
}

interface VerifyResult {
    success: boolean;
    message: string;
    error?: string;
}

export class VonageOTPService {
    /**
     * Send SMS OTP using Vonage SMS API
     */
    static async sendSMSOTP(phoneNumber: string, otpCode: string): Promise<OTPResult> {
        // MOCK OTP SERVICE - Commented out Vonage API for now
        console.log(`📱 [MOCK SMS] Sending OTP to ${phoneNumber}: ${otpCode}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            message: `SMS sent to ${phoneNumber} (mock mode - use code: ${otpCode})`,
            requestId: `mock-sms-${Date.now()}`,
        };

        /* COMMENTED OUT VONAGE API - TO BE IMPLEMENTED BY OTHER ENGINEER
        // Check if Vonage is properly initialized
        if (!vonage || !vonageInitialized || !hasVonageCredentials) {
            // In production, this should not happen if credentials are properly set
            return {
                success: false,
                message: 'SMS service not available',
                error: 'Vonage credentials not configured',
            };
        }

        try {
            // Try Vonage Verify API first
            const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
            
            console.log(`📱 Attempting to send OTP via Vonage Verify API to ${formattedPhone}...`);
            console.log(`📱 Vonage credentials check:`, {
                hasCredentials: hasVonageCredentials,
                vonageInitialized: vonageInitialized,
                vonageExists: !!vonage
            });

            const response = await vonage.verify.start({
                number: formattedPhone,
                brand: 'TradeMart',
                code_length: 6,
                pin_expiry: 600, // 10 minutes
                next_event_wait: 60, // Wait 60 seconds before allowing next attempt
                workflow_id: 1, // SMS only workflow (no voice calls)
            });

            console.log('📱 Verify API Response:', JSON.stringify(response, null, 2));

            if (response.status === '0') {
                console.log(`✅ OTP sent successfully via Verify API to ${formattedPhone}`);
                return {
                    success: true,
                    message: 'SMS OTP sent successfully',
                    requestId: response.request_id,
                };
            } else {
                console.log(`⚠️ Verify API failed (${response.status}): ${response.error_text || 'Unknown error'}`);
                console.log(`⚠️ Full Verify API response:`, JSON.stringify(response, null, 2));
                
                // If Verify API fails due to credentials, try basic SMS API
                if (response.status === '4' || response.error_text?.includes('Bad Credentials')) {
                    console.log(`🔄 Falling back to basic SMS API...`);
                    return await this.sendBasicSMS(formattedPhone, otpCode);
                }

                return {
                    success: false,
                    message: 'Failed to send SMS OTP',
                    error: response.error_text || 'Unknown error',
                };
            }
        } catch (error) {
            console.error('📱 Verify API error:', error);
            // Fallback: try basic SMS
            try {
                console.log(`🔄 Falling back to basic SMS API due to error...`);
                return await this.sendBasicSMS(phoneNumber, otpCode);
            } catch (fallbackError) {
                console.error('SMS delivery failed:', fallbackError);
                return {
                    success: false,
                    message: 'SMS delivery failed',
                    error: 'Unable to send SMS at this time',
                };
            }
        }
        */
    }

    /**
     * Send basic SMS using Vonage SMS API (fallback method) - COMMENTED OUT
     */
    private static async sendBasicSMS(phoneNumber: string, otpCode: string): Promise<OTPResult> {
        // MOCK SMS SERVICE - Commented out Vonage API for now
        console.log(`📱 [MOCK SMS] Sending OTP to ${phoneNumber}: ${otpCode}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            message: `SMS sent to ${phoneNumber} (mock mode - use code: ${otpCode})`,
            requestId: `mock-sms-${Date.now()}`,
        };

        /* COMMENTED OUT VONAGE API - TO BE IMPLEMENTED BY OTHER ENGINEER
        try {
            const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
            
            console.log(`📱 Attempting to send SMS to ${formattedPhone} with OTP: ${otpCode}`);
            console.log(`📱 Vonage credentials check:`, {
                hasCredentials: hasVonageCredentials,
                vonageInitialized: vonageInitialized,
                vonageExists: !!vonage
            });

            const smsResult = await vonage!.sms.send({
                to: formattedPhone,
                from: 'TradeMart', // You might need to register this sender name
                text: `Your TradeMart verification code is: ${otpCode}. This code expires in 10 minutes. Do not share this code with anyone.`
            });

            console.log(`📱 SMS API Response:`, JSON.stringify(smsResult, null, 2));

            if (smsResult.messages && smsResult.messages[0]?.status === '0') {
                console.log(`✅ SMS sent successfully to ${formattedPhone}`);
                return {
                    success: true,
                    message: 'SMS OTP sent successfully',
                    requestId: smsResult.messages[0]['message-id'],
                };
            } else {
                const errorText = smsResult.messages?.[0]?.['error-text'] || 'SMS sending failed';
                const errorCode = smsResult.messages?.[0]?.['status'];
                console.error(`❌ SMS failed: ${errorText} (Status: ${errorCode})`);
                console.error(`❌ Full SMS response:`, JSON.stringify(smsResult, null, 2));
                throw new Error(errorText);
            }
        } catch (error) {
            console.error(`❌ SMS send error:`, error);
            throw error;
        }
        */
    }

    /**
     * Send Email OTP using Vonage Email API - MOCKED FOR NOW
     */
    static async sendEmailOTP(email: string, otpCode: string): Promise<OTPResult> {
        // MOCK EMAIL SERVICE - Commented out Vonage API for now
        console.log(`📧 [MOCK EMAIL] Sending OTP to ${email}: ${otpCode}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            message: `Email sent to ${email} (mock mode - use code: ${otpCode})`,
            requestId: `mock-email-${Date.now()}`,
        };

        /* COMMENTED OUT VONAGE EMAIL API - TO BE IMPLEMENTED BY OTHER ENGINEER
        // Check if Vonage is available
        if (!vonage || !hasVonageCredentials) {
            return {
                success: false,
                message: 'Email service not available',
                error: 'Vonage credentials not configured',
            };
        }

        try {
            const emailContent = {
                from: {
                    email: process.env.VONAGE_EMAIL_FROM || 'noreply@trademart.com',
                    name: 'TradeMart'
                },
                to: [
                    {
                        email: email
                    }
                ],
                subject: 'TradeMart Verification Code',
                html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TradeMart Verification</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">TradeMart</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your Business Trading Platform</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
              <h2 style="color: #333; margin-bottom: 20px;">Verification Code</h2>
              <p style="color: #666; margin-bottom: 30px;">Use the following code to verify your account:</p>
              
              <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
                <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${otpCode}</span>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                This code will expire in <strong>10 minutes</strong>.
              </p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>Security Notice:</strong> Never share this code with anyone. TradeMart will never ask for your verification code.
              </p>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 12px;">
              <p>If you didn't request this verification code, please ignore this email.</p>
              <p>&copy; 2024 TradeMart. All rights reserved.</p>
            </div>
          </body>
          </html>
        `,
                text: `Your TradeMart verification code is: ${otpCode}. This code expires in 10 minutes. Do not share this code with anyone.`
            };

            // Try to send real email via Vonage API
            console.log(`📧 Attempting to send email to ${email} via Vonage API...`);

            try {
                // Note: Vonage Email API might require different implementation
                // For now, we'll log the attempt and show the email content
                console.log('📧 Email content:', {
                    to: email,
                    subject: emailContent.subject,
                    otp: otpCode
                });

                // In production, you would use Vonage Email API here
                // const response = await vonage.email.send(emailContent);

                console.log(`✅ Email sent successfully to ${email}`);
                return {
                    success: true,
                    message: 'Email OTP sent successfully via Vonage',
                    requestId: `email-${Date.now()}`,
                };
            } catch (emailError) {
                console.error('❌ Email sending failed:', emailError);
                throw emailError;
            }
        } catch (error) {
            console.error('Vonage Email OTP error:', error);
            return {
                success: false,
                message: 'Failed to send Email OTP',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
        */
    }

    /**
     * Verify OTP using Vonage Verify API (for phone numbers) - MOCKED FOR NOW
     */
    static async verifyOTP(phoneNumber: string, otpCode: string, requestId: string): Promise<VerifyResult> {
        // MOCK OTP VERIFICATION - Commented out Vonage API for now
        console.log(`🔍 [MOCK VERIFY] Verifying OTP ${otpCode} for ${phoneNumber} (request: ${requestId})`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Accept any 6-digit code for mock mode
        if (otpCode.length === 6 && /^\d+$/.test(otpCode)) {
            console.log(`✅ [MOCK VERIFY] OTP verified successfully`);
            return {
                success: true,
                message: 'OTP verified successfully (mock mode)',
            };
        }

        return {
            success: false,
            message: 'Invalid OTP format',
            error: 'OTP must be 6 digits',
        };

        /* COMMENTED OUT VONAGE VERIFY API - TO BE IMPLEMENTED BY OTHER ENGINEER
        // Check if Vonage is available
        if (!vonage || !hasVonageCredentials) {
            return {
                success: false,
                message: 'Verification service not available',
                error: 'Vonage credentials not configured',
            };
        }

        try {
            const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

            const response = await vonage.verify.check(requestId, otpCode);

            if (response.status === '0') {
                return {
                    success: true,
                    message: 'OTP verified successfully',
                };
            } else {
                return {
                    success: false,
                    message: 'Invalid or expired OTP',
                    error: response.error_text || 'Verification failed',
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'OTP verification failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
        */
    }

    /**
     * Send OTP using Vonage Verify API (recommended for phone verification) - MOCKED FOR NOW
     */
    static async sendVerifyOTP(phoneNumber: string): Promise<OTPResult> {
        // MOCK VERIFY OTP SERVICE - Commented out Vonage API for now
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`📱 [MOCK VERIFY] Sending OTP to ${phoneNumber}: ${otpCode}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            message: 'Verification code sent successfully (mock mode)',
            requestId: `mock-verify-${Date.now()}`,
        };

        /* COMMENTED OUT VONAGE VERIFY API - TO BE IMPLEMENTED BY OTHER ENGINEER
        // Check if Vonage is available
        if (!vonage || !hasVonageCredentials) {
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(`📱 Vonage not configured - mock verify OTP for ${phoneNumber}: ${otpCode}`);
            return {
                success: true,
                message: 'Verification code sent successfully (mock mode)',
                requestId: `mock-verify-${Date.now()}`,
            };
        }

        try {
            const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

            const response = await vonage.verify.start({
                number: formattedPhone,
                brand: 'TradeMart',
                code_length: 6,
                pin_expiry: 600, // 10 minutes
                next_event_wait: 60, // Wait 60 seconds before allowing next attempt
            });

            if (response.status === '0') {
                return {
                    success: true,
                    message: 'Verification code sent successfully',
                    requestId: response.request_id,
                };
            } else {
                return {
                    success: false,
                    message: 'Failed to send verification code',
                    error: response.error_text || 'Unknown error',
                };
            }
        } catch (error) {
            console.error('Vonage Verify OTP error:', error);
            return {
                success: false,
                message: 'Failed to send verification code',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
        */
    }

    /**
     * Cancel a verification request - MOCKED FOR NOW
     */
    static async cancelVerification(requestId: string): Promise<VerifyResult> {
        // MOCK CANCEL VERIFICATION - Commented out Vonage API for now
        console.log(`📱 [MOCK CANCEL] Cancelling verification for request: ${requestId}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            success: true,
            message: 'Verification cancelled successfully (mock mode)',
        };

        /* COMMENTED OUT VONAGE CANCEL API - TO BE IMPLEMENTED BY OTHER ENGINEER
        // Check if Vonage is available
        if (!vonage || !hasVonageCredentials) {
            console.log(`📱 Vonage not configured - mock cancel verification for request: ${requestId}`);
            return {
                success: true,
                message: 'Verification cancelled successfully (mock mode)',
            };
        }

        try {
            const response = await vonage.verify.cancel(requestId);

            if (response.status === '0') {
                return {
                    success: true,
                    message: 'Verification cancelled successfully',
                };
            } else {
                return {
                    success: false,
                    message: 'Failed to cancel verification',
                    error: response.error_text || 'Unknown error',
                };
            }
        } catch (error) {
            console.error('Vonage cancel verification error:', error);
            return {
                success: false,
                message: 'Failed to cancel verification',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
        */
    }
}

// Export individual functions for convenience
export const sendSMSOTP = VonageOTPService.sendSMSOTP;
export const sendEmailOTP = VonageOTPService.sendEmailOTP;
export const verifyOTP = VonageOTPService.verifyOTP;
export const sendVerifyOTP = VonageOTPService.sendVerifyOTP;
export const cancelVerification = VonageOTPService.cancelVerification;