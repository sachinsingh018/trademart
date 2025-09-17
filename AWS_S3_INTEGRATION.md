# AWS S3 Integration Documentation

## Overview

This document describes the AWS S3 integration implemented in the TradeMart project. The integration provides secure file upload, download, and management capabilities using AWS S3 as the storage backend.

## Configuration

### Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_REGION="eu-north-1"
AWS_DEFAULT_REGION="eu-north-1"
AWS_S3_BUCKET_NAME="trademart-bucket"
```

### Database Schema

A new `FileUpload` table has been added to track file uploads:

```sql
CREATE TABLE file_uploads (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_key TEXT UNIQUE NOT NULL,
  file_size INTEGER NOT NULL,
  content_type TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### 1. Upload Single File
**POST** `/api/files/upload`

Upload a single file to S3.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "file_id",
    "originalName": "document.pdf",
    "fileName": "generated_filename.pdf",
    "fileKey": "uploads/user_id/generated_filename.pdf",
    "fileSize": 1024000,
    "contentType": "application/pdf",
    "bucketName": "trademart-bucket",
    "url": "https://trademart-bucket.s3.eu-north-1.amazonaws.com/uploads/user_id/generated_filename.pdf",
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Upload Multiple Files
**POST** `/api/files/upload-multiple`

Upload multiple files to S3.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with `files` field (array)

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadedFiles": [
      {
        "id": "file_id_1",
        "originalName": "document1.pdf",
        "fileName": "generated_filename1.pdf",
        "fileKey": "uploads/user_id/generated_filename1.pdf",
        "fileSize": 1024000,
        "contentType": "application/pdf",
        "bucketName": "trademart-bucket",
        "url": "https://trademart-bucket.s3.eu-north-1.amazonaws.com/uploads/user_id/generated_filename1.pdf",
        "uploadedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "failedUploads": []
  }
}
```

### 3. Generate Presigned URL
**POST** `/api/files/presigned-url`

Generate a presigned URL for direct client uploads.

**Request:**
```json
{
  "fileName": "document.pdf",
  "contentType": "application/pdf",
  "fileSize": 1024000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "presignedUrl": "https://trademart-bucket.s3.eu-north-1.amazonaws.com/uploads/user_id/generated_filename.pdf?X-Amz-Algorithm=...",
    "fileKey": "uploads/user_id/generated_filename.pdf",
    "expiresIn": 3600
  }
}
```

### 4. Download File
**GET** `/api/files/download?fileKey=uploads/user_id/filename.pdf`

Download a file from S3.

**Response:**
- File stream with appropriate headers

### 5. Delete File
**DELETE** `/api/files/delete`

Delete a file from S3 and database.

**Request:**
```json
{
  "fileKey": "uploads/user_id/filename.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## React Components

### ImageUpload Component
Located at `components/ui/image-upload.tsx`

**Features:**
- Drag and drop support
- Image preview
- Progress tracking
- Multiple file upload
- File validation (size, type)
- Error handling

**Props:**
```typescript
interface ImageUploadProps {
  onUpload: (files: UploadedFile[]) => void;
  onRemove?: (fileKey: string) => void;
  uploadedFiles?: UploadedFile[];
  maxFiles?: number;
  maxSize?: number; // in bytes
  prefix?: string; // S3 key prefix
  title?: string;
  description?: string;
  showPreview?: boolean;
}
```

### FileUpload Component
Located at `components/ui/file-upload.tsx`

**Features:**
- General file upload (not just images)
- Progress tracking
- File validation
- Error handling

**Props:**
```typescript
interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void;
  onRemove?: (fileKey: string) => void;
  uploadedFiles?: UploadedFile[];
  maxFiles?: number;
  maxSize?: number;
  prefix?: string;
  title?: string;
  description?: string;
  acceptedTypes?: string[];
}
```

### ImageGallery Component
Located at `components/ui/image-gallery.tsx`

**Features:**
- Display multiple images
- Zoom functionality
- Download capability
- Responsive grid layout

### FileList Component
Located at `components/ui/file-list.tsx`

**Features:**
- Display list of files
- Download links
- File type icons
- File size display

## Integration Examples

### Product Images
```typescript
// In product creation form
<ImageUpload
  onUpload={handleProductImages}
  uploadedFiles={productImages}
  maxFiles={5}
  maxSize={5 * 1024 * 1024} // 5MB
  prefix="products"
  title="Product Images"
  description="Upload up to 5 product images"
  showPreview={true}
/>
```

### RFQ Attachments
```typescript
// In RFQ creation form
<FileUpload
  onUpload={handleRFQAttachments}
  uploadedFiles={rfqAttachments}
  maxFiles={10}
  maxSize={10 * 1024 * 1024} // 10MB
  prefix="rfqs"
  title="RFQ Attachments"
  description="Upload supporting documents"
  acceptedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx']}
/>
```

### Supplier Company Logo
```typescript
// In supplier profile
<ImageUpload
  onUpload={handleCompanyLogo}
  uploadedFiles={companyLogo ? [companyLogo] : []}
  maxFiles={1}
  maxSize={2 * 1024 * 1024} // 2MB
  prefix="suppliers/logos"
  title="Company Logo"
  description="Upload your company logo"
  showPreview={true}
/>
```

## Security Considerations

1. **File Validation**: All files are validated for type and size before upload
2. **Access Control**: Users can only access files they uploaded
3. **Presigned URLs**: Temporary URLs with expiration for secure access
4. **File Naming**: Random file names to prevent conflicts and guessing
5. **Content Type Validation**: Server-side validation of file types

## Error Handling

The integration includes comprehensive error handling:

- **Upload Failures**: Network issues, file size limits, invalid types
- **S3 Errors**: Bucket access, permissions, network connectivity
- **Database Errors**: File record creation, user validation
- **Client Errors**: File selection, validation, progress tracking

## Performance Optimizations

1. **Parallel Uploads**: Multiple files uploaded simultaneously
2. **Progress Tracking**: Real-time upload progress feedback
3. **Image Optimization**: Automatic image compression and resizing
4. **Caching**: Presigned URLs cached for repeated access
5. **Lazy Loading**: Images loaded on demand in galleries

## Testing

### Test Endpoints
- **POST** `/api/files/test` - Test S3 connectivity
- **GET** `/api/files/test` - Test database connectivity

### Test Commands
```bash
# Test S3 connection
curl -X POST http://localhost:3000/api/files/test

# Test file upload
curl -X POST -F "file=@test.pdf" http://localhost:3000/api/files/upload
```

## Troubleshooting

### Common Issues

1. **AWS Credentials**: Ensure environment variables are set correctly
2. **Bucket Permissions**: Verify S3 bucket has proper read/write permissions
3. **CORS Configuration**: Set up CORS for direct client uploads
4. **File Size Limits**: Check both client and server limits
5. **Network Issues**: Verify internet connectivity and AWS region access

### Debug Mode
Set `NODE_ENV=development` to enable detailed error logging.

## Future Enhancements

1. **Image Processing**: Automatic thumbnail generation
2. **CDN Integration**: CloudFront for faster file delivery
3. **Virus Scanning**: File security scanning before upload
4. **Backup Strategy**: Cross-region replication for important files
5. **Analytics**: File usage tracking and reporting
