import { NextRequest, NextResponse } from "next/server";
import { whatsappService } from "@/lib/whatsapp";

// Send custom message
export async function POST(request: NextRequest) {
    try {
        const { phone, message } = await request.json();

        if (!phone || !message) {
            return NextResponse.json(
                { error: "Missing required fields: phone, message" },
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

        // Send WhatsApp message
        const result = await whatsappService.sendCustomMessage(
            formattedPhone,
            message
        );

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "WhatsApp message sent successfully",
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
                    error: result.error || "Failed to send WhatsApp message" 
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("WhatsApp custom message error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to send WhatsApp message",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
