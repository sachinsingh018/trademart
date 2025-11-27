/**
 * ONDC on_select Callback Endpoint
 * 
 * This endpoint receives selected item details from Seller Apps (BPPs)
 * after a buyer selects items from search results.
 * 
 * Endpoint: POST /api/ondc/on_select
 * Deployed at: https://ondc.tradepanda.ai/api/ondc/on_select
 * 
 * Called by: Seller Apps (BPPs) in the ONDC network
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Parse the select response from Seller App
        const body = await request.json();

        // Log the select response for debugging
        console.log('ONDC on_select received:', {
            timestamp: new Date().toISOString(),
            context: body.context,
            order: body.message?.order ? 'present' : 'missing',
        });

        // TODO: Verify BECKN headers and signature
        // TODO: Validate the select response structure
        // TODO: Store selected items and quote in database
        // TODO: Process order details
        // TODO: Notify frontend via WebSocket/SSE

        // Return acknowledgment as per ONDC specification
        return NextResponse.json(
            {
                status: 'ok',
                message: 'Selection details received',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing on_select:', error);

        return NextResponse.json(
            {
                status: 'error',
                message: 'Failed to process selection',
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
        message: 'ONDC on_select endpoint is active',
        endpoint: '/api/ondc/on_select',
    });
}

