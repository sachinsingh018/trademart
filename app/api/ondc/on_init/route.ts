/**
 * ONDC on_init Callback Endpoint
 * 
 * This endpoint receives order initialization response from Seller Apps (BPPs)
 * after a buyer initiates an order.
 * 
 * Endpoint: POST /api/ondc/on_init
 * Deployed at: https://ondc.tradepanda.ai/api/ondc/on_init
 * 
 * Called by: Seller Apps (BPPs) in the ONDC network
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Parse the init response from Seller App
        const body = await request.json();

        // Log the init response for debugging
        console.log('ONDC on_init received:', {
            timestamp: new Date().toISOString(),
            context: body.context,
            order: body.message?.order ? 'present' : 'missing',
        });

        // TODO: Verify BECKN headers and signature
        // TODO: Validate the init response structure
        // TODO: Store order initialization details in database
        // TODO: Process payment information
        // TODO: Notify frontend via WebSocket/SSE

        // Return acknowledgment as per ONDC specification
        return NextResponse.json(
            {
                status: 'ok',
                message: 'Order initialization received',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing on_init:', error);

        return NextResponse.json(
            {
                status: 'error',
                message: 'Failed to process order initialization',
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
        message: 'ONDC on_init endpoint is active',
        endpoint: '/api/ondc/on_init',
    });
}

