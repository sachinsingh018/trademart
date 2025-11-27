/**
 * ONDC on_subscribe Callback Endpoint
 * 
 * This endpoint is called by the ONDC Registry when a subscription
 * request is processed. It confirms that the subscriber (Buyer App)
 * is ready to receive callbacks.
 * 
 * Endpoint: POST /api/ondc/on_subscribe
 * Deployed at: https://ondc.tradepanda.ai/api/ondc/on_subscribe
 * 
 * ONDC Registry will call this endpoint after subscription approval.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Parse the subscription response from ONDC Registry
        const body = await request.json();

        // Log the subscription response for debugging
        console.log('ONDC on_subscribe received:', {
            timestamp: new Date().toISOString(),
            body: body,
        });

        // TODO: Validate the subscription response
        // - Check signature
        // - Verify subscriber ID matches
        // - Store subscription status in database

        // TODO: Store subscription details in database
        // Example:
        // await prisma.ondcSubscription.create({
        //   data: {
        //     subscriberId: body.subscriber_id,
        //     status: body.status,
        //     subscribedAt: new Date(),
        //   },
        // });

        // Return success response as per ONDC specification
        return NextResponse.json(
            {
                status: 'ok',
                message: 'Subscription acknowledged',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing on_subscribe:', error);

        // Return error response
        return NextResponse.json(
            {
                status: 'error',
                message: 'Failed to process subscription',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// Also support GET for health check
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'ONDC on_subscribe endpoint is active',
        endpoint: '/api/ondc/on_subscribe',
    });
}

