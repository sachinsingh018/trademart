/**
 * ONDC on_search Callback Endpoint
 * 
 * This endpoint receives search results from Seller Apps (BPPs)
 * after a buyer initiates a search request.
 * 
 * Endpoint: POST /api/ondc/on_search
 * Deployed at: https://ondc.tradepanda.ai/api/ondc/on_search
 * 
 * Called by: Seller Apps (BPPs) in the ONDC network
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Parse the search response from Seller App
        const body = await request.json();

        // Log the search response for debugging
        console.log('ONDC on_search received:', {
            timestamp: new Date().toISOString(),
            context: body.context,
            catalog: body.message?.catalog ? 'present' : 'missing',
        });

        // TODO: Verify BECKN headers and signature
        // TODO: Validate the search response structure
        // TODO: Store search results in database
        // TODO: Process catalog data
        // TODO: Notify frontend via WebSocket/SSE

        // Return acknowledgment as per ONDC specification
        return NextResponse.json(
            {
                status: 'ok',
                message: 'Search results received',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing on_search:', error);

        return NextResponse.json(
            {
                status: 'error',
                message: 'Failed to process search results',
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
        message: 'ONDC on_search endpoint is active',
        endpoint: '/api/ondc/on_search',
    });
}

