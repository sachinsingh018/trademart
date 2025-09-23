import { NextRequest, NextResponse } from "next/server";
import { VonageOTPService } from "@/lib/vonage";
import { MockOTPService } from "@/lib/mock-otp";

export async function POST(request: NextRequest) {
    try {
        const { method, email, phone, otp, requestId } = await request.json();

        if (!method || !otp) {
            return NextResponse.json(
                { error: "Method and OTP code are required" },
                { status: 400 }
            );
        }

        const identifier = method === "email" ? email : phone;
        if (!identifier) {
            return NextResponse.json(
                { error: "Email or phone is required" },
                { status: 400 }
            );
        }

        // For phone verification with Vonage Verify API
        if (method === "phone" && requestId) {
            const verifyResult = await VonageOTPService.verifyOTP(phone, otp, requestId);

            if (!verifyResult.success) {
                return NextResponse.json(
                    { error: verifyResult.message },
                    { status: 400 }
                );
            }

            // Also verify in our mock storage
            const storedOtp = MockOTPService.getOTP(phone);
            if (!storedOtp || storedOtp.expires < Date.now()) {
                return NextResponse.json(
                    { error: "OTP not found or expired" },
                    { status: 400 }
                );
            }
            MockOTPService.removeOTP(phone);

            return NextResponse.json({
                success: true,
                message: verifyResult.message
            });
        }

        // For email verification using mock storage
        const storedOtp = MockOTPService.getOTP(identifier);
        if (!storedOtp) {
            return NextResponse.json(
                { error: "OTP not found or expired" },
                { status: 400 }
            );
        }

        // Check if OTP is expired
        if (storedOtp.expires < Date.now()) {
            MockOTPService.removeOTP(identifier);
            return NextResponse.json(
                { error: "OTP has expired" },
                { status: 400 }
            );
        }

        // OTP is valid, remove it from mock storage
        MockOTPService.removeOTP(identifier);

        return NextResponse.json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error("OTP verification error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
