/**
 * ONDC on_update Callback Endpoint (Optional)
 * 
 * This endpoint receives order update responses from Seller Apps (BPPs)
 * for order modifications (e.g., quantity changes, item replacements).
 * 
 * Endpoint: POST /api/ondc/on_update
 * Deployed at: https://ondc.tradepanda.ai/api/ondc/on_update
 * 
 * Called by: Seller Apps (BPPs) in the ONDC network
 * 
 * Note: This is an optional endpoint. Implement if you need order updates.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Parse the update response from Seller App
        const body = await request.json();

        // Log the update response for debugging
        console.log('ONDC on_update received:', {
            timestamp: new Date().toISOString(),
            context: body.context,
            order: body.message?.order ? 'present' : 'missing',
        });

        // TODO: Verify BECKN headers and signature
        // TODO: Validate the update response structure
        // TODO: Update order details in database
        // TODO: Process order modifications
        // TODO: Update pricing if changed
        // TODO: Notify frontend via WebSocket/SSE

        // Return acknowledgment as per ONDC specification
        return NextResponse.json(
            {
                status: 'ok',
                message: 'Order update received',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing on_update:', error);

        return NextResponse.json(
            {
                status: 'error',
                message: 'Failed to process order update',
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
        message: 'ONDC on_update endpoint is active',
        endpoint: '/api/ondc/on_update',
        note: 'This is an optional endpoint',
    });
}

