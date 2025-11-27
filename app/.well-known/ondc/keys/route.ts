/**
 * ONDC Public Key Endpoint
 * 
 * This endpoint serves the public key for ONDC signature verification.
 * It must be accessible at: https://ondc.tradepanda.ai/.well-known/ondc/keys
 * 
 * The ONDC Registry and Seller Apps will fetch this key to verify
 * signatures on requests sent by this Buyer App.
 */

import { NextResponse } from 'next/server';
import { getPublicKey, getKeyId } from '@/lib/ondc/keys';

export async function GET() {
    try {
        const publicKey = await getPublicKey();
        const keyId = await getKeyId();

        // If keys are not configured, return placeholder
        if (!publicKey) {
            return NextResponse.json(
                {
                    keys: [
                        {
                            keyId: keyId,
                            publicKey: 'NOT_CONFIGURED',
                            note: 'Please configure ONDC keys in environment variables',
                        },
                    ],
                },
                { status: 200 }
            );
        }

        // Return public key in ONDC format
        return NextResponse.json({
            keys: [
                {
                    keyId: keyId,
                    publicKey: publicKey,
                },
            ],
        });
    } catch (error) {
        console.error('Error serving public key:', error);

        return NextResponse.json(
            {
                error: 'Failed to retrieve public key',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

