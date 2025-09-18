import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // COMMENTED OUT - not used

// Mock OTP storage (in production, use Redis or database)
const otpStorage = new Map<string, { code: string; expires: number }>();

export async function POST(request: NextRequest) {
    try {
        const { method, email, phone, otp } = await request.json();

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

        // Check if OTP exists and is valid
        const storedOtp = otpStorage.get(identifier);
        if (!storedOtp) {
            return NextResponse.json(
                { error: "OTP not found or expired" },
                { status: 400 }
            );
        }

        // Check if OTP is expired
        if (Date.now() > storedOtp.expires) {
            otpStorage.delete(identifier);
            return NextResponse.json(
                { error: "OTP has expired" },
                { status: 400 }
            );
        }

        // Verify OTP
        if (storedOtp.code !== otp) {
            return NextResponse.json(
                { error: "Invalid OTP code" },
                { status: 400 }
            );
        }

        // OTP is valid, remove it from storage
        otpStorage.delete(identifier);

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

// Send OTP endpoint
export async function PUT(request: NextRequest) {
    try {
        const { method, email, phone } = await request.json();

        if (!method) {
            return NextResponse.json(
                { error: "Verification method is required" },
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

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Store OTP
        otpStorage.set(identifier, {
            code: otpCode,
            expires: expiresAt
        });

        // In development, log the OTP to console
        if (process.env.NODE_ENV === "development") {
            console.log(`🔐 OTP for ${identifier}: ${otpCode}`);
        }

        // TODO: In production, send actual OTP via SMS/Email
        // if (method === "email") {
        //     await sendOTPEmail(email, otpCode);
        // } else {
        //     await sendOTPSMS(phone, otpCode);
        // }

        return NextResponse.json({
            success: true,
            message: `OTP sent to ${method === "email" ? "email" : "phone"}`,
            // In development, include the OTP for testing
            ...(process.env.NODE_ENV === "development" && { otp: otpCode })
        });

    } catch (error) {
        console.error("OTP sending error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}