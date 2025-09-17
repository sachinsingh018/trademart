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
        const file = formData.get('file') as File;
        const prefix = formData.get('prefix') as string || 'uploads';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
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
            return NextResponse.json(
                { error: 'Upload failed', details: uploadResult.error },
                { status: 500 }
            );
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

        return NextResponse.json({
            success: true,
            file: {
                id: fileUpload.id,
                originalName: fileUpload.originalName,
                fileName: fileUpload.fileName,
                fileKey: fileUpload.fileKey,
                fileSize: fileUpload.fileSize,
                contentType: fileUpload.contentType,
                url: fileUpload.url,
                uploadedAt: fileUpload.uploadedAt,
            },
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
