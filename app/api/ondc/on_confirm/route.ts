/**
 * ONDC on_confirm Callback Endpoint
 * 
 * This endpoint receives order confirmation response from Seller Apps (BPPs)
 * after a buyer confirms an order.
 * 
 * Endpoint: POST /api/ondc/on_confirm
 * Deployed at: https://ondc.tradepanda.ai/api/ondc/on_confirm
 * 
 * Called by: Seller Apps (BPPs) in the ONDC network
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Parse the confirm response from Seller App
        const body = await request.json();

        // Log the confirm response for debugging
        console.log('ONDC on_confirm received:', {
            timestamp: new Date().toISOString(),
            context: body.context,
            order: body.message?.order ? 'present' : 'missing',
        });

        // TODO: Verify BECKN headers and signature
        // TODO: Validate the confirm response structure
        // TODO: Store confirmed order in database
        // TODO: Create transaction record
        // TODO: Trigger order fulfillment workflow
        // TODO: Notify frontend via WebSocket/SSE

        // Return acknowledgment as per ONDC specification
        return NextResponse.json(
            {
                status: 'ok',
                message: 'Order confirmation received',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing on_confirm:', error);

        return NextResponse.json(
            {
                status: 'error',
                message: 'Failed to process order confirmation',
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
        message: 'ONDC on_confirm endpoint is active',
        endpoint: '/api/ondc/on_confirm',
    });
}

