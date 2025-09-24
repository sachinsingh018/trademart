import { NextRequest, NextResponse } from "next/server";
import { VonageOTPService } from "@/lib/vonage";
import { MockOTPService } from "@/lib/mock-otp";

export async function POST(request: NextRequest) {
    try {
        const { method, email, phone } = await request.json();

        if (!method || (!email && !phone)) {
            return NextResponse.json(
                { error: "Method and contact information are required" },
                { status: 400 }
            );
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store OTP in mock storage (database disabled for now)
        const identifier = method === "email" ? email : phone;
        MockOTPService.storeOTP(identifier, otp, method);

        if (method === "email") {
            // Send OTP via Vonage Email service
            const emailResult = await VonageOTPService.sendEmailOTP(email, otp);

            if (!emailResult.success) {
                console.error("Email OTP failed:", emailResult.error);
                return NextResponse.json(
                    { error: emailResult.message },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                message: emailResult.message,
                requestId: emailResult.requestId,
            });
        } else if (method === "phone") {
            // Send OTP via Vonage SMS service
            const smsResult = await VonageOTPService.sendSMSOTP(phone, otp);

            if (!smsResult.success) {
                console.error("SMS OTP failed:", smsResult.error);
                return NextResponse.json(
                    { error: smsResult.message },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                message: smsResult.message,
                requestId: smsResult.requestId,
            });
        }

        return NextResponse.json(
            { error: "Invalid verification method" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Send OTP error:", error);
        return NextResponse.json(
            { error: "Failed to send OTP. Please try again." },
            { status: 500 }
        );
    }
}
