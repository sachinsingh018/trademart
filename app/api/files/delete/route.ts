import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteFromS3 } from '@/lib/aws-s3';

export async function DELETE(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const fileId = searchParams.get('id');
        const fileKey = searchParams.get('key');

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
                    userId: session.user.id, // Ensure user can only delete their own files
                },
            });
        } else if (fileKey) {
            // Get file by key
            fileUpload = await prisma.fileUpload.findFirst({
                where: {
                    fileKey: fileKey,
                    userId: session.user.id, // Ensure user can only delete their own files
                },
            });
        }

        if (!fileUpload) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Delete from S3
        const deleteResult = await deleteFromS3(fileUpload.fileKey);

        if (!deleteResult.success) {
            console.error('Failed to delete from S3:', deleteResult.error);
            // Continue with database deletion even if S3 deletion fails
        }

        // Delete from database
        await prisma.fileUpload.delete({
            where: {
                id: fileUpload.id,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'File deleted successfully',
        });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
