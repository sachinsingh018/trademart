import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface FileUploadInfo {
    id: string;
    originalName: string;
    fileName: string;
    fileKey: string;
    fileSize: number;
    contentType: string;
    url?: string;
    uploadedAt: Date;
}

/**
 * Get all files uploaded by the current user
 */
export async function getUserFiles(): Promise<FileUploadInfo[]> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const files = await prisma.fileUpload.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            uploadedAt: 'desc',
        },
    });

    return files.map(file => ({
        id: file.id,
        originalName: file.originalName,
        fileName: file.fileName,
        fileKey: file.fileKey,
        fileSize: file.fileSize,
        contentType: file.contentType,
        url: file.url || undefined,
        uploadedAt: file.uploadedAt,
    }));
}

/**
 * Get a specific file by ID (only if user owns it)
 */
export async function getUserFile(fileId: string): Promise<FileUploadInfo | null> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const file = await prisma.fileUpload.findFirst({
        where: {
            id: fileId,
            userId: session.user.id,
        },
    });

    if (!file) {
        return null;
    }

    return {
        id: file.id,
        originalName: file.originalName,
        fileName: file.fileName,
        fileKey: file.fileKey,
        fileSize: file.fileSize,
        contentType: file.contentType,
        url: file.url,
        uploadedAt: file.uploadedAt,
    };
}

/**
 * Get file statistics for the current user
 */
export async function getUserFileStats() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const stats = await prisma.fileUpload.aggregate({
        where: {
            userId: session.user.id,
        },
        _count: {
            id: true,
        },
        _sum: {
            fileSize: true,
        },
    });

    return {
        totalFiles: stats._count.id,
        totalSize: stats._sum.fileSize || 0,
    };
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Check if file type is allowed
 */
export function isAllowedFileType(filename: string, allowedTypes: string[] = []): boolean {
    if (allowedTypes.length === 0) {
        // Default allowed types
        const defaultTypes = [
            'jpg', 'jpeg', 'png', 'gif', 'webp', // Images
            'pdf', 'doc', 'docx', 'txt', 'rtf', // Documents
            'xls', 'xlsx', 'csv', // Spreadsheets
            'zip', 'rar', '7z', // Archives
        ];
        allowedTypes = defaultTypes;
    }

    const extension = getFileExtension(filename);
    return allowedTypes.includes(extension);
}

/**
 * Generate a thumbnail URL for image files
 */
export function getThumbnailUrl(fileKey: string): string {
    const bucketName = process.env.AWS_S3_BUCKET_NAME || 'trademart-bucket';
    const region = process.env.AWS_REGION || 'eu-north-1';

    // This would require AWS Lambda or CloudFront for image resizing
    // For now, return the original URL
    return `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
}
