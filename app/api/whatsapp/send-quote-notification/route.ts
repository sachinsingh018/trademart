import { NextRequest, NextResponse } from "next/server";
import { whatsappService } from "@/lib/whatsapp";

// Send quote notification to buyer
export async function POST(request: NextRequest) {
    try {
        const { buyerPhone, rfqTitle, quoteAmount, supplierCompany, quoteId } = await request.json();

        if (!buyerPhone || !rfqTitle || !quoteAmount || !supplierCompany) {
            return NextResponse.json(
                { error: "Missing required fields: buyerPhone, rfqTitle, quoteAmount, supplierCompany" },
                { status: 400 }
            );
        }

        // Validate phone number
        if (!whatsappService.validatePhoneNumber(buyerPhone)) {
            return NextResponse.json(
                { error: "Invalid phone number format" },
                { status: 400 }
            );
        }

        // Format phone number
        const formattedPhone = whatsappService.formatPhoneNumber(buyerPhone);

        // Send WhatsApp notification
        const result = await whatsappService.sendQuoteNotification(
            formattedPhone,
            rfqTitle,
            quoteAmount,
            supplierCompany,
            quoteId
        );

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "WhatsApp quote notification sent successfully",
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
        console.error("WhatsApp quote notification error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to send WhatsApp quote notification",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
