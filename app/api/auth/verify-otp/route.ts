import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { method, email, phone, otp } = await request.json();

        if (!method || !otp || (!email && !phone)) {
            return NextResponse.json(
                { error: "Method, OTP, and contact information are required" },
                { status: 400 }
            );
        }

        const identifier = method === "email" ? email : phone;

        // Find the verification token
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                identifier,
                token: otp,
                expires: {
                    gt: new Date(), // Token must not be expired
                },
            },
        });

        if (!verificationToken) {
            return NextResponse.json(
                { error: "Invalid or expired OTP" },
                { status: 400 }
            );
        }

        // Delete the used token
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier,
                    token: otp,
                },
            },
        });

        return NextResponse.json({
            message: "OTP verified successfully",
            verified: true,
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        return NextResponse.json(
            { error: "Failed to verify OTP. Please try again." },
            { status: 500 }
        );
    }
}
