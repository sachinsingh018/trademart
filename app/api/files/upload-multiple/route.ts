import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadToS3, generateFileKey } from '@/lib/aws-s3';

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        const prefix = formData.get('prefix') as string || 'uploads';

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        // Validate file count (max 10 files)
        if (files.length > 10) {
            return NextResponse.json({ error: 'Too many files. Maximum is 10 files.' }, { status: 400 });
        }

        const maxSize = 10 * 1024 * 1024; // 10MB per file
        const results = [];
        const errors = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            try {
                // Validate file size
                if (file.size > maxSize) {
                    errors.push({
                        fileName: file.name,
                        error: 'File too large. Maximum size is 10MB.',
                    });
                    continue;
                }

                // Generate unique file key
                const fileKey = generateFileKey(file.name, prefix);

                // Convert file to buffer
                const buffer = Buffer.from(await file.arrayBuffer());

                // Upload to S3
                const uploadResult = await uploadToS3(
                    buffer,
                    fileKey,
                    file.type,
                    {
                        originalName: file.name,
                        uploadedBy: session.user.id,
                        uploadedAt: new Date().toISOString(),
                    }
                );

                if (!uploadResult.success) {
                    errors.push({
                        fileName: file.name,
                        error: uploadResult.error || 'Upload failed',
                    });
                    continue;
                }

                // Save file metadata to database
                const fileUpload = await prisma.fileUpload.create({
                    data: {
                        userId: session.user.id,
                        originalName: file.name,
                        fileName: fileKey,
                        fileKey: fileKey,
                        fileSize: file.size,
                        contentType: file.type,
                        bucketName: process.env.AWS_S3_BUCKET_NAME || 'trademart-bucket',
                        url: uploadResult.url,
                    },
                });

                results.push({
                    id: fileUpload.id,
                    originalName: fileUpload.originalName,
                    fileName: fileUpload.fileName,
                    fileKey: fileUpload.fileKey,
                    fileSize: fileUpload.fileSize,
                    contentType: fileUpload.contentType,
                    url: fileUpload.url,
                    uploadedAt: fileUpload.uploadedAt,
                });
            } catch (error) {
                errors.push({
                    fileName: file.name,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }

        return NextResponse.json({
            success: true,
            uploaded: results,
            errors: errors,
            summary: {
                total: files.length,
                successful: results.length,
                failed: errors.length,
            },
        });
    } catch (error) {
        console.error('Multiple upload error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
