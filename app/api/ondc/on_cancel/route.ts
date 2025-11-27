/**
 * ONDC on_cancel Callback Endpoint
 * 
 * This endpoint receives order cancellation response from Seller Apps (BPPs)
 * after a buyer or seller cancels an order.
 * 
 * Endpoint: POST /api/ondc/on_cancel
 * Deployed at: https://ondc.tradepanda.ai/api/ondc/on_cancel
 * 
 * Called by: Seller Apps (BPPs) in the ONDC network
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Parse the cancel response from Seller App
        const body = await request.json();

        // Log the cancel response for debugging
        console.log('ONDC on_cancel received:', {
            timestamp: new Date().toISOString(),
            context: body.context,
            order: body.message?.order ? 'present' : 'missing',
        });

        // TODO: Verify BECKN headers and signature
        // TODO: Validate the cancel response structure
        // TODO: Update order status to cancelled in database
        // TODO: Process refund if payment was made
        // TODO: Update transaction status
        // TODO: Notify frontend via WebSocket/SSE

        // Return acknowledgment as per ONDC specification
        return NextResponse.json(
            {
                status: 'ok',
                message: 'Order cancellation received',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing on_cancel:', error);

        return NextResponse.json(
            {
                status: 'error',
                message: 'Failed to process cancellation',
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
        message: 'ONDC on_cancel endpoint is active',
        endpoint: '/api/ondc/on_cancel',
    });
}

