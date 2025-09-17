"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ZoomIn, X } from "lucide-react";

interface ImageGalleryProps {
    images: Array<{
        id: string;
        url: string;
        name: string;
        size?: number;
    }>;
    title?: string;
    showDownload?: boolean;
    onRemove?: (imageId: string) => void;
    canRemove?: boolean;
}

export default function ImageGallery({
    images,
    title = "Images",
    showDownload = true,
    onRemove,
    canRemove = false
}: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!images || images.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No images available</p>
            </div>
        );
    }

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
                <span className="text-sm text-gray-500">{images.length} image{images.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                    <Card key={image.id} className="group relative overflow-hidden">
                        <CardContent className="p-0">
                            <div className="aspect-square relative">
                                <Image
                                    src={image.url}
                                    alt={image.name}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />

                                {/* Action Buttons */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 w-8 p-0"
                                        onClick={() => setSelectedImage(image.url)}
                                    >
                                        <ZoomIn className="h-3 w-3" />
                                    </Button>
                                    {showDownload && (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="h-8 w-8 p-0"
                                            onClick={() => handleDownload(image.url, image.name)}
                                        >
                                            <Download className="h-3 w-3" />
                                        </Button>
                                    )}
                                    {canRemove && onRemove && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="h-8 w-8 p-0"
                                            onClick={() => onRemove(image.id)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Image Info */}
                            <div className="p-2">
                                <p className="text-xs text-gray-600 truncate" title={image.name}>
                                    {image.name}
                                </p>
                                {image.size && (
                                    <p className="text-xs text-gray-500">
                                        {(image.size / 1024 / 1024).toFixed(1)} MB
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modal for Full Size View */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="absolute top-4 right-4 z-10"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <Image
                            src={selectedImage}
                            alt="Full size view"
                            width={800}
                            height={600}
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
