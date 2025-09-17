import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'eu-north-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'trademart-bucket';

export interface UploadResult {
    success: boolean;
    key?: string;
    url?: string;
    error?: string;
}

export interface PresignedUrlResult {
    success: boolean;
    url?: string;
    key?: string;
    error?: string;
}

export interface FileMetadata {
    key: string;
    size: number;
    contentType: string;
    lastModified: Date;
    etag: string;
}

/**
 * Upload a file to S3
 */
export async function uploadToS3(
    file: Buffer | Uint8Array,
    key: string,
    contentType: string,
    metadata?: Record<string, string>
): Promise<UploadResult> {
    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file,
            ContentType: contentType,
            Metadata: metadata,
        });

        await s3Client.send(command);

        const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'eu-north-1'}.amazonaws.com/${key}`;

        return {
            success: true,
            key,
            url,
        };
    } catch (error) {
        console.error('Error uploading to S3:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Generate a presigned URL for direct client uploads
 */
export async function generatePresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600 // 1 hour default
): Promise<PresignedUrlResult> {
    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn });

        return {
            success: true,
            url,
            key,
        };
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Generate a presigned URL for downloading files
 */
export async function generatePresignedDownloadUrl(
    key: string,
    expiresIn: number = 3600 // 1 hour default
): Promise<PresignedUrlResult> {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn });

        return {
            success: true,
            url,
            key,
        };
    } catch (error) {
        console.error('Error generating presigned download URL:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(key: string): Promise<{ success: boolean; error?: string }> {
    try {
        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        await s3Client.send(command);

        return { success: true };
    } catch (error) {
        console.error('Error deleting from S3:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Get file metadata from S3
 */
export async function getFileMetadata(key: string): Promise<{ success: boolean; metadata?: FileMetadata; error?: string }> {
    try {
        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        const response = await s3Client.send(command);

        return {
            success: true,
            metadata: {
                key,
                size: response.ContentLength || 0,
                contentType: response.ContentType || 'application/octet-stream',
                lastModified: response.LastModified || new Date(),
                etag: response.ETag || '',
            },
        };
    } catch (error) {
        console.error('Error getting file metadata:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Check if a file exists in S3
 */
export async function fileExists(key: string): Promise<boolean> {
    try {
        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        await s3Client.send(command);
        return true;
    } catch {
        return false;
    }
}

/**
 * Generate a unique file key with timestamp and random string
 */
export function generateFileKey(originalName: string, prefix?: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop() || '';
    const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');

    const key = `${prefix ? `${prefix}/` : ''}${timestamp}_${randomString}_${baseName}.${extension}`;
    return key;
}
