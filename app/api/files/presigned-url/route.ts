import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePresignedUploadUrl, generateFileKey } from '@/lib/aws-s3';

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { fileName, contentType, prefix = 'uploads', expiresIn = 3600 } = body;

        if (!fileName || !contentType) {
            return NextResponse.json(
                { error: 'fileName and contentType are required' },
                { status: 400 }
            );
        }

        // Generate unique file key
        const fileKey = generateFileKey(fileName, prefix);

        // Generate presigned URL
        const result = await generatePresignedUploadUrl(fileKey, contentType, expiresIn);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Failed to generate presigned URL', details: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            uploadUrl: result.url,
            fileKey: result.key,
            expiresIn,
        });
    } catch (error) {
        console.error('Presigned URL error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
