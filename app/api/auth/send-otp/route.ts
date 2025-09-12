import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// TODO: Replace with actual AWS services
// import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
// import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

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

        // Store OTP in database (for verification)
        await prisma.verificationToken.upsert({
            where: {
                identifier_token: {
                    identifier: method === "email" ? email : phone,
                    token: otp,
                },
            },
            update: {
                token: otp,
                expires: expiresAt,
            },
            create: {
                identifier: method === "email" ? email : phone,
                token: otp,
                expires: expiresAt,
            },
        });

        if (method === "email") {
            // TODO: Replace with AWS SES
            // const sesClient = new SESClient({ region: process.env.AWS_REGION });
            // const command = new SendEmailCommand({
            //   Source: process.env.FROM_EMAIL,
            //   Destination: { ToAddresses: [email] },
            //   Message: {
            //     Subject: { Data: "TradeMart Verification Code" },
            //     Body: {
            //       Text: { Data: `Your verification code is: ${otp}. This code expires in 10 minutes.` },
            //       Html: { Data: `<h2>TradeMart Verification</h2><p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>` }
            //     }
            //   }
            // });
            // await sesClient.send(command);

            // Placeholder - in development, log the OTP
            console.log(`📧 Email OTP for ${email}: ${otp}`);

            return NextResponse.json({
                message: "OTP sent to email successfully",
                // In development, include OTP for testing
                ...(process.env.NODE_ENV === "development" && { otp }),
            });
        } else if (method === "phone") {
            // TODO: Replace with AWS SNS
            // const snsClient = new SNSClient({ region: process.env.AWS_REGION });
            // const command = new PublishCommand({
            //   PhoneNumber: phone,
            //   Message: `Your TradeMart verification code is: ${otp}. This code expires in 10 minutes.`
            // });
            // await snsClient.send(command);

            // Placeholder - in development, log the OTP
            console.log(`📱 SMS OTP for ${phone}: ${otp}`);

            return NextResponse.json({
                message: "OTP sent to phone successfully",
                // In development, include OTP for testing
                ...(process.env.NODE_ENV === "development" && { otp }),
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
