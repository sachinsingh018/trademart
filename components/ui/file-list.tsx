"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, X } from "lucide-react";

interface FileListProps {
    files: Array<{
        id: string;
        url: string;
        name: string;
        size?: number;
        type?: string;
    }>;
    title?: string;
    showDownload?: boolean;
    onRemove?: (fileId: string) => void;
    canRemove?: boolean;
}

export default function FileList({
    files,
    title = "Files",
    showDownload = true,
    onRemove,
    canRemove = false
}: FileListProps) {
    if (!files || files.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No files available</p>
            </div>
        );
    }

    const getFileIcon = (fileType?: string) => {
        if (!fileType) return "📁";

        if (fileType.startsWith("image/")) {
            return "🖼️";
        } else if (fileType === "application/pdf") {
            return "📄";
        } else if (fileType.includes("word") || fileType.includes("document")) {
            return "📝";
        } else if (fileType.includes("excel") || fileType.includes("spreadsheet")) {
            return "📊";
        } else if (fileType === "text/plain") {
            return "📄";
        } else {
            return "📁";
        }
    };

    const handleDownload = async (url: string, name: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <span className="text-sm text-gray-500">{files.length} file{files.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Files List */}
            <div className="space-y-2">
                {files.map((file) => (
                    <Card key={file.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                                            {file.name}
                                        </p>
                                        {file.size && (
                                            <p className="text-xs text-gray-500">
                                                {(file.size / 1024 / 1024).toFixed(1)} MB
                                            </p>
                                        )}
                                        {file.type && (
                                            <p className="text-xs text-gray-500">
                                                {file.type}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => window.open(file.url, '_blank')}
                                    >
                                        <FileText className="h-3 w-3 mr-1" />
                                        View
                                    </Button>

                                    {showDownload && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDownload(file.url, file.name)}
                                        >
                                            <Download className="h-3 w-3 mr-1" />
                                            Download
                                        </Button>
                                    )}

                                    {canRemove && onRemove && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => onRemove(file.id)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
