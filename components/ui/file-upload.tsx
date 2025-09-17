"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";

export interface UploadedFile {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
    fileKey: string;
}

interface FileUploadProps {
    onUpload: (files: UploadedFile[]) => void;
    onRemove?: (fileKey: string) => void;
    uploadedFiles: UploadedFile[];
    maxFiles?: number;
    maxSize?: number; // in MB
    prefix?: string;
    title?: string;
    description?: string;
    acceptedFileTypes?: Record<string, string[]>;
}

export default function FileUpload({
    onUpload,
    onRemove,
    uploadedFiles = [],
    maxFiles = 10,
    maxSize = 10,
    prefix = "files",
    title = "Upload Files",
    description = "Drag and drop files here, or click to select files",
    acceptedFileTypes = {
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        "text/plain": [".txt"],
        "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"]
    }
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState("");

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
            setError(`Maximum ${maxFiles} files allowed`);
            return;
        }

        setUploading(true);
        setError("");
        setUploadProgress(0);

        try {
            const formData = new FormData();
            acceptedFiles.forEach((file) => {
                formData.append("files", file);
            });
            formData.append("prefix", prefix);

            const response = await fetch("/api/files/upload-multiple", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const result = await response.json();
            setUploadProgress(100);

            // Add new files to existing ones
            const allFiles = [...uploadedFiles, ...result.files];
            onUpload(allFiles);

            setTimeout(() => {
                setUploadProgress(0);
                setUploading(false);
            }, 1000);
        } catch {
            setError("Upload failed. Please try again.");
            setUploading(false);
            setUploadProgress(0);
        }
    }, [uploadedFiles, maxFiles, prefix, onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedFileTypes,
        maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
        disabled: uploading || uploadedFiles.length >= maxFiles
    });

    const handleRemove = (fileKey: string) => {
        if (onRemove) {
            onRemove(fileKey);
        }
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith("image/")) {
            return "🖼️";
        } else if (fileType === "application/pdf") {
            return "📄";
        } else if (fileType.includes("word") || fileType.includes("document")) {
            return "📝";
        } else if (fileType.includes("excel") || fileType.includes("spreadsheet")) {
            return "📊";
        } else {
            return "📁";
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
                <p className="text-xs text-gray-500 mt-1">
                    Max {maxFiles} files, {maxSize}MB each. Supported: PDF, DOC, DOCX, XLS, XLSX, TXT, Images
                </p>
            </div>

            {/* Upload Area */}
            <Card
                {...getRootProps()}
                className={`border-2 border-dashed transition-colors cursor-pointer ${isDragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                    } ${uploading || uploadedFiles.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <CardContent className="p-6 text-center">
                    <input {...getInputProps()} />
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    {isDragActive ? (
                        <p className="text-blue-600">Drop the files here...</p>
                    ) : (
                        <div>
                            <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500">
                                {uploadedFiles.length}/{maxFiles} files uploaded
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Upload Progress */}
            {uploading && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                    {error}
                </div>
            )}

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
                    <div className="space-y-2">
                        {uploadedFiles.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{getFileIcon(file.type)}</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(1)} MB
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => window.open(file.url, '_blank')}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleRemove(file.fileKey)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
