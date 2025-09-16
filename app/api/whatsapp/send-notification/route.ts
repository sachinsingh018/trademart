import { NextRequest, NextResponse } from "next/server";
import { whatsappService } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
    try {
        const { quoteId, supplierPhone, rfqTitle, buyerCompany, rfqId } = await request.json();

        if (!supplierPhone || !rfqTitle || !buyerCompany) {
            return NextResponse.json(
                { error: "Missing required fields: supplierPhone, rfqTitle, buyerCompany" },
                { status: 400 }
            );
        }

        // Validate phone number
        if (!whatsappService.validatePhoneNumber(supplierPhone)) {
            return NextResponse.json(
                { error: "Invalid phone number format" },
                { status: 400 }
            );
        }

        // Format phone number
        const formattedPhone = whatsappService.formatPhoneNumber(supplierPhone);

        // Send WhatsApp notification
        const result = await whatsappService.sendRFQNotification(
            formattedPhone,
            rfqTitle,
            buyerCompany,
            rfqId || quoteId
        );

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "WhatsApp notification sent successfully",
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
                    error: result.error || "Failed to send WhatsApp notification" 
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("WhatsApp notification error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to send WhatsApp notification",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

// Handle WhatsApp webhook verification
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid webhook verification" }, { status: 403 });
}