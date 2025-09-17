import { NextRequest, NextResponse } from "next/server";
import { whatsappService } from "@/lib/whatsapp";

// Send welcome message to new users
export async function POST(request: NextRequest) {
    try {
        const { phone, userName, role } = await request.json();

        if (!phone || !userName || !role) {
            return NextResponse.json(
                { error: "Missing required fields: phone, userName, role" },
                { status: 400 }
            );
        }

        // Validate phone number
        if (!whatsappService.validatePhoneNumber(phone)) {
            return NextResponse.json(
                { error: "Invalid phone number format" },
                { status: 400 }
            );
        }

        // Format phone number
        const formattedPhone = whatsappService.formatPhoneNumber(phone);

        // Send WhatsApp welcome message
        const result = await whatsappService.sendWelcomeMessage(
            formattedPhone,
            userName,
            role
        );

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "WhatsApp welcome message sent successfully",
                data: {
                    messageId: result.messageId,
                    recipient: formattedPhone,
                    status: result.status,
                    timestamp: new Date().toISOString(),
                },
            });
        } else {
            return NextResponse.json(
                { 
                    success: false,
                    error: result.error || "Failed to send WhatsApp welcome message" 
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("WhatsApp welcome message error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to send WhatsApp welcome message",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
