/**
 * ONDC on_status Callback Endpoint
 * 
 * This endpoint receives order status updates from Seller Apps (BPPs)
 * when order status changes (e.g., confirmed, in-progress, shipped, delivered).
 * 
 * Endpoint: POST /api/ondc/on_status
 * Deployed at: https://ondc.tradepanda.ai/api/ondc/on_status
 * 
 * Called by: Seller Apps (BPPs) in the ONDC network
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Parse the status response from Seller App
        const body = await request.json();

        // Log the status response for debugging
        console.log('ONDC on_status received:', {
            timestamp: new Date().toISOString(),
            context: body.context,
            order: body.message?.order ? 'present' : 'missing',
        });

        // TODO: Verify BECKN headers and signature
        // TODO: Validate the status response structure
        // TODO: Update order status in database
        // TODO: Process status change (e.g., trigger notifications)
        // TODO: Update transaction status if needed
        // TODO: Notify frontend via WebSocket/SSE

        // Return acknowledgment as per ONDC specification
        return NextResponse.json(
            {
                status: 'ok',
                message: 'Order status update received',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing on_status:', error);

        return NextResponse.json(
            {
                status: 'error',
                message: 'Failed to process status update',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// Health check endpoint
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'ONDC on_status endpoint is active',
        endpoint: '/api/ondc/on_status',
    });
}

