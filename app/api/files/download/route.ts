import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePresignedDownloadUrl } from '@/lib/aws-s3';

export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const fileId = searchParams.get('id');
        const fileKey = searchParams.get('key');
        const expiresIn = parseInt(searchParams.get('expiresIn') || '3600');

        if (!fileId && !fileKey) {
            return NextResponse.json(
                { error: 'Either file id or file key is required' },
                { status: 400 }
            );
        }

        let fileUpload;

        if (fileId) {
            // Get file by ID
            fileUpload = await prisma.fileUpload.findFirst({
                where: {
                    id: fileId,
                    userId: session.user.id, // Ensure user can only access their own files
                },
            });
        } else if (fileKey) {
            // Get file by key
            fileUpload = await prisma.fileUpload.findFirst({
                where: {
                    fileKey: fileKey,
                    userId: session.user.id, // Ensure user can only access their own files
                },
            });
        }

        if (!fileUpload) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Generate presigned download URL
        const result = await generatePresignedDownloadUrl(fileUpload.fileKey, expiresIn);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Failed to generate download URL', details: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            downloadUrl: result.url,
            file: {
                id: fileUpload.id,
                originalName: fileUpload.originalName,
                fileName: fileUpload.fileName,
                fileSize: fileUpload.fileSize,
                contentType: fileUpload.contentType,
                uploadedAt: fileUpload.uploadedAt,
            },
        });
    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
