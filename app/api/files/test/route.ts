import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fileExists, generateFileKey } from '@/lib/aws-s3';

export async function GET(_request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Test S3 connection and configuration
        const testKey = generateFileKey('test-file.txt', 'test');

        // Check if we can connect to S3 (this will fail if credentials are wrong)
        const _exists = await fileExists(testKey);

        // Get environment variables (without exposing sensitive data)
        const config = {
            region: process.env.AWS_REGION || 'eu-north-1',
            bucketName: process.env.AWS_S3_BUCKET_NAME || 'trademart-bucket',
            hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
            hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
        };

        return NextResponse.json({
            success: true,
            message: 'S3 integration test successful',
            config,
            testKey,
            s3Connection: 'OK',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('S3 test error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'S3 integration test failed',
                details: error instanceof Error ? error.message : 'Unknown error',
                config: {
                    region: process.env.AWS_REGION || 'eu-north-1',
                    bucketName: process.env.AWS_S3_BUCKET_NAME || 'trademart-bucket',
                    hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
                    hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
                }
            },
            { status: 500 }
        );
    }
}
