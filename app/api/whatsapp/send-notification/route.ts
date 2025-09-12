import { NextRequest, NextResponse } from "next/server";

// TODO: Replace with actual WhatsApp Business API integration
// import { Client } from "whatsapp-web.js";
// or use WhatsApp Business API via HTTP requests

export async function POST(request: NextRequest) {
    try {
        const { quoteId, supplierPhone, rfqTitle, buyerCompany } = await request.json();

        if (!quoteId || !supplierPhone || !rfqTitle || !buyerCompany) {
            return NextResponse.json(
                { error: "Missing required fields: quoteId, supplierPhone, rfqTitle, buyerCompany" },
                { status: 400 }
            );
        }

        // TODO: Replace with actual WhatsApp Business API implementation
        // Example using WhatsApp Business API:
        /*
        const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: supplierPhone,
            type: "template",
            template: {
              name: "rfq_notification",
              language: {
                code: "en"
              },
              components: [
                {
                  type: "body",
                  parameters: [
                    {
                      type: "text",
                      text: rfqTitle
                    },
                    {
                      type: "text",
                      text: buyerCompany
                    }
                  ]
                }
              ]
            }
          })
        });
    
        if (!response.ok) {
          throw new Error(`WhatsApp API error: ${response.statusText}`);
        }
    
        const result = await response.json();
        */

        // Placeholder implementation for development
        console.log(`📱 WhatsApp notification sent to ${supplierPhone} for RFQ: ${rfqTitle}`);
        console.log(`Buyer: ${buyerCompany}`);
        console.log(`Quote ID: ${quoteId}`);

        // Mock success response
        const mockResponse = {
            success: true,
            messageId: `msg_${Date.now()}`,
            recipient: supplierPhone,
            status: "sent",
            timestamp: new Date().toISOString(),
        };

        return NextResponse.json({
            success: true,
            message: "WhatsApp notification sent successfully",
            data: mockResponse,
        });
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

// TODO: Add WhatsApp webhook handler for message status updates
export async function GET(request: NextRequest) {
    // Handle WhatsApp webhook verification
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid webhook verification" }, { status: 403 });
}
