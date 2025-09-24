import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check environment variables
        const envCheck = {
            AWS_REGION: process.env.AWS_REGION || 'NOT_SET',
            AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT_SET',
            AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'NOT_SET',
            AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || 'NOT_SET',
        };

        return NextResponse.json({
            success: true,
            message: 'File upload test endpoint',
            environment: envCheck,
            user: {
                id: session.user.id,
                role: session.user.role
            }
        });
    } catch (error) {
        console.error('Test endpoint error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}