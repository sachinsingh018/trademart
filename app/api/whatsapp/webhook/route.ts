import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Handle WhatsApp webhook events
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        console.log('WhatsApp Webhook received:', JSON.stringify(body, null, 2));

        // Handle message status updates
        if (body.entry?.[0]?.changes?.[0]?.value?.statuses) {
            const statuses = body.entry[0].changes[0].value.statuses;
            
            for (const status of statuses) {
                console.log(`Message ${status.id} status: ${status.status}`);
                
                // Update message status in database if needed
                await updateMessageStatus(status.id, status.status);
            }
        }
        
        // Handle incoming messages
        if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
            const messages = body.entry[0].changes[0].value.messages;
            
            for (const message of messages) {
                await handleIncomingMessage(message);
            }
        }
        
        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error('WhatsApp webhook error:', error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}

// Handle webhook verification
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        console.log('WhatsApp webhook verified successfully');
        return new Response(challenge, { status: 200 });
    }

    console.log('WhatsApp webhook verification failed');
    return NextResponse.json({ error: "Invalid webhook verification" }, { status: 403 });
}

async function updateMessageStatus(messageId: string, status: string) {
    try {
        // Here you would update your database with the message status
        // For now, we'll just log it
        console.log(`Updating message ${messageId} status to ${status}`);
        
        // Example: Update a notifications table
        // await prisma.notification.updateMany({
        //     where: { whatsappMessageId: messageId },
        //     data: { status: status }
        // });
    } catch (error) {
        console.error('Error updating message status:', error);
    }
}

async function handleIncomingMessage(message: any) {
    try {
        console.log('Incoming WhatsApp message:', message);
        
        const phoneNumber = message.from;
        const messageText = message.text?.body || '';
        const messageType = message.type;
        
        // Handle different message types
        switch (messageType) {
            case 'text':
                await handleTextMessage(phoneNumber, messageText);
                break;
            case 'image':
                await handleImageMessage(phoneNumber, message.image);
                break;
            case 'document':
                await handleDocumentMessage(phoneNumber, message.document);
                break;
            default:
                console.log(`Unhandled message type: ${messageType}`);
        }
    } catch (error) {
        console.error('Error handling incoming message:', error);
    }
}

async function handleTextMessage(phoneNumber: string, text: string) {
    console.log(`Text message from ${phoneNumber}: ${text}`);
    
    // Here you could implement chatbot logic
    // For now, we'll just log the message
    
    // Example responses based on keywords
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('help') || lowerText.includes('support')) {
        // Send help message
        console.log('Sending help message to', phoneNumber);
    } else if (lowerText.includes('status') || lowerText.includes('order')) {
        // Check order status
        console.log('Checking order status for', phoneNumber);
    } else if (lowerText.includes('quote') || lowerText.includes('rfq')) {
        // Handle quote/RFQ related queries
        console.log('Handling quote/RFQ query from', phoneNumber);
    }
}

async function handleImageMessage(phoneNumber: string, image: any) {
    console.log(`Image message from ${phoneNumber}:`, image);
    // Handle image messages (e.g., product photos, documents)
}

async function handleDocumentMessage(phoneNumber: string, document: any) {
    console.log(`Document message from ${phoneNumber}:`, document);
    // Handle document messages (e.g., contracts, specifications)
}
